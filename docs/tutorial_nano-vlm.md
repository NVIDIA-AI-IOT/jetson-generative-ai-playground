# NanoVLM - Efficient Multimodal Pipeline

We saw in the previous [LLaVA](tutorial_llava.md) tutorial how to run vision-language models through tools like `text-generation-webui` and `llama.cpp`.  In a similar vein to the [SLM](tutorial_slm.md) page on Small Language Models, here we'll explore optimizing VLMs for reduced memory usage and higher performance that reaches interactive levels (like in [Liva LLava](tutorial_live-llava.md)).  These are great for fitting on Orin Nano and increasing the framerate.

There are 3 model families currently supported:  [Llava](https://llava-vl.github.io/){:target="_blank"}, [VILA](https://github.com/Efficient-Large-Model/VILA){:target="_blank"}, and [Obsidian](https://huggingface.co/NousResearch/Obsidian-3B-V0.5){:target="_blank"} (mini VLM)

## VLM Benchmarks

<iframe width="719" height="446" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubchart?oid=88720541&amp;format=interactive"></iframe>

This FPS measures the end-to-end pipeline performance for continuous streaming like with [Live Llava](tutorial_live-llava.md) (on yes/no question)  

<iframe width="1000px" height="325px" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubhtml?gid=642302170&amp;single=true&amp;widget=true&amp;headers=false"></iframe>

## Multimodal Chat
	   
!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span><span title="Orin Nano 8GB can run VILA-2.7b, VILA-7b, Llava-7B, and Obsidian-3B">⚠️</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack){:target="_blank"}:

        <span class="blobPink2">JetPack 6 (L4T r36)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `22GB` for `nano_llm` container image
        - Space for models (`>10GB`)
	   
    4. Supported VLM models in [`NanoLLM`](https://dusty-nv.github.io/NanoLLM):
    
        - [`liuhaotian/llava-v1.5-7b`](https://huggingface.co/liuhaotian/llava-v1.5-7b), [`liuhaotian/llava-v1.5-13b`](https://huggingface.co/liuhaotian/llava-v1.5-13b), [`liuhaotian/llava-v1.6-vicuna-7b`](https://huggingface.co/liuhaotian/llava-v1.6-vicuna-7b), [`liuhaotian/llava-v1.6-vicuna-13b`](https://huggingface.co/liuhaotian/llava-v1.6-vicuna-13b)
        - [`Efficient-Large-Model/VILA-2.7b`](https://huggingface.co/Efficient-Large-Model/VILA-2.7b),[`Efficient-Large-Model/VILA-7b`](https://huggingface.co/Efficient-Large-Model/VILA-7b), [`Efficient-Large-Model/VILA-13b`](https://huggingface.co/Efficient-Large-Model/VILA-13b)
        - [`Efficient-Large-Model/VILA1.5-3b`](https://huggingface.co/Efficient-Large-Model/VILA1.5-3b),[`Efficient-Large-Model/Llama-3-VILA1.5-8B`](https://huggingface.co/Efficient-Large-Model/Llama-3-VILA1.5-8b), [`Efficient-Large-Model/VILA1.5-13b`](https://huggingface.co/Efficient-Large-Model/VILA1.5-13b)
        - [`VILA-2.7b`](https://huggingface.co/Efficient-Large-Model/VILA-2.7b), [`VILA1.5-3b`](https://huggingface.co/Efficient-Large-Model/VILA1.5-3b), [`VILA-7b`](https://huggingface.co/Efficient-Large-Model/VILA-7b), [`Llava-7b`](https://huggingface.co/liuhaotian/llava-v1.6-vicuna-7b), and [`Obsidian-3B`](https://huggingface.co/NousResearch/Obsidian-3B-V0.5) can run on Orin Nano 8GB
        
The optimized [`NanoLLM`](https://dusty-nv.github.io/NanoLLM) library uses MLC/TVM for quantization and inference provides the highest performance.  It efficiently manages the CLIP embeddings and KV cache.  You can find Python code for the chat program used in this example [here](https://dusty-nv.github.io/NanoLLM/chat.html). 


``` bash
jetson-containers run $(autotag nano_llm) \
  python3 -m nano_llm.chat --api=mlc \
    --model Efficient-Large-Model/VILA1.5-3b \
    --max-context-len 256 \
    --max-new-tokens 32
```

This starts an interactive console-based chat with Llava, and on the first run the model will automatically be downloaded from HuggingFace and quantized using MLC and W4A16 precision (which can take some time).  See [here](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm#text-chat) for command-line options.

You'll end up at a `>> PROMPT:` in which you can enter the path or URL of an image file, followed by your question about the image.  You can follow-up with multiple questions about the same image.  Llava does not understand multiple images in the same chat, so when changing images, first reset the chat history by entering `clear` or `reset` as the prompt.  VILA supports multiple images (area of active research)

### Automated Prompts

During testing, you can specify prompts on the command-line that will run sequentially:

```
jetson-containers run $(autotag nano_llm) \
  python3 -m nano_llm.chat --api=mlc \
    --model Efficient-Large-Model/VILA1.5-3b \
    --max-context-len 256 \
    --max-new-tokens 32 \
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
jetson-containers run $(autotag nano_llm) \
  python3 -m nano_llm.chat --api=mlc \
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

To use this through a web browser instead, see the [llamaspeak](./tutorial_llamaspeak.md) tutorial: 

<a href="tutorial_llamaspeak.html" target="_blank"><img src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/llamaspeak_llava_clip.gif" width="900px"></a>

## Live Streaming

These models can also be used with the [Live Llava](tutorial_live-llava.md) agent for continuous streaming - just substitute the desired model name below:

``` bash
jetson-containers run $(autotag nano_llm) \
  python3 -m nano_llm.agents.video_query --api=mlc \
    --model Efficient-Large-Model/VILA1.5-3b \
    --max-context-len 256 \
    --max-new-tokens 32 \
    --video-input /dev/video0 \
    --video-output webrtc://@:8554/output
```
  
Then navigate your browser to `https://<IP_ADDRESS>:8050` after launching it with your camera.  Using Chrome or Chromium is recommended for a stable WebRTC connection, with `chrome://flags#enable-webrtc-hide-local-ips-with-mdns` disabled.

The [Live Llava](tutorial_live-llava.md) tutorial shows how to enable additional features like vector database integration, image tagging, and RAG.

<div><iframe width="500" height="280" src="https://www.youtube.com/embed/8Eu6zG0eEGY" style="display: inline-block;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<iframe width="500" height="280" src="https://www.youtube.com/embed/wZq7ynbgRoE" style="display: inline-block;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

## Video Sequences

The VILA-1.5 family of models can understand multiple images per query, enabling video summarization, action & behavior analysis, change detection, and other temporal-based vision functions.  By manipulating the KV cache and dropping off the last frame from the chat history, we can keep the stream rolling continuously beyond the maximum context length of the model.  The [`vision/video.py`](https://github.com/dusty-nv/NanoLLM/blob/main/nano_llm/vision/video.py){:target="_blank"} example shows how to use this:

``` bash
jetson-containers run $(autotag nano_llm) \
  python3 -m nano_llm.vision.video \
    --model Efficient-Large-Model/VILA1.5-3b \
    --max-images 8 \
    --max-new-tokens 48 \
    --video-input /data/my_video.mp4 \
    --video-output /data/my_output.mp4 \
    --prompt 'What changes occurred in the video?'
```

<iframe width="720" height="405" src="https://www.youtube.com/embed/_7gughth8C0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<small>Note:  support will be added to the web UI for continuous multi-image queries on video sequences and is WIP.</small>
  
## Python Code

For a simplified code example of doing live VLM streaming from Python, see [here](https://dusty-nv.github.io/NanoLLM/multimodal.html#code-example){:target="_blank"} in the NanoLLM docs. 

<iframe width="750" height="500" src="https://dusty-nv.github.io/NanoLLM/multimodal.html#code-example" title="Live VLM Code Example" frameborder="0" style="border: 2px solid #DDDDDD;" loading="lazy" sandbox></iframe>
  
You can use this to implement customized prompting techniques and integrate with other vision pipelines.  This code applies the same set of prompts to the latest image from the video feed.  See [here](https://github.com/dusty-nv/NanoLLM/blob/main/nano_llm/vision/video.py){:target="_blank"} for the version that does multi-image queries on video sequences.

  
