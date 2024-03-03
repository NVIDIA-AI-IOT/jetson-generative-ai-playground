# Tutorial - Whisper

Let's run OpenAI's [Whisper](https://github.com/openai/whisper), pre-trained model for automatic speech recognition on Jetson!

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `6.1 GB` for `whisper` container image
        - Space for checkpoints

    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		cd jetson-containers
		sudo apt update; sudo apt install -y python3-pip
		pip3 install -r requirements.txt
		``` 

## How to start

Use `run.sh` and `autotag` script to automatically pull or build a compatible container image.

```
cd jetson-containers
./run.sh $(./autotag whisper)
```

The container has a default run command (`CMD`) that will automatically start the Jupyter Lab server, with SSL enabled.

Open your browser and access `https://<IP_ADDRESS>:8888`.

!!! attention

    Note it is **`https`** (not `http`).

    HTTPS (SSL) connection is needed to allow `ipywebrtc` widget to have access to your microphone (for `record-and-transcribe.ipynb`).


You will see a warning message like this.

![](./images/Chrome_ERR_CERT.png){: style="width:50%"}

Press "**Advanced**" button and then click on "**Proceed to <IP_ADDRESS> (unsafe)**" link to proceed to the Jupyter Lab web interface.

![](./images/Chrome_ERR_CERT_after_advanced.png){: style="width:50%"}

> The default password for Jupyter Lab is `nvidia`.

## Run Jupyter notebooks

Whisper repo comes with demo Jupyter notebooks, which you can find under `/notebooks/` directory.

`jetson-containers` also adds one convenient notebook (`record-and-transcribe.ipynb`) to record your audio sample on Jupyter notebook in order to run transcribe on your recorded audio. 

![](./images/whisper_jupyterlab_notebooks.png)

### `record-and-transcribe.ipynb`

This notebook is to let you record your own audio sample using your PC's microphone and apply Whisper's `medium` model to transcribe the audio sample.

It uses Jupyter notebook/lab's `ipywebrtc` extension to record an audio sample on your web browser.

![](./images/whisper_ipywebrtc_widget.png)

!!! attention

    When you click the ⏺ botton, your web browser may show a pop-up to ask you to allow it to use your microphone. Be sure to allow the access.

    ![](./images/whisper_microphone_access.png)

    ??? info "Final check"
    
        Once done, if you click on the "**⚠ Not secure**" part in the URL bar, you should see something like this.

        ![](./images/whisper_web_setting.png)

#### Result

Once you go through all the steps, you should see the transcribe result in text like this.

![](./images/whisper_transcribe_result.png)