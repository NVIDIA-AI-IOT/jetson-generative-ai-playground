# Genesis: A Generative and Universal Physics Engine for Robotics and Beyond

[Genesis](https://genesis-embodied-ai.github.io/){:target="_blank"} is an open-source physics simulation platform with massively-parallel GPU acceleration and provisions for [generative automation](https://robogen-ai.github.io/){:target="_blank"}. 

As per the project's [user guide](https://genesis-world.readthedocs.io/en/latest/user_guide/index.html){:target="_blank"} and [GitHub repo](https://github.com/Genesis-Embodied-AI/Genesis){:target="_blank"}, it is designed for robotics & embodied AI by a broad consortium of organizations:

1. A universal physics engine re-built from the ground up, capable of simulating a wide range of materials and physical phenomena.
2. A lightweight, ultra-fast, pythonic, and user-friendly robotics simulation platform.
3. A powerful and fast photo-realistic rendering system.
4. A generative data engine that transforms user-prompted natural language description into various modalities of data.

<table>
  <tr>
    <td style="text-align: center; max-width: 550px;">
      <a href="https://robogen-ai.github.io/" target="_blank">
        <video controls autoplay loop muted>
          <source src="https://genesis-embodied-ai.github.io/videos/manipulation/throw.mp4" type="video/mp4">
        </video>
      </a>
      <span style="font-size: 90%; font-style: italic;">"A mobile franka arm throws all the objects on the floor into the basket."</span>
    </td>
    <td style="text-align: center; max-width: 550px;">
      <a href="https://robogen-ai.github.io/" target="_blank">
        <video controls autoplay loop muted>
          <source src="https://genesis-embodied-ai.github.io/videos/manipulation/book.mp4" type="video/mp4">
        </video>
      </a>
      <span style="font-size: 90%; font-style: italic;">"A mobile franka arm re-organizes the books on the table by pushing them..."</span>
    </td>
  </tr>
  <tr>
    <td style="text-align: center; max-width: 550px;">
      <video controls autoplay loop muted>
        <source src="https://genesis-embodied-ai.github.io/videos/facial_single.mp4" type="video/mp4">
      </video>
      <span style="font-size: 90%; font-style: italic;">Speech Audio, Facial Animation & Emotion Generation for Digital Human</span>
    </td>
    <td style="text-align: center; max-width: 550px;">
      <video controls autoplay loop muted>
        <source src="https://genesis-embodied-ai.github.io/videos/locomotion/quadraped/traverse.mp4" type="video/mp4">
      </video>
      <span style="font-size: 90%; font-style: italic;">"Quadraped locomotion with various base heights (Sim2Real)"</span>
    </td>
  </tr>
</table>

> Special thanks to [Johnny Núñez Cano](https://www.linkedin.com/in/johnnycano/){:target="_blank"} for porting Genesis to arm64+CUDA and Jetson, along with the extensive stack to support it.   

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack){:target="_blank"}:

        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. <span class="markedYellow">NVMe SSD **highly recommended**</span> for storage speed and space

        - `11.1GB` for [`dustynv/genesis:r36.4.0-cu128`](https://hub.docker.com/r/dustynv/genesis) container image
        - Space for models and datasets (`>50GB`)
		 
    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		```  
		
	5. Please refer to the upstream project for more resources:
	 
	    - Code Examples - [https://github.com/Genesis-Embodied-AI/Genesis/tree/main/examples](https://github.com/Genesis-Embodied-AI/Genesis/tree/main/examples){:target="_blank"}
	    - Getting Started - [https://genesis-world.readthedocs.io/en/latest/user_guide/index.html](https://genesis-world.readthedocs.io/en/latest/user_guide/index.html)
	    - Documentation - [https://genesis-world.readthedocs.io](https://genesis-world.readthedocs.io){:target="_blank"}

!!! example "Work in Progress"
    Development status of the arm64 porting efforts (2/17/25)

    - [OMPL](https://github.com/ompl/ompl){:target="_blank"} - support for motion planning and IK, coming soon to Jetson.
    - [LuisaRender](https://github.com/Alif-01/LuisaRender/tree/d3b8e341540832ebf517cbe6a8abf5da2cf2e026){:target="_blank"} - support for CUDA-accelerated raytracing, coming soon to Jetson.
    - Ask questions in [`#robot-simulation-discuss`](https://discord.gg/BmqNSK4886){:target="_blank"} on Discord or [`jetson-containers/issues`](https://github.com/dusty-nv/jetson-containers/issues){:target="_blank"}

## Start Container

Currently a container image is available for JetPack 6.1+ and L4T R36.4, built with CUDA 12.8 and PyTorch 2.6:

```bash
jetson-containers run dustynv/genesis:r36.4.0-cu128
```

To mount your own directories into the container, use the [
`-v`](https://docs.docker.com/engine/reference/commandline/run/#volume) or [
`--volume`](https://docs.docker.com/engine/reference/commandline/run/#volume) flags:

```bash
jetson-containers run -v /path/on/host:/path/in/container dustynv/genesis:r36.4.0-cu128
```

## Demo Walkthroughs

There are numerous [quickstart guides](https://genesis-world.readthedocs.io/en/latest/user_guide/index.html) and [code examples](https://github.com/Genesis-Embodied-AI/Genesis/tree/main/examples){:target="_blank"} that come with Genesis and are installed inside the container under `/opt/genesis`

```bash
jetson-containers run -w /opt/genesis/examples \
  dustynv/genesis:r36.4.0-cu128 \
    python3 elastic_dragon.py --vis
```

<video controls autoplay loop muted style="max-width: 75%">
    <source src="images/genesis_demo.mp4" type="video/mp4">
</video>

We encourage you to explore these resources and [get involved](https://discord.gg/BmqNSK4886){:target="_blank"} in the efforts, and share results or feedback with the group and upstream maintainers. We'll continue updating this page with progress from porting the remaining dependencies, along with integration of AI & robotics models and related SDKs like [ROS](ros.md){:target="_blank"} and [LeRobot](lerobot.md){:target="_blank"}.
