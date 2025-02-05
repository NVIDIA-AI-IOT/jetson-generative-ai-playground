/*
 * Generate 'docker run' templates for launching models & containers
 */
export function docker_run(env) {
  //if( !(key in db.ancestors) || !db.ancestors[key].includes('container') )
  //  return;

  const opt = wrapLines(env.docker_options) + ' \\\n ';

  const image = `${env.docker_image} \\\n   `; 
  const exec = `${env.docker_cmd} \\\n   `;
   
  let args = docker_args(env);

  let cmd = env.docker_run
    .trim()
    .replace('$OPTIONS', '${OPTIONS}')
    .replace('$IMAGE', '${IMAGE}')
    .replace('$COMMAND', '${COMMAND}')
    .replace('$ARGS', '${ARGS}');

  if( !cmd.endsWith('${ARGS}') )
    args += ` \\\n      `;  // line break for user args

  cmd = cmd
    .replace('${OPTIONS}', opt)
    .replace('${IMAGE}', image)
    .replace('${COMMAND}', exec)
    .replace('${ARGS}', args)
    .replace('\\ ', '\\')
    .replace('  \\', ' \\');  

  return cmd;
}

Resolver({
  func: docker_run,
  name: 'Docker Run Cmd',
  tags: ['string', 'shell'],
  value: "docker run $OPTIONS $IMAGE $COMMAND $ARGS",
  help: [
    `Template that builds the 'docker run' command from $OPTIONS $IMAGE $COMMAND $ARGS\n`,
    `You can more deeply customize the container settings by altering these.`,
  ]
});