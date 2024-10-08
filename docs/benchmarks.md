---
hide:
  - navigation
---

# Benchmarks

## Large Language Models (LLM)

![](./svgs/LLM%20Text%20Generation%20Rate.svg)

For running LLM benchmarks, see the [`MLC`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/mlc) container documentation.

## Small Language Models (SLM)

![](./svgs/SLM%20Text%20Generation%20Rate.svg)

Small language models are generally defined as having fewer than 7B parameters *(Llama-7B shown for reference)*   
For more data and info about running these models, see the [`SLM`](tutorial_slm.md) tutorial and [`MLC`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/mlc) container documentation.

## Vision Language Models (VLM)

![](./svgs/Multimodal%20Streaming%20Rate.svg)

This measures the end-to-end pipeline performance for continuous streaming like with [Live Llava](tutorial_live-llava.md).  
For more data and info about running these models, see the [`NanoVLM`](tutorial_nano-vlm.md) tutorial.

## Vision Transformers (ViT)

![](./svgs/Vision%20Transformers.svg)

VIT performance data from [[1]](https://github.com/mit-han-lab/efficientvit#imagenet) [[2]](https://github.com/NVIDIA-AI-IOT/nanoowl#performance)  [[3]](https://github.com/NVIDIA-AI-IOT/nanosam#performance)

## Stable Diffusion

![](./svgs/Stable%20Diffusion.svg)

## Riva

![](./svgs/Riva%20Streaming%20ASR_TTS.svg)

For running Riva benchmarks, see [ASR Performance](https://docs.nvidia.com/deeplearning/riva/user-guide/docs/asr/asr-performance.html) and [TTS Performance](https://docs.nvidia.com/deeplearning/riva/user-guide/docs/tts/tts-performance.html).

## Vector Database

![](./svgs/Vector%20Database%20Retrieval.svg)

For running vector database benchmarks, see the [`NanoDB`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/vectordb/nanodb) container documentation.
