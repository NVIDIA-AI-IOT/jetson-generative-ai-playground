# Genesis: A Generative and Universal Physics Engine for Robotics and Beyond

[Genesis](https://genesis-embodied-ai.github.io/) is a physics platform designed for general-purpose Robotics/Embodied AI/Physical AI applications. It is simultaneously multiple things:

1. A universal physics engine re-built from the ground up, capable of simulating a wide range of materials and physical phenomena.
2. A lightweight, ultra-fast, pythonic, and user-friendly robotics simulation platform.
3. A powerful and fast photo-realistic rendering system.
4. A generative data engine that transforms user-prompted natural language description into various modalities of data.

<img src="images/genesis_jetson.jpg" style="max-width:800px;">

> Special thanks to [Johnny Núñez Cano](https://www.linkedin.com/in/johnnycano/) for porting the Genesis  
> Special thanks to [Johnny Núñez Cano](https://www.linkedin.com/in/johnnycano/) for porting the Genesis to numpy 2.0 and new libigl  
> Special thanks to [Johnny Núñez Cano](https://www.linkedin.com/in/johnnycano/) for porting the VTK, Coacd, trimesh, tetgen and more to arm64  
> Special thanks to [Johnny Núñez Cano](https://www.linkedin.com/in/johnnycano/) for porting OMPL and pygccxml to arm64  
> See [Genesis Official Page](https://genesis-embodied-ai.github.io/) by Nvidia and Universites.

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobFaintedGreen3">Jetson Thor (XGB)</span>
        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. <span class="markedYellow">NVMe SSD **highly recommended**</span> for storage speed and space

        - `11.1GB` for [`genesis`](https://hub.docker.com/r/dustynv/genesis) container image
        - Space for models and datasets (`>50GB`)
		 
    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		```  

!!! abstract "WARNING"
    [Transformer Engine](https://github.com/Alif-01/LuisaRender/tree/d3b8e341540832ebf517cbe6a8abf5da2cf2e026):

    - OMPL (Motion is still not working for Jetson. (Cooming soon))
    - LuisaRender (Raytracing is still not working for Jetson. (Cooming soon))

## Start Container

Use this command to automatically run, build, or pull a compatible container image for genesis:

```bash
jetson-containers run $(autotag genesis)
```

To mount your own directories into the container, use the [
`-v`](https://docs.docker.com/engine/reference/commandline/run/#volume) or [
`--volume`](https://docs.docker.com/engine/reference/commandline/run/#volume) flags:

```bash
jetson-containers run -v /path/on/host:/path/in/container $(autotag genesis)
```

## Follow the instructions from genesis repository.

Run Demo:

<video controls autoplay muted style="max-width: 75%">
    <source src="images/genesis_demo.mp4" type="video/mp4">
</video>
