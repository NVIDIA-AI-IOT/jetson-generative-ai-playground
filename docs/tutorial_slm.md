# Tutorial - Small Language Models (SLM)

Small Language Models (SLMs) represent a growing class of language models that have <7B parameters - for example [StableLM](https://stability.ai/news/stable-lm-3b-sustainable-high-performance-language-models-smart-devices){:target="_blank"}, [Phi-2](https://www.microsoft.com/en-us/research/blog/phi-2-the-surprising-power-of-small-language-models/){:target="_blank"}, and [Gemma-2B](https://blog.google/technology/developers/gemma-open-models/){:target="_blank"}.  Their smaller memory footprint and faster performance make them good candidates for deploying on Jetson Orin Nano.  Some are very capable with abilities at a similar level as the larger models, having been trained on high-quality curated datasets.

<img width="900px" src="images/slm_console.gif">

This tutorial shows how to run optimized SLMs with quantization using the [`NanoLLM`](https://dusty-nv.github.io/NanoLLM){:target="_blank"} library and MLC/TVM backend.  You can run these models through tools like [`text-generation-webui`](./tutorial_text-generation.md){:target="_blank"} and llama.cpp as well, just not as fast - and since the focus of SLMs is reduced computational and memory requirements, here we'll use the most optimized path available.  Those shown below have been profiled:

## SLM Benchmarks

![](./svgs/SLM%20Text%20Generation%20Rate.svg)

<iframe width="1125px" height="350px" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR0o4iAkwm4vRnDy2LdlSNhGf9sn7zzAf4RN7oLOLUSnTyLO5x94BrN8tq_uChRzQR-fSHNYmkZwO8v/pubhtml?gid=921468602&amp;single=true&amp;widget=true&amp;headers=false"></iframe>

> <small>• &nbsp; The HuggingFace [Open LLM Leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard){:target="_blank"} is a collection of multitask benchmarks including reasoning & comprehension, math, coding, history, geography, ect.</small>  
> <small>• &nbsp; The model's memory footprint includes 4-bit weights and KV cache at full context length (factor in extra for process overhead, library code, ect)</small>  
> <small>• &nbsp; The `Chat Model` is the instruction-tuned variant for chatting with in the commands below, as opposed to the base completion model.</small> 

Based on user interactions, the recommended models to try are [`stabilityai/stablelm-zephyr-3b`](https://huggingface.co/stabilityai/stablelm-zephyr-3b){:target="_blank"} and [`princeton-nlp/Sheared-LLaMA-2.7B-ShareGPT`](https://huggingface.co/princeton-nlp/Sheared-LLaMA-2.7B-ShareGPT){:target="_blank"}, for having output quality on par with Llama-2-7B and well-optimized neural architectures. These models have also been used as the base for various fine-tunes (for example [`Nous-Capybara-3B-V1.9`](https://huggingface.co/NousResearch/Nous-Capybara-3B-V1.9){:target="_blank"}) and mini VLMs. Others may not be particularly coherent.

## Chatting with SLMs

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span>
	   
    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack){:target="_blank"}:

        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. <span class="markedYellow">NVMe SSD **highly recommended**</span> for storage speed and space

        - `22GB` for `nano_llm` container image
        - Space for models (`>5GB`)
	
    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		```  

The [`nano_llm.chat`](https://dusty-nv.github.io/NanoLLM/chat.html){:target="_blank"} program will automatically download and quantize models from HuggingFace like those listed in the table above:

```bash
jetson-containers run $(autotag nano_llm) \
  python3 -m nano_llm.chat --api=mlc \
    --model princeton-nlp/Sheared-LLaMA-2.7B-ShareGPT
```
> <small>• &nbsp; For models requiring authentication, use `--env HUGGINGFACE_TOKEN=<YOUR-ACCESS-TOKEN>`</small>   
> <small>• &nbsp; Press <kbd>Ctrl+C</kbd> twice in succession to exit (once will interrupt bot output)</small>  

This will enter into interactive mode where you chat back and forth using the keyboard (entering `reset` will clear the chat history)  

<img width="900px" src="images/slm_console_2.gif">

### Automated Prompts

During testing, you can specify prompts on the command-line that will run sequentially:

```bash
jetson-containers run $(autotag nano_llm) \
  python3 -m nano_llm.chat --api=mlc \
    --model stabilityai/stablelm-zephyr-3b \
    --max-new-tokens 512 \
    --prompt 'hi, how are you?' \
    --prompt 'whats the square root of 900?' \
    --prompt 'can I get a recipie for french onion soup?'
```

You can also load JSON files containing prompt sequences, like with [`--prompt /data/prompts/qa.json`](https://github.com/dusty-nv/jetson-containers/blob/master/data/prompts/qa.json){:target="_blank"} (the output of which is below)

### Results

<iframe width="1325px" height="650px" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR2KXuZnOuaUyhau4hyP39ZusJvGrg8Z_cIcA-XUfem1OOZx9nCMzxl_T8GVj4-xdl-n6LS8nlukopZ/pubhtml?gid=538585753&amp;single=true&amp;widget=true&amp;headers=false"></iframe>
 
<small>• &nbsp; The model responses are with 4-bit quantization, and are truncated to 256 tokens for brevity.</small>  
<small>• &nbsp; These chat questions are from [`/data/prompts/qa.json`](https://github.com/dusty-nv/jetson-containers/blob/master/data/prompts/qa.json){:target="_blank"} (found in jetson-containers)</small> 

## Nemotron Mini

[Nemotron-Mini-4B-Instruct](https://huggingface.co/nvidia/Nemotron-Mini-4B-Instruct) is a 4B SLM tuned for on-device deployment, RAG, and function calling and is based on [Minitron-4B](https://huggingface.co/nvidia/Minitron-4B-Base) (pruned and distilled from [Nemotron4 15B](https://arxiv.org/abs/2402.16819)).  Inference on Jetson is available through HuggingFace Transformers and llama.cpp for quantization.  Here's how to run a local OpenAI-compatible server with llama.cpp and 4-bit quantized GGUF:

```bash
jetson-containers run $(autotag llama_cpp) \
  llama-server \
    --hf-repo Obenlia/Nemotron-Mini-4B-Instruct-Q4_K_M-GGUF \
    --hf-file nemotron-mini-4b-instruct-q4_k_m.gguf \
    --gpu-layers 34 \
    --seed 42 \
    --host 0.0.0.0 \
    --port 8080
```

For a quick test, you can navigate your browser to `http://JETSON_IP:8080`, connect other clients like [Open WebUI](https://github.com/open-webui/open-webui), or have applications send requests to your server's OpenAI chat completion endpoints (i.e. from [openai-python](https://github.com/openai/openai-python), REST, JavaScript, ect)

<img src="images/nemotron_llamacpp_webui.jpg" style="max-width: 600px">

You can more easily see the performance with the `llama-cli` tool:

``` bash
jetson-containers run $(autotag llama_cpp) \
  llama-cli \
    --hf-repo Obenlia/Nemotron-Mini-4B-Instruct-Q4_K_M-GGUF \
    --hf-file nemotron-mini-4b-instruct-q4_k_m.gguf \
    --gpu-layers 34 \
    --seed 42 \
    --ignore-eos \
    -n 128 \
    -p "The meaning to life and the universe is"
```

``` bash
# Jetson AGX Orin
llama_print_timings:        load time =    1408.27 ms
llama_print_timings:      sample time =      70.05 ms /   128 runs   (    0.55 ms per token,  1827.32 tokens per second)
llama_print_timings: prompt eval time =     120.08 ms /     9 tokens (   13.34 ms per token,    74.95 tokens per second)
llama_print_timings:        eval time =    3303.93 ms /   127 runs   (   26.02 ms per token,    38.44 tokens per second)
llama_print_timings:       total time =    3597.17 ms /   136 tokens
```

The model can also be previewed at [build.nvidia.com](https://build.nvidia.com/nvidia/nemotron-mini-4b-instruct) (example client requests for OpenAI API are also there)

## Llama 3.2

Meta has released multilingual 1B and 3B SLMs in the latest additions to the Llama family with [`Llama-3.2-1B`](https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct) and [`Llama-3.2-3B`](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct).  These can be run with INT4 quantization using the latest [MLC](https://llm.mlc.ai/docs/) container for Jetson (`dustynv/mlc:0.1.2-r36.3.0`).  After having requested access to the models from [Meta](https://huggingface.co/meta-llama) with your HuggingFace API key, you can download, quantize, and benchmark them with these commands:

```bash
HUGGINGFACE_KEY=YOUR_API_KEY \
MLC_VERSION=0.1.2 \
 jetson-containers/packages/llm/mlc/benchmark.sh \
   meta-llama/Llama-3.2-1B
```

* `Llama-3.2-1B` &nbsp; Jetson Orin Nano 54.8 tokens/sec, Jetson AGX Orin 163.9 tokens/sec
* `Llama-3.2-3B` &nbsp; Jetson Orin Nano 27.7 tokens/sec, Jetson AGX Orin 80.4 tokens/sec

The Llama-3.2 SLMs use the same core Llama architecture as previous Llama releases (except `tie_word_embeddings=True`), so it is already supported with quantization and full performance on edge devices.  Thanks to Meta for continuing to advance open generative AI models with Llama.

