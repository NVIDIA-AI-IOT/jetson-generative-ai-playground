# Tutorial - Live LLaVA

!!! abstract "Recommended"

    Follow the chat-based [LLaVA](tutorial_llava.md) and [NanoVLM](tutorial_nano-vlm.md) tutorials and see the [`local_llm`](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/local_llm){:target="_blank"} documentation to familiarize yourself with VLMs and test the models first.
    
This multimodal agent runs a vision-language model on a live camera feed or video stream, repeatedly applying the same prompts to it:

<a href="https://youtu.be/X-OXxPiUTuU" target="_blank"><img src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/live_llava.gif"></a>

It uses models like [LLaVA](https://llava-vl.github.io/){:target="_blank"} or [VILA](https://github.com/Efficient-Large-Model/VILA){:target="_blank"} (based on Llama and [CLIP](https://openai.com/research/clip)) and has been quantized with 4-bit precision to be deployed on Jetson Orin.  This runs an optimized multimodal pipeline from the [`local_llm`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm){:target="_blank"} package, and acts as a building block for creating event-driven streaming applications that trigger user-promptable alerts and actions with the flexibility of VLMs:

<iframe width="720" height="405" src="https://www.youtube.com/embed/dRmAGGuupuE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

The interactive web UI supports event filters, alerts, and multimodal [vector DB](tutorial_nanodb.md) integration.

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
		
The [VideoQuery](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/local_llm/agents/video_query.py){:target="_blank"} agent processes an incoming camera or video feed on prompts in a closed loop with the VLM.  Navigate your browser to `https://<IP_ADDRESS>:8050` after launching it, proceed past the [SSL warning](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/local_llm#enabling-httpsssl){:target="_blank"}, and see this [demo walkthrough](https://www.youtube.com/watch?v=dRmAGGuupuE){:target="_blank"} video on using the web UI.  

```bash
./run.sh $(./autotag local_llm) \
  python3 -m local_llm.agents.video_query --api=mlc \
    --model Efficient-Large-Model/VILA-2.7b \
    --max-context-len 768 \
    --max-new-tokens 32 \
    --video-input /dev/video0 \
    --video-output webrtc://@:8554/output
```

<a href="https://youtu.be/dRmAGGuupuE" target="_blank"><img width="49%" style="display: inline;"  src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/live_llava_horse.jpg"> <img width="49%" style="display: inline;" src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/live_llava_espresso.jpg"></a>

This uses [`jetson_utils`](https://github.com/dusty-nv/jetson-utils) for video I/O, and for options related to protocols and file formats, see [Camera Streaming and Multimedia](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md).  In the example above, it captures a V4L2 USB webcam connected to the Jetson (under the device `/dev/video0`) and outputs a WebRTC stream.

### Processing a Video File or Stream

The example above was running on a live camera, but you can also read and write a [video file or network stream](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md) by substituting the path or URL to the `--video-input` and `--video-output` command-line arguments like this:

```bash
./run.sh \
  -v /path/to/your/videos:/mount
  $(./autotag local_llm) \
    python3 -m local_llm.agents.video_query --api=mlc \
      --model Efficient-Large-Model/VILA-2.7b \
      --max-new-tokens 32 \
      --video-input /mount/my_video.mp4 \
      --video-output /mount/output.mp4 \
      --prompt "What does the weather look like?"
```

This example processes and pre-recorded video (in MP4, MKV, AVI, FLV formats with H.264/H.265 encoding), but it also can input/output live network streams like [RTP](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md#rtp), [RTSP](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md#rtsp), and [WebRTC](https://github.com/dusty-nv/jetson-inference/blob/master/docs/aux-streaming.md#webrtc) using Jetson's hardware-accelerated video codecs.

### NanoDB Integration

If you launch the [VideoQuery](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/local_llm/agents/video_query.py){:target="_blank"} agent with the `--nanodb` flag along with a path to your NanoDB database, it will perform reverse-image search on the incoming feed against the database by re-using the CLIP embeddings generated by the VLM.

To enable this mode, first follow the [**NanoDB tutorial**](tutorial_nanodb.md) to download, index, and test the database.  Then launch VideoQuery like this:

```bash
./run.sh $(./autotag local_llm) \
  python3 -m local_llm.agents.video_query --api=mlc \
    --model Efficient-Large-Model/VILA-2.7b \
    --max-context-len 768 \
    --max-new-tokens 32 \
    --video-input /dev/video0 \
    --video-output webrtc://@:8554/output \
    --nanodb /data/nanodb/coco/2017
```

You can also tag incoming images and add them to the database using the panel in the web UI.

<div><iframe width="500" height="280" src="https://www.youtube.com/embed/X-OXxPiUTuU" style="display: inline-block;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<iframe width="500" height="280" src="https://www.youtube.com/embed/dRmAGGuupuE" style="display: inline-block;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
