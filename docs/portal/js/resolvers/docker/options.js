/*
 * These are docker options that preceed the container image name.
 */
export function docker_options(env) {
  let opt = [];
  
  if( nonempty(env.docker_options) )
    opt.push(env.docker_options);

  if( nonempty(env.CUDA_VISIBLE_DEVICES) )
    opt.push('--gpus ${env.CUDA_VISIBLE_DEVICES}');

  if( nonempty(env.server_host) ) {
    var server_url = new URL('http://' + env.server_host);
    opt.push('-p ${server_url.port}:${server_url.port}');
  }
  else {
    opt.push('--network host');
  }

  if( !exists(env.auto_update) || env.auto_update != 'off' ) {
    opt.push('--pull always');
    opt.push('-e DOCKER_PULL=always');
  }

  return opt.join(' ');
}

Resolver({
  func: docker_options,
  tags: 'string',
  value: '-it --rm',
  help: [
    `These are extra prefix flags that get passed to 'docker run' when starting the container.`,  
    `These are the arguments that come before the container image name, for example --volume ~/workspace:/workspace --env WORKSPACE=/workspace"`
  ]
});
