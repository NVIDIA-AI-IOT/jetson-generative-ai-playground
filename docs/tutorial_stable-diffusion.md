# Tutorial - Stable Diffusion

Let's run AUTOMATIC1111's [`stable-diffusion-webui`](https://github.com/AUTOMATIC1111/stable-diffusion-webui) on NVIDIA Jetson.

![](./images/stable-diffusion-webui_green-web.gif)

!!! abstract "What you need"

    1. One of the following Jetson:

        <span class="blobDarkGreen4">Jetson AGX Orin 64GB</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano Orin (8GB)</span>[^1]

    2. Running one of the following [JetPack.5x](https://developer.nvidia.com/embedded/jetpack)

        <span class="blobPink1">JetPack 5.1.2 (L4T r35.4.1)</span>
        <span class="blobPink2">JetPack 5.1.1 (L4T r35.3.1)</span>
        <span class="blobPink3">JetPack 5.1 (L4T r35.2.1)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `6.8GB` for container image
        - Spaces for models

## Set up a container for `stable-diffusion-webui`

### Clone `jetson-containers`

!!! tip ""

    See [`jetson-containers`' `stable-diffusion-webui` package README](https://github.com/dusty-nv/jetson-containers/tree/master/packages/diffusion/stable-diffusion-webui) for more infomation**

```
git clone https://github.com/dusty-nv/jetson-containers
cd jetson-containers
sudo apt update; sudo apt install -y python3-pip
pip3 install -r requirements.txt
```

!!! info

    **JetsonHacks** provides an informative walkthrough video on `jetson-containers`, showcasing the usage of both the `stable-diffusion-webui` and `text-generation-webui` containers.
    
    You can find the complete article with detailed instructions [here](https://jetsonhacks.com/2023/09/04/use-these-jetson-docker-containers-tutorial/).

    <iframe width="720" height="405" src="https://www.youtube.com/embed/HlH3QkS1F5Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## How to start

Use `run.sh` and `autotag` script to automatically pull or build a compatible container image.

```
cd jetson-containers
./run.sh $(./autotag stable-diffusion-webui)
```

> For other ways to start the container, check the [README of `jetson-containers`' `stable-diffusion-webui` package](https://github.com/dusty-nv/jetson-containers/blob/master/packages/diffusion/stable-diffusion-webui/README.md#user-content-run).

The container has a default run command (`CMD`) that will automatically start the webserver like this:

```
cd /opt/stable-diffusion-webui && python3 launch.py \
  --data=/data/models/stable-diffusion \
  --enable-insecure-extension-access \
  --xformers \
  --listen \
  --port=7860
```

You should see it's downloading the model checkpoint on the first run.

Open your browser and access `http://<IP_ADDRESS>:7860`.

## Results / Output Examples

![](./images/stable-diffusion-webui_green-web.gif)

![](./images/stable-diffusion_space-ferret.png)

!!! tip ""

    **Want to explore using Python APIs to run diffusion models directly? <br>See [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/diffusion)**.