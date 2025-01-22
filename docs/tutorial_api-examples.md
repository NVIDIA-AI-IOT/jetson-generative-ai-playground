# Tutorial - API Examples

It's good to know the code for generating text with LLM inference, and ancillary things like tokenization, chat templates, and prompting.  On this page we give Python examples of running various LLM APIs, and their benchmarks.

!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span><span title="Orin Nano 8GB can run 7B quantized models">⚠️</span>
	   
    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink2">JetPack 5 (L4T r35)</span>
        <span class="blobPink2">JetPack 6 (L4T r36)</span>

    3. <span class="markedYellow">NVMe SSD **highly recommended**</span> for storage speed and space

        - `22GB` for `l4t-text-generation` container image
        - Space for models (`>10GB`)
	
    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		``` 
		
## Transformers

The HuggingFace Transformers API is the de-facto API that models are released for, often serving as the reference implementation.  It's not terribly fast, but it does have broad model support, and also supports quantization (AutoGPTQ, AWQ).  This uses streaming:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, TextIteratorStreamer
from threading import Thread

model_name='meta-llama/Llama-2-7b-chat-hf'
model = AutoModelForCausalLM.from_pretrained(model_name, device_map='cuda')

tokenizer = AutoTokenizer.from_pretrained(model_name)
streamer = TextIteratorStreamer(tokenizer)

prompt = [{'role': 'user', 'content': 'Can I get a recipe for French Onion soup?'}]
inputs = tokenizer.apply_chat_template(
    prompt,
    add_generation_prompt=True,
    return_tensors='pt'
).to(model.device)

Thread(target=lambda: model.generate(inputs, max_new_tokens=256, streamer=streamer)).start()

for text in streamer:
    print(text, end='', flush=True)
```

To run this (it can be found [here](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/transformers/test.py){:target="_blank"}), you can mount a directory containing the script or your jetson-containers directory:

```bash
jetson-containers run --volume $PWD/packages/llm:/mount --workdir /mount \
  $(autotag l4t-text-generation) \
    python3 transformers/test.py
```

We use the `l4t-text-generation` container because it includes the quantization libraries in addition to Transformers, for running the quanztized versions of the models like `TheBloke/Llama-2-7B-Chat-GPTQ`

### Benchmarks

The [`huggingface-benchmark.py`](https://github.com/dusty-nv/jetson-containers/blob/master/packages/llm/transformers/huggingface-benchmark.py){:target="_blank"} script will benchmark the models:

```bash
./run.sh --volume $PWD/packages/llm/transformers:/mount --workdir /mount \
  $(./autotag l4t-text-generation) \
    python3 huggingface-benchmark.py --model meta-llama/Llama-2-7b-chat-hf
```

```
* meta-llama/Llama-2-7b-chat-hf  AVG = 20.7077 seconds,  6.2 tokens/sec  memory=10173.45 MB
* TheBloke/Llama-2-7B-Chat-GPTQ  AVG = 12.3922 seconds, 10.3 tokens/sec  memory=7023.36 MB
* TheBloke/Llama-2-7B-Chat-AWQ   AVG = 11.4667 seconds, 11.2 tokens/sec  memory=4662.34 MB
```

## NanoLLM

The [`NanoLLM`](tutorial_nano-llm.md) library uses the optimized MLC/TVM library for inference, like on the [Benchmarks](benchmarks.md) page:

<a href="benchmarks.html"><iframe width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJ9lFqOIZSfrdnS_0sa2WahzLbpbAbBCTlS049jpOchMCum1hIk-wE_lcNAmLkrZd0OQrI9IkKBfGp/pubchart?oid=2126319913&amp;format=interactive"></iframe></a>

```python title="<a href='https://dusty-nv.github.io/NanoLLM' target='_blank'>> NanoLLM Reference Documentation</a>"
from nano_llm import NanoLLM, ChatHistory, ChatTemplates

# load model
model = NanoLLM.from_pretrained(
    model='meta-llama/Meta-Llama-3-8B-Instruct', 
    quantization='q4f16_ft', 
    api='mlc'
)

# create the chat history
chat_history = ChatHistory(model, system_prompt="You are a helpful and friendly AI assistant.")

while True:
    # enter the user query from terminal
    print('>> ', end='', flush=True)
    prompt = input().strip()

    # add user prompt and generate chat tokens/embeddings
    chat_history.append(role='user', msg=prompt)
    embedding, position = chat_history.embed_chat()

    # generate bot reply
    reply = model.generate(
        embedding, 
        streaming=True, 
        kv_cache=chat_history.kv_cache,
        stop_tokens=chat_history.template.stop,
        max_new_tokens=256,
    )
        
    # append the output stream to the chat history
    bot_reply = chat_history.append(role='bot', text='')
    
    for token in reply:
        bot_reply.text += token
        print(token, end='', flush=True)
            
    print('\n')

    # save the inter-request KV cache 
    chat_history.kv_cache = reply.kv_cache
```

This [example](https://github.com/dusty-nv/NanoLLM/blob/main/nano_llm/chat/example.py){:target="_blank"} keeps an interactive chat running with text being entered from the terminal.  You can start it like this:

```python
jetson-containers run \
  --env HUGGINGFACE_TOKEN=hf_abc123def \
  $(autotag nano_llm) \
    python3 -m nano_llm.chat.example
```

Or for easy editing from the host device, copy the source into your own script and mount it into the container with the `--volume` flag.  And for authenticated models, request access through HuggingFace (like with [Llama](https://huggingface.co/meta-llama){:target="_blank"}) and substitute your account's API token above.

 
