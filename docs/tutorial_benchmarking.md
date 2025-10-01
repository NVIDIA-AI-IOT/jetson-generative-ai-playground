# Benchmarking LLM Performance on Jetson

In this tutorial, we will walk you through benchmarking the performance of Large Language Models (LLMs) and Vision Language Models (VLMs) on your Jetson. For this guide, we'll use vLLM as our inference engine of choice due to its high throughput and efficiency. We'll focus on measuring the model's speed and performance, which are critical to give you an idea of how your system will react under different loads.

We will begin by serving the model, focusing on the key arguments to pass to vLLM. Then, we will capture and analyze the most critical metrics from our benchmark.

## What We're Measuring (and What We're Not)

In this tutorial, we are measuring the performance of the model, not its quality. Our goal is to answer questions like:

- How fast is it? (Latency)
- How much work can it handle at once? (Throughput)

We will not be evaluating the model's accuracy or how "smart" its answers are. We'll focus on these three key metrics:

**Time to First Token (TTFT)**: How long a user has to wait before the model starts generating a response. This is crucial for a responsive user experience. The initial delay before the first token appears exists because the model must first process your entire input prompt (a step called 'prefill') to compute its internal state, known as the KV cache. This upfront work is what allows vLLM to generate all subsequent tokens extremely fast.

**Output Token Throughput (tok/s)**: The total number of tokens the model can generate per second across all concurrent requests. This is our main measure of overall server capacity.

**Inter-Token Latency (ITL)**: The average delay between each token generated in the response. This affects how smoothly the text appears to "stream" to the user.

Here is a simple example to illustrate these metrics:

Imagine a drone using an onboard VLM to detect fires from its camera feed. The model is constantly processing this feed with the prompt, "Do you see a fire?" and is connected to an alert system.

In this scenario, a low TTFT is critical, as it's the time from the camera seeing fire to the system generating the first word of an alert like "Yes...". The Output Token Throughput then determines how quickly the model can provide a full, detailed description like "...a large fire is spreading in the north quadrant."

## 1. Preparing Your Jetson Environment

First, before starting the benchmark, we recommend you reboot the unit to make sure we are starting from a clean state. We also recommend setting your Jetson to MAXN mode.

You can do that by executing the following command.

```bash
sudo nvpmodel -m 0
```

### Get the vLLM Container

We will use a pre-built Docker container published by NVIDIA that has vLLM and all its dependencies. This guarantees a consistent environment for reproducible results and saves us from the complex process of building vLLM from source, which is necessary because official binaries are not provided for the Jetson platform.

Pull the container using the following command:

```bash
docker pull nvcr.io/nvidia/vllm:25.09-py3
```

## 2. The Benchmarking Workflow

The benchmarking process requires two separate terminals because we need one to serve the model and another to send benchmark requests to it.

### Step 1: Open Two Terminals

Open two terminal windows on your Jetson. We will refer to them as:

- Terminal 1 (Serving Terminal)
- Terminal 2 (Benchmark Terminal)

### Step 2: Launch the Container

In Terminal 1, start and enter the container:

```bash
sudo docker run --rm -it --network host --shm-size=16g --ulimit memlock=-1 --ulimit stack=67108864 --runtime=nvidia --name=vllm nvcr.io/nvidia/vllm:25.09-py3
```

Now, in Terminal 2, let's execute this command to access the same running container:

```bash
sudo docker exec -it vllm bash
```

You should now have two terminals, both inside the same running Docker container.

### Step 3: Serve the Model (Terminal 1)

In your Serving Terminal, run the following command to load the Meta-Llama-3.1-8B quantized model and start the server. This command tells vLLM to prepare the model to accept requests.

```bash
VLLM_ATTENTION_BACKEND=FLASHINFER vllm serve "RedHatAI/Meta-Llama-3.1-8B-Instruct-quantized.w4a16" \
--port "8000" \
--host "0.0.0.0" \
--trust_remote_code \
--swap-space 16 \
--max-seq-len 32000 \
--max-model-len 32000 \
--tensor-parallel-size 1 \
--max-num-seqs 1024 \
--gpu-memory-utilization 0.8
```

For this tutorial, we will be using this checkpoint `RedHatAI/Meta-Llama-3.1-8B-Instruct-quantized.w4a16`.

It is Llama 3.1 8B Instruct W4A16 quantized. But you can replace that checkpoint with any model checkpoint from Hugging Face, whether it is an LLM or a VLM.

**What these arguments mean:**

- `VLLM_ATTENTION_BACKEND=FLASHINFER`: We explicitly set this environment variable to use the FlashInfer backend. FlashInfer is a highly optimized library that significantly speeds up the core self-attention mechanism on NVIDIA GPUs by reducing memory traffic. Setting this ensures we are leveraging the fastest possible implementation for our benchmark. However, some models may not be fully compatible and could give a "CUDA Kernel not supported" error. If this happens, you can simply try an alternative like `VLLM_ATTENTION_BACKEND=FLASH_ATTN`.
- `--gpu-memory-utilization 0.8`: lets vLLM use ~80% of the total memory. Model weights load first and the remaining capacity within that 80% is pre-allocated to the KV cache.
- `--max-seq-len 32000`: Sets an upper limit on the input sequence length (the prompt only) that vLLM will accept for a single request.
- `--max-seq-len 32000`: Sets an upper bound on the model's context window (i.e. prompt tokens + output tokens) for a single request. vLLM will attempt to enforce this as the maximum total token count in memory for that request.

Wait until you see the confirmation message that the server is running. It will look exactly like this:

```
(APIServer pid=92) INFO:     Waiting for application startup.
(APIServer pid=92) INFO:     Application startup complete.
```

Leave this terminal running. Do not close it.

### Step 4: Warm Up the Model (Terminal 2)

Before we run the real benchmark, we need to perform a "warm-up." This is a practice run that populates vLLM's internal caches, especially the [prefix cache](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching.html), allowing it to achieve its true peak performance during the actual test.

In your Benchmark Terminal, run this command. The results from this run should be ignored.

```bash
vllm bench serve \
  --dataset-name random \
  --model RedHatAI/Meta-Llama-3.1-8B-Instruct-quantized.w4a16 \
  --num-prompts 50 \
  --percentile-metrics ttft,tpot,itl,e2el \
  --random-input-len 2048 \
  --random-output-len 128 \
  --max-concurrency 1
```

**A Note on Dataset Choice.** Since this tutorial is about performance (speed) rather than quality, the content of the dataset doesn't directly change latency/throughput; what matters are request shapes (token lengths), sampling/decoding settings, and concurrency. For synthetic runs, we use `--dataset-name random`, which lets us fix token counts precisely. 

We set `--random-input-len 2048` and `--random-output-len 128`. For a RAG-style workload, increase `--random-input-len` to account for the retrieved context.

However, if you are benchmarking a Vision Language Model, it is crucial to use a dataset that includes images for meaningful results. For a VLM, you would need to change the `--dataset-name` argument and swap it with the right argument to load the dataset of your choice. We recommend using `lmarena-ai/vision-arena-bench-v0.1`.

The final command will look like this for the VLM:

```bash
vllm bench serve \
  --dataset-name hf \
  --dataset-path lmarena-ai/vision-arena-bench-v0.1 \
  --hf-split train \
  --model <your_vlm_model> \
  --num-prompts 50 \
  --percentile-metrics ttft,tpot,itl,e2el \
  --hf-output-len 128 \
  --max-concurrency 1
```

For more information about the flags the vllm bench serve can take, please check out [vLLM's documentation page](https://docs.vllm.ai/en/v0.10.1/cli/bench/serve.html#options).

For the rest of the tutorial, we will be continuing with our example on the Llama 3.1 8B Instruct benchmark.

### Step 5: Run the Official Benchmark (Terminal 2)

Now you're ready to collect the real performance data. We will run the test twice: once to measure single-user performance and once to simulate a heavier load.

**Benchmark 1: Single-User Performance (Concurrency = 1)**

This test measures the best-case scenario for an individual user.

```bash
vllm bench serve \
  --dataset-name random \
  --model RedHatAI/Meta-Llama-3.1-8B-Instruct-quantized.w4a16 \
  --num-prompts 50 \
  --percentile-metrics ttft,tpot,itl,e2el \
  --random-input-len 2048 \
  --random-output-len 128 \
  --max-concurrency 1
```

**Benchmark 2: Multi-User Performance (Concurrency = 8)**

This test simulates 8 users sending requests at the same time to see how the system performs under load.

```bash
vllm bench serve \
  --dataset-name random \
  --model RedHatAI/Meta-Llama-3.1-8B-Instruct-quantized.w4a16 \
  --num-prompts 50 \
  --percentile-metrics ttft,tpot,itl,e2el \
  --random-input-len 2048 \
  --random-output-len 128 \
  --max-concurrency 8
```

## 3. Analyzing Your Results

After your benchmark runs, you will get a summary table. Let's break down what the key numbers mean using the sample output below.

```
============ Serving Benchmark Result ============
Successful requests:                     50        
Maximum request concurrency:             1         
Benchmark duration (s):                  233.17    
Total input tokens:                      10058     
Total generated tokens:                  10303     
Request throughput (req/s):              0.21      
Output token throughput (tok/s):         44.19     
Total Token throughput (tok/s):          87.32     
---------------Time to First Token----------------
Mean TTFT (ms):                          32.02     
Median TTFT (ms):                        31.38     
P99 TTFT (ms):                           38.12     
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          22.61     
Median TPOT (ms):                        22.56     
P99 TPOT (ms):                           24.97     
---------------Inter-token Latency----------------
Mean ITL (ms):                           22.47     
Median ITL (ms):                         22.58     
P99 ITL (ms):                            23.79     
----------------End-to-end Latency----------------
Mean E2EL (ms):                          4663.04   
Median E2EL (ms):                        3450.02   
P99 E2EL (ms):                           15030.27  
==================================================
```

### Key Metrics Explained

**Output token throughput (tok/s): 44.19**

This metric measures the generation speed for a single user, and a result of 44.19 tokens/second indicates a very strong processing capability for a single request, delivering text much faster than a person can read.

**Mean TTFT (ms): 32.02**

This is the average initial wait time before a response begins generating. An extremely low result of just 32.02 milliseconds means the application will feel instantaneous and highly responsive to the user.

In the context of VLMs, this number would usually be higher, since we are not dealing with the text prompt only; we are dealing with an image as well.

**Mean ITL (ms): 22.47**

This measures the average time gap between each generated token after the first one. A low value of 22.47 milliseconds is excellent, as it translates directly to a fast and smooth streaming experience for the user.

### Concurrency 1 vs. 8: The Trade-Off

When you compare your results, you'll likely see a trade-off:

- Going from concurrency 1 to 8, the Output Token Throughput should increase significantly. The system is doing more total work.
- However, the Mean TTFT and Mean ITL will also likely increase. Since the Jetson is now splitting its time between 8 requests instead of 1, each individual request takes longer to process.

This is the classic trade-off between overall capacity and individual user experience. Your benchmark results help you find the right balance for your application.

!!! note
    The term "user" in this tutorial could mean the entity which consumes the output of the model which could be a robotic application using the model in a drone, a humanoid, or simply you using it as a local LLM inference hardware.