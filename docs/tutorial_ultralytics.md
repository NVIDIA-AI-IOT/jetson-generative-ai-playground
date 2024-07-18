# Tutorial - Ultralytics

Let's run [Ultralytics](https://www.ultralytics.com) YOLOv8 on Jetson with [NVIDIA TensorRT](https://developer.nvidia.com/tensorrt).

YOLOv8 is built on cutting-edge advancements in deep learning and computer vision, offering unparalleled performance in terms of speed and accuracy. Its streamlined design makes it suitable for various applications and easily adaptable to different hardware platforms, from edge devices to cloud APIs.

![](https://github.com/NVIDIA-AI-IOT/nanoowl/raw/main/assets/jetson_person_2x.gif)

!!! abstract "What you need"

    1. One of the following Jetson:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span>
        <span class="blobLightGreen5">Jetson Nano (4GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink2">JetPack 4 (L4T r32.x)</span>
        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>

## How to start

Execute the below commands according to the JetPack version to pull the corresponding Docker container and run on Jetson.

!!! Setup

    === "JetPack 4"

        ```bash
        t=ultralytics/ultralytics:latest-jetson-jetpack4 && sudo docker pull $t && sudo docker run -it --ipc=host --runtime=nvidia $t
        ```

    === "JetPack 5"

        ```bash
        t=ultralytics/ultralytics:latest-jetson-jetpack5 && sudo docker pull $t && sudo docker run -it --ipc=host --runtime=nvidia $t
        ```

## Convert model to TensorRT and run inference

The YOLOv8n model in PyTorch format is converted to TensorRT to run inference with the exported model.

!!! Example

    === "Python"

        ```python
        from ultralytics import YOLO

        # Load a YOLOv8n PyTorch model
        model = YOLO("yolov8n.pt")

        # Export the model
        model.export(format="engine")  # creates 'yolov8n.engine'

        # Load the exported TensorRT model
        trt_model = YOLO("yolov8n.engine")

        # Run inference
        results = trt_model("https://ultralytics.com/images/bus.jpg")
        ```

    === "CLI"

        ```bash
        # Export a YOLOv8n PyTorch model to TensorRT format
        yolo export model=yolov8n.pt format=engine  # creates 'yolov8n.engine'

        # Run inference with the exported model
        yolo predict model=yolov8n.engine source='https://ultralytics.com/images/bus.jpg'
        ```

!!! Note

    Visit the [Export page](https://docs.ultralytics.com/modes/export) to access additional arguments when exporting models to different model formats

## Further reading

To learn more, visit a [more comprehensive guide on running Ultralytics YOLOv8 on NVIDIA Jetson](https://docs.ultralytics.com/guides/nvidia-jetson) including benchmarks!
