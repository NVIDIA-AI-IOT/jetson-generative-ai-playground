# Tutorial - llamaspeak

Talk live with Llama using Riva ASR/TTS, and chat about images with Llava!

<a href="https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm#local_llm" target=”_blank”><img src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/llamaspeak_voice_clip.gif"></a>

* [`llamaspeak:v1`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/llamaspeak) - uses text-generation-webui loaders for LLM models (llama.cpp, exllama, AutoGPTQ, Transformers)
* [`llamaspeak:v2`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm) - uses AWQ/MLC from [`local_llm`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm) package, web chat voice agent 

llamaspeak v2 has multimodal support for chatting about images with quantized Llava-1.5:

<a href="https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm#local_llm" target=”_blank”><img src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/llamaspeak_llava_clip.gif"></a>
> [Multimodal Voice Chat with LLaVA-1.5 13B on NVIDIA Jetson AGX Orin](https://www.youtube.com/watch?v=9ObzbbBTbcc) (container: [`local_llm`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm))  

See the [`Voice Chat`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm#voice-chat) section of the [`local_llm`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm) documentation to run llamaspeak v2.