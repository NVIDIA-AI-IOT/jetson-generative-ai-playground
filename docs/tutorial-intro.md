# Tutorial - Introduction

## Overview

Our tutorials are divided into categories roughly based on model modality, the type of data to be processed or generated.


### Text (LLM)

|      |                     |
| :---------- | :----------------------------------- |
| **[text-generation-webui](./tutorial_text-generation.md)** | Interact with a local AI assistant by running a LLM with oobabooga's text-generaton-webui |
| **[llamaspeak](./tutorial_llamaspeak.md)** | Talk live with Llama using Riva ASR/TTS, and chat about images with Llava! |

### Text + Vision (VLM)

Give your locally running LLM an access to vision!

|      |                     |
| :---------- | :----------------------------------- |
| **[Mini-GPT4](./tutorial_minigpt4.md)** | [Mini-GPT4](https://minigpt-4.github.io/), an open-source model that demonstrate vision-language capabilities.|
| **[LLaVA](./tutorial_llava.md)** | [Large Language and Vision Assistant](https://llava-vl.github.io/), multimodal model that combines a vision encoder and Vicuna LLM for general-purpose visual and language understanding. |

### Image Generation

|      |                     |
| :---------- | :----------------------------------- |
| **[Stable Diffusion](./tutorial_stable-diffusion.md)** | Run AUTOMATIC1111's [`stable-diffusion-webui`](https://github.com/AUTOMATIC1111/stable-diffusion-webui) to generate images from prompts |
| **[Stable Diffusion XL](./tutorial_stable-diffusion-xl.md)** | A newer ensemble pipeline consisting of a base model and refiner that results in significantly enhanced and detailed image generation capabilities.|

### Vision Transformers (ViT)

|      |                     |
| :---------- | :----------------------------------- |
| **[EfficientVIT](./tutorial_efficientvit.md)** | MIT Han Lab's [EfficientViT](https://github.com/mit-han-lab/efficientvit), Multi-Scale Linear Attention for High-Resolution Dense Prediction |
| **[NanoSAM](./tutorial_nanosam.md)** | [NanoSAM](https://github.com/NVIDIA-AI-IOT/nanosam), SAM model variant capable of running in real-time on Jetson |
| **[NanoOWL](./tutorial_nanoowl.md)** | [OWL-ViT](https://huggingface.co/docs/transformers/model_doc/owlvit) optimized to run real-time on Jetson with NVIDIA TensorRT |
| **[SAM](./tutorial_sam.md)** | Meta's [SAM](https://github.com/facebookresearch/segment-anything), Segment Anything model |
| **[TAM](./tutorial_tam.md)** | [TAM](https://github.com/gaomingqi/Track-Anything), Track-Anything model, is an interactive tool for video object tracking and segmentation |

### Vector Database

|      |                     |
| :---------- | :----------------------------------- |
| **[NanoDB](./tutorial_nanodb.md)** | Interactive demo to witness the impact of Vector Database that handles multimodal data |


### Audio

|      |                     |
| :---------- | :----------------------------------- |
| **[AudioCraft](./tutorial_audiocraft.md)** | Meta's [AudioCraft](https://github.com/facebookresearch/audiocraft), to produce high-quality audio and music |
| **[Whisper](./tutorial_whisper.md)** | OpenAI's [Whisper](https://github.com/openai/whisper), pre-trained model for automatic speech recognition (ASR) |

## Tips

|      |                     |
| :---------- | :----------------------------------- |
| Knowledge Distillation | |
| SSD + Docker | |
| Memory optimization | |


## About NVIDIA Jetson

!!! note

    We are mainly targeting Jetson Orin generation devices for deploying the latest LLMs and generative AI models.

    |   | <span class="blobDarkGreen4">Jetson AGX Orin 64GB Developer Kit</span>  | <span class="blobDarkGreen5">Jetson AGX Orin Developer Kit</span>  | <span class="blobLightGreen4">Jetson Orin Nano Developer Kit</span> |
    |-----------------|:-:|:-:|:-:|
    |                 | ![](./images/jetson-agx-orin-dev-kit-3qtr-front-right-reverse_800px.png) | ![](./images/jetson-agx-orin-dev-kit-3qtr-front-right-reverse_800px.png) | <br><br>![](./images/NVIDIA-JetsonOrin-3QTR-Front-Left_800px.png) |
    | GPU             | 2048-core NVIDIA Ampere architecture GPU with 64 Tensor Cores  {: colspan=2}| 1024-core NVIDIA Ampere architecture GPU with 32 Tensor Cores |
    | RAM<br>(CPU+GPU) | 64GB | 32GB | 8GB  |
    | Storage         | 64GB eMMC (+ NVMe SSD)  {: colspan=2}| microSD card (+ NVMe SSD) |
        



