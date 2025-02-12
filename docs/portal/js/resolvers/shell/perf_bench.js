/*
 * Generate benchmarking
 */

export function llm_perf_bench(env) {

  if( env.parent ) {
    env.server_host = env.parent.server_host;
  }

  /*const perf_container = 'dustynv/mlc:r36.4.0';
  const server_url = get_server_url(env, 'http://0.0.0.0:9000');
  const newline = ' \\\n ';

  let perf_cmd = [
    `docker run ${wrapLines(docker_options(env, false))} --network=host`,
    ` -v /var/run/docker.sock:/var/run/docker.sock`,
    ` ${perf_container} sudonim bench stop`,
    `  --host ${server_url.hostname ?? '0.0.0.0'}`,
    `  --port ${server_url.port ?? 9000}`,
    `  --model ${env.url}`
  ];

  if( 'tokenizer' in env )
    perf_cmd.push(` --tokenizer ${env.tokenizer}`);

  return perf_cmd.join(newline);*/

  return docker_run(env);
}

Resolvers({perf_bench: {
  func: llm_perf_bench,
  title: 'Performance Benchmark',
  filename: 'perf-bench.sh',
  hidden: true,
  docker_image: "dustynv/mlc:r36.4.0",
  docker_options: "-it --rm --network=host -v /var/run/docker.sock:/var/run/docker.sock",
  docker_cmd: "sudonim bench stop",
  group: ['shell'],
  refs: ['llm'],
  tags: ['docker_profile', 'shell', 'container'],
  text: `Profile the decode generation rate (tokens/sec) and context prefill latency:`,
  footer: [
    `This benchmarks through the <span class="monospace">chat.completion</span> endpoint,`, 
    `so they need the server to be running. The results are saved under`,
    `<span class="monospace">$CACHE/benchmarks</span>`
  ].join(' ')
}});