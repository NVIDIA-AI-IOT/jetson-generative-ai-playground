# Tutorial - AudioCraft

Let's run Meta's [AudioCraft](https://github.com/facebookresearch/audiocraft), to produce high-quality audio and music on Jetson!

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `10.7 GB` for `audiocraft` container image
        - Space for checkpoints

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
./run.sh $(./autotag audiocraft)
```

The container has a default run command (`CMD`) that will automatically start the Jupyter Lab server.

Open your browser and access `http://<IP_ADDRESS>:8888`.

> The default password for Jupyter Lab is `nvidia`.

## Run Jupyter notebooks

AudioCraft repo comes with demo Jupyter notebooks.

On Jupyter Lab navigation pane on the left, double-click `demos` folder. 

![](./images/audiocraft_jupyterlab_demo.png)

### AudioGen demo

For "**Text-conditional Generation**", you should get something like this.

<audio controls>
  <source src="./assets/subway.wav" type="audio/wav">
Your browser does not support the audio element.
</audio>

!!! info

    You may encounter an error message like the following when executing the first cell, but you can keep going.
    ```
    A matching Triton is not available, some optimizations will not be enabled.
    Error caught was: No module named 'triton'
    ```

!!! warning

    When running the 5-th cell of `audiogen_demo.ipynb`, you may run into "**Failed to load audio**" RuntimeError.

### MusicGen demo

For "**Text-conditional Generation**", you should get something like this.

<audio controls>
  <source src="./assets/80s-pop.wav" type="audio/wav">
Your browser does not support the audio element.
</audio>

!!! warning

    When running the 5-th cell of `musicgen_demo.ipynb`, you may run into "**Failed to load audio**" RuntimeError.