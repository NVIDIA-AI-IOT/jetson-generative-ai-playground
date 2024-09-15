# Tutorial - text-generation-webui

Interact with a local AI assistant by running a LLM with oobabooga's [`text-generaton-webui`](https://github.com/oobabooga/text-generation-webui) on NVIDIA Jetson!

![](./images/text-generation-webui_sf-trip.gif)

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span>⚠️[^1]

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `6.2GB` for container image
        - Spaces for models

    [^1]: Limited to 7B model (4-bit quantized).

## Set up a container for text-generation-webui

The [jetson-containers](https://github.com/dusty-nv/jetson-containers){:target="_blank"} project provides pre-built Docker images for [`text-generation-webui`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/text-generation-webui){:target="_blank"} along with all of the loader API's built with CUDA enabled (llama.cpp, ExLlama, AutoGPTQ, Transformers, ect).  You can clone the repo to use its utilities that will automatically pull/start the correct container for you, or you can do it [manually](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm/text-generation-webui#user-content-run){:target="_blank"}.

```
git clone https://github.com/dusty-nv/jetson-containers
bash jetson-containers/install.sh
```

!!! info

    **JetsonHacks** provides an informative walkthrough video on jetson-containers, showcasing the usage of both the `stable-diffusion-webui` and `text-generation-webui`.  You can find the complete article with detailed instructions [here](https://jetsonhacks.com/2023/09/04/use-these-jetson-docker-containers-tutorial/).

    <iframe width="720" height="405" src="https://www.youtube.com/embed/HlH3QkS1F5Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## How to start

Use `jetson-containers run` and `autotag` tools to automatically pull or build a compatible container image:

```
jetson-containers run $(autotag text-generation-webui)
```

The container has a default run command (`CMD`) that will automatically start the webserver like this:

```
cd /opt/text-generation-webui && python3 server.py \
  --model-dir=/data/models/text-generation-webui \
  --chat \
  --listen
```

Open your browser and access `http://<IP_ADDRESS>:7860`.

## Download a model on web UI

See the [oobabooga documentation](https://github.com/oobabooga/text-generation-webui/tree/main#downloading-models) for instructions for downloading models - either from within the web UI, or using [`download-model.py`](https://github.com/oobabooga/text-generation-webui/blob/main/download-model.py)

```bash
jetson-containers run --workdir=/opt/text-generation-webui $(./autotag text-generation-webui) /bin/bash -c \
  'python3 download-model.py --output=/data/models/text-generation-webui TheBloke/Llama-2-7b-Chat-GPTQ'
```

From within the web UI, select **Model** tab and navigate to "**Download model or LoRA**" section.  

You can find text generation models on [Hugging Face Hub](https://huggingface.co/models?pipeline_tag=text-generation&sort=trending), then enter the Hugging Face username/model path (which you can have copied to your clipboard from the Hub).  Then click the **Download** button.

### GGUF models

The fastest oobabooga model loader to use is currently [llama.cpp](https://github.com/dusty-nv/jetson-containers/blob/dev/packages/llm/llama_cpp) with 4-bit quantized GGUF models.

You can download a single model file for a particular quantization, like `*.Q4_K_M.bin`. Input the file name and hit **Download** button.

| Model                                                                           |          Quantization         | Memory (MB) |
|---------------------------------------------------------------------------------|:-----------------------------:|:-----------:|
| [`TheBloke/Llama-2-7b-Chat-GGUF`](https://huggingface.co/TheBloke/Llama-2-7b-Chat-GGUF)   |  `llama-2-7b-chat.Q4_K_M.gguf` |    5,268    |
| [`TheBloke/Llama-2-13B-chat-GGUF`](https://huggingface.co/TheBloke/Llama-2-13B-chat-GGUF) | `llama-2-13b-chat.Q4_K_M.gguf` |    8,609    |
| [`TheBloke/LLaMA-30b-GGUF`](https://huggingface.co/TheBloke/LLaMA-30b-GGUF)     | `llama-30b.Q4_K_S.gguf`   |    19,045   |
| [`TheBloke/Llama-2-70B-chat-GGUF`](https://huggingface.co/TheBloke/Llama-2-70b-Chat-GGUF) | `llama-2-70b-chat.Q4_K_M.gguf` |    37,655   |

![](./images/tgwui_model-download-animation.gif)

!!! info

    ### Model selection for Jetson Orin Nano

    <span class="blobLightGreen4">Jetson Orin Nano Developer Kit</span> has only 8GB RAM for both CPU (system) and GPU, so you need to pick a model that fits in the RAM size - see the [Model Size](#model-size-tested) section below.  The 7B models with 4-bit quantization are the ones to use on Jetson Orin Nano.  Make sure you go through the [RAM optimization](./tips_ram-optimization.md) steps before attempting to load such model on Jetson Orin Nano.

## Load a model

After you have downloaded a model, click the 🔄 button to refresh your model list, and select the model you want to use.

For a GGUF model, remember to

- Set `n-gpu-layers` to `128`
- Set `n_gqa` to `8` if you using Llama-2-70B (on Jetson AGX Orin 64GB)

Then click the **Load** button.

## Chat Template

If you're using a Llama model fine-tuned for chat, like the models listed above (except for `LLaMA-30b`), you need to use the oobabooga Instruct mode and set the template.  On the **Parameters** tab, go to the **Instruction Template** sub-tab, then select `Llama-v2` from the **Instruction Template** drop-down (or Vicuna, Guanaco, ect if you are using one of those models)  

!!! tip ""

    For the base text completion models (like `LLaMA-30b`), use the Default or Notebook tab.
    
Selecting the right chat template will make sure the model is being [prompted correctly](https://huggingface.co/blog/llama2#how-to-prompt-llama-2) - you can also change the system prompt in the **Context** box to alter the agent's personality and behavior.  There are a lot of other settings under the **Generation** tab, like the maximum length it should output per reply, and token sampling parameters like [`temperature` and `top_p`](https://medium.com/@dixnjakindah/top-p-temperature-and-other-parameters-1a53d2f8d7d7) for controlling randomness.

Then change back to the **Chat** tab, and under the mode section, make sure **Instruct** is selected (confusingly, not chat mode).  Then you can start chatting with the LLM!

## Results

![](./images/text-generation-webui_sf-trip.gif)

## Things to do with your LLM

[Here](https://modal.com/docs/guide/ex/vllm_inference#run-the-model) are some common test prompts for coding, math, history ect.  You can also ask it about geography, travel, nature, recipies, fixing things, general life advice, and practically everything else.  Also Llama-2 is quite playful and likes to play games to test its logic abilities!

```
>> What games do you like to play?

I'm a large language model, so I can play text-based games and answer questions on a wide variety of topics. Here are some game ideas:

- 20 Questions:  You or I can think of an object, and the other player tries to guess what it is by asking up to 20 yes-or-no questions.  The goal is to guess the object in as few questions as possible.
- Hangman: I can think of a word or phrase and you try to guess it by suggesting letters. Each incorrect guess will bring the hangman one step closer to being complete!
- Word association: I'll give you a word and you have to come up with a word that is related to it. We can keep playing back and forth as long as you'd like!
- Trivia: I can provide questions on a wide range of topics, from history to science to pop culture. See how many questions you can answer correctly!
- Storytelling: I can start telling a story and then stop at a cliffhanger. You can then try to guess what happens next or even take over the storytelling and continue it in your own
- Jokes: I love to tell jokes and make people laugh with my "Dad humor"!  Knock knock!  *giggles*
```

## Model size tested

With llama.cpp, GGUF model, 4-bit quantization:

| Model size  | Jetson AGX Orin 64GB | Jetson AGX Orin 32GB | Jetson Orin Nano 8GB |
| -----------:|:--------------------:|:--------------------:|:--------------------:|
| 70B model   |✅                    |                      |                     |
| 30B model   |✅                    |✅                    |                     |
| 13B model   |✅                    |✅                    |                     |
|  7B model   |✅                    |✅                    |✅                   |

!!! tip ""

    **Want to explore using Python APIs to run LLMs directly? <br>
    See [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/tree/master/packages/llm) for its LLM related packages and containers.**