# TensorRT-LLM for Jetson

[TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM) is a high-performance LLM inference library with advanced quantization, attention kernels, and paged KV caching.  Initial support for building TensorRT-LLM from source for JetPack 6.1 has been included in the [`v0.12.0-jetson`](https://github.com/NVIDIA/TensorRT-LLM/tree/v0.12.0-jetson) branch of the [TensorRT-LLM repo](https://github.com/NVIDIA/TensorRT-LLM) for Jetson AGX Orin.

<img src="https://blogs.nvidia.com/wp-content/uploads/2023/10/studio-ai-announcemenet-blog-kv-oct2023-1280x680-1.jpg">

We've provided pre-compiled TensorRT-LLM [wheels](http://jetson.webredirect.org/jp6/cu126/tensorrt-llm/0.12.0) and containers along with this guide for [`TensorRT-LLM Deployment on Jetson Orin`](https://github.com/NVIDIA/TensorRT-LLM/blob/v0.12.0-jetson/README4Jetson.md)

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin</span>
        *Support for other Orin devices is currently undergoing testing.
	   
    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink2">JetPack 6.1 (L4T r36.4)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `18.5GB` for `tensorrt_llm` container image
        - Space for models (`>10GB`)
        
    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		``` 
		
## Building TensorRT-LLM Engine for Llama

You can find the steps for converting Llama to TensorRT-LLM under [`examples/llama`](https://github.com/NVIDIA/TensorRT-LLM/tree/v0.12.0-jetson/examples/llama) in the repo, and also in the [documentation](https://nvidia.github.io/TensorRT-LLM/).  This script will automate the process for Llama-7B with INT4 quantization applied, and run some generation and performance checks on the model:

```bash
jetson-containers run \
  -e HUGGINGFACE_TOKEN=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 \
  -e FORCE_BUILD=on \
  dustynv/tensorrt_llm:0.12-r36.4.0 \
    /opt/TensorRT-LLM/llama.sh
```

There are many such conversion procedures outlined in the TensorRT-LLM examples for different model architectures.  

## OpenAI API Endpoint

TensorRT-LLM has programming APIs for Python and C++ available, but it also includes an example [server endpoint](https://github.com/NVIDIA/TensorRT-LLM/tree/v0.12.0-jetson/examples/apps) for the [OpenAI protocol](https://github.com/openai/openai-python) that makes it easy to substitute for other local or cloud model backends.  

This will start the TensorRT-LLM container with the server and model that you built above:

```
jetson-containers run \
  dustynv/tensorrt_llm:0.12-r36.4.0 \
  python3 /opt/TensorRT-LLM/examples/apps/openai_server.py \
    /data/models/tensorrt_llm/Llama-2-7b-chat-hf-gptq
```

Then you can make chat completion requests against it from practically any language or from any connected device.  This [example](https://github.com/NVIDIA/TensorRT-LLM/tree/v0.12.0-jetson/examples/apps#v1completions) shows a simple way of testing it initially from another terminal with curl:

```
curl http://localhost:8000/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": <model_name>,
        "prompt": "Where is New York?",
        "max_tokens": 16,
        "temperature": 0
    }'
```

Or the code included with [openai_client.py](https://github.com/NVIDIA/TensorRT-LLM/blob/v0.12.0-jetson/examples/apps/openai_client.py) will handle these requests using the standard [`openai-python`](https://github.com/openai/openai-python) package that can be installed outside of the container or on another machine.

```
jetson-containers run \
  --workdir /opt/TensorRT-LLM/examples/apps \
  dustynv/tensorrt_llm:0.12-r36.4.0 \
    python3 openai_client.py --prompt "Where is New York?" --api chat
```

The patches in the branch above for TensorRT-LLM 0.12 are a preview release for Jetson AGX Orin, and we'll continue with validating and testing the various settings in TensorRT-LLM.  If you need any support, please post to the [Jetson Developer Forums.](https://forums.developer.nvidia.com/c/agx-autonomous-machines/jetson-embedded-systems/jetson-agx-orin/486).
