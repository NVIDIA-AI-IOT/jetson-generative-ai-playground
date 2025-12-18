---
title: "Introduction to GenAI on Jetson: How to Run LLMs and VLMs"
description: "A practical intro to running LLMs and VLMs on Jetson. Use Ollama for fast experimentation, and vLLM for best performance (LLMs + VLMs supported)."
category: "Fundamentals"
section: "Core Concepts"
order: 1
tags: ["fundamentals", "genai", "jetson", "llm", "vlm", "ollama", "vllm", "speculative-decoding", "eagle3"]
model: "ollama / vllm"
featured: true
---

Running Generative AI on Jetson usually comes down to two workflows:

- **Ollama**: best for *getting started fast* and trying models "on the fly".
- **vLLM**: best for *production-like serving* and *optimal performance* on Jetson.

This guide covers **LLMs (text models)** and **VLMs (vision-language models)** equally. The flow is the same, only the model checkpoint changes.

## 🎯 Overview

You will learn:

- The "Jetson way" to run **LLMs and VLMs** locally.
- When to pick **Ollama** vs **vLLM**.
- Which **vLLM container** to use on Orin vs Thor.
- How **speculative decoding (EAGLE-3)** can boost throughput with no quality loss (when configured well).

## 📋 Prerequisites

- **Jetson** with JetPack installed.
- **Internet access** (for pulling models and containers).

If you're unsure what models are known-good on Jetson, start with the **Models** page and copy-paste the run commands:

- [Supported Models](/models)

---

## 🚀 Ollama for quick start

Ollama is a great entry point: install it, pull a model, and start prompting in minutes. The **native Ollama installer can be used on any Jetson model**.

### Step 1: Install Ollama (native)

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Pull a small VLM-capable model

```bash
ollama pull gemma3:4b
```

### Step 3: Discover available models

For the list of models you can use with `ollama pull` / `ollama run` / `ollama serve`, check:

- [Ollama model search](https://ollama.com/search)

### Learn more

For a deeper Ollama walkthrough (including **Open WebUI** setup), see [Ollama documentation](https://ollama.com).

> Open WebUI works great for both **LLMs and VLMs**, giving you a simple browser UI on your Jetson for chatting (and for VLMs, attaching images).

---

## 🚀 vLLM for best performance

If you care about *maximum throughput*, *low latency* and getting the most out of your Jetson, **use vLLM whenever possible**. vLLM supports both **LLMs and VLMs**. You will use the same server command. We do not recommend going through the hassle of building and installing vLLM yourself. Instead, use our prebuilt vLLM containers, they are set up correctly and regularly updated.

### Pick the right container for your Jetson

- **Jetson Orin**: `ghcr.io/nvidia-ai-iot/vllm:latest-jetson-orin`
- **Jetson Thor**: `ghcr.io/nvidia-ai-iot/vllm:latest-jetson-thor`

### Run the container

Below is a simple pattern that works well for most setups (host networking + Hugging Face cache mounted):

```bash
docker run --rm -it --runtime nvidia --network host \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  ghcr.io/nvidia-ai-iot/vllm:latest-jetson-orin
```

If you are on Jetson Thor, change only the container image to `ghcr.io/nvidia-ai-iot/vllm:latest-jetson-thor`.

### Serve a model (LLM or VLM)

Inside the container:

```bash
vllm serve MODEL_CHECKPOINT
```

Where `MODEL_CHECKPOINT` is typically a Hugging Face repo ID (for example: `org/model-name`).

### Model formats & quantization tips

- **Most models are already supported** in vLLM.
- With something like **4-bit quantization**, you can get a huge performance boost with barely any accuracy degradation. It's recommended to use it whenever possible.
  - Prefer **W4A16** checkpoints when available.
  - If you don't see **W4A16** for a given model, **AWQ** and **GPTQ** are also common W4A16-style 4-bit variants, so using an **AWQ** or **GPTQ** checkpoint is a solid fallback.
- If you're on **Jetson Thor**, prefer **NVFP4 quantization** whenever it's available for the model.

### "Known-good" model list

For models tested and guaranteed to work on Jetson (with copy/paste commands you can run using vLLM), refer to [Supported Models](/models). You can switch between Jetson Orin and Jetson Thor to copy the right container command.

### Example: vLLM + Open WebUI

Here is a simple way to see how fast you can go from zero to chatting with your model in a WebUI.

First, start Open WebUI:

```bash
docker run -d \
  --network=host \
  -v ${HOME}/open-webui:/app/backend/data \
  -e OPENAI_API_BASE_URL=http://0.0.0.0:8000/v1 \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

Then, start vLLM and serve a model. Here is one command you can copy and run on Jetson Orin:

```bash
docker run --pull=always --rm -it \
  --network host \
  --shm-size=16g \
  --ulimit memlock=-1 \
  --ulimit stack=67108864 \
  --runtime=nvidia \
  --name=vllm \
  -v $HOME/data/models/huggingface:/root/.cache/huggingface \
  ghcr.io/nvidia-ai-iot/vllm:latest-jetson-orin \
  vllm serve RedHatAI/Qwen3-8B-quantized.w4a16
```

If you are on Jetson Thor, change only the container image to `ghcr.io/nvidia-ai-iot/vllm:latest-jetson-thor`. You can also refer to [Supported Models](/models) to copy the right command for your device.

Wait for the model to be served, then visit `http://localhost:8080` in your browser.

From here, you can interact with the LLM and add tools that provide agentic capabilities, such as search, data analysis, and voice output (TTS).

### Faster generation with EAGLE-3 speculative decoding

One of the reasons we recommend vLLM is that it opens the door to speculative decoding. Speculative decoding is quickly becoming an industry standard for boosting generation speed.

In speculative decoding, you run a smaller **draft model** alongside your main model. This means you now choose two checkpoints: the main model you want to serve and a small draft model that is designed to go with it. The draft model proposes multiple candidate tokens, then the main model verifies and accepts them efficiently. When the draft model matches your prompts and data well, you can get a meaningful performance boost with **no loss in accuracy**. If the draft model is a poor fit, the speedup can be smaller because the main model rejects more draft tokens and spends more time verifying. The real answer is empirical, so test it with the prompts you care about, talk to the model, or run it on your dataset to get a feel for the speedups you get.

Thankfully, amazing people in the open source community have trained and published draft models that pair with popular base models. A good resource for finding these is the [Speculator models collection (RedHatAI)](https://huggingface.co/collections/RedHatAI/speculator-models).

If there is a strong draft model available for your main model, there is little reason not to use speculative decoding. If you do not enable it, you are usually leaving performance on the table.

Here is a simple example you can copy and run:

```bash
vllm serve Qwen/Qwen3-8B \
  --speculative-config '{
    "model": "RedHatAI/Qwen3-8B-speculator.eagle3",
    "num_speculative_tokens": 3,
    "method": "eagle3"
  }'
```

We recommend starting with **EAGLE-3** draft or speculator models, since many are supported with vLLM.

Do not be afraid to mix quantization with speculative decoding. In our experience, this is where the best speedups come from. For example:

```bash
vllm serve RedHatAI/Qwen3-8B-quantized.w4a16 \
  --speculative-config '{
    "model": "RedHatAI/Qwen3-8B-speculator.eagle3",
    "num_speculative_tokens": 3,
    "method": "eagle3"
  }'
```

---

## 🎉 Summary

- **Start with Ollama** for quick, beginner-friendly experimentation on any Jetson.
- **Use vLLM** whenever possible for best performance and a production-style serving stack.
- Treat **LLMs and VLMs the same way**: the workflow is identical. You just change the model checkpoint.
- For extra speed, try **speculative decoding** once your baseline setup is working.

## 🔗 Next steps

- [Supported Models](/models)

