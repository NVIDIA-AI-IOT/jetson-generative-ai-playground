# Tutorial - Live LLaVA

!!! abstract "Recommended"

    Follow the chat-based [LLaVA](tutorial_llava.md) and [NanoVLM](tutorial_nano-vlm.md) tutorials and see the [`local_llm`](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/local_llm) documentation to familiarize yourself with VLMs and test the models first.
    
This multimodal agent runs a vision-language model on a live camera feed or video stream, repeatedly applying the same prompts to it:

<a href="https://youtu.be/X-OXxPiUTuU" target="_blank"><img src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/live_llava.gif"></a>

This example uses the popular [LLaVA](https://llava-vl.github.io/) model (based on Llama and [CLIP](https://openai.com/research/clip)) and has been quantized with 4-bit precision to be deployed on Jetson Orin.  It's using an optimized multimodal pipeline from the [`local_llm`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm) package and the MLC/TVM inferencing runtime, and acts as a building block for creating always-on edge applications that can trigger user-promptable alerts and actions with the flexibility of VLMs.

## Running the Live Llava Demo

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span><span title="Orin Nano 8GB can run Llava-7b, VILA-7b, and Obsidian-3B">⚠️</span>
	   
    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `22GB` for `local_llm` container image
        - Space for models (`>10GB`)
		 
    4. Follow the chat-based [LLaVA](tutorial_llava.md) and [NanoVLM](tutorial_nano-vlm.md) tutorials first and see the [`local_llm`](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/local_llm) documentation.

    5. Supported VLM models in [`local_llm`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm#text-chat):
    
        - [`liuhaotian/llava-v1.5-7b`](https://huggingface.co/liuhaotian/llava-v1.5-7b), [`liuhaotian/llava-v1.5-13b`](https://huggingface.co/liuhaotian/llava-v1.5-13b), [`liuhaotian/llava-v1.6-vicuna-7b`](https://huggingface.co/liuhaotian/llava-v1.6-vicuna-7b), [`liuhaotian/llava-v1.6-vicuna-13b`](https://huggingface.co/liuhaotian/llava-v1.6-vicuna-13b)
        - [`Efficient-Large-Model/VILA-2.7b`](https://huggingface.co/Efficient-Large-Model/VILA-2.7b),[`Efficient-Large-Model/VILA-7b`](https://huggingface.co/Efficient-Large-Model/VILA-7b), [`Efficient-Large-Model/VILA-13b`](https://huggingface.co/Efficient-Large-Model/VILA-13b)
        - [`NousResearch/Obsidian-3B-V0.5`](https://huggingface.co/NousResearch/Obsidian-3B-V0.5)
        - [`VILA-2.7b`](https://huggingface.co/Efficient-Large-Model/VILA-2.7b), [`VILA-7b`](https://huggingface.co/Efficient-Large-Model/VILA-7b), [`Llava-7b`](https://huggingface.co/liuhaotian/llava-v1.6-vicuna-7b), and [`Obsidian-3B`](https://huggingface.co/NousResearch/Obsidian-3B-V0.5) can run on Orin Nano 8GB
		
The [`VideoQuery`](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/local_llm/agents/video_query.py) agent processes an incoming camera or video feed on prompts in a closed loop with Llava.  

```bash
./run.sh \
  -e SSL_KEY=/data/key.pem -e SSL_CERT=/data/cert.pem \
  $(./autotag local_llm) \
	python3 -m local_llm.agents.video_query --api=mlc --verbose \
	  --model liuhaotian/llava-v1.5-7b \
	  --max-context-len 768 \
	  --max-new-tokens 32 \
	  --video-input /dev/video0 \
	  --video-output webrtc://@:8554/output \
	  --prompt "How many fingers am I holding up?"
```
> <small>Refer to [Enabling HTTPS/SSL](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm#enabling-httpsssl) to generate self-signed SSL certificates for enabling client-side browser webcams.</small>

This uses [`jetson_utils`](https://github.com/dusty-nv/jetson-utils) for video I/O, and for options related to protocols and file formats, see [Camera Streaming and Multimedia](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md).  In the example above, it captures a V4L2 USB webcam connected to the Jetson (`/dev/video0`) and outputs a WebRTC stream that can be viewed from a browser at `https://HOSTNAME:8554`.  When HTTPS/SSL is enabled, it can also capture from the browser's webcam.

### Changing the Prompt 

The `--prompt` can be specified multiple times, and changed at runtime by pressing the number of the prompt followed by enter on the terminal's keyboard (for example, <kbd>1</kbd> + <kbd>Enter</kbd> for the first prompt).  These are the default prompts when no `--prompt` is specified:

1. Describe the image concisely.
2. How many fingers is the person holding up?
3. What does the text in the image say?
4. There is a question asked in the image.  What is the answer?

Future versions of this demo will have the prompts dynamically editable from the web UI.

### Processing a Video File or Stream

The example above was running on a live camera, but you can also read and write a [video file or stream](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md) by substituting the path or URL to the `--video-input` and `--video-output` command-line arguments like this:

```bash
./run.sh \
  -v /path/to/your/videos:/mount
  $(./autotag local_llm) \
	python3 -m local_llm.agents.video_query --api=mlc --verbose \
	  --model liuhaotian/llava-v1.5-7b \
	  --max-new-tokens 32 \
	  --video-input /mount/my_video.mp4 \
	  --video-output /mount/output.mp4 \
	  --prompt "What does the weather look like?"
```

This example processes and pre-recorded video (in MP4, MKV, AVI, FLV formats with H.264/H.265 encoding), but it also can input/output live network streams like [RTP](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md#rtp), [RTSP](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md#rtsp), and [WebRTC](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md#webrtc) using Jetson's hardware-accelerated video codecs.

<iframe width="720" height="405" src="https://www.youtube.com/embed/X-OXxPiUTuU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

