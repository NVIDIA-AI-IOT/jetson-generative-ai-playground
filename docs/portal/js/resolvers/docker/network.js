/*
 * Networking options for docker
 */
export function get_server_url(env, default_host='0.0.0.0:9000') {
  if( nonempty(env.server_host) )
    var host = env.server_host;
  else if( exists(env.parent) && exists(env.parent.server_host) )
    var host = env.parent.server_host;
  else
    var host = default_host;

  return new URL('http://' + host);
}

export function get_endpoint_url(env, default_host='0.0.0.0:9000') {
  return `${get_server_url(env, default_host)}/v1/chat/completions`;
}

export function docker_network(env) {
  if( exists(env.docker_options) ) { // skip these defaults if manually specified
    if( env.docker_options.includes('--network') || env.docker_options.includes('-p ') )
      return;
  }

  const server_url = get_server_url(env);

  if( exists(server_url) )
    return `-p ${server_url.port}:${server_url.port}`;

  return '--network host';
}