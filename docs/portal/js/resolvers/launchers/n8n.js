/*
 * n8n launcher
 */

export function n8n(env) {

  let server_host = env.server_host.split(':');
 
  const PORT = server_host.pop();
  const ADDR = server_host.pop();

  env.properties.docker_run.text = [
    `Use <a href="https://github.com/n8n-io/n8n" target="_blank">n8n</a> workflow automation platform to build AI-enabled bots from LangChain graphs.`,
    `Launch the server and navigate to <a href="http://${ADDR}:${PORT}" target="_blank" class="code">http://${ADDR}:${PORT}</a>`
  ].join(' ');

  env.properties.docker_run.footer = [
    'n8n has many <a href="https://docs.n8n.io/hosting/configuration/environment-variables/" target="_blank">environment variables</a>',
    'for configuring different API adapters in LangChain and <a href="https://docs.n8n.io/integrations/community-nodes/installation/" target="_blank">community nodes</a>',
    'for connecting LLMs to various messaging services, databases, and embedding endpoints for RAG.'
  ].join(' ');

  env.docker_run = substitution(docker_run(env), {
    'server_addr': ADDR,
    //'server_llm': as_url(env.server_llm),
    'cache_dir': env.cache_dir,
    'port': PORT
  });
  
  return env.docker_run;
}

Resolver({
  func: n8n,
  name: 'n8n',
  filename: 'n8n.sh',
  server_host: '0.0.0.0:5678',
  //server_llm: '0.0.0.0:9000',
  docker_image: 'n8nio/n8n:stable',
  docker_options: [
    '-it --rm --name=n8n --network=host',
    '-e N8N_LISTEN_ADDRESS=${SERVER_ADDR}',
    '-e N8N_PORT=${PORT}',
    '-e N8N_SECURE_COOKIE=false',
    //'-e OPENAI_API_BASE=${SERVER_LLM}v1 -e OPENAI_API_KEY=foo',
    '-v ${CACHE_DIR}/n8n:/root/node/.n8n',
  ].join(' '),
  docker_run: 'docker run $OPTIONS $IMAGE',
  CUDA_VISIBLE_DEVICES: "none",
  thumbnail: '/portal/dist/images/n8n.webp',
  nav_class: 'theme-light',
  hidden: true,
  tags: ['webui', 'shell'],
  links: {
    website: {
      name: "n8n.io",
      url: "https://n8n.io/"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/n8n-io/n8n"
    }
  }
});