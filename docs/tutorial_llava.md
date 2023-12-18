# Tutorial - LLaVA

[LLaVA](https://llava-vl.github.io/) is a leading multimodal vision/language model that you can run locally on Jetson to answer questions about image prompts and queries.  Internally, it uses the [CLIP](https://openai.com/research/clip) vision encoder to transform images into a common embedding space that the LLM (which is the same as Llama architecture) can understand with text.  Below we will cover a few methods to Llava on Jetson, some with quantization for improved performance:

1. [Chat with Llava using `text-generation-webui`](#1-chat-with-llava-using-text-generation-webui)
2. [Run from the terminal with `llava.serve.cli`](#2-run-from-the-terminal-with-llavaservecli)

![](./images/tgwui_multimodal_llava_spacewalk.png)

### Clone and set up `jetson-containers`

```
git clone https://github.com/dusty-nv/jetson-containers
cd jetson-containers
sudo apt update; sudo apt install -y python3-pip
pip3 install -r requirements.txt
```
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

The [oobabooga](https://github.com/oobabooga/text-generation-webui) chat UI from the [LLM tutorial](tutorial_text-generation.md) has a multimodal extension for Llava, and it supports 4-bit quantization using AutoGPTQ.  If you already used text-generation-webui before 12/2023, do `sudo docker pull $(./autotag text-generation-webui)` to update to the latest container.

### Download Model

```
./run.sh --workdir=/opt/text-generation-webui $(./autotag text-generation-webui) \
  python3 download-model.py --output=/data/models/text-generation-webui \
    TheBloke/llava-v1.5-13B-GPTQ
```

### Start Web UI with Multimodal Extension

```
./run.sh --workdir=/opt/text-generation-webui $(./autotag text-generation-webui) \
  python3 server.py --listen \
    --model-dir /data/models/text-generation-webui \
    --model TheBloke_llava-v1.5-13B-GPTQ \
    --multimodal-pipeline llava-v1.5-13b \
    --loader autogptq \
    --disable_exllama \
    --verbose
```

Go to **Chat** tab, drag and drop an image of your choice into the **Drop Image Here** area, and your question in the text area above and hit **Generate**.

![](./images/tgwui_llava_drag-n-drop_birds.gif)

### Result

![](./images/tgwui_multimodal_llava_spacewalk.png)

## 2. Run from the terminal with `llava.serve.cli`

!!! abstract "What you need"

    1. One of the following Jetson:

        <span class="blobDarkGreen4">Jetson AGX Orin 64GB</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `6.1GB` for `llava` container image
        - Space for models
            - 7B model : `14GB`, or
            - 13B model : `26GB`

This example uses the upstream [Llava codebase](https://github.com/haotian-liu/LLaVA) to run the original, unquantized Llava models from the command-line.  As such, it uses more memory due to using FP16 precision, and is provided mostly as a reference for debugging.  See the [Llava container](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/llava/README.md) readme for more infomation.

### llava-v1.5-7b

```
./run.sh $(./autotag llava) \
  python3 -m llava.serve.cli \
    --model-path liuhaotian/llava-v1.5-7b \
    --image-file /data/images/hoover.jpg
```

### llava-v1.5-13b

``` bash
./run.sh $(./autotag llava) \
  python3 -m llava.serve.cli \
    --model-path liuhaotian/llava-v1.5-13b \
    --image-file /data/images/hoover.jpg
```
<small>This may run only on Jetson AGX Orin 64GB due to memory requirements.</small>

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
``` -->
