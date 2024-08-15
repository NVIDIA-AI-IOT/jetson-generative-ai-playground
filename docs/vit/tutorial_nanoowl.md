# Tutorial - NanoOWL 

Let's run [NanoOWL](https://github.com/NVIDIA-AI-IOT/nanoowl), [OWL-ViT](https://huggingface.co/docs/transformers/model_doc/owlvit) optimized to run real-time on Jetson with [NVIDIA TensorRT](https://developer.nvidia.com/tensorrt).

![](https://github.com/NVIDIA-AI-IOT/nanoowl/raw/main/assets/jetson_person_2x.gif)

!!! abstract "What you need"

    1. One of the following Jetson:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `7.2 GB` for container image
        - Spaces for models

    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		``` 

## How to start

Use the `jetson-containers run` and `autotag` commands to automatically pull or build a compatible container image.

```
jetson-containers run --workdir /opt/nanoowl $(autotag nanoowl)
```

## How to run the tree prediction (live camera) example

1. Ensure you have a camera device connected

    ```
    ls /dev/video*
    ```

    <small>If no video device is found, exit from the container and check if you can see a video device on the host side.</small>

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

![](../images/nanoowl_chrome_window.png)
