/*
 * Networking options for docker
 */
export function get_server_url(env, default_host='0.0.0.0:9000') {
  return new URL('http://' + (env.server_host ?? default_host));
}

export function get_endpoint_url(env, default_host='0.0.0.0:9000') {
  return `http://${env.server_host ?? get_server_url(env, default_host)}/v1/chat/completions`;
}

export function docker_network(env) {
  const server_url = get_server_url(env);

  if( exists(server_url) )
    return `-p ${server_url.port}:${server_url.port}`;

  return '--network host';
}