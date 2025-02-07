/*
 * Generate 'docker run' templates for launching models & containers
 */
export function docker_run(env) {
  
  const opt = wrapLines(
    nonempty(env.docker_options) ? env.docker_options : docker_options(env)
  ) + ' \\\n ';

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

  return cmd; //`# ${get_endpoint_url(env)}\n` 
}

Resolver({
  func: docker_run,
  name: 'Docker Run Cmd',
  title: 'Docker Run',
  filename: 'docker-run.sh',
  value: "docker run $OPTIONS $IMAGE $COMMAND $ARGS",
  tags: ['string', 'shell'],
  help: [
    `Template that builds the 'docker run' command from $OPTIONS $IMAGE $COMMAND $ARGS\n`,
    `You can more deeply customize the container settings by altering these.`,
  ],
  text: `Run these terminal commands from the host device or over SSH, this one downloading the model and starting an <span class="monospace">openai.chat.completion</span> server.`
});