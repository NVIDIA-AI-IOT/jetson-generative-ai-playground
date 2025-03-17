import { substitution } from "../../nanolab";

/*
 * Generate 'docker run' templates for launching models & containers
 */
export function docker_run(env) {
  const opt = wrapLines(
    nonempty(env.docker_options) ? env.docker_options : docker_options(env)
  ) + ' \\\n ';

  const indent = ' '.repeat(4);
  const line_sep = '\\\n';
  const line_indent = line_sep + indent;
  
  const image = `${env.docker_image} ${line_sep}   `; 
  const exec = nonempty(env.docker_cmd) ? `${env.docker_cmd} ${line_sep}     ` : ``;

  let args = wrapLines({text: docker_args(env), indent: 6});
  let cmd = nonempty(env.docker_run) ? env.docker_run : env.db.index['docker_run'].value;

  cmd = cmd
    .trim()
    .replace('$OPTIONS', '${OPTIONS}')
    .replace('$IMAGE', '${IMAGE}')
    .replace('$COMMAND', '${COMMAND}')
    .replace('$ARGS', '${ARGS}');

  if( !cmd.endsWith('${ARGS}') )
    args += ' ' + line_sep + ' '.repeat(6);  // line break for user args

  cmd = cmd
    .replace('${OPTIONS}', opt)
    .replace('${IMAGE}', image)
    .replace('${COMMAND}', exec)
    .replace('${ARGS}', args);

  console.log('EXEC', exec);
  console.log('ARGS', args);
  
  cmd = substitution(cmd, env).trim();

  cmd = cmd
    .replace('\\ ', '\\')
    .replace('  \\', ' \\');  

  if( cmd.endsWith(line_sep) )
    cmd = cmd.slice(0, -line_sep.length + 1);

  if( cmd.endsWith(' \\') )
    cmd = cmd.slice(0, -2);

  if( cmd.endsWith('\\') )
    cmd = cmd.slice(0, -1);

  return cmd; 
}

Resolver({
  func: docker_run,
  name: 'Docker Run Cmd',
  title: 'Docker Run',
  filename: 'docker-run.sh',
  value: "docker run $OPTIONS $IMAGE $COMMAND $ARGS",
  group: 'shell',
  tags: ['string', 'shell'],
  help: [
    `Template that builds the 'docker run' command from $OPTIONS $IMAGE $COMMAND $ARGS\n`,
    `You can more deeply customize the container settings by altering these.`,
  ],
  text: `Run these terminal commands from the host device or SSH, this one downloading the model and starting an <span class="code">openai.chat.completion</span> server:`,
  footer: `These individual commands are typically meant for exploratory use - see the <span class="code">Compose</span> tab for managed deployments of models and microservices.`
});