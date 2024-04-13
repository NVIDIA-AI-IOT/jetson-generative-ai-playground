# Tutorial - Small Language Models (SLM)

Small Language Models (SLMs) represent a growing class of language models that have <7B parameters - for example [StableLM](https://stability.ai/news/stable-lm-3b-sustainable-high-performance-language-models-smart-devices){:target="_blank"}, [Phi-2](https://www.microsoft.com/en-us/research/blog/phi-2-the-surprising-power-of-small-language-models/){:target="_blank"}, and [Gemma-2B](https://blog.google/technology/developers/gemma-open-models/){:target="_blank"}.  Their smaller memory footprint and faster performance make them good candidates for deploying on Jetson Orin Nano.  Some are very capable with abilities at a similar level as the larger models, having been trained on high-quality curated datasets.

<img width="900px" src="images/slm_console.gif">

This tutorial shows how to run optimized SLMs with quantization using the [`NanoLLM`](https://dusty-nv.github.io/NanoLLM){:target="_blank"} library and MLC/TVM backend.  You can run these models through tools like [`text-generation-webui`](./tutorial_text-generation.md){:target="_blank"} and llama.cpp as well, just not as fast - and since the focus of SLMs is reduced computational and memory requirements, here we'll use the most optimized path available.  Those shown below have been profiled:

## SLM Benchmarks

<iframe width="916" height="507" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubchart?oid=1746097360&format=interactive"></iframe>

<iframe width="1325px" height="350px" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubhtml?gid=921468602&amp;single=true&amp;widget=true&amp;headers=false"></iframe>

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

    3. Sufficient storage space (preferably with NVMe SSD).

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

<iframe width="1325px" height="650px" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubhtml?gid=1801223941&amp;single=true&amp;widget=true&amp;headers=false"></iframe>
 
<small>• &nbsp; The model responses are with 4-bit quantization, and are truncated to 256 tokens for brevity.</small>  
<small>• &nbsp; These chat questions are from [`/data/prompts/qa.json`](https://github.com/dusty-nv/jetson-containers/blob/master/data/prompts/qa.json){:target="_blank"} (found in jetson-containers)</small> 

