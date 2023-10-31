# Tutorial - NanoOWL 

Check out the GitHub repo, [https://github.com/NVIDIA-AI-IOT/nanoowl](https://github.com/NVIDIA-AI-IOT/nanoowl).

![](https://raw.githubusercontent.com/NVIDIA-AI-IOT/nanoowl/main/assets/tree_predict_out.jpg)

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

        - `7.3GB` for container image
        - Spaces for models

## Set up a container for `nanoowl`

### Clone `jetson-containers`

!!! tip ""

    See [`jetson-containers`' `nanoowl` package README](https://github.com/dusty-nv/jetson-containers/tree/master/packages/vit/nanoowl) for more infomation**

```
git clone https://github.com/dusty-nv/jetson-containers
cd jetson-containers
sudo apt update; sudo apt install -y python3-pip
pip3 install -r requirements.txt
```

## How to start

Use `run.sh` and `autotag` script to automatically pull or build a compatible container image.

```
cd jetson-containers
./run.sh $(./autotag nanoowl)
```

## Run examples

Inside the container, you can move to `/opt/nanoowl` directory, to go through all the examples demonstrated on the repo.

```
cd /opt/nanoowl
```

To run the "[**Example 1 - Basic prediction**](https://github.com/NVIDIA-AI-IOT/nanoowl#example-1---basic-prediction)":

```
python3 owl_predict.py \
    --prompt="[an owl, a glove]" \
    --threshold=0.1 \
    --image_encoder_engine=../data/owl_image_encoder_patch32.engine
```

The result is saved under `/opt/nanosam/data/owl_predict_out.jpg`.

To check on your host machine, you can copy that into `/data` directory of the container where that is mounted from the host.

```
cp data/owl_predict_out.jpg /data/
```

Then you can go to your host system, and find the file under the `jetson_containers`' `data` directory, like `jetson_containers/data/basic_usage_out.jpg`.