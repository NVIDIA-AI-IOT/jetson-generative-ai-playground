---
title: "Qwen3 VL 4B"
model_id: "qwen3-vl-4b"
short_description: "Alibaba's 4 billion parameter vision-language model for multimodal understanding"
family: "Qwen Qwen3"
icon: "🔮"
is_new: false
order: 5
type: "Multimodal"
memory_requirements: "6GB RAM"
precision: "AWQ 4-bit"
model_size: "3GB"
hf_checkpoint: "cpatonn/Qwen3-VL-4B-Instruct-AWQ-4bit"
minimum_jetson: "Orin Nano"
supported_inference_engines:
  - engine: "vLLM"
    type: "Container"
    run_command_orin: "sudo docker run -it --rm --pull always --runtime=nvidia --network host ghcr.io/nvidia-ai-iot/vllm:latest-jetson-orin vllm serve cpatonn/Qwen3-VL-4B-Instruct-AWQ-4bit"
    run_command_thor: "sudo docker run -it --rm --pull always --runtime=nvidia --network host ghcr.io/nvidia-ai-iot/vllm:latest-jetson-thor vllm serve cpatonn/Qwen3-VL-4B-Instruct-AWQ-4bit"
---

Meet Qwen3-VL — the most powerful vision-language model in the Qwen series to date.

This generation delivers comprehensive upgrades across the board: superior text understanding & generation, deeper visual perception & reasoning, extended context length, enhanced spatial and video dynamics comprehension, and stronger agent interaction capabilities.

Available in Dense and MoE architectures that scale from edge to cloud, with Instruct and reasoning-enhanced Thinking editions for flexible, on-demand deployment.

## Key Enhancements

- **Visual Agent**: Operates PC/mobile GUIs—recognizes elements, understands functions, invokes tools, completes tasks.
- **Visual Coding Boost**: Generates Draw.io/HTML/CSS/JS from images/videos.
- **Advanced Spatial Perception**: Judges object positions, viewpoints, and occlusions; provides stronger 2D grounding and enables 3D grounding for spatial reasoning and embodied AI.
- **Long Context & Video Understanding**: Native 256K context, expandable to 1M; handles books and hours-long video with full recall and second-level indexing.
- **Enhanced Multimodal Reasoning**: Excels in STEM/Math—causal analysis and logical, evidence-based answers.
- **Upgraded Visual Recognition**: Broader, higher-quality pretraining is able to "recognize everything"—celebrities, anime, products, landmarks, flora/fauna, etc.
- **Expanded OCR**: Supports 32 languages (up from 19); robust in low light, blur, and tilt; better with rare/ancient characters and jargon; improved long-document structure parsing.
- **Text Understanding on par with pure LLMs**: Seamless text–vision fusion for lossless, unified comprehension.

*Referenced from the [Qwen3-VL model card](https://huggingface.co/Qwen/Qwen3-VL-4B-Instruct).*

