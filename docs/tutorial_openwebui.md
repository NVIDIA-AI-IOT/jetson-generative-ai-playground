# Tutorial - Open WebUI

[Open WebUI](https://github.com/ollama/ollama){:target="_blank"} is a versatile, browser-based interface for running and managing large language models (LLMs) locally, offering Jetson developers an intuitive platform to experiment with LLMs on their devices.

It can work with Ollama as a backend as well as other backend that is compatible with OpenAI, which can also run well on Jetson.

![alt text](<images/open_webui_on_desktop.png>)

## Ollama Server

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen3">Jetson Orin Nano (8GB)</span>
	   
    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack){:target="_blank"}:

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `7GB` for `open-webui` container image
		 
```
sudo docker run -d --network=host \
    -v ${HOME}/open-webui:/app/backend/data \
    -e OLLAMA_BASE_URL=http://127.0.0.1:11434 \
    --name open-webui \
    --restart always \ 
    ghcr.io/open-webui/open-webui:main
```

## Ollama backend

If you <a href="./tutorial_ollama.html">have installed Ollama</a>, you can just run the Open WebUI docker container without installing any other things.

```
sudo docker run -d --network=host \
    -v ${HOME}/open-webui:/app/backend/data \
    -e OLLAMA_BASE_URL=http://127.0.0.1:11434 \
    --name open-webui \
    --restart always \ 
    ghcr.io/open-webui/open-webui:main
```