export function docker_profile(env, profile_key, depends) {

  const profile_name = profile_key.replace('_', '-');
  let profile_cmd = '';

  if( nonempty(env, profile_key) )
    profile_cmd = env[profile_key];
  else {
    if( exists(env.properties[profile_key].func) )
      profile_cmd = env.properties[profile_key].func(env);
  }

  //console.log(`PROFILE CMD`, profile_cmd);

  let comp = composerize(profile_cmd, null, 'latest', 2);

  for( let n=0; n < 2; n++ )
    comp = comp.substring(comp.indexOf("\n") + 1);

  const comp_pre = `  ${profile_name}:\n    profiles:\n      - ${profile_name}\n` +
    `    depends_on:\n      ${depends}:\n        condition: service_healthy\n`;

  return docker_service_name(comp, profile_name);
}

export function docker_profiles(env, compose) {

  let profile_keys = [];

  for( const field_key in env.properties ) {
    console.log(`${field_key} ancestors`, env.db.ancestors[field_key]);

    if( env.db.ancestors[field_key].includes('docker_profile') )
      profile_keys.push(field_key);
  }

  for( const profile_key of profile_keys ) {
    let profile_cmd = docker_profile(env, profile_key, env.key);

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