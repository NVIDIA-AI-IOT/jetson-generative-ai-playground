# Tutorial 2 - Image Generation

Let's run AUTOMATIC1111's [`stable-diffusion-webui`](https://github.com/AUTOMATIC1111/stable-diffusion-webui) on NVIDIA Jetson using a Docker container.

!!! note

    Assume we are using either **Jetson AGX Orin Developer Kit** or **Jetson Orin Nano Developer Kit**.

    - With sufficient storage space (preferably with NVMe SSD).
    - Running JetPack 5.1.1 (L4T r35.3.1) 

## Set up a container for `stable-diffusion-webui`

### Clone `jetson-containers`

> We use the `dev` branch of `jetson-container` for now.

```
git clone https://github.com/dusty-nv/jetson-containers
cd jetson-containers
git checkout dev
sudo apt update; sudo apt install -y python3-pip
pip install -r requirements.txt
```

### Build a container for `stable-diffusion-webui` 

```
./build.sh --list-packages
./build.sh stable-diffusion-webui
```

For a reference, `jetson-containers` builds this container based on packages `stable-diffusion-webui` package depends on.

```
$ docker image ls | grep stable-diffusion-webui
$ docker image ls | grep stable-diffusion-webui
stable-diffusion-webui         r35.3.1                          7baa25e62d23   25 hours ago   12.9GB
stable-diffusion-webui         r35.3.1-stable-diffusion-webui   7baa25e62d23   25 hours ago   12.9GB
stable-diffusion-webui         r35.3.1-opencv                   1126f131f935   26 hours ago   11.2GB
stable-diffusion-webui         r35.3.1-torchvision              d0559d35e3ae   2 days ago     10.8GB
stable-diffusion-webui         r35.3.1-cmake                    eb82c3e7eed0   2 days ago     10.7GB
stable-diffusion-webui         r35.3.1-pytorch                  d20d1969b5fa   2 days ago     10.6GB
stable-diffusion-webui         r35.3.1-numpy                    859f4bf688da   3 days ago     9.95GB
stable-diffusion-webui         r35.3.1-build-essential          eb68abbb13e5   3 days ago     9.89GB
stable-diffusion-webui         r35.3.1-python                   5580e2be6245   3 days ago     9.86GB
```

!!! tips

    If you want to make the models you download and output generated persistent, mount the local directories.

    ```
    cd jetson-containers
    git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui stable-diffusion-webui_for_mount
    find ./stable-diffusion-webui_for_mount -mindepth 1 -maxdepth 1 \
        ! -name models -type d -not -path '.' -exec rm -rf {} +
    mkdir -p ./stable-diffusion-webui_for_mount/outputs
    ```

## How to start

Check the exact container tag name.

```
docker image ls | grep stable-diffusion-webui
```

And remember to use that tag name for running the container.

```
cd jetson-containers
./run.sh stable-diffusion-webui:r35.3.1
```

!!! tips

    If you want to make the models you download and output generated persistent, mount the local directories.
    
    ```
    cd jetson-containers
    ./run.sh \
       -v ${PWD}/stable-diffusion-webui_for_mount/models/:/opt/stable-diffusion-webui/models \
       -v ${PWD}/stable-diffusion-webui_for_mount/outputs/:/opt/stable-diffusion-webui/outputs \
       stable-diffusion-webui:r35.3.1
    ```

Inside the docker:

```
cd /opt/stable-diffusion-webui
python3 webui.py --listen
```

!!! tips

    Other relevant arguments from https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Command-Line-Arguments-and-Settings
    
    ```
    --port=7860
    --xformers
    --medvram
    --lowvram
    --enable-insecure-extension-access
    ```

You should see it's downloading the model checkpoint on the first run.

Open your browser and access `http://<IP_ADDRESS>:7860`.

## Results / Output Examples

![](./images/stable-diffusion-webui_green-web.gif)

![](./images/stable-diffusion_space-ferret.png)

