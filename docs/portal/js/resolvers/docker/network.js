/*
 * Networking options for docker
 */
export function get_server_url(env) {
  if( exists(env.server_host) )
    return new URL('http://' + env.server_host);
}

export function docker_network(env) {
  const server_url = get_server_url(env);

  if( exists(server_url) )
    return `-p ${server_url.port}:${server_url.port} `;

  return '--network host ';
}