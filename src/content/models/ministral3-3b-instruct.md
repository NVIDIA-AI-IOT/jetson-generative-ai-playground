---
title: "Ministral 3 3B Instruct"
model_id: "ministral3-3b-instruct"
short_description: "Mistral AI's compact 3 billion parameter instruction-tuned model"
family: "Mistral AI Ministral 3"
icon: "🌀"
is_new: false
order: 1
type: "Multimodal"
memory_requirements: "4GB RAM"
precision: "FP8"
model_size: "2GB"
hf_checkpoint: "mistralai/Ministral-3-3B-Instruct-2512"
minimum_jetson: "Orin Nano"
supported_inference_engines:
  - engine: "vLLM"
    type: "Container"
    run_command_orin: "sudo docker run -it --rm --pull always --runtime=nvidia --network host ghcr.io/nvidia-ai-iot/vllm:latest-jetson-orin vllm serve mistralai/Ministral-3-3B-Instruct-2512"
    run_command_thor: "sudo docker run -it --rm --pull always --runtime=nvidia --network host ghcr.io/nvidia-ai-iot/vllm:latest-jetson-thor vllm serve mistralai/Ministral-3-3B-Instruct-2512"
---

Mistral AI's Ministral 3 3B Instruct is a compact instruction-tuned language model optimized for following instructions and general-purpose text generation.

The Ministral 3 Instruct model offers the following capabilities:

- **Vision**: Enables the model to analyze images and provide insights based on visual content, in addition to text.
- **Multilingual**: Supports dozens of languages, including English, French, Spanish, German, Italian, Portuguese, Dutch, Chinese, Japanese, Korean, Arabic.
- **System Prompt**: Maintains strong adherence and support for system prompts.
- **Agentic**: Offers best-in-class agentic capabilities with native function calling and JSON outputting.
- **Edge-Optimized**: Delivers best-in-class performance at a small scale, deployable anywhere.
- **Apache 2.0 License**: Open-source license allowing usage and modification for both commercial and non-commercial purposes.
- **Large Context Window**: Supports a 256k context window.
