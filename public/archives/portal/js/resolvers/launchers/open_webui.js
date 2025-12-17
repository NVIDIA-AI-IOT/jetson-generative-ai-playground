/*
  OpenWebUI launcher

  docker run -it --rm --network=host \
    -e ENABLE_OPENAI_API=True \
    -e ENABLE_OLLAMA_API=False \
    -e OPENAI_API_BASE_URL=http://localhost:9000/v1 \
    -e OPENAI_API_KEY=foo \
    -v /mnt/nvme/cache:/root/.cache \
    -v /mnt/nvme/cache/open-webui:/app/backend/data \
    --name open-webui \
      ghcr.io/open-webui/open-webui:main
*/

export function open_webui(env) {
  
  const port = env.server_host.split(':').pop();

  if( exists(env.parent) ) {
    var root = env.parent;
    var server_llm = get_server_url(env.parent ?? {});
  }
  else {
    var root = env;
    root.properties.docker_run.text = [
      `Start an <a href="https://github.com/open-webui/open-webui" target="_blank">Open WebUI</a> server that uses a running <span class="code">chat.completion</span> model:`,
      `Then navigate your browser to <a href="http://0.0.0.0:${port}" target="_blank" class="code">http://0.0.0.0:${port}</a> (or your Jetson's IP)`
    ].join('<br/>'),
    root.properties.docker_run.footer = env.footer; // `These individual commands are typically meant for exploratory use - see the <span class="code">Compose</span> tab for managed deployments of models and microservices.`
  }

  env.cache_dir = root.cache_dir;

  env.docker_run = substitution(docker_run(env), {
    server_llm: server_llm ?? as_url(env.server_llm),
    server_asr: as_url(env.server_asr),
    server_tts: as_url(env.server_tts),
    cache_dir: root.cache_dir,
    port: port
  });

  return env.docker_run;
}

Resolver({
  func: open_webui,
  name: 'Open WebUI',
  filename: 'open-webui.sh',
  server_host: '0.0.0.0:8080',
  server_llm: '0.0.0.0:9000',
  server_asr: '0.0.0.0:8990',
  server_tts: '0.0.0.0:8995',
  docker_image: 'ghcr.io/open-webui/open-webui:main',
  docker_options: [
    '-it --rm --name open-webui --network=host -e PORT=${PORT}', /* --net-alias open-webui */
    '-e ENABLE_OPENAI_API=True -e ENABLE_OLLAMA_API=False',
    '-e OPENAI_API_BASE_URL=${SERVER_LLM}/v1 -e OPENAI_API_KEY=foo',
    '-e AUDIO_STT_ENGINE=openai -e AUDIO_TTS_ENGINE=openai',
    '-e AUDIO_STT_OPENAI_API_BASE_URL=${SERVER_ASR}/v1',
    '-e AUDIO_TTS_OPENAI_API_BASE_URL=${SERVER_TTS}/v1',
    '-v ${CACHE_DIR}/open-webui:/app/backend/data',
  ].join(' '),
  docker_run: 'docker run $OPTIONS $IMAGE',
  CUDA_VISIBLE_DEVICES: "none",
  thumbnail: '/portal/dist/images/open-webui.webp',
  nav_style: 'background-size: auto;',
  hidden: true,
  group: ['shell'],
  refs: ['llm'],
  tags: ['docker_profile', 'shell', 'webui'],
  links: {
    website: {
      name: "openwebui.com",
      url: "https://openwebui.com/"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/open-webui/open-webui"
    }
  },
  text: [
    `Start an <a href="https://github.com/open-webui/open-webui" target="_blank">Open WebUI</a> user interface with this model, as per this <a href="/tutorial_openwebui.html" target="_blank">tutorial</a>.`,
    `Then navigate your browser to <a href="http://0.0.0.0:8080" target="_blank" class="code">http://0.0.0.0:8080</a> (or your Jetson's IP)`
  ].join('<br/>'),
  footer: [
    `The <span class="code">chat.completion</span> model server should already be running before starting Open WebUI`, 
    `(which is handled automatically when using docker-compose)<br/>`,
    `It will have you create a login on the first use, but its only stored locally.`
  ].join(' ')
});