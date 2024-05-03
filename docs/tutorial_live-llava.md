# Tutorial - Live LLaVA

!!! abstract "Recommended"

    Follow the chat-based [LLaVA](tutorial_llava.md) and [NanoVLM](tutorial_nano-vlm.md) tutorials to familiarize yourself with vision/language models and test the models first.
    
This multimodal agent runs a vision-language model on a live camera feed or video stream, repeatedly applying the same prompts to it:

<a href="https://youtu.be/X-OXxPiUTuU" target="_blank"><img src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/live_llava.gif"></a>

It uses models like [LLaVA](https://llava-vl.github.io/){:target="_blank"} or [VILA](https://github.com/Efficient-Large-Model/VILA){:target="_blank"} (based on Llama and [CLIP](https://openai.com/research/clip)) and has been quantized with 4-bit precision to be deployed on Jetson Orin.  This runs an optimized multimodal pipeline from the [`NanoLLM`](https://dusty-nv.github.io/NanoLLM){:target="_blank"} library, including event filters and alerts, and multimodal RAG:

<iframe width="720" height="405" src="https://www.youtube.com/embed/8Eu6zG0eEGY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

For benchmarks and further discussion about multimodal optimizations, see the [**NanoVLM**](tutorial_nano-vlm.md) page.

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

        - `22GB` for `nano_llm` container image
        - Space for models (`>10GB`)
		 
    4. Follow the chat-based [LLaVA](tutorial_llava.md) and [NanoVLM](tutorial_nano-vlm.md) tutorials first.

    5. Supported vision/language models:
    
        - [`liuhaotian/llava-v1.5-7b`](https://huggingface.co/liuhaotian/llava-v1.5-7b), [`liuhaotian/llava-v1.5-13b`](https://huggingface.co/liuhaotian/llava-v1.5-13b), [`liuhaotian/llava-v1.6-vicuna-7b`](https://huggingface.co/liuhaotian/llava-v1.6-vicuna-7b), [`liuhaotian/llava-v1.6-vicuna-13b`](https://huggingface.co/liuhaotian/llava-v1.6-vicuna-13b)
        - [`Efficient-Large-Model/VILA-2.7b`](https://huggingface.co/Efficient-Large-Model/VILA-2.7b),[`Efficient-Large-Model/VILA-7b`](https://huggingface.co/Efficient-Large-Model/VILA-7b), [`Efficient-Large-Model/VILA-13b`](https://huggingface.co/Efficient-Large-Model/VILA-13b)
        - [`Efficient-Large-Model/VILA1.5-3b`](https://huggingface.co/Efficient-Large-Model/VILA1.5-3b),[`Efficient-Large-Model/Llama-3-VILA1.5-8B`](https://huggingface.co/Efficient-Large-Model/Llama-3-VILA1.5-8b), [`Efficient-Large-Model/VILA1.5-13b`](https://huggingface.co/Efficient-Large-Model/VILA1.5-13b)
        - [`VILA-2.7b`](https://huggingface.co/Efficient-Large-Model/VILA-2.7b), [`VILA1.5-3b`](https://huggingface.co/Efficient-Large-Model/VILA1.5-3b), [`VILA-7b`](https://huggingface.co/Efficient-Large-Model/VILA-7b), [`Llava-7b`](https://huggingface.co/liuhaotian/llava-v1.6-vicuna-7b), and [`Obsidian-3B`](https://huggingface.co/NousResearch/Obsidian-3B-V0.5) can run on Orin Nano 8GB
        
		
The [VideoQuery](https://dusty-nv.github.io/NanoLLM/agents.html#video-query){:target="_blank"} agent applies prompts to the incoming video feed with the VLM.  Navigate your browser to `https://<IP_ADDRESS>:8050` after launching it with your camera (Chrome is recommended with `chrome://flags#enable-webrtc-hide-local-ips-with-mdns` disabled)

```bash
jetson-containers run $(autotag nano_llm) \
  python3 -m nano_llm.agents.video_query --api=mlc \
    --model Efficient-Large-Model/VILA1.5-3b \
    --max-context-len 256 \
    --max-new-tokens 32 \
    --video-input /dev/video0 \
    --video-output webrtc://@:8554/output
```

<a href="https://youtu.be/wZq7ynbgRoE" target="_blank"><img width="49%" style="display: inline;"  src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/live_llava_horse.jpg"> <img width="49%" style="display: inline;" src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/live_llava_espresso.jpg"></a>

This uses [`jetson_utils`](https://github.com/dusty-nv/jetson-utils) for video I/O, and for options related to protocols and file formats, see [Camera Streaming and Multimedia](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md).  In the example above, it captures a V4L2 USB webcam connected to the Jetson (under the device `/dev/video0`) and outputs a WebRTC stream.

### Processing a Video File or Stream

The example above was running on a live camera, but you can also read and write a [video file or network stream](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md) by substituting the path or URL to the `--video-input` and `--video-output` command-line arguments like this:

```bash
jetson-containers run \
  -v /path/to/your/videos:/mount
  $(autotag nano_llm) \
    python3 -m nano_llm.agents.video_query --api=mlc \
      --model Efficient-Large-Model/VILA1.5-3b \
      --max-context-len 256 \
      --max-new-tokens 32 \
      --video-input /mount/my_video.mp4 \
      --video-output /mount/output.mp4 \
      --prompt "What does the weather look like?"
```

This example processes and pre-recorded video (in MP4, MKV, AVI, FLV formats with H.264/H.265 encoding), but it also can input/output live network streams like [RTP](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md#rtp), [RTSP](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md#rtsp), and [WebRTC](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md#webrtc) using Jetson's hardware-accelerated video codecs.

### NanoDB Integration

If you launch the [VideoQuery](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/nano_llm/agents/video_query.py){:target="_blank"} agent with the `--nanodb` flag along with a path to your NanoDB database, it will perform reverse-image search on the incoming feed against the database by re-using the CLIP embeddings generated by the VLM.

To enable this mode, first follow the [**NanoDB tutorial**](tutorial_nanodb.md) to download, index, and test the database.  Then launch VideoQuery like this:

```bash
jetson-containers run $(autotag nano_llm) \
  python3 -m nano_llm.agents.video_query --api=mlc \
    --model Efficient-Large-Model/VILA1.5-3b \
    --max-context-len 256 \
    --max-new-tokens 32 \
    --video-input /dev/video0 \
    --video-output webrtc://@:8554/output \
    --nanodb /data/nanodb/coco/2017
```

You can also tag incoming images and add them to the database using the panel in the web UI.

<div><iframe width="500" height="280" src="https://www.youtube.com/embed/8Eu6zG0eEGY" style="display: inline-block;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<iframe width="500" height="280" src="https://www.youtube.com/embed/wZq7ynbgRoE" style="display: inline-block;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

## Python Code

For a simplified code example of doing live VLM streaming from Python, see [here](https://dusty-nv.github.io/NanoLLM/multimodal.html#code-example){:target="_blank"} in the NanoLLM docs. 

<iframe width="750" height="500" src="https://dusty-nv.github.io/NanoLLM/multimodal.html#code-example" title="Live VLM Code Example" frameborder="0" style="border: 2px solid #DDDDDD;" loading="lazy" sandbox="allow-scripts"></iframe>
  
You can use this to implement customized prompting techniques and integrate with other vision pipelines.
  
