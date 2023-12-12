# Tutorial - SAM (Segment Anything)

Let's run [`TAM`](https://github.com/gaomingqi/Track-Anything) to perform Segment Anything on videos on NVIDIA Jetson.

![](./images/TAM_screenshot_cat.png)

!!! abstract "What you need"

    1. One of the following Jetson:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `6.8GB` for container image
        - Spaces for models
 
## Set up a container for `tam`

### Clone `jetson-containers`

!!! tip ""

    See [`jetson-containers`' `tam` package README](https://github.com/dusty-nv/jetson-containers/tree/master/packages/vit/tam) for more infomation**

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
./run.sh $(./autotag tam)
```

The container has a default run command (`CMD`) that will automatically start TAM's web server.

Open your browser and access `http://<IP_ADDRESS>:12212`.

## TAM web UI

Check out the [official tutorial](https://github.com/gaomingqi/Track-Anything/blob/master/doc/tutorials.md) to learn how to operate the web UI.

<video controls>
<source src="./images/TAM_screencast_cat_720p-80pcnt.mp4" type="video/mp4">
</video>

## Results

<video controls autoplay>
<source src="./images/TAM_15s_1080p.mp4" type="video/mp4">
</video>