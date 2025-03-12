/*
 * jupyterlab launcher
 */

export function jupyterlab_server(env) {

  let server_host = env.server_host.split(':');
 
  const PORT = server_host.pop();
  const ADDR = server_host.pop();

  env.properties.docker_run.text = [
    `<a href="https://jupyter.org/" target="_blank">JupyterLab</a> is a remote web-based IDE with classic IPython notebook support`,
    `along with Linux terminals, file browsers, scientific plotting, and more.`,
  ].join(' ');

  env.properties.docker_run.footer = [
    `After you start Jupyter, copy the login token that it prints in the terminal, and navigate to`,
    `<a href="http://${ADDR}:${PORT}" target="_blank" class="code">http://${ADDR}:${PORT}</a>`,
    `to set an initial password.<br/><br/>`,
    `The environment is configured to automatically install GPU-accelerated Python wheels from the Jetson AI Lab`,
    `<a href="https://pypi.jetson-ai-lab.dev/jp6/cu126" target="_blank">pip server</a>, which`,
    `gets set like below:<br/><br/>&nbsp;&nbsp;&nbsp`,
    `<span class="code">PIP_INDEX_URL=<a href="https://pypi.jetson-ai-lab.dev/jp6/cu126" target="_blank">https://pypi.jetson-ai-lab.dev/jp6/cu126</a></span>`
  ].join(' ');

  env.docker_run = substitution(docker_run(env), {
    'cache_dir': env.cache_dir,
    'port': PORT
  });
  
  return env.docker_run;
}

Resolver({
  func: jupyterlab_server,
  name: 'JupyterLab',
  filename: 'jupyterlab.sh',
  server_host: '0.0.0.0:8888',
  docker_image: 'dustynv/jupyterlab:r36.4.0',
  docker_options: [
    '-it --rm --name=jupyterlab --network=host',
    '-e JUPYTER_PORT=${PORT}',
    '-e JUPYTER_LOGS=/root/.cache/jupyter/jupyter.log',
    //'-e OPENAI_API_BASE=${SERVER_LLM}v1 -e OPENAI_API_KEY=foo',
    '-v ${CACHE_DIR}/jupyter:/root/.cache/jupyter',
    '-v ${CACHE_DIR}/jupyter/ipynb_checkpoints:/root/.ipynb_checkpoints',
    '-v ${CACHE_DIR}/jupyter/ipython:/root/.ipython',
    '-v ${CACHE_DIR}/jupyter/jupyter:/root/.jupyter'
  ].join(' '),
  docker_run: 'docker run $OPTIONS $IMAGE',
  thumbnail: '/portal/dist/images/jupyterlab.webp',
  nav_class: 'theme-light',
  hidden: true,
  tags: ['webui', 'shell'],
  links: {
    website: {
      name: "Project Jupyter",
      url: "https://jupyter.org/"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/jupyterlab"
    },
    docs: {
      name: "Docs",
      url: "https://jupyterlab.readthedocs.io/en/latest/"
    }
  }
});