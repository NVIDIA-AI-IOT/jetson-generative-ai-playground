/*
 * These are docker run CMD entrypoint arguments that follow the container name.
 */
export function docker_args(env) {

  const model_api = get_model_api(env.url ?? env.model_name)
  const model_repo = get_model_repo(env.url ?? env.model_name);
  const server_url = get_server_url(env);

  let args = ` \\
      --model ${model_repo} \\
      --quantization ${env.quantization} \\
      --max-batch-size ${env.max_batch_size}`;

  if( exists(env.max_context_len) ) {
    args += ` \\
      --max-context-len ${env.max_context_len}`;
  }

  if( exists(env.prefill_chunk) ) {
    args += ` \\
      --prefill-chunk ${env.prefill_chunk}`;
  }

  if( nonempty(env.chat_template) ) {
    args += ` \\
      --chat-template ${env.chat_template}`;
  }

  if( exists(server_url) ) {
    args += ` \\
      --host ${server_url.hostname} \\
      --port ${server_url.port}`;
  }

  if( exists(env.docker_args) ) {
    args += ` \\
        ${env.docker_args}`;
  }

  return args;
}
