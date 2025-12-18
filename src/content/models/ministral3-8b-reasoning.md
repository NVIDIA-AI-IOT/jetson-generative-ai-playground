---
title: "Ministral 3 8B Reasoning"
model_id: "ministral3-8b-reasoning"
short_description: "Mistral AI's versatile 8 billion parameter model optimized for reasoning tasks"
family: "Mistral AI Ministral 3"
icon: "🌀"
is_new: false
order: 5
type: "Multimodal"
memory_requirements: "8GB RAM"
precision: "FP16"
model_size: "5GB"
hf_checkpoint: "mistralai/Ministral-3-8B-Reasoning-2512"
minimum_jetson: "Orin NX"
supported_inference_engines:
  - engine: "Ollama"
    type: "Container"
    install_command: "curl -fsSL https://ollama.ai/install.sh | sh"
    run_command: "ollama run ministral-3:8b"
  - engine: "vLLM"
    type: "Container"
    run_command_orin: "sudo docker run -it --rm --pull always --runtime=nvidia --network host ghcr.io/nvidia-ai-iot/vllm:latest-jetson-orin vllm serve mistralai/Ministral-3-8B-Reasoning-2512"
    run_command_thor: "sudo docker run -it --rm --pull always --runtime=nvidia --network host ghcr.io/nvidia-ai-iot/vllm:latest-jetson-thor vllm serve mistralai/Ministral-3-8B-Reasoning-2512"
---

Mistral AI's Ministral 3 8B Reasoning is the default reasoning variant, balancing reasoning capability with efficiency.

The Ministral 3 Reasoning model offers the following capabilities:

- **Vision**: Enables the model to analyze images and provide insights based on visual content, in addition to text.
- **Multilingual**: Supports dozens of languages, including English, French, Spanish, German, Italian, Portuguese, Dutch, Chinese, Japanese, Korean, Arabic.
- **System Prompt**: Maintains strong adherence and support for system prompts.
- **Agentic**: Offers best-in-class agentic capabilities with native function calling and JSON outputting.
- **Edge-Optimized**: Delivers best-in-class performance at a small scale, deployable anywhere.
- **Apache 2.0 License**: Open-source license allowing usage and modification for both commercial and non-commercial purposes.
- **Large Context Window**: Supports a 256k context window.
