/*
 * Generate 'docker run' templates for launching models & containers
 */
export function docker_compose(env, service_name='llm-server') {

  //if( !env.db.ancestors[env.key].includes('container') )
  //  return;

  var root = exists(env.parent) ? env.parent : env;
  var compose = composerize(root.docker_run ?? docker_run(root), null, 'latest', 2); // this gets imported globally by nanolab.js
  compose = compose.substring(compose.indexOf("\n") + 1); // first line from composerize is an unwanted name

  const server_url = get_server_url(root, 'http://0.0.0.0:9000');

  /*compose = `# Save as compose.yml and run 'docker compose up'\n` +
    `# Benchmark:  docker compose --profile perf-bench up\n` + 
    `# Open WebUI: docker compose --profile open-webui up\n` + 
    (model_api === 'llama.cpp' ? '# With llama.cpp backend, you may encounter request ack/response errors (these can safely be ignored during the benchmark)\n' : '') 
    + compose;*/
  
  compose = docker_service_name(compose, service_name);

  compose += `\n    healthcheck:`;
  compose += `\n      test: ["CMD", "curl", "-f", "http://${server_url.hostname}:${server_url.port}/v1/models"]`;
  compose += `\n      interval: 20s`;
  compose += `\n      timeout: 60s`;
  compose += `\n      retries: 45`;    
  compose += `\n      start_period: 15s`; 

  const profiles = docker_profiles(root, service_name);

  let profile_docs = [];
  let profile_text = '';

  for( const profile in profiles ) {
    profile_docs.push(`* docker compose --profile ${profile} up`)
    compose += '\n' + profiles[profile];
  }

  if( nonempty(profile_docs) ) {
    profile_text = substitution(env.profile_text, {
      DOCKER_PROFILE_LIST: profile_docs.join('<br/>')
    });
  }

  env.text = substitution(env.text, {
    DOCKER_PROFILE_DOCS: profile_text
  });

  return compose;
}

Resolver({
  key: 'compose',
  name: 'Compose',
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
  refs: ['llm', 'webui'],
  text: [
    'Use this <a href="https://docs.docker.com/reference/compose-file/services/" ' +
    'title="To install docker compose on your Jetson use:\n ' +
    'sudo apt install docker-compose-v2" target="_blank" class="code">compose.yml</a> ' +
    'to manage microservice deployments and workflows.<br/>' +
    '${DOCKER_PROFILE_DOCS}' +
    'By default,<span class="code"> docker compose up </span>will prepare the model and start the server. <br/>' +
    'To stop the containers, run<span class="code"> docker compose down --remove-orphans</span>'
  ].join(' '),
  profile_text: [
    'These embedded docker profiles launch the example scripts & tools:<br/>',
    '<div class="code" style="margin: 5px 0px 5px 25px">${DOCKER_PROFILE_LIST}<br/></div>'
  ].join('')
});