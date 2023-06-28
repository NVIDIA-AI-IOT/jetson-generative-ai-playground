# Tutorial 1 - Text Generation

Let's run oobabooga's [`text-generaton-webui`](https://github.com/oobabooga/text-generation-webui) on NVIDIA Jetson using a Docker container.

!!! note

    Assume we are using either **Jetson AGX Orin Developer Kit** or **Jetson Orin Nano Developer Kit**.

    - With sufficient storage space (preferably with NVMe SSD).
    - Running JetPack 5.1.1 (L4T r35.3.1) 

## Pre-setup

### RAM optimization

> You can skip this process if you are on Jetson AGX Orin Developer Kit, which has 32GB RAM.

```
sudo systemctl disable nvzramconfig.service
sudo systemctl disable nvargus-daemon.service
sudo systemctl set-default multi-user
sudo reboot
```

After reboot, create swap file.

```
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo swapon --show
free -h
sudo cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Pull l4t-pytorch container image

We use `l4t-pytorch` as the base container image.

```
docker pull nvcr.io/nvidia/l4t-pytorch:r35.3.1-pth2.0-py3
docker tag nvcr.io/nvidia/l4t-pytorch:r35.3.1-pth2.0-py3 l4t-pytorch:r35.3.1-pth2.0-py3
```

If the image is not available on NGC yet, build the base container by yourself.

```
git clone https://github.com/dusty-nv/jetson-containers
./scripts/docker_build_ml.sh pytorch  
```

### Build a container for text-generation-webuit

```
git clone https://github.com/nvidia-ai-iot/jetson-text-generation-webui
cd jetson-text-generation-webui
./docker/build.sh
```

## How to start

> If you are running this for the first time, go through the [pre-setup](#pre-setup) described below.

```
cd jetson-text-generation-webui
./docker/run.sh
```

Inside the docker:

```
cd /text-generation-webui
python3 server.py --listen --chat
```

Open your browser and access `http://<IP_ADDRESS>:7860`.

From the "**Model**" tab, download a model, and then load the model.

!!! info

    ### Model selection for Jetson Orin Nano

    Jetson Orin Nano Developer Kit has only 8GB RAM for both CPU (system) and GPU, so you need to pick a model that fits in the RAM size.

    7 billion parameter models are usually little less than 4GB if it uses 4-bit quantization, and that's probably the biggest you can run on Jetson Orin Nano Developer Kit.

    If you are working with 7B model, it probably takes more than 10 minutes to load the model as it needs to first load everything to CPU memory and then shuffle it down to GPU memory using swap.


### Results

![](./images/text-generation-webui_sf-trip.gif)

#### Metrics

|                 | Loader | Jetson AGX Orin Developer Kit  | Jetson Orin Nano Developer Kit  |
|-----------------|--------|-----|-----|
| 7B network quantized 4bit-128g | AutoGPTQ | nnn token/sec | nnn token/sec |
| 13B network quantized 4bit-128g | AutoGPTQ | nnn token/sec | DNR |
| 1.3B network |  | nnn token/sec | nnn token/sec |
