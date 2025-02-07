/*
 * Generate benchmarking
 */

export function llm_perf_bench(env) {

  const perf_container = 'dustynv/mlc:r36.4.0';
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

  return perf_cmd.join(newline);
}

Resolvers({perf_bench: {
  func: llm_perf_bench,
  title: 'Benchmarks',
  filename: 'perf-bench.sh',
  hidden: true,
  tags: ['docker_profile', 'shell'],
  text: `Profile decode generation (tokens/sec) and context prefill latency (ms)`,
  footer: [
    `This benchmarks through the <span class="monospace">chat.completion</span> endpoint,`, 
    `so they need the server to be running. The results are saved under`,
    `<span class="monospace">$CACHE/benchmarks</span>`
  ].join(' ')
}});