/*
 * These are docker run CMD entrypoint arguments that follow the container name.
 */
export function docker_args(env) {

  if( env.tags.includes('models') ) // TODO findParent() / findAncestor()
    var model = env;
  else if( exists(env.parent) && env.parent.tags.includes('models') )
    var model = env.parent;
  else 
    return env.docker_args;

  const model_id = model.url ?? model.model_name;
  const model_api = get_model_api(model_id)
  const model_repo = get_model_repo(model_id);
  const server_url = get_server_url(model);

  let args = `  --model ${model_repo} \\
      --quantization ${model.quantization} \\
      --max-batch-size ${model.max_batch_size}`;

  if( is_number(model.max_context_len) ) {
    args += ` \\
      --max-context-len ${model.max_context_len}`;
  }

  if( is_number(model.prefill_chunk) ) {
    args += ` \\
      --prefill-chunk ${model.prefill_chunk}`;
  }

  if( nonempty(model.chat_template) ) {
    args += ` \\
      --chat-template ${model.chat_template}`;
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
