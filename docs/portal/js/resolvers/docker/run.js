/*
 * Generate 'docker run' templates for launching models & containers
 */
export function docker_run(env) {
  //if( !(key in db.ancestors) || !db.ancestors[key].includes('container') )
  //  return;

  const opt = wrapLines(docker_options(env)) + ' \\\n ';

  const image = `${env.docker_image} \\\n   `; 
  const args = docker_args(env);

  let cmd = env.docker_run
    .trim()
    .replace('$OPTIONS', '${OPTIONS}')
    .replace('$IMAGE', '${IMAGE}')
    .replace('$ARGS', '${ARGS}');

  if( !cmd.endsWith('${ARGS}') )
    args += ` \\\n      `;  // line break for user args

  cmd = `docker run ${cmd}`
    .replace('${OPTIONS}', opt)
    .replace('${IMAGE}', image)
    .replace('${ARGS}', args)
    .replace('\\ ', '\\')
    .replace('  \\', ' \\');  

  return cmd;
}

Resolver({
  func: docker_run,
  name: 'Docker Run Cmd',
  tags: 'string',
  value: "$OPTIONS $IMAGE $ARGS",
  help: [
    `Template that builds the 'docker run' command from $OPTIONS $IMAGE $ARGS\n`,
    `You can change the startup command or arguments with this.`,
  ]
});