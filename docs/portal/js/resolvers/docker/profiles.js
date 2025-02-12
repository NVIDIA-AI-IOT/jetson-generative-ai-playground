export function docker_profile(env, depends) {

  const profile_name = env.key.replace('_', '-');
  const profile_cmd = env.value;

  if( is_empty(profile_cmd) ) {
    console.warn(`Missing resolved ${env.key}.value for docker_profile`);
    return;
  }

  /*if( nonempty(env, profile_key) )
    profile_cmd = env[profile_key];
  else {
    if( exists(env.properties[profile_key].func) )
      profile_cmd = env.properties[profile_key].func(env);
  }*/

  let comp = composerize(profile_cmd, null, 'latest', 2);

  for( let n=0; n < 2; n++ )
    comp = comp.substring(comp.indexOf("\n") + 1);

  const comp_pre = `  ${profile_name}:\n    profiles:\n      - ${profile_name}\n` +
    `    depends_on:\n      ${depends}:\n        condition: service_healthy\n`;

  return docker_service_name(comp, profile_name);
}

export function docker_profiles(env, compose) {

  let root_env = exists(env.parent) ? env.parent : env;

  for( const ref_key in root_env['references'] ) {
    const ref = root_env.references[ref_key];

    console.log(`${root_env.key}.references.${ref_key}.tags =`, ref.tags, 'root_env', root_env);

    if( !ref.tags.includes('docker_profile') )
      continue;

    let profile_cmd = docker_profile(ref, env.key);

    console.log(`${env.key}.references.${ref_key} =`, profile_cmd);

    if( !exists(profile_cmd) )
      continue;

    compose += '\n' + profile_cmd;
  }

  return compose;
}

export function docker_service_name(compose, name) {
  for( const api of ['mlc', 'llama_cpp', 'tensorrt_llm', 'vllm'] )
    compose = compose.replace(`  ${api}:`, `  ${name}:`);
  return compose;
}