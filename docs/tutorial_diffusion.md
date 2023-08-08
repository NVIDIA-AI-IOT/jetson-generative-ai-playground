# Tutorial 2 - Image Generation

Let's run AUTOMATIC1111's [`stable-diffusion-webui`](https://github.com/AUTOMATIC1111/stable-diffusion-webui) on NVIDIA Jetson using a Docker container.

!!! note

    Assume we are using either **Jetson AGX Orin Developer Kit** or **Jetson Orin Nano Developer Kit**.

    - With sufficient storage space (preferably with NVMe SSD).
    - Running JetPack 5.x
        - JetPack 5.1 (L4T r35.2.1)
        - JetPack 5.1.1 (L4T r35.3.1)
        - JetPack 5.1.2 (L4T r35.4.1)

## Set up a container for `stable-diffusion-webui`

### Clone `jetson-containers`

```
git clone https://github.com/dusty-nv/jetson-containers
cd jetson-containers
sudo apt update; sudo apt install -y python3-pip
pip install -r requirements.txt
```

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
