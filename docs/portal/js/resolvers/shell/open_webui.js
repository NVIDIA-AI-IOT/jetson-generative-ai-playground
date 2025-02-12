/*
 * OpenWebUI launchers
 */

/*
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

  if( env.parent ) {
    env.server_host = env.parent.server_host;
  }

  return docker_run(env);
}

Resolver({
  func: open_webui,
  title: 'Open WebUI',
  filename: 'open-webui.sh',
  hidden: true,
  docker_image: "ghcr.io/open-webui/open-webui:main",
  docker_options: "-it --rm --network=host -e ENABLE_OPENAI_API=True -e ENABLE_OLLAMA_API=False -e OPENAI_API_BASE_URL=http://localhost:9000/v1 -e OPENAI_API_KEY=foo -v /mnt/nvme/cache/open-webui:/app/backend/data --name open-webui",
  CUDA_VISIBLE_DEVICES: null,
  group: ['shell'],
  refs: ['llm'],
  tags: ['docker_profile', 'shell', 'container'],
  text: `Start an <a href="https://github.com/open-webui/open-webui" target="_blank">Open WebUI</a> server using this chat model by default:`,
  footer: [
    `The <span class="monospace">chat.completion</span> model server should already be running before starting Open WebUI,`, 
    `which is handled automatically with docker-compose.`
  ].join(' ')
});