# Tutorial - NanoOWL 

Let's run [NanoOWL](https://github.com/NVIDIA-AI-IOT/nanoowl), [OWL-ViT](https://huggingface.co/docs/transformers/model_doc/owlvit) optimized to run real-time on Jetson with [NVIDIA TensorRT](https://developer.nvidia.com/tensorrt).

![](https://github.com/NVIDIA-AI-IOT/nanoowl/raw/main/assets/jetson_person_2x.gif)

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

        - `7.2 GB` for container image
        - Spaces for models

## Clone and set up `jetson-containers`

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

## How to run the tree prediction (live camera) example

1. Ensure you have a camera device connected

    ```
    ls /dev/video*
    ```

    > If no video device is found, exit from the container and check if you can see a video device on the host side.

2. Launch the demo
    ```bash
    cd examples/tree_demo
    python3 tree_demo.py ../../data/owl_image_encoder_patch32.engine
    ```

    !!! info

        If it fails to find or load the TensorRT engine file, build the TensorRT engine for the OWL-ViT vision encoder on your Jetson device.

        ```bash
        python3 -m nanoowl.build_image_encoder_engine \
            data/owl_image_encoder_patch32.engine
        ```

3. Second, open your browser to ``http://<ip address>:7860``

4. Type whatever prompt you like to see what works!  

    Here are some examples

    - Example: `[a face [a nose, an eye, a mouth]]`
    - Example: `[a face (interested, yawning / bored)]`
    - Example: `(indoors, outdoors)`

### Result

![](./images/nanoowl_chrome_window.png)