/*
 * aim launcher
 */

export function aim_server(env) {

  let server_host = env.server_host.split(':');
  let web_host = env.web_host.split(':');

  const SERVER_PORT = server_host.pop();
  const SERVER_ADDR = server_host.pop();

  const WEB_PORT = web_host.pop();
  const WEB_ADDR = web_host.pop();

  env.properties.docker_run.text = [
    `Collect, monitor, and analyze multimodal ML/AI datasets and metrics with <a href="https://github.com/aimhubio" target="_blank">Aim</a>,<br/>`,
    `an open-source experiment tracker for visualization and model development.`,
  ].join(' ');

  env.properties.docker_run.footer = `
    This starts a centralized <a href="https://aimstack.readthedocs.io/en/latest/using/remote_tracking.html" target="_blank">remote server</a>
    that can be reached on your LAN from:<br/><br/>
    &nbsp;&nbsp;&nbsp;&nbsp; <b>Browser</b> &nbsp;
    <a href="http://${WEB_ADDR}:${WEB_PORT}" target="_blank" class="code">http://${WEB_ADDR}:${WEB_PORT}</a>
    &nbsp;&nbsp;&nbsp;&nbsp; <b>Python</b> &nbsp;
    <a href="http://${SERVER_ADDR}:${SERVER_PORT}" target="_blank" class="code">http://${SERVER_ADDR}:${SERVER_PORT}</a>
    <br/><br/>
    The data is logged from <a href="https://aimstack.readthedocs.io/en/latest/using/remote_tracking.html#client-side-setup" target="_blank">Python clients</a>
    during jobs and is stored locally.  See these <a href="https://aimstack.readthedocs.io/en/latest/examples/images_explorer_gan.html" target="_blank">examples</a>.
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
  func: aim_server,
  name: 'Aim',
  filename: 'aim.sh',
  web_host: '0.0.0.0:9200',
  server_host: '0.0.0.0:53800',
  docker_image: 'dustynv/aim:3.27.0-r36.4.0',
  docker_options: [
    '-it --rm --name=aim',
    '--entrypoint /opt/aim/start-servers.sh',
    '--volume ${CACHE_DIR}/aim:/repo',
    '--env WEB_HOST=${WEB_ADDR}',
    '--env WEB_PORT=${WEB_PORT}',
    '--env SERVER_HOST=${SERVER_ADDR}',
    '--env SERVER_PORT=${SERVER_PORT}',
    '--publish ${WEB_PORT}:${WEB_PORT}',
    '--publish ${SERVER_PORT}:${SERVER_PORT}',
  ].join(' '),
  docker_run: [
    'docker run $OPTIONS $IMAGE'
  ].join(' '),
  thumbnail: '/portal/dist/images/aim.webp',
  nav_style: 'background-size: 125%;',
  nav_class: 'theme-light',
  hidden: true,
  tags: ['webui', 'shell'],
  links: {
    website: {
      name: "aimstack.io",
      url: "https://aimstack.io/"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/aimhubio/aim"
    },
    docs: {
      name: "Docs",
      url: "https://aimstack.readthedocs.io/en/latest"
    }
  }
});