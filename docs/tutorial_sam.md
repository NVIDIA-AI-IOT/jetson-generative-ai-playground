# Tutorial - SAM (Segment Anything)

Let's run Meta's [`SAM`](https://github.com/facebookresearch/segment-anything) on NVIDIA Jetson.

![](./images/sam_notebook.png)

!!! abstract "What you need"

    1. One of the following Jetson:

        <span class="blobDarkGreen4">Jetson AGX Orin 64GB</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano Orin (8GB)</span>⚠️[^1]

    2. Running one of the following [JetPack.5x](https://developer.nvidia.com/embedded/jetpack)

        <span class="blobPink1">JetPack 5.1.2 (L4T r35.4.1)</span>
        <span class="blobPink2">JetPack 5.1.1 (L4T r35.3.1)</span>
        <span class="blobPink3">JetPack 5.1 (L4T r35.2.1)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `6.8GB` for container image
        - Spaces for models

    [^1]: The biggest `vit_h` (2.4GB) model may not ran due to OOM, but `vit_l` (1.1GB) runs on Jetson Orin Nano.
 
## Set up a container for `sam`

### Clone `jetson-containers`

!!! tip ""

    See [`jetson-containers`' `sam` package README](https://github.com/dusty-nv/jetson-containers/tree/master/packages/vit/sam) for more infomation**

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
./run.sh $(./autotag sam)
```

The container has a default run command (`CMD`) that will automatically start the Jupyter Lab server.

Open your browser and access `http://<IP_ADDRESS>:8888`.

> The default password for Jupyter Lab is `nvidia`.

## Run Jupyter notebook

In Jupyter Lab, navigate to `notebooks` and open `automatic_mask_generator_example.py` notebook.

Create a new cell at the top, insert the model download command below and run the cell.

```
!wget https://dl.fbaipublicfiles.com/segment_anything/sam_vit_h_4b8939.pth
```

Then go through executing all the cells below **Set-up**.

## Results

![](./images/sam_notebook.png)