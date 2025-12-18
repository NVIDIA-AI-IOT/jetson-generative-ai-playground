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
  const root = exists(env.parent) ? env.parent : env;

  env.cache_dir = root.cache_dir;

  return substitution(docker_run(env), {
    server_host: get_server_url(env.parent ?? {}),
    cache_dir: root.cache_dir
  });
}

Resolver({
  func: open_webui,
  title: 'Open WebUI',
  filename: 'open-webui.sh',
  server_host: '0.0.0.0:8080',
  docker_image: 'ghcr.io/open-webui/open-webui:main',
  docker_options: [
    '-it --rm --name open-webui --network=host', /* --net-alias open-webui */
    '-e ENABLE_OPENAI_API=True -e ENABLE_OLLAMA_API=False',
    '-e OPENAI_API_BASE_URL=${SERVER_HOST}v1 -e OPENAI_API_KEY=foo',
    '-v ${CACHE_DIR}/open-webui:/app/backend/data',
  ].join(' '),
  docker_run: 'docker run $OPTIONS $IMAGE',
  CUDA_VISIBLE_DEVICES: "none",
  hidden: true,
  group: ['shell'],
  refs: ['llm'],
  tags: ['docker_profile', 'shell', 'container'],
  text: [
    `Start a user interface for chatting with this model, following this <a href="/tutorial_openwebui.html" target="_blank">tutorial</a>.`,
    `Then navigate your browser to <a href="http://0.0.0.0:8080" target="_blank" class="code">http://0.0.0.0:8080</a> (or your Jetson's IP)`
  ].join('<br/>'),
  footer: [
    `The <span class="code">chat.completion</span> model server should already be running before starting Open WebUI`, 
    `(which is handled automatically when using docker-compose)<br/>`,
    `It will have you create a login on the first use, but this is only stored locally.`
  ].join(' ')
});