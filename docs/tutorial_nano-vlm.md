# NanoVLM - Efficient Multimodal Pipeline

We saw in the previous [LLaVA](tutorial_llava.md) tutorial how to run vision-language models through tools like `text-generation-webui` and `llama.cpp`.  In a similar vein to the [SLM](tutorial_slm.md) page on Small Language Models, here we'll explore optimizing VLMs for reduced memory usage and higher performance that reaches interactive levels (like in [Liva LLava](tutorial_live-llava.md)).  These are great for fitting on Orin Nano and increasing the framerate.

There are 3 model families currently supported:  [Llava](https://llava-vl.github.io/), [VILA](https://huggingface.co/Efficient-Large-Model), and [Obsidian](https://huggingface.co/NousResearch/Obsidian-3B-V0.5) (mini VLM)

## VLM Benchmarks

<iframe width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubchart?oid=642317430&format=interactive"></iframe>

This FPS measures the end-to-end pipeline performance for continuous streaming like with [Live Llava](tutorial_live-llava.md) (on yes/no question)  

<iframe width="1000px" height="275px" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubhtml?gid=642302170&amp;single=true&amp;widget=true&amp;headers=false"></iframe>

> <small>• &nbsp; These models all use [`CLIP ViT-L/14@336px`](https://huggingface.co/openai/clip-vit-large-patch14-336) for the vision encoder.</small>  
> <small>• &nbsp; Jetson Orin Nano 8GB runs out of memory trying to run Llava-13B.</small>  

## Multimodal Chat
	   
!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span><span title="Orin Nano 8GB can run VILA-2.7b, VILA-7b, Llava-7B, and Obsidian-3B">⚠️</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `22GB` for `local_llm` container image
        - Space for models (`>10GB`)
	   
    4. Supported VLM models in [`local_llm`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm#text-chat):
    
        - [`liuhaotian/llava-v1.5-7b`](https://huggingface.co/liuhaotian/llava-v1.5-7b), [`liuhaotian/llava-v1.5-13b`](https://huggingface.co/liuhaotian/llava-v1.5-13b), [`liuhaotian/llava-v1.6-vicuna-7b`](https://huggingface.co/liuhaotian/llava-v1.6-vicuna-7b), [`liuhaotian/llava-v1.6-vicuna-13b`](https://huggingface.co/liuhaotian/llava-v1.6-vicuna-13b)
        - [`Efficient-Large-Model/VILA-2.7b`](https://huggingface.co/Efficient-Large-Model/VILA-2.7b),[`Efficient-Large-Model/VILA-7b`](https://huggingface.co/Efficient-Large-Model/VILA-7b), [`Efficient-Large-Model/VILA-13b`](https://huggingface.co/Efficient-Large-Model/VILA-13b)
        - [`NousResearch/Obsidian-3B-V0.5`](https://huggingface.co/NousResearch/Obsidian-3B-V0.5)
        - [`VILA-2.7b`](https://huggingface.co/Efficient-Large-Model/VILA-2.7b), [`VILA-7b`](https://huggingface.co/Efficient-Large-Model/VILA-7b), [`Llava-7b`](https://huggingface.co/liuhaotian/llava-v1.6-vicuna-7b), and [`Obsidian-3B`](https://huggingface.co/NousResearch/Obsidian-3B-V0.5) can run on Orin Nano 8GB
	   
The optimized [`local_llm`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm) container using MLC/TVM for quantization and inference provides the highest performance.  It efficiently manages the CLIP embeddings and KV cache.  You can find the Python code for the chat program used in this example [here](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/local_llm/__main__.py). 


``` bash
./run.sh $(./autotag local_llm) \
  python3 -m local_llm --api=mlc \
    --model liuhaotian/llava-v1.6-vicuna-7b \
    --max-context-len 768 \
    --max-new-tokens 128
```

This starts an interactive console-based chat with Llava, and on the first run the model will automatically be downloaded from HuggingFace and quantized using MLC and W4A16 precision (which can take some time).  See [here](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm#text-chat) for command-line options.

You'll end up at a `>> PROMPT:` in which you can enter the path or URL of an image file, followed by your question about the image.  You can follow-up with multiple questions about the same image.  Llava does not understand multiple images in the same chat, so when changing images, first reset the chat history by entering `clear` or `reset` as the prompt.  VILA supports multiple images (area of active research)

### Automated Prompts

During testing, you can specify prompts on the command-line that will run sequentially:

```
./run.sh $(./autotag local_llm) \
  python3 -m local_llm --api=mlc \
    --model liuhaotian/llava-v1.6-vicuna-7b \
    --max-context-len 768 \
    --max-new-tokens 128 \
    --prompt '/data/images/hoover.jpg' \
    --prompt 'what does the road sign say?' \
    --prompt 'what kind of environment is it?' \
    --prompt 'reset' \
    --prompt '/data/images/lake.jpg' \
    --prompt 'please describe the scene.' \
    --prompt 'are there any hazards to be aware of?'
```

You can also use [`--prompt /data/prompts/images.json`](https://github.com/dusty-nv/jetson-containers/blob/master/data/prompts/images.json){:target="_blank"} to run the test sequence, the results of which are in the table below.

### Results

<iframe width="1325px" height="905px"  src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubhtml?gid=816702382&amp;single=true&amp;widget=true&amp;headers=false"></iframe>

<small>• &nbsp; The model responses are with 4-bit quantization enabled, and are truncated to 128 tokens for brevity.</small>  
<small>• &nbsp; These chat questions and images are from [`/data/prompts/images.json`](https://github.com/dusty-nv/jetson-containers/blob/master/data/prompts/images.json){:target="_blank"} (found in jetson-containers)</small> 

#### JSON

When prompted, these models can also output in constrained JSON formats (which the LLaVA authors cover in their [LLaVA-1.5 paper](https://arxiv.org/abs/2310.03744)), and can be used to programatically query information about the image:

```
./run.sh $(./autotag local_llm) \
  python3 -m local_llm --api=mlc \
    --model liuhaotian/llava-v1.5-13b \
    --prompt '/data/images/hoover.jpg' \
    --prompt 'extract any text from the image as json'

{
  "sign": "Hoover Dam",
  "exit": "2",
  "distance": "1 1/2 mile"
}
```

## Web UI

To use local_llm with a web UI instead, see the [Voice Chat](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm#voice-chat) section of the documentation: 

<a href="https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm#local_llm" target="_blank"><img src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/llamaspeak_llava_clip.gif"></a>

## Live Streaming

These models can also be used with the [Live Llava](tutorial_live-llava.md) agent for continuous streaming - just substitute the desired model name below:

``` bash
./run.sh $(./autotag local_llm) \
  python3 -m local_llm.agents.video_query --api=mlc \
    --model NousResearch/Obsidian-3B-V0.5 \
    --max-context-len 768 \
    --max-new-tokens 32 \
    --video-input /dev/video0 \
    --video-output webrtc://@:8554/output \
    --prompt "How many fingers am I holding up?"
```
   
<a href="https://youtu.be/X-OXxPiUTuU" target="_blank"><img src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/live_llava.gif"></a>
