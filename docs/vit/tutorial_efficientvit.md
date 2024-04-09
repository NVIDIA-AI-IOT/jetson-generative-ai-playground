# Tutorial - EfficientViT

Let's run MIT Han Lab's [EfficientViT](https://github.com/mit-han-lab/efficientvit) on Jetson!

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>
	   
    3. Sufficient storage space (preferably with NVMe SSD).

        - `10.9 GB` for `efficientvit` container image
        - Space for checkpoints
	   
    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		``` 

## How to start

Use the `jetson-containers run` and `autotag` commands to automatically pull or build a compatible container image.

```
jetson-containers run $(autotag efficientvit)
```

## Usage of EfficientViT

The official EfficientViT repo shows the complete usage information: [`https://github.com/mit-han-lab/efficientvit#usage`](https://github.com/mit-han-lab/efficientvit#usage)

## Run example/benchmark

Inside the container, a small benchmark script `benchmark.py` is added under `/opt/efficientvit` directory by the jetson-container build process.

It is to test EfficientViT-L2-SAM in bounding box mode, so we can use this as an example and verify the output.

### Download `l2.pt` model

```
mkdir -p /data/models/efficientvit/sam/
cd /data/models/efficientvit/sam/
wget https://huggingface.co/han-cai/efficientvit-sam/resolve/main/l2.pt
```

> The downloaded checkpoint file is stored on the `/data/` directory that is mounted from the Docker host.

### Run benchmark script

```
cd /opt/efficientvit
python3 ./benchmark.py
```

At the end you should see a summary like the following.

```
AVERAGE of 2 runs:
  encoder --- 0.062 sec
  latency --- 0.083 sec
Memory consumption :  3419.68 MB
```

### Check the output/result

The output image file (of the last inference result) is stored as `/data/benchmarks/efficientvit_sam_demo.png`.

It is stored under `/data/` directory that is mounted from the Docker host.<br>
So you can go back to your host machine, and check `jetson-containers/data/benchmark/` directory.

You should find the output like this.

![](../images/efficientvit_sam_demo.png)
