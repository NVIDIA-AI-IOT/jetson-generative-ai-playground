# Tutorial - MiniGPT-4

Give your locally running LLM an access to vision, by running [MiniGPT-4](https://minigpt-4.github.io/) on Jetson!

![](./images/minigpt4_gleaners.gif)

!!! abstract "What you need"

    1. One of the following Jetson:

        <span class="blobDarkGreen4">Jetson AGX Orin 64GB</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano Orin (8GB)</span>

    2. Running one of the following [JetPack.5x](https://developer.nvidia.com/embedded/jetpack)

        <span class="blobPink1">JetPack 5.1.2 (L4T r35.4.1)</span>
        <span class="blobPink2">JetPack 5.1.1 (L4T r35.3.1)</span>
        <span class="blobPink3">JetPack 5.1 (L4T r35.2.1)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `5.8GB` for container image
        - Space for [pre-quantized MiniGPT-4 model](https://github.com/Maknee/minigpt4.cpp/tree/master#3-obtaining-the-model)

## Set up a container for `MiniGPT-4`

!!! tip ""

    See [`jetson-containers`' `minigpt4` package README](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/minigpt4) for more infomation**

### Clone and set up `jetson-containers`

```
git clone https://github.com/dusty-nv/jetson-containers
cd jetson-containers
sudo apt update; sudo apt install -y python3-pip
pip3 install -r requirements.txt
```

### Start `minigpt4` container with models

To start the MiniGPT4 container and webserver with the recommended models, run this command:

```
cd jetson-containers
./run.sh $(./autotag minigpt4) /bin/bash -c 'cd /opt/minigpt4.cpp/minigpt4 && python3 webui.py \
  $(huggingface-downloader --type=dataset maknee/minigpt4-13b-ggml/minigpt4-13B-f16.bin) \
  $(huggingface-downloader --type=dataset maknee/ggml-vicuna-v0-quantized/ggml-vicuna-13B-v0-q5_k.bin)'
```

Then, open your web browser and access `http://<IP_ADDRESS>:7860`.

## Results

![](./images/minigpt4_gleaners.gif)

