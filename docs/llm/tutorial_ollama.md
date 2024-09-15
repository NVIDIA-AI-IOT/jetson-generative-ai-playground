# Tutorial - Ollama

[Ollama](https://github.com/ollama/ollama){:target="_blank"} is a popular LLM tool that's easy to get started with, and includes a built-in [model library](https://ollama.com/library){:target="_blank"} of pre-quantized weights that will automatically be downloaded and run using llama.cpp underneath for inference.  The [ollama container](https://github.com/dusty-nv/jetson-containers/tree/dev/packages/llm/ollama){:target="_blank"} was compiled with CUDA support.

<img src="https://github.com/dusty-nv/jetson-containers/blob/docs/docs/images/ollama_cli.gif?raw=true" width="750px"></img>

* The `ollama` [client](#ollama-client) can run inside or outside container after starting the [server](#ollama-server).
* You can also run an [Open WebUI server](#open-webui) for supporting web clients.
* Supports the latest models like [Llama-3](https://ollama.com/library/llama3){:target="_blank"} and [Phi-3 Mini](https://ollama.com/library/phi3){:target="_blank"}!

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

        - `7GB` for `ollama` container image
        - Space for models (`>5GB`)
		 
```
# models cached under jetson-containers/data
jetson-containers run --name ollama $(autotag ollama)

# models cached under your user's home directory
docker run --runtime nvidia --rm --network=host -v ~/ollama:/ollama -e OLLAMA_MODELS=/ollama dustynv/ollama:r36.2.0
```

Running either of these will start the local Ollama server as a daemon in the background.  It will save the models it downloads under your mounted `jetson-containers/data/models/ollama` directory (or another directory that you override with `OLLAMA_MODELS`)

## Ollama Client

Start the Ollama command-line chat client with your desired [model](https://ollama.com/library){:target="_blank"} (for example: `llama3`, `phi3`, `mistral`)

```
# if running inside the same container as launched above
/bin/ollama run phi3

# if launching a new container for the client in another terminal
jetson-containers run $(autotag ollama) /bin/ollama run phi3
```

Or you can install Ollama's [binaries](https://github.com/ollama/ollama/releases){:target="_blank"} for arm64 outside of container (without CUDA, which only the server needs)

```
# download the latest ollama release for arm64 into /bin
sudo wget https://github.com/ollama/ollama/releases/download/$(git ls-remote --refs --sort="version:refname" --tags https://github.com/ollama/ollama | cut -d/ -f3- | sed 's/-rc.*//g' | tail -n1)/ollama-linux-arm64 -O /bin/ollama
sudo chmod +x /bin/ollama

# use the client like normal outside container
/bin/ollama run phi3
```

## Open WebUI

To run an [Open WebUI](https://github.com/open-webui/open-webui){:target="_blank"} server for client browsers to connect to, use the `open-webui` container:

```
docker run -it --rm --network=host --add-host=host.docker.internal:host-gateway ghcr.io/open-webui/open-webui:main
```

You can then navigate your browser to `http://JETSON_IP:8080`, and create a fake account to login (these credentials are only local)

<img src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/ollama_open_webui.jpg" width="800px"></img>

Ollama uses llama.cpp for inference, which various API benchmarks and comparisons are provided for on the [Llava](./tutorial_llava.md){:target="_blank"} page.  It gets roughly half of peak performance versus the faster APIs like [NanoLLM](./tutorial_nano-llm.md), but is generally considered fast enough for text chat.  
