---
hide:
  - navigation
---

# Benchmarks

## Large Language Models (LLM)

<iframe width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubchart?oid=363544488&amp;format=interactive"></iframe>

For running LLM benchmarks, see the [`MLC`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/mlc) container documentation.

## Small Language Models (SLM)

<iframe width="818" height="507" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubchart?oid=1746097360&format=interactive"></iframe>

Small language models are generally defined as having fewer than 7B parameters *(Llama2-7B shown for reference)*   
For more info about these models, see the [`SLM`](tutorial_slm.md) tutorial and [`MLC`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/mlc) container documentation for running benchmarks.

## Vision Language Models (VLM)

<iframe width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubchart?oid=642317430&format=interactive"></iframe>

This measures the end-to-end pipeline performance for continuous streaming with [Live Llava](tutorial_live-llava.md).  

> <sup>These are all using [`CLIP ViT-L/14@336px`](https://huggingface.co/openai/clip-vit-large-patch14-336) for the vision encoder.</sup>  
> <sup>Jetson Orin Nano 8GB runs out of memory trying to run Llava-7B or larger.</sup>  
> <sup>The tokens/sec performance is roughly equal to the base LM ([`StableLM-3B`](https://huggingface.co/stabilityai/stablelm-3b-4e1t) for [`Obsidian`](https://huggingface.co/NousResearch/Obsidian-3B-V0.5), Llama for Llava)</sup>  


## Vision Transformers (ViT)

<iframe width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubchart?oid=1923307503&amp;format=interactive"></iframe>

VIT performance data from [[1]](https://github.com/mit-han-lab/efficientvit#imagenet) [[2]](https://github.com/NVIDIA-AI-IOT/nanoowl#performance)  [[3]](https://github.com/NVIDIA-AI-IOT/nanosam#performance)

## Stable Diffusion

<iframe width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubchart?oid=1177544659&amp;format=interactive"></iframe>

## Riva

<iframe width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubchart?oid=266480884&amp;format=interactive"></iframe>

For running Riva benchmarks, see [ASR Performance](https://docs.nvidia.com/deeplearning/riva/user-guide/docs/asr/asr-performance.html) and [TTS Performance](https://docs.nvidia.com/deeplearning/riva/user-guide/docs/tts/tts-performance.html).

## Vector Database

<iframe width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubchart?oid=1160879788&amp;format=interactive"></iframe>

For running vector database benchmarks, see the [`NanoDB`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/vectordb/nanodb) container documentation.