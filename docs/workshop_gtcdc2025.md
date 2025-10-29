# From AI Exploration to Production Deployment

![](./images/jetson-agx-thor-family-key-visual-03-v002-eb-1k.jpg){ width="30%"  align=right}

*Master inference optimization on Jetson Thor with vLLM*

> Welcome! In this hands-on workshop, you’ll unlock truly high-performance, **on-device** generative AI using the new [**NVIDIA Jetson Thor**](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/).<br>You’ll start by unleashing Thor's full potential with a state-of-the-art 120B model, then step through practical optimizations -- **FP8**, **FP4**, and **speculative decoding** -- measuring speed vs. quality at each stage.

## Workshop overview

=== ":fontawesome-solid-chalkboard-teacher: GTC DC 2025 Workshop 🌸"

    :material-bookmark-box-multiple-outline: **What you will learn**

    - **Deploy production-grade LLM serving** - Set up vLLM with OpenAI-compatible APIs on Thor hardware
    - **Master quantization strategies** - Compare FP16 → FP8 → FP4 performance vs. quality trade-offs systematically
    - **Implement advanced optimizations** - Apply speculative decoding and other techniques for maximum throughput

    :fontawesome-solid-user-alt: **Who is this for**

    - Teams building edge applications/products (robots, kiosks, appliances) who need **fast, private, API-compatible** LLMs without cloud dependency.
    - Developers interested in learning inference optimizations

    :material-file-table-box-multiple-outline: **What we provide**

    - **Hardware**: Jetson AGX Thor Developer Kit setup in rack
        - Jetson HUD : To help you locate your device and monitor the hardware stats
    - **Software**: BSP pre-installed, Docker pre-setup
        - **Containers**: Container images pre-pulled (downloaded)
        - **Data**: Some models are pre-downloaded (to save time for workshop)
    - **Access**: Headless, through the network (SSH + Web UI)
        - Network topology

    ![](./images/jetson_thor_racks.jpg){ width="50%" } ![](./images/jetson_hud.jpg){ width="40%" }

    :material-help-box-multiple-outline: **Need Help?**

    Use the "Red-Cup, Blue-Cup" system:

    - 🔴 **Red cup on top**: I need help from a TA
    - 🔵 **Blue cup on top**: I'm good to go (problem resolved)

=== ":fontawesome-solid-home-user: Self-paced"

    :material-bookmark-box-multiple-outline: **What you will learn**

    - **Deploy production-grade LLM serving** - Set up vLLM with OpenAI-compatible APIs on Thor hardware
    - **Master quantization strategies** - Compare FP16 → FP8 → FP4 performance vs. quality trade-offs systematically
    - **Implement advanced optimizations** - Apply speculative decoding and other techniques for maximum throughput

    :fontawesome-solid-user-alt: **Who is this for**

    - Developer interested in learning how to use VLLM and learning inference optimizations.
    - Teams building edge applications/products (robots, kiosks, appliances) who need **fast, private, API-compatible** LLMs without cloud dependency.

    :material-file-table-box-multiple-outline: **What You Need**

    - **Hardware**: Jetson AGX Thor Developer Kit
    - **Software**: BSP installed ([Thor Getting Started](https://docs.nvidia.com/jetson/agx-thor-devkit/user-guide/latest/quick_start.html)), Docker setup ([Thor link](https://docs.nvidia.com/jetson/agx-thor-devkit/user-guide/latest/setup_docker.html), [Orin link](https://www.jetson-ai-lab.com/tips_ssd-docker.html#docker))
        - Containers: NGC's `vllm` container ([`nvcr.io/nvidia/vllm:25.09-py3`](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/vllm/tags?version=25.09-py3)), Open WebUI official container(`ghcr.io/open-webui/open-webui:main`)
    - **Access**: Monitor-attached or Headless (SSH)

??? info "Why Thor?"
    Thor’s memory capacity enables **large models** and **large context windows**, allows **serving multiple models concurrently**, and supports **high-concurrency batching** on-device.

    ??? quote "Why not ...?"
        Other platform could be used for this workshop, like **DGX Spark**, which also offer 128GB unified memory. <br>Jetson provides more deployment ready platform for your products.

---

## 🚀 Experience: Thor's Raw Power with 120B Intelligence

!!! note "The Open Weights Revolution 🔓"

    ### Open Weight Models

    #### What are Open Weights Models?**

    Unlike **closed models** (GPT-4, Claude, Gemini), **open weights models** give you:

    - **Complete model access**: Download and run locally
    - **Data privacy**: Your data never leaves your device
    - **No API dependencies**: Work offline, no rate limits
    - **Customization freedom**: Fine-tune for your specific needs
    - **Cost control**: No per-token charges

    #### Why This Matters: Closed vs. Open Comparison

    | Aspect | Closed Models (GPT-4, etc.) | Open Weights Models |
    |--------|------------------------------|---------------------|
    | **Privacy** | Data sent to external servers | Stays on your device |
    | **Latency** | Network dependent | Local inference speed |
    | **Availability** | Internet required | Works offline |
    | **Customization** | Limited via prompts | Full fine-tuning possible |
    | **Cost** | Pay per token/request | Hardware cost only |
    | **Compliance** | External data handling | Full control |

    #### Enter GPT-OSS-120B: Game Changer 🎯

    **OpenAI's GPT-OSS-120B** represents a breakthrough:

    - **First major open weights model** from OpenAI
    - **120 billion parameters** of GPT-quality intelligence
    - **Massive compute requirements** - needs serious hardware

    **The Thor Advantage:**

    - **One of the few platforms** capable of running GPT-OSS-120B at the edge
    - **Real-time inference** without cloud dependencies
    - **Perfect for evaluation**: Test if the model fits your domain
    - **Baseline assessment**: Understand capabilities before fine-tuning

    #### Why Start Here?

    Before you invest in fine-tuning or domain adaptation:

    1. **Domain Knowledge Check**: Does the base model understand your field?
    2. **Performance Baseline**: How well does it perform out-of-the-box?
    3. **Use Case Validation**: Is this the right model architecture?
    4. **Resource Planning**: What hardware do you actually need?

    **Thor lets you answer these questions locally, privately, and immediately.**

!!! note "Understanding LLM Inference and Serving"

    ### LLM Inference Engine

    #### What is an Inference Engine?

    An **inference engine** is specialized software that takes a trained AI model and executes it efficiently to generate predictions or responses. <br>Think of it as the "runtime" for your AI model.

    **Key responsibilities:**

    - **Model loading**: Reading model weights into memory
    - **Memory management**: Optimizing GPU/CPU memory usage
    - **Request handling**: Processing multiple concurrent requests
    - **Optimization**: Applying techniques like quantization, batching, caching

    #### What is LLM Serving?

    **LLM serving** means making a large language model available as a service that applications can interact with through APIs. <br>Instead of running the model directly in your application, you:

    1. **Deploy the model** on a server (including Jetson Thor)
    2. **Expose HTTP endpoints** for requests
    3. **Provide universal APIs** (like OpenAI's format)
    4. **Handle concurrent users** efficiently

    **Benefits of serving vs. direct integration:**

    - ✅ **Scalability**: Handle multiple applications/users
    - ✅ **Resource sharing**: One model serves many clients
    - ✅ **API standardization**: Consistent interface across models
    - ✅ **Optimization**: Specialized engines for maximum performance

    #### Popular Inference Engines

    | Engine | Strengths | Best For |
    |--------|-----------|----------|
    | **[vLLM](https://github.com/vllm-project/vllm)** | High throughput, PagedAttention, OpenAI compatibility | Production serving, high concurrency |
    | **[SGLang](https://github.com/sgl-project/sglang)** | Structured generation, complex workflows, multi-modal | Advanced use cases, structured outputs |
    | **[Ollama](https://ollama.com/)** | Easy setup, local-first, model management | Development, personal use, quick prototyping|
    | **[llama.cpp](https://github.com/ggml-org/llama.cpp)** | CPU-focused, lightweight, quantization | Resource-constrained environments |
    | **[TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM)** | Maximum performance, NVIDIA optimization | Latency-critical applications, Limited support for Jetson |
    | **[Text Generation Inference](https://huggingface.co/docs/text-generation-inference/en/index)** | HuggingFace integration, streaming | HuggingFace ecosystem |

    !!! info "Ollama ↔ llama.cpp Relationship"
        **Ollama** is built on top of **llama.cpp** as its inference engine. Think of it as:

        - **llama.cpp**: The low-level inference engine (C++ implementation)
        - **Ollama**: The user-friendly wrapper with model management, API server, and easy installation

        Ollama handles downloading models, managing versions, and providing a simple API, while llama.cpp does the actual inference work underneath. This is why they're often used together - Ollama for convenience, llama.cpp for the core performance.

    #### Why vLLM for This Workshop?

    **vLLM excels at production-grade serving:**

    - 🚀 **PagedAttention**: Revolutionary memory management for high throughput
    - 🔌 **OpenAI compatibility**: Drop-in replacement for existing applications
    - ⚡ **Advanced optimizations**: Continuous batching, speculative decoding, quantization
    - 🎯 **Thor optimization**: NVIDIA provides and maintains vllm containers on ([NGC](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/vllm/tags?version=25.09-py3))
    - 📊 **Production ready**: Built for real-world deployment scenarios

    **Perfect for learning inference optimization** because you can see the impact of each technique (FP8, FP4, speculative decoding) on real performance metrics.



### Exercise : Launch Your First 120B Model

Ready to experience Thor's raw power? <br>In this exercise, you'll launch OpenAI's GPT-OSS-120B model locally using vLLM. Follow the steps below to get your local AI powerhouse running 💪.

### 1️⃣ Starting vLLM container

Start running the vLLM container (provided by NVIDIA on NGC). <br>We mount some local (on host) directories for making models downloaded persist and re-using cache:

```bash
docker run --rm -it \
  --network host \
  --shm-size=16g \
  --ulimit memlock=-1 \
  --ulimit stack=67108864 \
  --runtime=nvidia \
  --name=vllm \
  -v $HOME/data/models/huggingface:/root/.cache/huggingface \
  -v $HOME/data/vllm_cache:/root/.cache/vllm \
  nvcr.io/nvidia/vllm:25.09-py3
```

**Key mount points:**

| Host Path | Container Path | Purpose |
|-----------|----------------|---------|
| `$HOME/data/models/huggingface` | `/root/.cache/huggingface` | Model weights cache |
| `$HOME/data/vllm_cache` | `/root/.cache/vllm` | Torch compilation cache |


### 2️⃣ Set Tokenizer Encodings

Configure the required tokenizer files for GPT-OSS models:

```bash
mkdir /etc/encodings
wget https://openaipublic.blob.core.windows.net/encodings/cl100k_base.tiktoken -O /etc/encodings/cl100k_base.tiktoken
wget https://openaipublic.blob.core.windows.net/encodings/o200k_base.tiktoken -O /etc/encodings/o200k_base.tiktoken
export TIKTOKEN_ENCODINGS_BASE=/etc/encodings
```

??? info "About This Workaround"
    This tokenizer configuration is required for GPT-OSS models to avoid `HarmonyError: error downloading or loading vocab file` errors. The solution involves:

    - **Pre-downloading tiktoken files** from OpenAI's public blob storage
    - **Setting TIKTOKEN_ENCODINGS_BASE** environment variable to point to local files
    - **Avoiding network dependency** during model initialization

    **Related Resources:**

    - **[vLLM Issue #22525](https://github.com/vllm-project/vllm/issues/22525)** - Official GitHub issue documenting this exact error with GPT-OSS models
    - [vLLM Official Documentation](https://docs.vllm.ai/) - General vLLM configuration and troubleshooting
    - [vLLM GitHub Issues](https://github.com/vllm-project/vllm/issues) - Community solutions and discussions
    - [OpenAI Tiktoken Repository](https://github.com/openai/tiktoken) - Tokenizer implementation details

    This workaround is particularly important for air-gapped environments or when OpenAI's blob storage is inaccessible.


### 3️⃣ Verify Pre-downloaded Model

Inside the container, check if the model is available:

```bash
# Check if model is available
ls -la /root/.cache/huggingface/hub/models--openai--gpt-oss-120b/
du -h /root/.cache/huggingface/hub/models--openai--gpt-oss-120b/
# Should show ~122GB - no download needed!
```

Even if you don't find the pre-downloaded models you can skip ahead to the next step.
vLLM downloads the model automatically.

### 4️⃣ Launch vLLM Server

Start the vLLM inference server:

```bash
vllm serve openai/gpt-oss-120b
```

**What happens next:**

The vLLM serve command will take approximately **2.5 minutes** to complete startup on Thor. Watch for the final "Application startup complete" message to know when it's ready!

??? note "Why vLLM Startup Takes Time"

    **Understanding the ~2.5 minute startup sequence:**

    #### Stage 1: Model Loading (~35 seconds)
    ```
    Parse safetensors files: 100%|████████████████████| 15/15 [00:01<00:00, 14.70it/s]
    Loading safetensors checkpoint shards: 100%|████████████████████| 15/15 [00:24<00:00,  1.64s/it]
    INFO: Loading weights took 24.72 seconds
    ```

    **What's happening:**

    - 💿 **Reading 122GB of model weights** from storage into GPU memory
    - 🗃️ **Parsing 15 safetensors files** containing the neural network parameters
    - 📥 **Memory allocation** on Thor's 128GB unified memory
    - 💵 **Fast with pre-cache** (vs. hours without!)

    #### Stage 2: Torch Compilation (~45 seconds) 🐌 **Longest step**
    ```
    INFO: torch.compile takes 45.2s in total for 1 model(s)
    ```

    **What's happening:**

    - 🔧 **Kernel optimization**: PyTorch compiles custom CUDA kernels for Thor's GPU
    - ⚡ **Performance tuning**: Creates optimized inference paths for this specific model
    - 💾 **Cache generation**: Saves compiled kernels to `/root/.cache/vllm` for future use
    - 🎯 **One-time cost**: Subsequent startups reuse this compilation cache

    **Workshop Optimization Strategy:**

    For workshops, this compilation step can be pre-warmed to reduce startup time:

    - **Pre-workshop setup**: Organizers run vLLM once to generate compilation cache (~2GB)
    - **Cache distribution**: Copy `/root/.cache/vllm` to all workshop units using `rsync`
    - **Volume mount**: Workshop containers mount pre-warmed cache with `-v $HOME/data/vllm_cache:/root/.cache/vllm`
    - **Result**: Stage 2 drops from ~45 seconds to ~5 seconds with pre-warmed cache!

    **Alternative for quick demos**: Use `--compilation-config '{"level": 0}'` to reduce optimization for faster startup (~60s total vs ~150s)

    #### Stage 3: CUDA Graph Capture (~21 seconds)
    ```
    INFO: Graph capturing finished in 21.0 secs
    ```

    **What's happening:**

    - 📊 **Execution graph recording**: Captures the inference computation flow
    - 🚀 **GPU optimization**: Pre-allocates memory and optimizes kernel launches
    - ⚡ **Batching preparation**: Sets up efficient request batching mechanisms

    #### Stage 4: Ready! 🏁
    ```
    (APIServer pid=92) INFO:     Waiting for application startup.
    (APIServer pid=92) INFO:     Application startup complete.
    ```

    **What's happening:**

    - 🎯 **Final initialization**: API server completes startup sequence
    - 🌐 **Endpoints active**: HTTP server begins accepting requests on port 8000
    - ✅ **Ready for inference**: Model is fully loaded and optimized

    #### Why Each Stage Matters:

    - **Stage 1** enables the model to run at all
    - **Stage 2** makes inference fast (without this, responses would be much slower)
    - **Stage 3** enables high-throughput concurrent requests
    - **Stage 4** confirms everything is ready for your first chat!


#### Test the API endpoints (Optional)

Test your vLLM server is working:

```bash
# Check available models
curl http://localhost:8000/v1/models

# Test chat completion
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-oss-120b",
    "messages": [{"role": "user", "content": "Hello! Tell me about Jetson Thor."}],
    "max_tokens": 100
  }'
```

??? note "Understanding the Serving Architecture"
    **What does "serve" mean?**

    When vLLM "serves" a model, it:

    - ✅ **Loads the model** into GPU memory (GPT-OSS-120B)
    - ✅ **Creates an API server** listening on port 8000
    - ✅ **Exposes HTTP endpoints** for inference requests
    - ✅ **Handles concurrent requests** with optimized batching

    **What is vLLM exposing?**

    vLLM creates a **REST API server** at `http://localhost:8000` with endpoints like:

    - `/v1/chat/completions` - Chat-style conversations
    - `/v1/completions` - Text completion
    - `/v1/models` - List available models
    - `/health` - Server health check

    **OpenAI-Compatible Endpoint**

    vLLM implements the **same API format** as OpenAI's GPT models:

    - ✅ **Same request format** - JSON with `messages`, `model`, `max_tokens`
    - ✅ **Same response format** - Structured JSON responses
    - ✅ **Drop-in replacement** - Existing OpenAI code works unchanged
    - ✅ **Local inference** - No data leaves your device

### 5️⃣ Launch Open WebUI

Start the web interface for easy interaction:

```bash
docker run -d \
  --network=host \
  -v ${HOME}/open-webui:/app/backend/data \
  -e OPENAI_API_BASE_URL=http://0.0.0.0:8000/v1 \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

**Access the interface:**

1. Open your browser to `http://localhost:8080`
2. Create an account (stored locally)
3. Start chatting with your local 120B model!

![](./images/vllm_openwebui_dc.png){ style="box-shadow: 0 4px 8px rgba(0,0,0,0.3); border-radius: 8px;" }

!!! info

    Check out [Open WebUI tutorial](./tutorial_openwebui.md) on Jetson AI Lab.

??? note "About Open WebUI"
    **What role does Open WebUI play?**

    Open WebUI is a **web-based chat interface** that:

    - 🌐 **Provides a familiar ChatGPT-like UI** in your browser
    - 🔌 **Connects to your local vLLM server** (not OpenAI's servers)
    - 💬 **Handles conversations** with chat history and context
    - 🎛️ **Offers model controls** (temperature, max tokens, etc.)
    - 📊 **Shows performance metrics** (tokens/sec, response time)

    **Architecture Flow:**
    ```
    You → Open WebUI (Browser) → vLLM Server → GPT-OSS-120B → Response
    ```

    **Key Benefits:**

    - 🔒 **Complete privacy** - No data sent to external servers
    - ⚡ **Local performance** - Thor's inference speed
    - 🎯 **Production testing** - Real application interface
    - 📈 **Performance monitoring** - See actual tokens/sec

### 6️⃣ Evaluate

Interact with OpenAI's gpt-oss-120b model!<br>

This is your chance to evaluate the accuracy, generalizability, and the performance of the model. <br>Use Open WebUI to test different scenarios and see how Thor handles this massive 120B parameter model.

??? note "Suggested Evaluation Methods"

    **🧠 Domain Knowledge Testing**

    Try prompts from your specific domain to see if the base model understands your field:

    - **Technical**: "Explain the differences between ROS1 and ROS2 for robotics development"
    - **Scientific**: "What are the key considerations for autonomous vehicle sensor fusion?"
    - **Business**: "Outline a go-to-market strategy for an edge AI product"
    - **Creative**: "Write a technical blog post about deploying AI at the edge"

    **⚡ Performance Monitoring**

    Watch the Open WebUI interface for key metrics:

    - **Time-to-First-Token (TTFT)**: How quickly does the first word appear?
    - **Tokens/second**: What's the sustained generation speed?
    - **Response quality**: Is the output coherent and relevant?
    - **Context handling**: Try longer conversations to test memory

    **🎯 Capability Assessment**

    Test different types of tasks:

    - **Reasoning**: Multi-step problem solving
    - **Code generation**: Write Python scripts or explain algorithms
    - **Analysis**: Summarize complex technical documents
    - **Instruction following**: Give specific formatting requirements

    #### Try Alternative Models

    **GPT-OSS-20B (Faster Alternative)**

    If you want to compare performance vs. capability trade-offs:

    Stop the current model serving by hitting ++ctrl+c++, then start a new model serving.

    ```bash
    # Inside container
    vllm serve openai/gpt-oss-20b
    ```

    **Other Popular Models to Explore**

    - **Llama-3.1-70B-Instruct**: Meta's flagship model
    - **Qwen2.5-72B-Instruct**: Strong multilingual capabilities
    - **Mixtral-8x22B-Instruct-v0.1**: Mixture of experts architecture

    #### Evaluation Questions to Consider

    As you interact with the model, think about:

    - **Is this model suitable for my use case?** Does it understand your domain well enough?
    - **What's the performance vs. quality trade-off?** Could a smaller model work just as well?
    - **How does local inference compare to cloud APIs?** Consider latency, privacy, and cost
    - **What would fine-tuning add?** Identify gaps that domain-specific training could fill

### 7️⃣ Stop vLLM serving

You can continue to the next section "Optimize" by just stopping the current model serving by hitting ++ctrl+c++ and keeping the container running.

However, **even when just stopping the vLLM serving process**, you need to clear GPU memory to make it available for the next model.

1. **Stop the vLLM serving:**

    Press ++ctrl+c++ on the terminal where you ran `vllm serve` command.

2. **⚠️ CRITICAL: Clear GPU memory cache (Workaround)**

    Due to the vLLM limitation, run this command on the **HOST** (outside the container):

    ```bash
    sudo sysctl -w vm.drop_caches=3
    ```

3. **Verify memory cleared:**

    ```bash
    jtop
    # GPU memory should drop to baseline (~3-6GB)
    ```

    <video width="100%" controls autoplay>
        <source src="./images/workaround_drop_caches_h264_720p.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>

!!! warning "Why This Workaround is Always Needed (For Now)"
    **This is an interim measure** due to a current vLLM bug/limitation where GPU memory cache is not properly released when stopping the serving process.

    Without this workaround, you may see 26GB+ of GPU memory still allocated, which prevents new models from loading in the optimization section.

    📋 **See detailed explanation:** [🚑 Troubleshooting → GPU Memory Not Released](#critical-gpu-memory-not-released-after-stopping-vllm)

    **Expected Future:** This workaround will become unnecessary once vLLM fixes the memory management issue in future releases.

---

## 🔧 Optimize: Precision Engineering (FP16 → FP8 → FP4)

Now that you've experienced Thor's raw power with the 120B model, it's time to dive into the **real engineering work** of model deployment optimization. <br>In this section, we'll systematically explore how to balance **performance vs. quality** through precision engineering—taking a production-ready model through FP16 → FP8 → FP4 quantization while measuring the impact at each step.

We'll use **Llama-3.1-8B-Instruct (FP16)** as our baseline.

### 1️⃣ Test FP16 model

#### 1.0 Check model cache and size

First, let's examine the FP16 model to understand its memory footprint:

```bash
# Check the cached model location and size
ls -la $HOME/data/models/huggingface/hub/models--meta-llama--Llama-3.1-8B-Instruct/

# Get detailed size breakdown
du -h $HOME/data/models/huggingface/hub/models--meta-llama--Llama-3.1-8B-Instruct/

# Check individual model weight files (stored as hash-named blobs)
ls -lh $HOME/data/models/huggingface/hub/models--meta-llama--Llama-3.1-8B-Instruct/blobs/

# Alternative: Check the actual model files in snapshots directory
find $HOME/data/models/huggingface/hub/models--meta-llama--Llama-3.1-8B-Instruct/snapshots/ \
  -name "*.safetensors" -exec ls -lh {} \;
```

**Expected output:**

- **Total model size**: ~30GB (15GB actual + 15GB in snapshots - HuggingFace cache structure)
- **Actual model weights**: ~15GB in FP16 precision
- **4 safetensors files**: Each ~4GB containing the neural network weights (stored as hash-named blobs)
- **Memory bandwidth impact**: Every token generation requires accessing these 15GB of weights

??? note "HuggingFace Cache Structure"
    The `du -h` command shows ~30GB total because HuggingFace stores files in both `/blobs/` (hash-named) and `/snapshots/` (symbolic links). The actual model size is ~15GB, but the cache structure doubles the apparent disk usage.

!!! info "Why Model Size Matters for Performance"
    **Memory Bandwidth Bottleneck**: Thor's unified memory architecture means that the 15GB of FP16 weights must be transferred over memory bandwidth for each inference step. This is why we see ~10-11 tokens/s baseline performance - we're bandwidth-limited, not compute-limited!

    **Quantization Impact**: Reducing precision (FP8 → FP4) doesn't just save memory - it **dramatically improves performance** by reducing bandwidth requirements.

#### 1.1 Serve

```bash
vllm serve meta-llama/Llama-3.1-8B-Instruct
```

Once loaded, select the model in Open WebUI.

#### 1.2 Baseline prompt & measurements

**Prompt (copy/paste):**

```text
Write a 5-sentence paragraph explaining the main benefit of using Jetson Thor for an autonomous robotics developer.
```

**Observe:**

- **Time-to-First-Token (TTFT)** — perceived latency
- **Tokens/sec** — throughput (use Open WebUI stats or API logs)
- **Answer quality** — coherence, accuracy, task fit

??? example "API test without UI"
    ```bash
    curl http://localhost:8000/v1/chat/completions \
        -H "Content-Type: application/json" \
        -d '{
            "model": "meta-llama/Llama-3.1-8B-Instruct",
            "messages": [
                {
                    "role": "user",
                    "content": "Write a 5-sentence paragraph explaining the main benefit of using Jetson Thor for an autonomous robotics developer."
                }
            ],
            "max_tokens": 256,
            "temperature": 0.7
          }'
    ```

---

### 2️⃣ FP8 Quantization

FP8 reduces memory bandwidth/footprint and **often matches FP16 quality** for many tasks.

```bash
vllm serve nvidia/Llama-3.1-8B-Instruct-FP8
```

Select this FP8 variant in Open WebUI and repeat the same prompt.
Compare **TTFT**, **tokens/sec**, and **answer quality** vs. FP16.

---

### 3️⃣ FP4 Quantization

Let's push further! <br>FP4 halves memory again vs. FP8 and is **much faster**, but may introduce noticeable quality drift (hallucinations, repetition).

#### 3.1 Relaunch in FP4

```bash
vllm serve nvidia/Llama-3.1-8B-Instruct-FP4
```

#### 3.2 Evaluate FP4 perf and accuracy

Run the **same prompt** and evaluate:

- 🚀**Speed**: should be visibly faster than FP16/FP8 both in terms of TTFT and generation speed.
- 🎯**Quality**: check fidelity to the prompt and coherence

    !!! question  "The Quality Question"
        Now, read the answer very carefully. Is it still as high-quality? Does it answer the prompt accurately? Do you see any strange wording, repetition, or nonsensical statements? This is the trade-off in action, and you are now experiencing the core challenge of on-device AI optimization.

??? success "Performance Recap (FP16 → FP8 → FP4)"

    ** 💡 Thor Performance Discovery: Memory Bandwidth is the Bottleneck**

    Our systematic testing revealed that Thor's performance is **memory bandwidth limited**, not compute limited. Each precision reduction directly translates to performance gains:

    | Precision | Model Memory | Startup Time | Generation Speed | vs FP16 Performance | Memory Reduction |
    |-----------|--------------|--------------|------------------|-------------------|------------------|
    | **FP16** (Baseline) | 14.99 GiB | ~25s | 10.7 tok/s | Baseline | - |
    | **FP8** | 8.49 GiB | 20.3s | **14.2 tok/s** | **+33% faster** | 43% less |
    | **FP4** | 6.07 GiB | 21.1s | **19.1 tok/s** | **+78% faster** | 59% less |

    **🔍 Key Engineering Insights:**

    - **Linear relationship**: Memory reduction directly correlates with performance improvement
    - **Thor's architecture**: 128GB unified memory optimized for capacity, not bandwidth
    - **Quantization impact**: Not just memory savings - dramatic performance gains
    - **Production trade-offs**: Speed vs. quality decisions based on real measurements

    **☑️ Workshop Validation:**

    - ✅ **Memory bandwidth theory confirmed** - 59% less data = 78% faster inference
    - ✅ **Consistent startup times** - All models load in ~20-25 seconds
    - ✅ **Predictable scaling** - Each precision step shows measurable improvements
    - ✅ **Real engineering decisions** - Data-driven optimization choices

    **Next step**: Test quality differences to complete the performance vs. accuracy trade-off analysis!

??? tip "Want to Quantize Models Yourself?"
    **We used NVIDIA's pre-quantized models for convenience, but you can quantize your own models!**

    **🔧 NVIDIA Tools & Resources:**

    - **[NVIDIA TensorRT Model Optimizer](https://github.com/NVIDIA/TensorRT-Model-Optimizer)** - Official NVIDIA quantization toolkit
    - **[NVIDIA ModelOpt](https://github.com/NVIDIA/TensorRT-Model-Optimizer)** - Advanced model optimization including FP8/FP4 quantization

    **🛠️ Popular Open-Source Tools:**

    - **[AutoGPTQ](https://github.com/PanQiWei/AutoGPTQ)** - Easy GPTQ quantization for various models
    - **[BitsAndBytes](https://github.com/TimDettmers/bitsandbytes)** - 4-bit and 8-bit quantization library
    - **[GGML/llama.cpp](https://github.com/ggerganov/llama.cpp)** - Quantization for CPU inference
    - **[Optimum](https://huggingface.co/docs/optimum/index)** - HuggingFace's optimization library

    **📚 Learning Resources:**

    - **[Quantization Fundamentals](https://huggingface.co/blog/merve/quantization)** - HuggingFace blog series
    - **[NVIDIA Deep Learning Performance Guide](https://docs.nvidia.com/deeplearning/performance/index.html)** - Comprehensive optimization guide
    - **[vLLM Quantization Documentation](https://docs.vllm.ai/en/latest/quantization/supported_methods.html)** - Supported quantization methods

    **⚡ Quick Start Example:**
    ```python
    # Using AutoGPTQ to quantize your own model
    from auto_gptq import AutoGPTQForCausalLM, BaseQuantizeConfig

    quantize_config = BaseQuantizeConfig(
        bits=4,  # FP4 quantization
        group_size=128,
        desc_act=False,
    )

    model = AutoGPTQForCausalLM.from_pretrained(
        "your-model-name",
        quantize_config
    )
    model.quantize(calibration_dataset)
    model.save_quantized("./quantized-model")
    ```

### 4️⃣ Speculative Decoding

In Part 3, we pushed our model to FP4. We got a **massive boost in speed** and a **huge reduction in memory**, but we also hit the trade-off: **the quality can start to degrade**.

So, the next logical question is: **Can we get even faster than our FP4 model, but without sacrificing any more quality?**

**The answer is yes.** We can do this by using **Speculative Decoding**.

!!! info "How Speculative Decoding Works"
    This is a **clever technique that doesn't change the model's weights at all**. Instead, it uses a second, much smaller **"draft" model** that runs alongside our main FP4 model.

    **The Process:**

    1. **Draft Phase**: This tiny, super-fast model "guesses" **5 tokens ahead**
    2. **Verification Phase**: Our larger, "smart" FP4 model **checks all 5 of those guesses at once** in a single step
    3. **Results**:
        - ✅ **If the guesses are correct**: We get **5 tokens for the price of 1** → huge speedup
        - ❌ **If a guess is wrong**: The main model simply corrects it and continues

    <img src="https://developer-blogs.nvidia.com/wp-content/uploads/2025/09/speculative-decoding-verification-phase-target-model.gif" width="66%">

    **🎯 Key Takeaway**: The final output is **mathematically identical** to what the FP4 model would have produced on its own. We are getting a significant performance boost **"for free,"** with **no additional quality loss**.

    **Learn More**:

    - **[NVIDIA Developer Blog: Introduction to Speculative Decoding](https://developer.nvidia.com/blog/an-introduction-to-speculative-decoding-for-reducing-latency-in-ai-inference/)** - Comprehensive guide to speculative decoding techniques
    - **[vLLM Speculative Decoding Documentation](https://docs.vllm.ai/en/v0.10.1/features/spec_decode.html)** - Official implementation guide
    - **[EAGLE-3 Research Paper](https://arxiv.org/abs/2503.01840)** - Academic paper: "Scaling up Inference Acceleration of Large Language Models via Training-Time Test"

#### 4.1 Relaunch with Speculative Decoding

Let's stop the last server. This time, our command is a bit more complex. We're telling vLLM to serve our FP4 model, but to also load a specific **"draft" model (EAGLE3)** to help it.

```bash
# Stop current FP4 serving (Ctrl+C)
# Then launch with speculative decoding:
vllm serve nvidia/Llama-3.1-8B-Instruct-FP4 \
  --trust_remote_code \
  --speculative-config '{"method":"eagle3","model":"yuhuili/EAGLE3-LLaMA3.1-Instruct-8B","num_speculative_tokens":5}'
```

??? note "What's Happening Here"
    - **Main model**: `nvidia/Llama-3.1-8B-Instruct-FP4` (our optimized FP4 model)
    - **Draft model**: `yuhuili/EAGLE3-LLaMA3.1-Instruct-8B` (tiny, fast predictor)
    - **Speculation depth**: 5 tokens ahead
    - **Trust remote code**: Required for EAGLE3 implementation

!!! info "What is EAGLE3?"
    **EAGLE3** (Extrapolation Algorithm for Greater Language-model Efficiency) is a **specific implementation of speculative decoding** that uses a small, specialized "draft" model to predict multiple tokens ahead of the main model.

    **Key Features:**

    - **Lightweight architecture**: Much smaller than the main model (~850MB vs ~6GB)
    - **Fast prediction**: Generates 5 token candidates in parallel
    - **Model-specific training**: Trained specifically for Llama-3.1 models
    - **Zero quality loss**: Main model verifies all predictions, ensuring identical output

    **How it works:**

    1. **EAGLE3 draft model** quickly generates 5 potential next tokens
    2. **Main FP4 model** evaluates all 5 predictions in a single forward pass
    3. **Accepts correct predictions** and continues from the first incorrect one
    4. **Result**: Up to 5x speedup when predictions are accurate

    **Why "EAGLE3"**: This is the third generation of the EAGLE algorithm, optimized for better acceptance rates and broader model compatibility.

    **Learn More**:

    - [vLLM Speculative Decoding Documentation](https://docs.vllm.ai/en/v0.10.1/features/spec_decode.html#speculating-using-eagle-based-draft-models) - "Speculating using EAGLE based draft models" section.
    - [EAGLE-3 Research Paper](https://arxiv.org/abs/2503.01840) - Academic paper: "Scaling up Inference Acceleration of Large Language Models via Training-Time Test"

#### 4.2 Test Performance and Quality

Once it's loaded, go back to **Open WebUI**. The model name will be the same as before (`nvidia/Llama-3.1-8B-Instruct-FP4`), but it's now running with its new **speculative assistant**.

**Now let's prompt it again and pay very close attention to these two things:**

1. **🚀 Generation Speed**: Look at the throughput. The words should appear to **fly onto the screen**. This should be the **fastest version we've seen today**.

    <video width="100%" controls autoplay muted loop>
      <source src="https://github.com/user-attachments/assets/b6f0bceb-8ef0-4bc0-be29-3e46d885a403" type="video/mp4">
      Your browser does not support the video tag.
    </video>

    ??? success "Performance Recap: The Complete Optimization Journey"

        **🎯 From 10.7 to 25.6+ tokens/second - A 2.4x Performance Breakthrough!**

        | Configuration | Memory | Generation (Short) | Generation (Long) | vs FP16 | Best Case |
        |---------------|--------|--------------------|-------------------|---------|-----------|
        | **FP16** (Baseline) | 14.99 GiB | 10.7 tok/s | ~10.7 tok/s | Baseline | Baseline |
        | **FP8** | 8.49 GiB | 14.2 tok/s | ~14.2 tok/s | **+33%** | +33% |
        | **FP4** | 6.07 GiB | 19.1 tok/s | ~19.1 tok/s | **+78%** | +78% |
        | **FP4 + Speculative** | 6.86 GiB | 14.3 tok/s | **25.6 tok/s** | **+139%** | **+139%** |

        **🔍 Key Engineering Insights:**

        - **Memory bandwidth bottleneck confirmed**: Thor's performance scales directly with memory reduction
        - **Context matters for speculation**: Short responses show modest gains, long responses show dramatic improvements
        - **Speculative decoding sweet spot**: Most effective for structured, longer content generation
        - **Production decision framework**: Choose based on your specific use case and content length

         **🚀 Ultimate Result**: **25.6 tokens/second** for long content - nearly **2.4x faster** than our FP16 baseline!

2. **🎯 Quality**: Compare this answer very closely to the one you got in Part 3 (FP4). The quality should be **essentially unchanged**. This proves that speculative decoding is purely a **performance optimization** and does not change the model's final output.

!!! info "Where this truly shines"
    On **70B-class** models, FP4 + speculative decoding can feel close to smaller models for interactivity, while preserving large-model competence.

---

## 🚑 Troubleshooting

??? warning "Critical: GPU Memory Not Released After Stopping vLLM"
    **Common Issue:** Even after stopping the vLLM container, GPU memory remains allocated (e.g., 26GB+ still in use).

    **Root Cause:** Current vLLM version has a known issue where inference cache is not properly freed when the container stops.

    **Immediate Solution:**
    ```bash
    # Run this command on the HOST after stopping vLLM container
    sudo sysctl -w vm.drop_caches=3
    ```

    **Video demonstration:**

    <video width="100%" controls autoplay>
      <source src="./images/workaround_drop_caches_h264_720p.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>

    **When to use this:**
    - After every vLLM container stop
    - Before starting a new model inference session
    - When `jtop` shows unexpectedly high GPU memory usage

    **Alternative (if the above doesn't work):**
    ```bash
    # More aggressive memory clearing
    sudo systemctl restart docker
    # Or as last resort:
    sudo reboot
    ```

    🔗 **Related Issues:**

    - **[NVIDIA Forums: vLLM container on Jetson Thor second start fails until vm.drop_caches=3](https://forums.developer.nvidia.com/t/vllm-container-on-jetson-thor-second-start-fails-until-vm-drop-caches-3-system-issue-or-thor-vllm-container-25-08-py3-base-bug/347575)** - Exact issue and workaround discussion
    - **[GitHub Issue #11230: Increased VRAM usage [OOM][KV cache]](https://github.com/vllm-project/vllm/issues/11230)** - Related memory management issues

??? warning "NVML Errors and Model Architecture Failures"
    **Common Issue:** If you see errors like:
    - `Can't initialize NVML`
    - `NVMLError_Unknown: Unknown Error`
    - `Model architectures ['GptOssForCausalLM'] failed to be inspected`

    **Root Cause:** Malformed Docker daemon configuration

    **Check Docker daemon.json:**
    ```bash
    cat /etc/docker/daemon.json
    ```

    **If the file is missing the default-runtime configuration:**
    ```json
    {
        "runtimes": {
            "nvidia": {
                "args": [],
                "path": "nvidia-container-runtime"
            }
        }
    }
    // ❌ Missing "default-runtime": "nvidia" !
    ```

    **Fix with complete configuration:**
    ```bash
    sudo nano /etc/docker/daemon.json
    ```

    **Correct content:**
    ```json
    {
        "runtimes": {
            "nvidia": {
                "args": [],
                "path": "nvidia-container-runtime"
            }
        },
        "default-runtime": "nvidia"
    }
    ```

    **Apply the fix:**
    ```bash
    # Restart Docker daemon
    sudo systemctl restart docker

    # Verify Docker is running
    sudo systemctl status docker

    # Test NVIDIA runtime (Thor-compatible CUDA 13)
    docker run --rm --runtime=nvidia nvcr.io/nvidia/cuda:13.0.0-runtime-ubuntu24.04 nvidia-smi

    # Restart your vLLM container
    docker stop vllm  # if running
    # Then relaunch with the corrected Docker configuration
    ```

    **If Docker Runtime Issues Persist:**

    Try a system reboot - this often resolves Docker runtime configuration issues:

    ```bash
    sudo reboot
    ```

    **Why reboot helps:**
    - Complete Docker daemon restart with new configuration
    - Fresh NVIDIA driver/runtime initialization
    - Proper CDI device registration
    - All system services start in correct order

    **After reboot, test immediately:**
    ```bash
    docker run --rm --runtime=nvidia nvcr.io/nvidia/cuda:13.0.0-runtime-ubuntu24.04 nvidia-smi
    ```

    **Tested on:** L4T (Jetson Linux) r38.2.2

??? warning "Stuck GPU Memory Allocations"
    **Symptom:** vLLM fails with "insufficient GPU memory" despite stopping containers

    **Example error:**
    ```
    ValueError: Free memory on device (14.45/122.82 GiB) on startup is less than
    desired GPU memory utilization (0.7, 85.98 GiB)
    ```

    **Diagnosis:**
    ```bash
    # Check current GPU memory usage
    jtop
    # Expected baseline: ~3-6GB system usage
    # Problem: 25GB+ or 100GB+ unexplained usage
    ```

    **Solution sequence:**
    ```bash
    # 1. Stop all containers
    docker stop $(docker ps -q) 2>/dev/null
    docker rm $(docker ps -aq) 2>/dev/null

    # 2. Restart Docker daemon
    sudo systemctl restart docker

    # 3. Check if memory cleared
    jtop

    # 4. If memory still high (>10GB baseline), reboot system
    sudo reboot
    ```

    **Root Cause Investigation:**
    This appears to be related to GPU memory allocations not being properly released at the driver level. We're investigating the exact cause and will update this section with a more targeted solution.

    **Workaround for now:** System reboot reliably clears stuck allocations.

??? warning "User Permissions and Docker Access"
    **Verify user permissions:**
    ```bash
    groups $USER  # Should include 'docker'
    ```

    **Check GPU accessibility:**
    ```bash
    nvidia-smi
    # Or test via Docker:
    docker run --rm --runtime=nvidia nvcr.io/nvidia/cuda:13.0.0-runtime-ubuntu24.04 nvidia-smi
    ```

??? warning "HuggingFace Gated Repository Access Error"
    **Common Issue:** When trying to serve Llama models (e.g., `meta-llama/Llama-3.1-8B-Instruct`), you see:
    ```
    OSError: You are trying to access a gated repo.
    Make sure to have access to it at https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct.
    401 Client Error.
    Cannot access gated repo for url https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct/resolve/main/config.json.
    Access to model meta-llama/Llama-3.1-8B-Instruct is restricted. You must have access to it and be authenticated to access it.
    ```

    **Root Cause:** Meta's Llama models are "gated" on HuggingFace, requiring:
    1. **HuggingFace account** with access approval
    2. **Authentication token** configured in the container

    **Workshop Solution (Pre-downloaded Models):**

    This workshop **cleverly avoids this issue** by pre-downloading model weights to the host system. When you use the volume mount `-v $HOME/data/models/huggingface:/root/.cache/huggingface`, vLLM finds the local model files and doesn't need to authenticate with HuggingFace.

    **If You Need Authentication (Post-Workshop):**
    ```bash
    # 1. Get HuggingFace token from https://huggingface.co/settings/tokens
    # 2. Inside the container, authenticate:
    pip install huggingface_hub
    huggingface-cli login
    # Enter your token when prompted

    # 3. Or set environment variable:
    export HUGGING_FACE_HUB_TOKEN="your_token_here"
    ```

    **Workshop Advantage:**
    - ✅ **No authentication needed** - Models are pre-cached locally
    - ✅ **Faster startup** - No network downloads during workshop
    - ✅ **Reliable access** - Works even without internet connectivity
    - ✅ **Focus on optimization** - Skip the credential setup complexity

??? warning "Model doesn't appear in Open WebUI"
    - Confirm WebUI uses `OPENAI_API_BASE_URL=http://<thor-ip>:8000/v1`
    - Check with `curl http://localhost:8000/v1/models`
    - Verify `docker logs open-webui` shows successful backend registration
    - Check that vLLM is listening on `0.0.0.0:8000`

??? warning "OOM or slow loads"
    - Reduce **context window** or switch to **FP8/FP4**
    - Ensure **swap** is configured appropriately on Thor for your image
    - Close unused sessions/models

??? warning "Tokenizers/encodings error"
    - Re-export `TIKTOKEN_ENCODINGS_BASE`
    - Confirm files exist under `/etc/encodings/*.tiktoken`

---

## What to do next

- Try a **70B** FP4 model with speculative decoding and compare UX to 8B
- Add observability: **latency histograms**, **p95 TTFT**, **tokens/sec**

---


## Appendix

### Pre-Workshop Setup (For Organizers)

!!! info "Directory Structure Alignment"
    **Following jetson-containers convention with optimization caching:**

    We use `$HOME/data/` as the unified data directory structure:
    ```
    /home/jetson/data/                    177G total
    ├── models/huggingface/               176G (all workshop models)
    │   ├── hub/                          167G
    │   │   ├── models--openai--gpt-oss-120b                   122G (120B main model)
    │   │   ├── models--meta-llama--Llama-3.1-8B-Instruct      30G (FP16 baseline)
    │   │   ├── models--nvidia--Llama-3.1-8B-Instruct-FP8      8.5G (FP8 quantized)
    │   │   ├── models--nvidia--Llama-3.1-8B-Instruct-FP4      5.7G (FP4 quantized)
    │   │   └── models--yuhuili--EAGLE3-LLaMA3.1-Instruct-8B   811M (Speculative draft)
    │   ├── xet/                          9.3G (HuggingFace cache)
    │   └── modules/                      4KB
    └── vllm_cache/torch_compile_cache/   628M (6 pre-warmed compilation caches)
        ├── 248df3d3e5/ (97M), 71b2b46784/ (78M), 92deee5901/ (141M)
        ├── b7ef42f749/ (92M), cd8c499fb2/ (116M), fce60ae060/ (107M)
        └── (optimized for all model variants - instant startup!)
    ```

    This ensures:

    - ✅ **Consistency** with existing Jetson workflows
    - ✅ **Familiar paths** for jetson-containers users
    - ✅ **Easy integration** with other Jetson AI tools
    - ✅ **Standardized model storage** across projects
    - ✅ **Pre-warmed optimization** for instant startup

!!! warning "Storage Requirements"
    **Total storage needed per Thor unit:**

    **Container Images (~15GB):**
    - **vLLM container**: `nvcr.io/nvidia/vllm:25.09-py3` (~8GB)
    - **Open WebUI container**: `ghcr.io/open-webui/open-webui:main` (~2GB)
    - **CUDA base container**: `nvcr.io/nvidia/cuda:13.0.0-runtime-ubuntu24.04` (~3GB)

    **Model Weights (~140GB):**
    - **GPT-OSS-120B**: ~122GB (main workshop model)
    - **Llama-3.1-8B-Instruct (FP16)**: ~15GB
    - **Llama-3.1-8B-Instruct-FP8**: ~8GB (NVIDIA quantized)
    - **Llama-3.1-8B-Instruct-FP4**: ~6GB (NVIDIA quantized)
    - **EAGLE3 draft model**: ~850MB (for speculative decoding)

    **System Components (~10GB):**
    - **vLLM compilation cache**: ~2GB (torch.compile optimizations)
    - **HuggingFace tokenizer cache**: ~500MB
    - **System utilities**: `jtop`, `nvtop`, monitoring tools (~100MB)
    - **Workshop workspace**: Scripts, logs, examples (~1GB)
    - **Docker overlay storage**: ~6GB

    **Total Required**: ~165GB
    **Recommended per unit**: 200GB+ free space for comfortable operation and future expansion

**Model Pre-download Process:**
```bash
# 1. Download model once (takes 30-60 minutes depending on network)
sudo docker run --rm -it --runtime=nvidia --name=vllm-download \
  nvcr.io/nvidia/vllm:25.09-py3

# Inside container, trigger model download:
python -c "
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained('openai/gpt-oss-120b')
print('Model downloaded successfully!')
"

# 2. Copy model cache to host (jetson-containers structure)
mkdir -p $ROOT/data/models
docker cp vllm-download:/root/.cache/huggingface $ROOT/data/models/

# 3. Verify model size
du -h $ROOT/data/models/huggingface/hub/models--openai--gpt-oss-120b/
# Should show ~122GB
```

**Distribute to all workshop units:**
```bash
# Copy to each Thor unit (adjust IPs/hostnames)
for unit in thor-{01..60}; do
  rsync -av --progress $ROOT/data/models/ ${unit}:$ROOT/data/models/
done
```

---