/*
 * VLM code examples (todo move under clients/ or resources/)
 */

Resolver({
  key: 'python-vlm',
  url: 'https://github.com/dusty-nv/sudonim/blob/main/sudonim/clients/vlm.py',
  /*func: python_vlm,*/
  title: '<span class="code" style="font-size: 105%">vlm.py</span>',
  filename: 'vlm.py',
  hidden: true,
  group: ['python'],
  refs: ['vlm'],
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
    Before running <span class="code">vlm.py</span>, the model service container should be started, and you should <span class="code">pip install openai</span>
    in your Python environment if needed. Lightweight dependencies make it easy to install clients outside of container or in others.
    <br/><br/>
    For relevant API documentation from the OpenAI Python library, see:<br/>&nbsp;&nbsp;&nbsp;
    <a href="https://github.com/openai/openai-python" target="_blank" class="code">https://github.com/openai/openai-python</a><br/>&nbsp;&nbsp;&nbsp;
    <a href="https://platform.openai.com/docs/guides/images" target="_blank" class="code">https://platform.openai.com/docs/guides/images</a>
  `
});