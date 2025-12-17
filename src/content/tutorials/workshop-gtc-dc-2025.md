---
title: "GTC DC 2025: From AI Exploration to Production Deployment"
description: "Master inference optimization on Jetson Thor with vLLM. Learn to deploy production-grade LLM serving, quantization strategies (FP16 → FP8 → FP4), and advanced optimizations like speculative decoding."
category: "Workshops"
section: "Hands-on Labs"
order: 1
tags: ["Jetson Thor", "vLLM", "Quantization", "FP8", "FP4", "Speculative Decoding", "LLM Serving", "GTC"]
featured: false
---

# From AI Exploration to Production Deployment

*Master inference optimization on Jetson Thor with vLLM*

Welcome! In this hands-on workshop, you'll unlock truly high-performance, **on-device** generative AI using the new **NVIDIA Jetson Thor**. You'll start by unleashing Thor's full potential with a state-of-the-art 120B model, then step through practical optimizations — **FP8**, **FP4**, and **speculative decoding** — measuring speed vs. quality at each stage.

## Workshop Overview

### What You Will Learn

- **Deploy production-grade LLM serving** - Set up vLLM with OpenAI-compatible APIs on Thor hardware
- **Master quantization strategies** - Compare FP16 → FP8 → FP4 performance vs. quality trade-offs systematically
- **Implement advanced optimizations** - Apply speculative decoding and other techniques for maximum throughput

### Who Is This For

- Teams building edge applications/products (robots, kiosks, appliances) who need **fast, private, API-compatible** LLMs without cloud dependency
- Developers interested in learning inference optimizations

### What We Provide (GTC Workshop)

- **Hardware**: Jetson AGX Thor Developer Kit setup in rack
  - Jetson HUD: To help you locate your device and monitor the hardware stats
- **Software**: BSP pre-installed, Docker pre-setup
  - **Containers**: Container images pre-pulled (downloaded)
  - **Data**: Some models are pre-downloaded (to save time for workshop)
- **Access**: Headless, through the network (SSH + Web UI)

### Self-Paced Requirements

- **Hardware**: Jetson AGX Thor Developer Kit
- **Software**: BSP installed ([Thor Getting Started](https://docs.nvidia.com/jetson/agx-thor-devkit/user-guide/latest/quick_start.html)), Docker setup
- **Containers**: NGC's `vllm` container (`nvcr.io/nvidia/vllm:25.09-py3`), Open WebUI official container (`ghcr.io/open-webui/open-webui:main`)

> **Why Thor?** Thor's memory capacity enables **large models** and **large context windows**, allows **serving multiple models concurrently**, and supports **high-concurrency batching** on-device.

---

## 🚀 Experience: Thor's Raw Power with 120B Intelligence

### Open Weight Models

Unlike **closed models** (GPT-4, Claude, Gemini), **open weights models** give you:

- **Complete model access**: Download and run locally
- **Data privacy**: Your data never leaves your device
- **No API dependencies**: Work offline, no rate limits
- **Customization freedom**: Fine-tune for your specific needs
- **Cost control**: No per-token charges

| Aspect | Closed Models (GPT-4, etc.) | Open Weights Models |
|--------|------------------------------|---------------------|
| **Privacy** | Data sent to external servers | Stays on your device |
| **Latency** | Network dependent | Local inference speed |
| **Availability** | Internet required | Works offline |
| **Customization** | Limited via prompts | Full fine-tuning possible |
| **Cost** | Pay per token/request | Hardware cost only |
| **Compliance** | External data handling | Full control |

### GPT-OSS-120B: Game Changer 🎯

**OpenAI's GPT-OSS-120B** represents a breakthrough:

- **First major open weights model** from OpenAI
- **120 billion parameters** of GPT-quality intelligence
- **Massive compute requirements** - needs serious hardware

**The Thor Advantage:**

- **One of the few platforms** capable of running GPT-OSS-120B at the edge
- **Real-time inference** without cloud dependencies
- **Perfect for evaluation**: Test if the model fits your domain
- **Baseline assessment**: Understand capabilities before fine-tuning

### Understanding LLM Inference and Serving

An **inference engine** is specialized software that takes a trained AI model and executes it efficiently to generate predictions or responses.

**Key responsibilities:**

- **Model loading**: Reading model weights into memory
- **Memory management**: Optimizing GPU/CPU memory usage
- **Request handling**: Processing multiple concurrent requests
- **Optimization**: Applying techniques like quantization, batching, caching

### Popular Inference Engines

| Engine | Strengths | Best For |
|--------|-----------|----------|
| **vLLM** | High throughput, PagedAttention, OpenAI compatibility | Production serving, high concurrency |
| **SGLang** | Structured generation, complex workflows, multi-modal | Advanced use cases, structured outputs |
| **Ollama** | Easy setup, local-first, model management | Development, personal use, quick prototyping |
| **llama.cpp** | CPU-focused, lightweight, quantization | Resource-constrained environments |
| **TensorRT-LLM** | Maximum performance, NVIDIA optimization | Latency-critical applications |
| **Text Generation Inference** | HuggingFace integration, streaming | HuggingFace ecosystem |

### Why vLLM for This Workshop?

- 🚀 **PagedAttention**: Revolutionary memory management for high throughput
- 🔌 **OpenAI compatibility**: Drop-in replacement for existing applications
- ⚡ **Advanced optimizations**: Continuous batching, speculative decoding, quantization
- 🎯 **Thor optimization**: NVIDIA provides and maintains vLLM containers on NGC
- 📊 **Production ready**: Built for real-world deployment scenarios

---

## Exercise: Launch Your First 120B Model

### 1️⃣ Starting vLLM Container

Start running the vLLM container (provided by NVIDIA on NGC):

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

### 3️⃣ Verify Pre-downloaded Model

Inside the container, check if the model is available:

```bash
ls -la /root/.cache/huggingface/hub/models--openai--gpt-oss-120b/
du -h /root/.cache/huggingface/hub/models--openai--gpt-oss-120b/
# Should show ~122GB - no download needed!
```

### 4️⃣ Launch vLLM Server

```bash
vllm serve openai/gpt-oss-120b
```

The vLLM serve command will take approximately **2.5 minutes** to complete startup on Thor. Watch for the final "Application startup complete" message!

#### Test the API Endpoints

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

### 6️⃣ Evaluate

Interact with OpenAI's gpt-oss-120b model! This is your chance to evaluate the accuracy, generalizability, and the performance of the model.

**Suggested Evaluation Methods:**

- **Domain Knowledge Testing**: Try prompts from your specific domain
- **Performance Monitoring**: Watch for Time-to-First-Token (TTFT) and tokens/second
- **Capability Assessment**: Test reasoning, code generation, analysis tasks

### 7️⃣ Stop vLLM Serving

Press `Ctrl+C` on the terminal where you ran `vllm serve` command.

**⚠️ CRITICAL: Clear GPU memory cache:**

```bash
sudo sysctl -w vm.drop_caches=3
```

**Verify memory cleared:**

```bash
jtop
# GPU memory should drop to baseline (~3-6GB)
```

---

## 🔧 Optimize: Precision Engineering (FP16 → FP8 → FP4)

Now let's systematically explore how to balance **performance vs. quality** through precision engineering.

### 1️⃣ Test FP16 Model (Baseline)

```bash
vllm serve meta-llama/Llama-3.1-8B-Instruct
```

**Baseline prompt:**

```text
Write a 5-sentence paragraph explaining the main benefit of using Jetson Thor for an autonomous robotics developer.
```

**Observe:** Time-to-First-Token, Tokens/sec, Answer quality

### 2️⃣ FP8 Quantization

FP8 reduces memory bandwidth/footprint and **often matches FP16 quality** for many tasks.

```bash
vllm serve nvidia/Llama-3.1-8B-Instruct-FP8
```

Compare **TTFT**, **tokens/sec**, and **answer quality** vs. FP16.

### 3️⃣ FP4 Quantization

FP4 halves memory again vs. FP8 and is **much faster**, but may introduce noticeable quality drift.

```bash
vllm serve nvidia/Llama-3.1-8B-Instruct-FP4
```

### Performance Recap (FP16 → FP8 → FP4)

| Precision | Model Memory | Generation Speed | vs FP16 Performance | Memory Reduction |
|-----------|--------------|------------------|-------------------|------------------|
| **FP16** (Baseline) | 14.99 GiB | 10.7 tok/s | Baseline | - |
| **FP8** | 8.49 GiB | **14.2 tok/s** | **+33% faster** | 43% less |
| **FP4** | 6.07 GiB | **19.1 tok/s** | **+78% faster** | 59% less |

---

## 4️⃣ Speculative Decoding

Can we get even faster than our FP4 model, but without sacrificing any more quality? **Yes!** Using **Speculative Decoding**.

### How Speculative Decoding Works

This technique uses a second, much smaller **"draft" model** that runs alongside our main FP4 model:

1. **Draft Phase**: This tiny, super-fast model "guesses" **5 tokens ahead**
2. **Verification Phase**: Our larger, "smart" FP4 model **checks all 5 of those guesses at once**
3. **Results**:
   - ✅ **If the guesses are correct**: We get **5 tokens for the price of 1** → huge speedup
   - ❌ **If a guess is wrong**: The main model simply corrects it and continues

**🎯 Key Takeaway**: The final output is **mathematically identical** to what the FP4 model would have produced on its own!

### Launch with Speculative Decoding

```bash
vllm serve nvidia/Llama-3.1-8B-Instruct-FP4 \
  --trust_remote_code \
  --speculative-config '{"method":"eagle3","model":"yuhuili/EAGLE3-LLaMA3.1-Instruct-8B","num_speculative_tokens":5}'
```

### Complete Performance Journey

| Configuration | Memory | Generation (Long) | vs FP16 |
|---------------|--------|-------------------|---------|
| **FP16** (Baseline) | 14.99 GiB | ~10.7 tok/s | Baseline |
| **FP8** | 8.49 GiB | ~14.2 tok/s | **+33%** |
| **FP4** | 6.07 GiB | ~19.1 tok/s | **+78%** |
| **FP4 + Speculative** | 6.86 GiB | **25.6 tok/s** | **+139%** |

🚀 **Ultimate Result**: **25.6 tokens/second** for long content - nearly **2.4x faster** than our FP16 baseline!

---

## 🚑 Troubleshooting

### GPU Memory Not Released

Even after stopping the vLLM container, GPU memory remains allocated.

**Solution:**

```bash
sudo sysctl -w vm.drop_caches=3
```

### NVML Errors

Check Docker daemon configuration:

```bash
cat /etc/docker/daemon.json
```

Ensure `"default-runtime": "nvidia"` is present.

### HuggingFace Gated Repository Access

For Llama models, you need HuggingFace authentication:

```bash
pip install huggingface_hub
huggingface-cli login
```

---

## What to Do Next

- Try a **70B** FP4 model with speculative decoding
- Add observability: **latency histograms**, **p95 TTFT**, **tokens/sec**
- Explore other models: Qwen2.5-72B, Mixtral-8x22B

