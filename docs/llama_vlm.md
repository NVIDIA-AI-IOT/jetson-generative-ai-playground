# Llama 3.2 Vision

The latest additions to Meta's family of foundation LLMs include multimodal vision/language models (VLMs) in 11B and 90B sizes with high-resolution image inputs (1120x1120) and cross-attention with base completion and instruction-tuned chat variants:

* [`Llama-3.2-11B-Vision`](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision)
* [`Llama-3.2-11B-Vision-Instruct`](https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct)
* [`Llama-3.2-90B-Vision`](https://huggingface.co/meta-llama/Llama-3.2-90B-Vision)
* [`Llama-3.2-90B-Vision-Instruct`](https://huggingface.co/meta-llama/Llama-3.2-90B-Vision-Instruct)

While quantization and optimization efforts are underway, we have started with running the unquantized 11B model in a container based on HuggingFace Transformers that has been updated with the latest support for Llama-3.2-Vision a jump start on trying out these exciting new multimodal models - thanks to Meta for continuing to release open Llama models!

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>

    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink2">JetPack 6 (L4T r36)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `12.8GB` for `llama-vision` container image
        - Space for models (`>25GB`)
	
    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		``` 
		
    5. Request access to the gated models [here](https://huggingface.co/meta-llama) with your HuggingFace API key.

		
## Code Example

Today Llama-3.2-11B-Vision is able to be run on Jetson AGX Orin in FP16 via HuggingFace Transformers.  Here's a simple code example from the model card for using it: 

```python
import time
import requests
import torch

from PIL import Image
from transformers import MllamaForConditionalGeneration, AutoProcessor

model_id = "meta-llama/Llama-3.2-11B-Vision"
model = MllamaForConditionalGeneration.from_pretrained(model_id, device_map="auto", torch_dtype=torch.bfloat16)
processor = AutoProcessor.from_pretrained(model_id)

prompt = "<|image|><|begin_of_text|>If I had to write a haiku for this one"
url = "https://llava-vl.github.io/static/images/view.jpg"
raw_image = Image.open(requests.get(url, stream=True).raw)

inputs = processor(text=prompt, images=raw_image, return_tensors="pt").to(model.device)
output = model.generate(**inputs, do_sample=False, max_new_tokens=32)
```

<img src="https://llava-vl.github.io/static/images/view.jpg">

```
If I had to write a haiku for this one, it would be:

A dock on a lake.
A mountain in the distance.
A long exposure.
```

Initial testing seems that Llama-3.2-Vision has more conversational abilities than VLMs typically retain after VQA alignment.  This [llama_vision.py](https://github.com/dusty-nv/jetson-containers/blob/master/packages/vlm/llama-vision/llama_vision.py) script has interactive completion and image loading to avoid re-loading the model.  It can be launched from the container like this:

```bash
jetson-containers run \
    -e HUGGINGFACE_TOKEN=YOUR_API_KEY \
    $(autotag llama-vision) \
      python3 /opt/llama_vision.py \
        --model "meta-llama/Llama-3.2-11B-Vision" \
        --image "/data/images/hoover.jpg" \
        --prompt "I'm out in the" \
        --max-new-tokens 32 \
        --interactive
```

After processing the initial [image](https://github.com/dusty-nv/jetson-containers/blob/master/data/images/hoover.jpg), it will ask you to submit another prompt or image:

```
total 4.8346s (39 tokens, 8.07 tokens/sec)

Enter prompt or image path/URL:

>> 
```

We will update this page and container as support for the Llama-3.2-Vision architecture is added to quantization APIs like MLC and llama.cpp for GGUF, which will reduce the memory and latency.

