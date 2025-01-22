# Tutorial - Stable Diffusion

Let's run AUTOMATIC1111's [`stable-diffusion-webui`](https://github.com/AUTOMATIC1111/stable-diffusion-webui) on NVIDIA Jetson to generate images from our prompts!

![](./images/stable-diffusion-webui_green-web.gif)

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. <span class="markedYellow">NVMe SSD **highly recommended**</span> for storage speed and space

        - `6.8GB` for container image
        - `4.1GB` for SD 1.5 model

## Setup a container for stable-diffusion-webui

The [jetson-containers](https://github.com/dusty-nv/jetson-containers){:target="_blank"} project provides pre-built Docker images for [`stable-diffusion-webui`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/diffusion/stable-diffusion-webui){:target="_blank"}.  You can clone the repo to use its utilities that will automatically pull/start the correct container for you, or you can do it [manually](https://github.com/dusty-nv/jetson-containers/tree/master/packages/diffusion/stable-diffusion-webui#user-content-run){:target="_blank"}.

```
git clone https://github.com/dusty-nv/jetson-containers
bash jetson-containers/install.sh
```

!!! info

    **JetsonHacks** provides an informative walkthrough video on jetson-containers, showcasing the usage of both the `stable-diffusion-webui` and `text-generation-webui`.  You can find the complete article with detailed instructions [here](https://jetsonhacks.com/2023/09/04/use-these-jetson-docker-containers-tutorial/).

    <iframe width="720" height="405" src="https://www.youtube.com/embed/HlH3QkS1F5Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## How to start

Use `jetson-containers run` and `autotag` tools to automatically pull or build a compatible container image:

```
jetson-containers run $(autotag stable-diffusion-webui)
```

The container has a default run command (`CMD`) that will automatically start the webserver like this:

```
cd /opt/stable-diffusion-webui && python3 launch.py \
  --data=/data/models/stable-diffusion \
  --enable-insecure-extension-access \
  --xformers \
  --listen \
  --port=7860
```

You should see it downloading the model checkpoint on the first run.

Open your browser and access `http://<IP_ADDRESS>:7860`

## Results / Output Examples

![](./images/stable-diffusion-webui_green-web.gif)

![](./images/stable-diffusion_space-ferret.png)

## Stable Diffusion XL

To generate even higher-quality and detailed images, check out the next part of the tutorial that uses the latest [Stable Diffusion XL](tutorial_stable-diffusion-xl.md) models!


!!! tip ""

    **Want to explore using Python APIs to run diffusion models directly? See [`jetson-containers/stable-diffusion`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/diffusion/stable-diffusion)**.