/*
 * Flowise launcher
 */

export function flowise(env) {
  const PORT = env.server_host.split(':').pop();

  env.properties.docker_run.text = [
    `Start <a href="https://github.com/FlowiseAI" target="_blank">Flowise</a> server to use the graphical agent builder and create chat flows.`,
    `Then navigate your browser to <a href="http://0.0.0.0:${PORT}" target="_blank" class="code">http://0.0.0.0:${PORT}</a> (or your Jetson's IP)`
  ].join('<br/>');

  env.properties.docker_run.footer = [
    'To use local models, first start one of the <a href="models.html?view=llm" target="_blank">LLM Servers</a>,',
    'then in Flowise select the <span class="code">ChatOpenAI Custom</span> model type, and enter any value for the <span class="code">Model Name</span>.<br/><br/>',
    'The default login is defined in the docker environment with the following:</br>',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code">* username: nvidia</span></br>',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code">* password: nvidia</span></br>'
  ].join(' ');

  env.docker_run = substitution(docker_run(env), {
    'server_llm': as_url(env.server_llm),
    'cache_dir': env.cache_dir,
    'port': PORT
  });
  
  return env.docker_run;
}

Resolver({
  func: flowise,
  name: 'Flowise',
  filename: 'flowise.sh',
  server_host: '0.0.0.0:3000',
  server_llm: '0.0.0.0:9000',
  docker_image: 'flowiseai/flowise:latest',
  docker_options: [
    '-it --rm --name=flowise --network=host -e PORT=${PORT}',
    '-e FLOWISE_USERNAME=nvidia -e FLOWISE_PASSWORD=nvidia',
    '-e OPENAI_API_BASE=${SERVER_LLM}v1 -e OPENAI_API_KEY=foo',
    '-v ${CACHE_DIR}/flowise:/root/.flowise',
  ].join(' '),
  docker_run: 'docker run $OPTIONS $IMAGE',
  CUDA_VISIBLE_DEVICES: "none",
  thumbnail: '/portal/dist/images/flowise.webp',
  hidden: true,
  tags: ['webui', 'shell'],
  links: {
    website: {
      name: "FlowiseAI.com",
      url: "https://flowiseai.com/"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/FlowiseAI"
    }
  }
});