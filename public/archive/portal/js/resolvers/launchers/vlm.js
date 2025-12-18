/*
 * VLM code examples (todo move under clients/ or resources/)
 */

Resolver({
  key: 'python-vlm-simple',
  url: 'https://github.com/dusty-nv/sudonim/blob/main/sudonim/clients/vlm-simple.py',
  title: '<span class="code" style="font-size: 105%">vlm.py</span>',
  filename: 'vlm.py',
  hidden: true,
  refs: ['vlm'],
  group: ['python'],
  tags: ['python'],
  text: `
    This simple VLM <a href="https://github.com/dusty-nv/sudonim/blob/main/sudonim/clients/vlm-simple.py" target="_blank">client</a>
    shows how to embed images in the <span class="code">chat.completion</span> messages and run an example query.  It supports streaming outputs.
  `,
  footer: `
    Before running <span class="code">vlm.py</span>, the model service container should be started, and you should <span class="code">pip install openai</span>
    in your Python environment if needed. 
    <br/>
    Due to the lightweight dependencies, you can install clients natively outside of container, or in other containers.
    <br/><br/>
    For relevant API documentation from the OpenAI Python library, see:<br/>&nbsp;&nbsp;&nbsp;
    <a href="https://github.com/openai/openai-python" target="_blank" class="code">https://github.com/openai/openai-python</a><br/>&nbsp;&nbsp;&nbsp;
    <a href="https://platform.openai.com/docs/guides/images" target="_blank" class="code">https://platform.openai.com/docs/guides/images</a>
  `
});

Resolver({
  key: 'python-vlm',
  url: 'https://github.com/dusty-nv/sudonim/blob/main/sudonim/clients/vlm.py',
  title: '<span class="code" style="font-size: 105%">vlm-bench.py</span>',
  filename: 'vlm-bench.py',
  hidden: true,
  refs: ['vlm'],
  group: ['python'],
  tags: ['python'],
  text: `
    This multimodal <span class="code">chat.completion</span> 
    <a href="https://github.com/dusty-nv/sudonim/blob/main/sudonim/clients/vlm.py" target="_blank">client</a>
    supports text/image inputs and streaming text output.  It runs some example Visual Question Answering (VQA) prompts
    on these <a href="https://github.com/dusty-nv/jetson-containers/tree/master/data/images" target="_blank">test images</a>,
    encoded as <a href="https://annacsmedeiros.medium.com/efficient-image-processing-in-python-a-straightforward-guide-to-base64-and-numpy-conversions-e9e3aac13312" target="_blank">base64</a>
    in the chat message URLs.
  `,
  footer: `
    This tool measures the performance of the VLM in terms of the <b>Time To First Token (TTFT)</b> -
    how long until the model started generating output, 
    which includes the VIT processing, multimodal projector, and prefill latency -
    and the decode generation rate in tokens per second. 
  `
});