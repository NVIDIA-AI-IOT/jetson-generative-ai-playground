# Tutorial - llamaspeak

Talk live with Llama using streaming ASR/TTS, and chat about images with Llava!

<a href="https://dusty-nv.github.io/NanoLLM/agents.html#voice-chat" target=”_blank”><img src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/llamaspeak_llava_clip.gif" width="900px"></img></a>

* The [`NanoLLM`](https://dusty-nv.github.io/NanoLLM){:target="_blank"} library provides optimized inference for LLM and speech models.
* It's recommended to run JetPack 6.0 to be able to run the latest containers.

The [`WebChat`](https://dusty-nv.github.io/NanoLLM/agents.html#web-chat){:target="_blank"} agent has conversational abilities and multimodal support for chatting about images with vision/language models.

## Running llamaspeak

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink2">JetPack 6 (L4T r36)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `22GB` for `nano_llm` container image
        - Space for models (`>10GB`)
		 
    4. Start the [Riva server](https://github.com/dusty-nv/jetson-containers/tree/master/packages/audio/riva-client) first and test the ASR examples.

```bash
jetson-containers run --env HUGGINGFACE_TOKEN=hf_xyz123abc456 \
  $(autotag nano_llm) \
  python3 -m nano_llm.agents.web_chat --api=mlc \
    --model meta-llama/Meta-Llama-3-8B-Instruct \
    --asr=riva --tts=piper
```

This will start llamaspeak with text LLM and ASR/TTS enabled.  You can then navigate your browser to `https://IP_ADDRESS:8050`
<small>
	<ul>
		<li>The default port is 8050, but can be changed with <code>--web-port</code> (and <code>--ws-port</code> for the websocket port)</li>
		<li>During bot replies, the TTS model will pause output if you speak a few words in the mic to interrupt it.</li>
		<li>Request access to the <a href="https://huggingface.co/meta-llama" target="_blank">Llama models</a> on HuggingFace and substitute your account's API token above.</li>
	</ul>
</small>

<iframe width="720" height="405" src="https://www.youtube.com/embed/hswNSZTvEFE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

The [code](https://github.com/dusty-nv/NanoLLM/blob/main/nano_llm/agents/web_chat.py){:target="_blank"} and [docs](https://dusty-nv.github.io/NanoLLM/agents.html#web-chat){:target="_blank"} for the `WebAgent` that runs llamaspeak can be found in the NanoLLM library.

## Multimodality

If you load a multimodal vision/language model instead, you can drag images into the chat and ask questions about them:

```bash
jetson-containers run $(autotag nano_llm) \
  python3 -m nano_llm.agents.web_chat --api=mlc \
    --model Efficient-Large-Model/VILA-7b \
    --asr=riva --tts=piper
```

<iframe width="720" height="405" src="https://www.youtube.com/embed/UOjqF3YCGkY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

For more info about the supported vision/language models, see the [NanoVLM](./tutorial_nano-vlm.md) page.