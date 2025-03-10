/*
 * portainer launcher
 */

export function portainer(env) {

  let server_host = env.server_host.split(':');
 
  const PORT = server_host.pop();
  const ADDR = server_host.pop();

  env.properties.docker_run.text = [
    `<a href="https://www.portainer.io/" target="_blank">Portainer</a> is web-based management platform for deploying containers,`,
    `orchestrating microservices, and control of distributed edge devices.`,
  ].join(' ');

  env.properties.docker_run.footer = [
    `After you start Portainer, navigate to`,
    `<a href="http://${ADDR}:${PORT}" target="_blank" class="code">http://${ADDR}:${PORT}</a>`,
    `to establish a login and enter the management console.`,
    `The docker command above mounts the system's socket for the docker daemon, so it can launch containers from within.`
  ].join(' ');

  env.docker_run = substitution(docker_run(env), {
    'cache_dir': env.cache_dir,
    'port': PORT
  });
  
  return env.docker_run;
}

// map ports 9000 and 9443
Resolver({
  func: portainer,
  name: 'Portainer',
  filename: 'portainer.sh',
  server_host: '0.0.0.0:9100',
  docker_image: 'portainer/portainer-ce:lts',
  docker_options: [
    '-it --rm --name=portainer',
    '-p ${PORT}:9000 -p 9443:9443',
    '-v /var/run/docker.sock:/var/run/docker.sock',
    '-v ${CACHE_DIR}/portainer:/data',
    '-v ${CACHE_DIR}:/root/.cache'
  ].join(' '),
  docker_run: 'docker run $OPTIONS $IMAGE',
  thumbnail: '/portal/dist/images/portainer.webp',
  nav_class: 'theme-light',
  nav_style: 'background-size: 150%;',
  hidden: true,
  tags: ['webui', 'shell'],
  links: {
    website: {
      name: "Portainer.io",
      url: "https://www.portainer.io/"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/portainer/portainer"
    },
    docs: {
      name: "Docs",
      url: "https://docs.portainer.io/"
    }
  }
});