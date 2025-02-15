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
| **[LLaVA](./tutorial_llava.md)** | Different ways to run [LLaVa](https://llava-vl.github.io/) vision/language model on Jetson for visual understanding. |
| **[Live LLaVA](./tutorial_live-llava.md)** | Run multimodal models interactively on live video streams over a repeating set of prompts. |
| **[NanoVLM](./tutorial_nano-vlm.md)** | Use mini vision/language models and the optimized multimodal pipeline for live streaming. |
| **[Llama 3.2 Vision](./llama_vlm.md)** | Run Meta's multimodal Llama-3.2-11B-Vision model on Orin with HuggingFace Transformers. |

### Vision Transformers

|      |                     |
| :---------- | :----------------------------------- |
| **[EfficientVIT](./vit/tutorial_efficientvit.md)** | MIT Han Lab's [EfficientViT](https://github.com/mit-han-lab/efficientvit), Multi-Scale Linear Attention for High-Resolution Dense Prediction |
| **[NanoOWL](./vit/tutorial_nanoowl.md)** | [OWL-ViT](https://huggingface.co/docs/transformers/model_doc/owlvit) optimized to run real-time on Jetson with NVIDIA TensorRT |
| **[NanoSAM](./vit/tutorial_nanosam.md)** | [NanoSAM](https://github.com/NVIDIA-AI-IOT/nanosam), SAM model variant capable of running in real-time on Jetson |
| **[SAM](./vit/tutorial_sam.md)** | Meta's [SAM](https://github.com/facebookresearch/segment-anything), Segment Anything model |
| **[TAM](./vit/tutorial_tam.md)** | [TAM](https://github.com/gaomingqi/Track-Anything), Track-Anything model, is an interactive tool for video object tracking and segmentation |

### Image Generation

|                                                        |                                                                                                                                                                                                                                                                                                             |
|:-------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **[Cosmos](./cosmos.md)**                              | Cosmos is a world model development platform that consists of world foundation models, tokenizers and video processing pipeline to accelerate the development of Physical AI at Robotics & AV labs.                                                                                                         |
| **[Genesis](./genesis.md)**                            | Cosmos Genesis is a physics platform designed for general-purpose Robotics/Embodied AI/Physical AI applications.                                                                                                                                                                                            |
| **[Flux + ComfyUI](./tutorial_comfyui_flux.md)**       | Set up and run the ComfyUI with Flux model for image generation on Jetson Orin.                                                                                                                                                                                                                             |
| **[Stable Diffusion](./tutorial_stable-diffusion.md)** | Run AUTOMATIC1111's [`stable-diffusion-webui`](https://github.com/AUTOMATIC1111/stable-diffusion-webui) to generate images from prompts                                                                                                                                                                     |
| **[SDXL](./tutorial_stable-diffusion-xl.md)**          | Ensemble pipeline consisting of a base model and refiner with enhanced image generation.                                                                                                                                                                                                                    |
| **[nerfstudio](./nerf.md)**                            | Experience neural reconstruction and rendering with nerfstudio and onboard training.                                                                                                                                                                                                                        |


### Audio

|      |                     |
| :---------- | :----------------------------------- |
| **[Whisper](./tutorial_whisper.md)** | OpenAI's [Whisper](https://github.com/openai/whisper), pre-trained model for automatic speech recognition (ASR) |
| **[AudioCraft](./tutorial_audiocraft.md)** | Meta's [AudioCraft](https://github.com/facebookresearch/audiocraft), to produce high-quality audio and music |
| **[Voicecraft](./tutorial_voicecraft.md)** | Interactive speech editing and zero shot TTS |


### RAG & Vector Database

|      |                     |
| :---------- | :----------------------------------- |
| **[NanoDB](./tutorial_nanodb.md)** | Interactive demo to witness the impact of Vector Database that handles multimodal data |
| **[LlamaIndex](./tutorial_llamaindex.md)** | Realize RAG (Retrieval Augmented Generation) so that an LLM can work with your documents |
| **[LlamaIndex](./tutorial_jetson-copilot.md)** | Reference application for building your own local AI assistants using LLM, RAG, and VectorDB |


### API Integrations
|      |                     |
| :---------- | :----------------------------------- |
| **[ROS2 Nodes](./ros.md)** | Optimized LLM and VLM provided as [ROS2 nodes](./ros.md) for robotics |
| **[Holoscan SDK](./tutorial_holoscan.md)** | Use the [Holoscan-SDK](https://github.com/nvidia-holoscan/holoscan-sdk) to run high-throughput, low-latency edge AI pipelines |
| **[Jetson Platform Services](./tutorial_jps.md)** | Quickly build microservice driven vision applications with [Jetson Platform Services](https://developer.nvidia.com/embedded/jetpack/jetson-platform-services-get-started) |
| **[Gapi Workflows](./tutorial_gapi_workflows.md)** | Integrating generative AI into real world environments |
| **[Gapi Micro Services](./tutorial_gapi_microservices.md)** | Wrapping models and code to participate in systems |
| **[Ultralytics YOLOv8](./tutorial_ultralytics.md)** | Run [Ultralytics](https://www.ultralytics.com) YOLOv8 on Jetson with NVIDIA TensorRT. |

## About NVIDIA Jetson

!!! note

    We are mainly targeting Jetson Orin generation devices for deploying the latest LLMs and generative AI models.

    |   | <span class="blobDarkGreen4">Jetson AGX Orin 64GB Developer Kit</span>  | <span class="blobDarkGreen5">Jetson AGX Orin Developer Kit</span>  | <span class="blobLightGreen4">Jetson Orin Nano Developer Kit</span> |
    |-----------------|:-:|:-:|:-:|
    |                 | ![](./images/jetson-agx-orin-dev-kit-3qtr-front-right-reverse_800px.png) | ![](./images/jetson-agx-orin-dev-kit-3qtr-front-right-reverse_800px.png) | <br><br>![](./images/NVIDIA-JetsonOrin-3QTR-Front-Left_800px.png) |
    | GPU             | 2048-core NVIDIA Ampere architecture GPU with 64 Tensor Cores  {: colspan=2}| 1024-core NVIDIA Ampere architecture GPU with 32 Tensor Cores |
    | RAM<br>(CPU+GPU) | 64GB | 32GB | 8GB  |
    | Storage         | 64GB eMMC (+ NVMe SSD)  {: colspan=2}| microSD card (+ NVMe SSD) |
        



