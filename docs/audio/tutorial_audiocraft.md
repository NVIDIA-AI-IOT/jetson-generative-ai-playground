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

    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		``` 

## How to start

Use `run.sh` and `autotag` script to automatically pull or build a compatible container image.

```
jetson-containers run $(autotag audiocraft)
```

The container has a default run command (`CMD`) that will automatically start the Jupyter Lab server.

Open your browser and access `http://<IP_ADDRESS>:8888`.

> The default password for Jupyter Lab is `nvidia`.

## Run Jupyter notebooks

AudioCraft repo comes with demo Jupyter notebooks.

On Jupyter Lab navigation pane on the left, double-click `demos` folder. 

![](../images/audiocraft_jupyterlab_demo.png)

### AudioGen demo

<!-- For "**Text-conditional Generation**", you should get something like this.

<audio controls>
  <source src="../assets/subway.wav" type="audio/wav">
Your browser does not support the audio element.
</audio> -->

Run cells with ```Shift + Enter```, first one will download models, which can take some time.

!!! info

    You may encounter an error message like the following when executing the first cell, but you can keep going.
    ```
    A matching Triton is not available, some optimizations will not be enabled.
    Error caught was: No module named 'triton'
    ```

<!-- !!! warning

    When running the 5-th cell of `audiogen_demo.ipynb`, you may run into "**Failed to load audio**" RuntimeError. -->

In the *Audio Continuation* cells, you can generate continuation based on text, while in *Text-conditional Generation* you can generate audio based just on text descriptions.

You can also use your own audio as prompt, and use text descriptions to generate continuation:
```
prompt_waveform, prompt_sr = torchaudio.load(".../assets/sirens_and_a_humming_engine_approach_and_pass.mp3") # you can upload your own audio
prompt_duration = 2
prompt_waveform = prompt_waveform[..., :int(prompt_duration * prompt_sr)]
output = model.generate_continuation(prompt_waveform.expand(3, -1, -1), prompt_sample_rate=prompt_sr,descriptions=[
        'Subway train blowing its horn',   # text descriptions for continuation
        'Horse neighing furiously',
        'Cat hissing'
], progress=True)
display_audio(output, sample_rate=16000)
```

### MusicGen and MAGNeT demos

The two other jupyter notebooks are similar to AuidioGen, where you can generate continuation or generate audio, while using models trained to generate music.

<!-- For "**Text-conditional Generation**", you should get something like this.

<audio controls>
  <source src="../assets/80s-pop.wav" type="audio/wav">
Your browser does not support the audio element.
</audio>

!!! warning

    When running the 5-th cell of `musicgen_demo.ipynb`, you may run into "**Failed to load audio**" RuntimeError. -->