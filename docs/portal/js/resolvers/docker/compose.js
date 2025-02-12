/*
 * Generate 'docker run' templates for launching models & containers
 */
export function docker_compose(env, service_name='llm-server') {

  //if( !env.db.ancestors[env.key].includes('container') )
  //  return;
  
  if( exists(env.parent) )
    env = env.parent;

  var compose = composerize(env.docker_run ?? docker_run(env), null, 'latest', 2); // this gets imported globally by nanolab.js
  compose = compose.substring(compose.indexOf("\n") + 1); // first line from composerize is an unwanted name

  const server_url = get_server_url(env, 'http://0.0.0.0:9000');

  /*compose = `# Save as compose.yml and run 'docker compose up'\n` +
    `# Benchmark:  docker compose --profile perf-bench up\n` + 
    `# Open WebUI: docker compose --profile open-webui up\n` + 
    (model_api === 'llama.cpp' ? '# With llama.cpp backend, you may encounter request ack/response errors (these can safely be ignored during the benchmark)\n' : '') 
    + compose;*/
  
  for( const api of ['mlc', 'llama_cpp', 'tensorrt_llm', 'vllm'] )
    compose = compose.replace(`  ${api}:`, `  ${service_name}:`);

  compose += `\n    healthcheck:`;
  compose += `\n      test: ["CMD", "curl", "-f", "http://${server_url.hostname}:${server_url.port}/v1/models"]`;
  compose += `\n      interval: 20s`;
  compose += `\n      timeout: 60s`;
  compose += `\n      retries: 45`;    
  compose += `\n      start_period: 15s`; 

  return docker_profiles(env, compose);
}

Resolver({
  key: 'compose',
  tags: ['code', 'resource'],
  language: 'yaml',
  hidden: true
});

Resolver({
  func: docker_compose,
  name: 'Docker Compose',
  filename: 'compose.yml',
  language: 'yaml',
  hidden: true,
  group: "compose",
  tags: ['compose'],
  refs: ['llm'],
  text: [
    `Use this <a href="https://docs.docker.com/reference/compose-file/services/" ` +
    `title="To install docker compose on your Jetson use:\n ` +
    `sudo apt install docker-compose-v2" target="_blank" class="monospace">compose.yml</a> ` +
    `to manage microservice deployments and workflows.<br/>` +
    `These embedded docker profiles launch the example scripts & tools:<br/>`,
    `<div class="monospace" style="margin: 5px 0px 5px 25px">* docker compose --profile perf-client up<br/>`,
    `* docker compose --profile open-webui up </div>` +
    `By default,<span class="monospace"> docker compose up </span>will prepare the model and start the server. <br/>` +
    `To stop the containers, run<span class="monospace"> docker compose down --remove-orphans</span>`
  ].join(' ')
});