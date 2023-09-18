# Tutorial - LLaVA

Give your locally running LLM an access to vision, by running [LLaVA](https://llava-vl.github.io/) on Jetson!

![](./images/tgwui_multimodal_llava_spacewalk.png)

## Clone and set up `jetson-containers`

```
git clone https://github.com/dusty-nv/jetson-containers
cd jetson-containers
sudo apt update; sudo apt install -y python3-pip
pip3 install -r requirements.txt
```
## 1. Use `text-generation-webui` container to test Llava model

!!! abstract "What you need"

    1. One of the following Jetson:

        <span class="blobDarkGreen4">Jetson AGX Orin 64GB</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>

    2. Running one of the following [JetPack.5x](https://developer.nvidia.com/embedded/jetpack)

        <span class="blobPink1">JetPack 5.1.2 (L4T r35.4.1)</span>
        <span class="blobPink2">JetPack 5.1.1 (L4T r35.3.1)</span>
        <span class="blobPink3">JetPack 5.1 (L4T r35.2.1)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `6.2GB` for `text-generation-webui` container image
        - Space for models
            - CLIP model : `1.7GB`
            - Llava-Llama2 merged model : `7.3GB`

### Use `text-generation-webui` container for web UI

Using the `multimodal` extension, you can use the LLaVA model in oobaboonga's `text-generation-webui`.

```
./run.sh $(./autotag text-generation-webui) /bin/bash -c \
  "python3 /opt/text-generation-webui/download-model.py \
  --output=/data/models/text-generation-webui \
  liuhaotian/llava-llama-2-13b-chat-lightning-gptq"
./run.sh $(./autotag text-generation-webui) /bin/bash -c \
  "cd /opt/text-generation-webui && python3 server.py --listen \
	--model-dir=/data/models/text-generation-webui \
	--model=liuhaotian_llava-llama-2-13b-chat-lightning-gptq \
	--multimodal-pipeline=llava-llama-2-13b \
	--extensions=multimodal \
	--chat \
	--verbose"
```

Go to **Chat** tab, drag and drop an image of your choice into the **Drop Image Here** area, and your question in the text area above and hit **Generate** button.

![](./images/tgwui_llava_drag-n-drop_birds.gif)

### Result

![](./images/tgwui_multimodal_llava_spacewalk.png)

## 2. Use `llava` container to run `llava.serve.cli`

!!! abstract "What you need"

    1. One of the following Jetson:

        <span class="blobDarkGreen4">Jetson AGX Orin 64GB</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>

    2. Running one of the following [JetPack.5x](https://developer.nvidia.com/embedded/jetpack)

        <span class="blobPink1">JetPack 5.1.2 (L4T r35.4.1)</span>
        <span class="blobPink2">JetPack 5.1.1 (L4T r35.3.1)</span>
        <span class="blobPink3">JetPack 5.1 (L4T r35.2.1)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `6.1GB` for `llava` container image
        - Space for models
            - 7B model : `14GB`, or
            - 13B model : `26GB`

!!! tip ""

    See [`jetson-containers`' `llava` package README](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/llava/README.md) for more infomation**



### llava-llama-2-7b-chat

```
./run.sh --env HUGGING_FACE_HUB_TOKEN=<YOUR-ACCESS-TOKEN> $(./autotag llava) \
  python3 -m llava.serve.cli \
    --model-path liuhaotian/llava-llama-2-7b-chat-lightning-lora-preview \
    --model-base meta-llama/Llama-2-7b-chat-hf \
    --image-file /data/images/hoover.jpg
```

### llava-llama-2-13b-chat

This may only run on <span class="blobDarkGreen4">Jetson AGX Orin 64GB</span>.

```
./run.sh $(./autotag llava) \
  python3 -m llava.serve.cli \
    --model-path liuhaotian/llava-llama-2-13b-chat-lightning-preview \
    --image-file /data/images/hoover.jpg
```


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
