# Tutorial - LLaVA

[LLaVA](https://llava-vl.github.io/) is a popular multimodal vision/language model that you can run locally on Jetson to answer questions about image prompts and queries.  Llava uses the [CLIP](https://openai.com/research/clip) vision encoder to transform images into the same embedding space as its LLM (which is the same as Llama architecture).  Below we cover different methods to run Llava on Jetson, with increasingly optimized performance:

1. [Chat with Llava using `text-generation-webui`](#1-chat-with-llava-using-text-generation-webui)
2. [Run from the terminal with `llava.serve.cli`](#2-run-from-the-terminal-with-llavaservecli)
3. [Quantized GGUF models with `llama.cpp`](#3-quantized-gguf-models-with-llamacpp)
4. [Optimized Multimodal Pipeline with `local_llm`](#4-optimized-multimodal-pipeline-with-local_llm)

| Llava-13B (Jetson AGX Orin)                                               | Quantization | Tokens/sec |  Memory |
|---------------------------------------------------------------------------|:------------:|:----------:|:-------:|
| [`text-generation-webui`](#1-chat-with-llava-using-text-generation-webui) | 4-bit (GPTQ) |     2.3    |  9.7 GB |
| [`llava.serve.cli`](#2-run-from-the-terminal-with-llavaservecli)          |  FP16 (None) |     4.2    | 27.7 GB |
| [`llama.cpp`](#3-quantized-gguf-models-with-llamacpp)                     | 4-bit (Q4_K) |    10.1    |  9.2 GB |
| [`local_llm`](tutorial_nano-vlm.md)                                       | 4-bit (MLC)  |    21.1    |  8.7 GB |

In addition to Llava, the [`local_llm`](tutorial_nano-vlm.md) pipeline supports [VILA](https://huggingface.co/Efficient-Large-Model) and mini vision models that run on Orin Nano as well.

![](./images/tgwui_multimodal_llava_fish.jpg)

## 1. Chat with Llava using `text-generation-webui`

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
	   
    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `6.2GB` for `text-generation-webui` container image
        - Space for models
            - CLIP model : `1.7GB`
            - Llava-v1.5-13B-GPTQ model : `7.25GB`

    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		``` 

### Download Model

```
jetson-containers run --workdir=/opt/text-generation-webui $(autotag text-generation-webui) \
  python3 download-model.py --output=/data/models/text-generation-webui \
    TheBloke/llava-v1.5-13B-GPTQ
```

### Start Web UI with Multimodal Extension

```
jetson-containers run --workdir=/opt/text-generation-webui $(autotag text-generation-webui) \
  python3 server.py --listen \
    --model-dir /data/models/text-generation-webui \
    --model TheBloke_llava-v1.5-13B-GPTQ \
    --multimodal-pipeline llava-v1.5-13b \
    --loader autogptq \
    --disable_exllama \
    --verbose
```

Go to **Chat** tab, drag and drop an image into the **Drop Image Here** area, and your question in the text area and hit **Generate**:

<img width="960px" src="images/tgwui_llava_drag-n-drop_birds.gif">

### Result

<img width="960px" src="images/tgwui_multimodal_llava_spacewalk.png">

## 2. Run from the terminal with `llava.serve.cli`

!!! abstract "What you need"

    1. One of the following Jetson:

        <span class="blobDarkGreen4">Jetson AGX Orin 64GB</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `6.1GB` for `llava` container
        - `14GB` for Llava-7B (or `26GB` for Llava-13B)

This example uses the upstream [Llava repo](https://github.com/haotian-liu/LLaVA) to run the original, unquantized Llava models from the command-line.  It uses more memory due to using FP16 precision, and is provided mostly as a reference for debugging.  See the [Llava container](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/llava/README.md) readme for more info.

### llava-v1.5-7b

```
jetson-containers run $(autotag llava) \
  python3 -m llava.serve.cli \
    --model-path liuhaotian/llava-v1.5-7b \
    --image-file /data/images/hoover.jpg
```

### llava-v1.5-13b

``` bash
jetson-containers run $(autotag llava) \
  python3 -m llava.serve.cli \
    --model-path liuhaotian/llava-v1.5-13b \
    --image-file /data/images/hoover.jpg
```
> <small>Unquantized 13B may run only on Jetson AGX Orin 64GB due to memory requirements.</small>

<!-- 

## 3. Use `llava` container to run its web UI


#### Terminal 1 : Controller

```
./run.sh $(./autotag llava) 
```

Inside the container, launch a controller (`llava.serve.controller`).

```
python3 -m llava.serve.controller --host 0.0.0.0 --port 10000
```

#### Terminal 2 : Web server

```
docker ps
docker exec -it <CONTAINER_NAME> bash 
```

Inside the container, launch a gradio web server..

```
cp -r /opt/llava/llava/serve/examples/ /usr/local/lib/python3.8/dist-packages/llava/serve/
python3 -m llava.serve.gradio_web_server --controller http://localhost:10000 --model-list-mode reload
```

#### Terminal 3 : Model worker

```
docker ps
docker exec -it <CONTAINER_NAME> bash 
```

Inside the container, launch a model worker.

```
python3 -m llava.serve.model_worker \
    --host 0.0.0.0 \
    --controller http://localhost:10000 --port 40000 \
    --worker http://localhost:40000 \
    --model-path $(huggingface-downloader liuhaotian/llava-llama-2-13b-chat-lightning-preview)
``` 
-->

## 3. Quantized GGUF models with `llama.cpp`

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
	   
    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>
		
[llama.cpp](https://github.com/ggerganov/llama.cpp) is one of the faster LLM API's, and can apply a variety of quantization methods to Llava to reduce its memory usage and runtime.  Despite its name, it uses CUDA.  There are pre-quantized versions of Llava-1.5 available in GGUF format for 4-bit and 5-bit:

* [mys/ggml_llava-v1.5-7b](https://huggingface.co/mys/ggml_llava-v1.5-7b)
* [mys/ggml_llava-v1.5-13b](https://huggingface.co/mys/ggml_llava-v1.5-13b)

```bash
jetson-containers run --workdir=/opt/llama.cpp/bin $(autotag llama_cpp:gguf) \
  /bin/bash -c './llava-cli \
    --model $(huggingface-downloader mys/ggml_llava-v1.5-13b/ggml-model-q4_k.gguf) \
    --mmproj $(huggingface-downloader mys/ggml_llava-v1.5-13b/mmproj-model-f16.gguf) \
    --n-gpu-layers 999 \
    --image /data/images/hoover.jpg \
    --prompt "What does the sign say"'
```

| Quantization | Bits | Response                            | Tokens/sec |  Memory |
|--------------|:----:|-------------------------------------|:----------:|:-------:|
| `Q4_K`       |   4  | The sign says "Hoover Dam, Exit 9." |    10.17   |  9.2 GB |
| `Q5_K`       |   5  | The sign says "Hoover Dam exit 9."  |    9.73    | 10.4 GB |

A lower temperature like 0.1 is recommended for better quality (`--temp 0.1`), and if you omit `--prompt` it will describe the image:

```bash
jetson-containers run --workdir=/opt/llama.cpp/bin $(autotag llama_cpp:gguf) \
  /bin/bash -c './llava-cli \
    --model $(huggingface-downloader mys/ggml_llava-v1.5-13b/ggml-model-q4_k.gguf) \
    --mmproj $(huggingface-downloader mys/ggml_llava-v1.5-13b/mmproj-model-f16.gguf) \
    --n-gpu-layers 999 \
    --image /data/images/lake.jpg'
    
In this image, a small wooden pier extends out into a calm lake, surrounded by tall trees and mountains. The pier seems to be the only access point to the lake. The serene scene includes a few boats scattered across the water, with one near the pier and the others further away. The overall atmosphere suggests a peaceful and tranquil setting, perfect for relaxation and enjoying nature.
```

You can put your own images in the mounted `jetson-containers/data` directory.  The C++ code for llava-cli can be found [here](https://github.com/ggerganov/llama.cpp/tree/master/examples/llava).  The llama-cpp-python bindings also [support Llava](https://github.com/abetlen/llama-cpp-python?tab=readme-ov-file#multi-modal-models), however they are significantly slower from Python for some reason (potentially pre-processing) 

## 4. Optimized Multimodal Pipeline with `local_llm`
	   
!!! abstract "What's Next"

    This section got too long and was moved to the [NanoVLM](tutorial_nano-vlm.md) page - check it out there for performance optimizations, mini VLMs, and live streaming!

<a href="tutorial_nano-vlm.html"><img title="Live Llava" src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/live_llava.gif"></a>

<a href="tutorial_nano-vlm.html"><img title="Multimodal Llamaspeak" src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/llamaspeak_llava_clip.gif"></a>
