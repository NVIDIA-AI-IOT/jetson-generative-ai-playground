/*
 * These are docker options that preceed the container image name.
 */
export function docker_options(env) {
  let opt = [];
  
  if( nonempty(env.docker_options) )
    opt.push(env.docker_options);

  if( nonempty(env.CUDA_VISIBLE_DEVICES) )
    opt.push(`--gpus ${env.CUDA_VISIBLE_DEVICES}`);

  opt.push(docker_network(env));

  if( !exists(env.auto_update) || env.auto_update != 'off' ) {
    opt.push('--pull always');
    opt.push('-e DOCKER_PULL=always');
  }

  if( exists(env.hf_token) ) {
    const tr = env.hf_token.trim();
    if( tr.length > 0 )
      opt.push(`-e HF_TOKEN=${tr}`);
  }

  if( exists(env.cache_dir) ) {
    const tr = env.cache_dir.trim();
    if( tr.length > 0 ) {
      var cache_dir = `-v ${tr}:/root/.cache `;
      var hf_hub_dir = `-e HF_HUB_CACHE=/root/.cache/huggingface `;
      opt.push(hf_hub_dir + cache_dir);
    }
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
