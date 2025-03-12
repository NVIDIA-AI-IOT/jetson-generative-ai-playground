/*
 * llama-factory launcher
 */

export function llama_factory(env) {

  let server_host = env.server_host.split(':');
  let web_host = env.web_host.split(':');

  const SERVER_PORT = server_host.pop();
  const SERVER_ADDR = server_host.pop();

  const WEB_PORT = web_host.pop();
  const WEB_ADDR = web_host.pop();

  const DOCKER_IMAGE = env.docker_image;

  env.properties.docker_run.text = `
    Fine-tune multimodal LLMs with <a href="https://github.com/hiyouga/LLaMA-Factory" target="_blank">LLaMa-Factory</a>,
    supporting PEFT, QLoRA, RLHF, KTO, SFT, reward modelling, and pretraining through HuggingFace <a href="https://github.com/huggingface/trl" target="_blank">TRL</a>.

    <p style="opacity: 80%; margin-top: 7px;">&nbsp;&nbsp;&nbsp;
      <i class="bi bi-exclamation-triangle-fill"></i>&nbsp;&nbsp;
      May exceed memory limits (Jetson AGX Orin 64GB recommended)
    </p>
  `;

  env.properties.docker_run.footer = `
    After you start the server, navigate your browser to <a href="http://${WEB_ADDR}:${WEB_PORT}" target="_blank" class="code">http://${WEB_ADDR}:${WEB_PORT}</a>
    <br/>
      This also supports serving a 
      <a href="https://github.com/hiyouga/LLaMA-Factory/tree/main?tab=readme-ov-file#deploy-with-openai-style-api-and-vllm" target="_blank">
        <span class="code">chat.completion</span>
      </a>
      inference endpoint with vLLM.
    <p>
      The <a href="https://github.com/hiyouga/LLaMA-Factory/blob/main/data/README.md" target="_blank">dataset formats</a> supported are Alpaca and ShareGPT,
      and there are several build-in <a href="https://github.com/hiyouga/LLaMA-Factory/tree/main/examples" target="_blank">examples</a> that will automatically download test data subsets & models.
    </p>
    <p>
      This is the build configuration of <span class="code">${DOCKER_IMAGE}</span> container:
      <pre class="code" style="color: revert; line-height: revert; margin: 0px;">
  - llamafactory version: 0.9.2
  - Platform: Linux-5.15.148-tegra-aarch64-with-glibc2.35
  - Python version: 3.10.12
  - PyTorch version: 2.6.0 (GPU)
  - Transformers version: 4.49.0
  - Datasets version: 3.2.0
  - Accelerate version: 1.2.1
  - PEFT version: 0.12.0
  - TRL version: 0.9.6
  - Bitsandbytes version: 0.45.4.dev0
  - vLLM version: 0.7.4
      </pre>
    You can change to the dark theme by adding <span class="code">?__theme=dark</span> to the URL.
    </p>
  `;

  env.docker_run = substitution(docker_run(env), {
    CACHE_DIR: env.cache_dir,
    SERVER_PORT: SERVER_PORT,
    SERVER_ADDR: SERVER_ADDR,
    WEB_PORT: WEB_PORT,
    WEB_ADDR: WEB_ADDR,
  });
  
  return env.docker_run;
}

Resolver({
  func: llama_factory,
  name: 'LLaMa Factory',
  filename: 'llama-factory.sh',
  web_host: '0.0.0.0:7860',
  server_host: '0.0.0.0:9000',
  hf_token: null,
  docker_image: 'dustynv/llama-factory:r36.4.0',
  docker_options: [
    '-it --rm --name=llama-factory',
    '-v ${CACHE_DIR}/llama-factory/cache:/data/llama-factory/cache',
    '-v ${CACHE_DIR}/llama-factory/config:/data/llama-factory/config',
    '-v ${CACHE_DIR}/llama-factory/data:/data/llama-factory/data',
    '-v ${CACHE_DIR}/llama-factory/saves:/data/llama-factory/saves',
    '-e GRADIO_SERVER_PORT=${WEB_PORT}',
    '-e API_PORT=${SERVER_PORT}',
    '-p ${WEB_PORT}:${WEB_PORT}',
    '-p ${SERVER_PORT}:${SERVER_PORT}',
  ].join(' '),
  docker_run: [
    'docker run $OPTIONS $IMAGE'
  ].join(' '),
  thumbnail: '/portal/dist/images/llama-factory.webp',
  nav_style: 'background-size: 115%;',
  nav_class: 'theme-light',
  hidden: true,
  tags: ['webui', 'shell'],
  links: {
    github: {
      name: "GitHub",
      url: "https://github.com/hiyouga/LLaMA-Factory"
    },
    docs: {
      name: "Docs",
      url: "https://llamafactory.readthedocs.io/en/latest/"
    }
  }
});