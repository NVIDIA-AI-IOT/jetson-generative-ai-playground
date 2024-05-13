# Tutorial - VoiceCraft

Let's run [VoiceCraft](https://github.com/jasonppy/VoiceCraft), a Zero-Shot Speech Editing and Text-to-Speech in the Wild!
!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <!-- <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span> -->

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <!-- <span class="blobPink1">JetPack 5 (L4T r35.x)</span> -->
         <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `15.6 GB` for `voicecraft` container image
        - Space for models

    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		``` 

## How to start

Use `run.sh` and `autotag` script to automatically pull or build a compatible container image.

```
jetson-containers run $(autotag voicecraft)
```

The container has a default run command (`CMD`) that will automatically start the Gradio app.

Open your browser and access `http://<IP_ADDRESS>:7860`.

<!-- > The default password for Jupyter Lab is `nvidia`. -->

## Gradio app

VoiceCraft repo comes with Gradio demo app.

1. Select which models you want to use, I recommend using 330M_TTSEnhanced on 32GB AGX Orin
2. Click load, if you run it for the first time, models are downloaded from huggingface, otherwise are loaded from ```/data``` folder, where are saved to from previous runs
3. Upload audio file of your choice (MP3/wav)
4. Click transcribe, it will use whisper to get transcription along with start/end time of each word spoken
5. Now you can edit the sentence, or use TTS. Click Run to generate output.


![](./images/voicecraft_load_models.png)


!!! warning

    For TTS it's okay to use only first few seconds of audio as prompt, since it consumes a lot of memory. On AGX 32GB Orin the maximal TTS length of generated audio is around ~16 seconds in headless mode.


## Resources
If you want to know how it works under the hood, you can read following papers:

1.  [VOICECRAFT: Zero-Shot Speech Editing and Text-to-Speech in the Wild](https://arxiv.org/pdf/2403.16973)
2.  [High Fidelity Neural Audio Compression](https://arxiv.org/pdf/2210.13438)
3.  [Neural Codec Language Models are Zero-Shot Text to Speech Synthesizers](https://arxiv.org/pdf/2301.02111)