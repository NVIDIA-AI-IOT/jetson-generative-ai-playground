# Tutorial - MiniGPT-4

Give your locally running LLM an access to vision, by running [MiniGPT-4](https://minigpt-4.github.io/) on Jetson!

![](./images/minigpt4_gleaners.gif)

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `5.8GB` for container image
        - Space for [pre-quantized MiniGPT-4 model](https://github.com/Maknee/minigpt4.cpp/tree/master#3-obtaining-the-model)

    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		``` 
		
## Start `minigpt4` container with models

To start the MiniGPT4 container and webserver with the recommended models, run this command:

```
jetson-containers run $(autotag minigpt4) /bin/bash -c 'cd /opt/minigpt4.cpp/minigpt4 && python3 webui.py \
  $(huggingface-downloader --type=dataset maknee/minigpt4-13b-ggml/minigpt4-13B-f16.bin) \
  $(huggingface-downloader --type=dataset maknee/ggml-vicuna-v0-quantized/ggml-vicuna-13B-v0-q5_k.bin)'
```

Then, open your web browser and access `http://<IP_ADDRESS>:7860`.

## Results

![](./images/minigpt4_gleaners.gif)

