# Tutorial - Introduction

## Overview

Our tutorials are divided into categories roughly based on model modality, the type of data to be processed or generated.


### Text (LLM)

|      |                     |
| :---------- | :----------------------------------- |
| **[text-generation-webui](./tutorial_text-generation.md)** | Interact with a local AI assistant by running a LLM with oobabooga's text-generaton-webui |
| **[Ollama](./tutorial_ollama.md)** | Get started effortlessly deploying GGUF models for chat and web UI |
| **[llamaspeak](./tutorial_llamaspeak.md)** | Talk live with Llama using Riva ASR/TTS, and chat about images with Llava! |
| **[NanoLLM](./tutorial_nano-llm.md)** | Optimized inferencing library for LLMs, multimodal agents, and speech. |
| **[Small LLM (SLM)](./tutorial_slm.md)** | Deploy Small Language Models (SLM) with reduced memory usage and higher throughput. |
| **[API Examples](./tutorial_api-examples.md)** | Learn how to write Python code for doing LLM inference using popular APIs. |

### Text + Vision (VLM)

Give your locally running LLM an access to vision!

|      |                     |
| :---------- | :----------------------------------- |
| **[Mini-GPT4](./tutorial_minigpt4.md)** | [Mini-GPT4](https://minigpt-4.github.io/), an open-source model that demonstrate vision-language capabilities.|
| **[LLaVA](./tutorial_llava.md)** | [Large Language and Vision Assistant](https://llava-vl.github.io/), multimodal model that combines a vision encoder and LLM for visual and language understanding. |
| **[Live LLaVA](./tutorial_live-llava.md)** | Run multimodal models interactively on live video streams over a repeating set of prompts. |
| **[NanoVLM](./tutorial_nano-vlm.md)** | Use mini vision/language models and the optimized multimodal pipeline for live streaming. |

### Image Generation

|      |                     |
| :---------- | :----------------------------------- |
| **[Stable Diffusion](./tutorial_stable-diffusion.md)** | Run AUTOMATIC1111's [`stable-diffusion-webui`](https://github.com/AUTOMATIC1111/stable-diffusion-webui) to generate images from prompts |
| **[Stable Diffusion XL](./tutorial_stable-diffusion-xl.md)** | A newer ensemble pipeline consisting of a base model and refiner that results in significantly enhanced and detailed image generation capabilities.|

### Vision Transformers & CV

|      |                     |
| :---------- | :----------------------------------- |
| **[EfficientVIT](./vit/tutorial_efficientvit.md)** | MIT Han Lab's [EfficientViT](https://github.com/mit-han-lab/efficientvit), Multi-Scale Linear Attention for High-Resolution Dense Prediction |
| **[NanoOWL](./vit/tutorial_nanoowl.md)** | [OWL-ViT](https://huggingface.co/docs/transformers/model_doc/owlvit) optimized to run real-time on Jetson with NVIDIA TensorRT |
| **[NanoSAM](./vit/tutorial_nanosam.md)** | [NanoSAM](https://github.com/NVIDIA-AI-IOT/nanosam), SAM model variant capable of running in real-time on Jetson |
| **[SAM](./vit/tutorial_sam.md)** | Meta's [SAM](https://github.com/facebookresearch/segment-anything), Segment Anything model |
| **[TAM](./vit/tutorial_tam.md)** | [TAM](https://github.com/gaomingqi/Track-Anything), Track-Anything model, is an interactive tool for video object tracking and segmentation |
| **[Ultralytics YOLOv8](./tutorial_ultralytics.md)** | Run [Ultralytics](https://www.ultralytics.com) YOLOv8 on Jetson with NVIDIA TensorRT. |

### RAG & Vector Database

|      |                     |
| :---------- | :----------------------------------- |
| **[NanoDB](./tutorial_nanodb.md)** | Interactive demo to witness the impact of Vector Database that handles multimodal data |
| **[LlamaIndex](./tutorial_llamaindex.md)** | Realize RAG (Retrieval Augmented Generation) so that an LLM can work with your documents |
| **[LlamaIndex](./tutorial_jetson-copilot.md)** | Reference application for building your own local AI assistants using LLM, RAG, and VectorDB |

### Audio

|      |                     |
| :---------- | :----------------------------------- |
| **[Whisper](./tutorial_whisper.md)** | OpenAI's [Whisper](https://github.com/openai/whisper), pre-trained model for automatic speech recognition (ASR) |
| **[AudioCraft](./tutorial_audiocraft.md)** | Meta's [AudioCraft](https://github.com/facebookresearch/audiocraft), to produce high-quality audio and music |
| **[Voicecraft](./tutorial_voicecraft.md)** | Interactive speech editing and zero shot TTS |


## About NVIDIA Jetson

!!! note

    We are mainly targeting Jetson Orin generation devices for deploying the latest LLMs and generative AI models.

    |   | <span class="blobDarkGreen4">Jetson AGX Orin 64GB Developer Kit</span>  | <span class="blobDarkGreen5">Jetson AGX Orin Developer Kit</span>  | <span class="blobLightGreen4">Jetson Orin Nano Developer Kit</span> |
    |-----------------|:-:|:-:|:-:|
    |                 | ![](./images/jetson-agx-orin-dev-kit-3qtr-front-right-reverse_800px.png) | ![](./images/jetson-agx-orin-dev-kit-3qtr-front-right-reverse_800px.png) | <br><br>![](./images/NVIDIA-JetsonOrin-3QTR-Front-Left_800px.png) |
    | GPU             | 2048-core NVIDIA Ampere architecture GPU with 64 Tensor Cores  {: colspan=2}| 1024-core NVIDIA Ampere architecture GPU with 32 Tensor Cores |
    | RAM<br>(CPU+GPU) | 64GB | 32GB | 8GB  |
    | Storage         | 64GB eMMC (+ NVMe SSD)  {: colspan=2}| microSD card (+ NVMe SSD) |
        



