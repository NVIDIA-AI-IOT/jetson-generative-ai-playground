# NanoLLM - Optimized LLM Inference

[`NanoLLM`](https://dusty-nv.github.io/NanoLLM) is a lightweight, high-performance library using optimized inferencing APIs for quantized LLM’s, multimodality, speech services, vector databases with RAG, and web frontends. It's used to build many of the responsive, low-latency agents featured on this site.

<a href="https://dusty-nv.github.io/NanoLLM" target="_blank"><img src="./images/nano_llm_docs.jpg" style="max-width: 50%; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);"></img></a>

It provides <a href="tutorial_api-examples.html#nanollm" target="_blank">similar APIs</a> to HuggingFace, backed by highly-optimized inference libraries and quantization tools:

```python
from nano_llm import NanoLLM

model = NanoLLM.from_pretrained(
   "meta-llama/Llama-2-7b-hf",  # HuggingFace repo/model name, or path to HF model checkpoint
   api='mlc',                   # supported APIs are: mlc, awq, hf
   api_token='hf_abc123def',    # HuggingFace API key for authenticated models ($HUGGINGFACE_TOKEN)
   quantization='q4f16_ft'      # q4f16_ft, q4f16_1, q8f16_0 for MLC, or path to AWQ weights
)

response = model.generate("Once upon a time,", max_new_tokens=128)

for token in response:
   print(token, end='', flush=True)
```

## Resources

Here's an index of the various tutorials & examples using NanoLLM on Jetson AI Lab:

|      |                     |
| :---------- | :----------------------------------- |
| **[Benchmarks](./benchmarks.md){:target="_blank"}** | Benchmarking results for LLM, SLM, VLM using MLC/TVM backend |
| **[API Examples](./tutorial_api-examples.md#nanollm){:target="_blank"}** | Python code examples for completion and multi-turn chat |
| **[Llamaspeak](./tutorial_llamaspeak.md){:target="_blank"}** | Talk verbally with LLMs using low-latency ASR/TTS speech models |
| **[Small LLM (SLM)](./tutorial_slm.md){:target="_blank"}** | Focus on language models with reduced footprint (7B params and below) |
| **[Live LLaVA](./tutorial_live-llava.md){:target="_blank"}** | Realtime live-streaming vision/language models on recurring prompts |
| **[Nano VLM](./tutorial_nano-vlm.md){:target="_blank"}** | Efficient multimodal pipeline with one-shot RAG support |


<div><iframe width="500" height="280" src="https://www.youtube.com/embed/UOjqF3YCGkY" style="display: inline-block;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<iframe width="500" height="280" src="https://www.youtube.com/embed/8Eu6zG0eEGY" style="display: inline-block;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>
  

