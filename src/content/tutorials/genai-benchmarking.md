---
title: "GenAI Benchmarking: LLMs and VLMs on Jetson"
description: "Learn how to benchmark Large Language Models and Vision Language Models on your Jetson using vLLM. Measure throughput, latency, and understand key performance metrics."
category: "Fundamentals"
section: "Performance"
order: 2
tags: ["benchmarking", "vllm", "llm", "vlm", "performance", "throughput", "latency", "ttft", "jetson"]
featured: true
isNew: true
---

In this tutorial, we will walk you through benchmarking Large Language Models (LLMs) and Vision Language Models (VLMs) on your Jetson. For this guide, we'll use vLLM as our inference engine of choice due to its high throughput and efficiency. We'll focus on measuring the model's speed and performance, which are critical to give you an idea of how your system will react under different loads.

We will begin by serving the model, focusing on the key arguments to pass to vLLM. Then, we will capture and analyze the most critical metrics from our benchmark.

---

## What We're Measuring (and What We're Not)

In this tutorial, we are measuring the **performance** of the model, not its quality. Our goal is to answer questions like:

- How fast is it? (Latency)
- How much work can it handle at once? (Throughput)

We will **not** be evaluating the model's accuracy or how "smart" its answers are. We'll focus on these three key metrics:

### Time to First Token (TTFT)

How long a user has to wait before the model starts generating a response. This is crucial for a responsive user experience. The initial delay before the first token appears exists because the model must first process your entire input prompt (a step called 'prefill') to compute its internal state, known as the KV cache. This upfront work is what allows vLLM to generate all subsequent tokens extremely fast.

### Output Token Throughput (tok/s)

The total number of tokens the model can generate per second across all concurrent requests. This is our main measure of overall server capacity.

### Inter-Token Latency (ITL)

The average delay between each token generated in the response. This affects how smoothly the text appears to "stream" to the user.

---

## Real-World Example

Imagine a drone using an onboard VLM to detect fires from its camera feed. The model is constantly processing this feed with the prompt, "Do you see a fire?" and is connected to an alert system.

In this scenario:
- A **low TTFT** is critical, as it's the time from the camera seeing fire to the system generating the first word of an alert like "Yes..."
- The **Output Token Throughput** then determines how quickly the model can provide a full, detailed description like "...a large fire is spreading in the north quadrant."

---

## 1. Preparing Your Jetson Environment

First, before starting the benchmark, we recommend you reboot the unit to make sure we are starting from a clean state. We also recommend setting your Jetson to **MAXN mode**:

```bash
sudo nvpmodel -m 0
```

### Get the vLLM Container

We will use a pre-built Docker container published by NVIDIA that has vLLM and all its dependencies. This guarantees a consistent environment for reproducible results and saves us from the complex process of building vLLM from source.

Pull the container:

```bash
docker pull nvcr.io/nvidia/vllm:25.09-py3
```

---

## 2. The Benchmarking Workflow

The benchmarking process requires two separate terminals because we need one to serve the model and another to send benchmark requests to it.

### Step 1: Open Two Terminals

Open two terminal windows on your Jetson:
- **Terminal 1** (Serving Terminal)
- **Terminal 2** (Benchmark Terminal)

### Step 2: Launch the Container

In **Terminal 1**, start and enter the container:

```bash
sudo docker run --rm -it --network host --shm-size=16g --ulimit memlock=-1 --ulimit stack=67108864 --runtime=nvidia --name=vllm nvcr.io/nvidia/vllm:25.09-py3
```

In **Terminal 2**, access the same running container:

```bash
sudo docker exec -it vllm bash
```

You should now have two terminals, both inside the same running Docker container.

### Step 3: Serve the Model (Terminal 1)

In your Serving Terminal, run the following command to load the Meta-Llama-3.1-8B quantized model:

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

**What these arguments mean:**

- `VLLM_ATTENTION_BACKEND=FLASHINFER`: Uses the FlashInfer backend for optimized self-attention on NVIDIA GPUs. If you get a "CUDA Kernel not supported" error, try `VLLM_ATTENTION_BACKEND=FLASH_ATTN`.
- `--gpu-memory-utilization 0.8`: Lets vLLM use ~80% of total memory. Model weights load first, and remaining capacity is pre-allocated to the KV cache.
- `--max-seq-len 32000`: Sets an upper limit on input sequence length.
- `--max-model-len 32000`: Sets an upper bound on the model's context window (prompt + output tokens).

Wait until you see:

```
(APIServer pid=92) INFO:     Waiting for application startup.
(APIServer pid=92) INFO:     Application startup complete.
```

Leave this terminal running.

### Step 4: Warm Up the Model (Terminal 2)

Before the real benchmark, perform a "warm-up" to populate vLLM's internal caches:

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

> **Ignore the results from this run.**

**Note on Dataset Choice:** For synthetic runs, we use `--dataset-name random` to fix token counts precisely. For VLM benchmarks, use a dataset with images like `lmarena-ai/vision-arena-bench-v0.1`:

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

### Step 5: Run the Official Benchmark (Terminal 2)

**Benchmark 1: Single-User Performance (Concurrency = 1)**

This test measures the best-case scenario for an individual user:

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

This test simulates 8 users sending requests simultaneously:

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

---

## 3. Analyzing Your Results

After your benchmark runs, you will get a summary table. Here's an example output:

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

This metric measures the generation speed for a single user. A result of 44.19 tokens/second indicates very strong processing capability, delivering text much faster than a person can read.

**Mean TTFT (ms): 32.02**

This is the average initial wait time before a response begins generating. An extremely low result of just 32.02 milliseconds means the application will feel instantaneous and highly responsive.

> For VLMs, this number would usually be higher since we're dealing with images in addition to text.

**Mean ITL (ms): 22.47**

This measures the average time gap between each generated token after the first one. A low value of 22.47 milliseconds translates directly to a fast and smooth streaming experience.

---

## Concurrency 1 vs. 8: The Trade-Off

When you compare your results, you'll likely see a trade-off:

- Going from concurrency 1 to 8, the **Output Token Throughput should increase** significantly. The system is doing more total work.
- However, the **Mean TTFT and Mean ITL will also likely increase**. Since the Jetson is now splitting its time between 8 requests instead of 1, each individual request takes longer to process.

This is the classic trade-off between **overall capacity** and **individual user experience**. Your benchmark results help you find the right balance for your application.

> **Note:** The term "user" in this tutorial could mean the entity which consumes the output of the model — which could be a robotic application using the model in a drone, a humanoid, or simply you using it as a local LLM inference hardware.

---

## Next Steps

- [Introduction to GenAI](/tutorials/genai-on-jetson-llms-vlms) - Learn about Ollama and vLLM for different use cases
- [Supported Models](/models) - Browse optimized models with benchmark data
- [vLLM Documentation](https://docs.vllm.ai/en/v0.10.1/cli/bench/serve.html#options) - Explore more benchmark options

