---
title: "Gemma 3 270M"
model_id: "gemma3-270m"
short_description: "Google's ultra-compact 270 million parameter model for lightweight edge deployments"
family: "Google Gemma3"
icon: "💎"
is_new: false
order: 1
type: "Text"
memory_requirements: "1GB RAM"
precision: "FP16"
model_size: "0.5GB"
hf_checkpoint: "google/gemma-3-270m-it"
minimum_jetson: "Orin Nano"
supported_inference_engines:
  - engine: "Ollama"
    type: "Container"
    install_command: "curl -fsSL https://ollama.ai/install.sh | sh"
    run_command: "ollama run gemma3:270m"
  - engine: "vLLM"
    type: "Container"
    run_command_orin: "sudo docker run -it --rm --pull always --runtime=nvidia --network host ghcr.io/nvidia-ai-iot/vllm:latest-jetson-orin vllm serve google/gemma-3-270m-it"
    run_command_thor: "sudo docker run -it --rm --pull always --runtime=nvidia --network host ghcr.io/nvidia-ai-iot/vllm:latest-jetson-thor vllm serve google/gemma-3-270m-it"
---

Gemma is a family of lightweight, state-of-the-art open models from Google, built from the same research and technology used to create the Gemini models. Gemma 3 models are multimodal, handling text and image input and generating text output, with open weights for both pre-trained variants and instruction-tuned variants. Gemma 3 has a large, 128K context window, multilingual support in over 140 languages, and is available in more sizes than previous versions. Gemma 3 models are well-suited for a variety of text generation and image understanding tasks, including question answering, summarization, and reasoning. Their relatively small size makes it possible to deploy them in environments with limited resources such as laptops, desktops or your own cloud infrastructure, democratizing access to state of the art AI models and helping foster innovation for everyone.

## Inputs and outputs

**Input:**
- Text string, such as a question, a prompt, or a document to be summarized
- Images, normalized to 896 x 896 resolution and encoded to 256 tokens each
- Total input context of 32K tokens for the 270M size

**Output:**
- Generated text in response to the input, such as an answer to a question, analysis of image content, or a summary of a document
- Total output context of 8192 tokens
