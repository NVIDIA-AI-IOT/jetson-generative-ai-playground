# Tutorial - SAM (Segment Anything)

Let's run Meta's [`SAM`](https://github.com/facebookresearch/segment-anything) on NVIDIA Jetson.

![](../images/sam_notebook.png)

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span>⚠️[^1]

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `6.8GB` for container image
        - Spaces for models

    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		cd jetson-containers
		sudo apt update; sudo apt install -y python3-pip
		pip3 install -r requirements.txt
		``` 
		
    [^1]: The biggest `vit_h` (2.4GB) model may not ran due to OOM, but `vit_l` (1.1GB) runs on Jetson Orin Nano.
 

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

![](../images/sam_notebook.png)