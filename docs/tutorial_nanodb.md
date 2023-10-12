# Tutorial - NanoDB

Let's run [NanoDB](https://github.com/dusty-nv/jetson-containers/blob/master/packages/vectordb/nanodb/README.md)'s interactive demo to witness the impact of Vector Database that handles multimodal data.

![](https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/nanodb_horse.gif)

!!! abstract "What you need"

    1. One of the following Jetson:

        <span class="blobDarkGreen4">Jetson AGX Orin 64GB</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>

    2. Running one of the following [JetPack.5x](https://developer.nvidia.com/embedded/jetpack)

        <span class="blobPink1">JetPack 5.1.2 (L4T r35.4.1)</span>
        <span class="blobPink2">JetPack 5.1.1 (L4T r35.3.1)</span>
        <span class="blobPink3">JetPack 5.1 (L4T r35.2.1)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `7.0GB` for container image

## Set up a container for `nanodb`

### Clone `jetson-containers`

!!! tip ""

    See [`jetson-containers`' `nanodb` package README](https://github.com/dusty-nv/jetson-containers/tree/master/packages/vectordb/nanodb) for more infomation**

```
git clone https://github.com/dusty-nv/jetson-containers
cd jetson-containers
sudo apt update; sudo apt install -y python3-pip
pip3 install -r requirements.txt
```

## How to start 

### Download your data

Just for an example, let's just use MS COCO dataset.

```
cd jetson-containers
mkdir data/datasets/coco/
cd data/datasets/coco
wget http://images.cocodataset.org/zips/train2017.zip
unzip train2017.zip
```

### Indexing Data

First, we need to build the index by scanning your dataset directory.

```
cd jetson-containers
./run.sh -v ${PWD}/data/datasets/coco:/my_dataset $(./autotag nanodb) \
  python3 -m nanodb \
    --scan /my_dataset \
    --path /my_dataset/nanodb \
    --autosave --validate 
```

This will take about 2 hours.

### Interactive web UI

Spin up the Gradio server.

```
cd jetson-containers
./run.sh -v /path/to/your/dataset:/my_dataset $(./autotag nanodb) \
  python3 -m nanodb \
    --path /my_dataset/nanodb \
    --server --port=7860
```

You can use your PC (or any machine) that can access your Jetson via a network, and navigate your browser to `http://<IP_ADDRESS>:7860?__theme=dark`

You can enter text search queries as well as drag/upload images.

[![](https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/nanodb_tennis.jpg)](https://youtu.be/ayqKpQNd1Jw)

