# Tutorial - NanoDB

Let's run [NanoDB](https://github.com/dusty-nv/jetson-containers/blob/master/packages/vectordb/nanodb/README.md){:target="_blank"}'s interactive demo to witness the impact of Vector Database that handles multimodal data.

<a href="https://youtu.be/ayqKpQNd1Jw" target=”_blank”><img src="https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/nanodb_horse.gif"></a>

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

        - `16GB` for container image
        - `40GB` for MS COCO dataset

    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		``` 

## How to start 

### Download COCO

Just for an example, let's use MS COCO dataset:

```
cd jetson-containers
mkdir -p data/datasets/coco/2017
cd data/datasets/coco/2017

wget http://images.cocodataset.org/zips/train2017.zip
wget http://images.cocodataset.org/zips/val2017.zip
wget http://images.cocodataset.org/zips/unlabeled2017.zip

unzip train2017.zip
unzip val2017.zip
unzip unlabeled2017.zip
```

### Download Index

You can download a pre-indexed NanoDB that was already prepared over the COCO dataset from [here](https://nvidia.box.com/shared/static/icw8qhgioyj4qsk832r4nj2p9olsxoci.gz):

```
cd jetson-containers/data
wget https://nvidia.box.com/shared/static/icw8qhgioyj4qsk832r4nj2p9olsxoci.gz -O nanodb_coco_2017.tar.gz
tar -xzvf nanodb_coco_2017.tar.gz
```

This allow you to skip the [indexing process](#indexing-data) in the next step, and jump to starting the [Web UI](#interactive-web-ui).

### Indexing Data

If you didn't download the [NanoDB index](#download-index) for COCO from above, we need to build the index by scanning your dataset directory:

```
jetson-containers run $(autotag nanodb) \
  python3 -m nanodb \
    --scan /data/datasets/coco/2017 \
    --path /data/nanodb/coco/2017 \
    --autosave --validate 
```

This will take a few hours on AGX Orin.  Once the database has loaded and completed any start-up operations , it will drop down to a `> ` prompt from which the user can run search queries. You can quickly check the operation by typing your query on this prompt:

```
> a girl riding a horse

* index=80110   /data/datasets/coco/2017/train2017/000000393735.jpg      similarity=0.29991915822029114
* index=158747  /data/datasets/coco/2017/unlabeled2017/000000189708.jpg  similarity=0.29254037141799927
* index=123846  /data/datasets/coco/2017/unlabeled2017/000000026239.jpg  similarity=0.292171448469162
* index=127338  /data/datasets/coco/2017/unlabeled2017/000000042508.jpg  similarity=0.29118549823760986
* index=77416   /data/datasets/coco/2017/train2017/000000380634.jpg      similarity=0.28964102268218994
* index=51992   /data/datasets/coco/2017/train2017/000000256290.jpg      similarity=0.28929752111434937
* index=228640  /data/datasets/coco/2017/unlabeled2017/000000520381.jpg  similarity=0.28642547130584717
* index=104819  /data/datasets/coco/2017/train2017/000000515895.jpg      similarity=0.285491943359375
```

You can press ++ctrl+c++ to exit. For more info about the various options available, see the [NanoDB container](https://github.com/dusty-nv/jetson-containers/blob/master/packages/vectordb/nanodb/README.md){:target="_blank"} documentation.

## Interactive Web UI

Spin up the Gradio server:

```
jetson-containers run $(autotag nanodb) \
  python3 -m nanodb \
    --path /data/nanodb/coco/2017 \
    --server --port=7860
```

Then navigate your browser to `http://<IP_ADDRESS>:7860`, and you can enter text search queries as well as drag/upload images:

<iframe width="720" height="405" src="https://www.youtube.com/embed/ayqKpQNd1Jw?si=hKIluxxCaBJ8ZkPR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
> <small>To use the dark theme, navigate to `http://<IP_ADDRESS>:7860/?__theme=dark` instead<small>
