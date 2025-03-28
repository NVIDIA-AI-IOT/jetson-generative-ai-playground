/*
 * These are docker run CMD entrypoint arguments that follow the container name.
 */
export function docker_args(env) {

  if( env.tags.includes('models') ) // TODO findParent() / findAncestor()
    var model = env;
  else if( exists(env.parent) && env.parent.tags.includes('models') )
    var model = env.parent;
  else 
    return env.docker_args ?? '';

  const model_id = model.url ?? model.model_name;
  const model_api = get_model_api(model_id)
  const model_repo = get_model_repo(model_id);
  const server_url = get_server_url(model);

  let args = [];
  
  if( env.tags.includes('sudonim') ) {
    args.push(
      `--model ${model_repo}`,
      `--quantization ${model.quantization}`,
      `--max-batch-size ${model.max_batch_size}`
    );

    if( is_value(model.max_context_len) ) {
      args.push(`--max-context-len ${model.max_context_len}`);
    }

    if( is_value(model.prefill_chunk) ) {
      args.push(`--prefill-chunk ${model.prefill_chunk}`);
    }

    if( nonempty(model.chat_template) ) {
      args.push(`--chat-template ${model.chat_template}`);
    }

    if( exists(server_url) ) {
      args.push(
        `--host ${server_url.hostname}`,
        `--port ${server_url.port}`
      );
    }
  }

  if( exists(env.docker_args) ) {
    args.push(env.docker_args);
  }

  let sub = {
    'SERVER_ADDR': server_url.hostname,
    'SERVER_PORT': server_url.port,
    'MAX_CONTEXT_LEN': is_value(model.max_context_len) ? model.max_context_len : 4096,
    'MAX_BATCH_SIZE': is_value(model.max_batch_size) ? model.max_batch_size : 1,
    'MODEL': model_repo,
  };

  if( env.quantization === "fp16" )
    sub['VLLM_QUANTIZATION'] = '';
  else if( env.quantization === "fp8" )
    sub['VLLM_QUANTIZATION'] = '--quantization=fp8'
  else if( env.quantization === "bnb4" )
    sub['VLLM_QUANTIZATION'] = '--quantization=bitsandbytes --load-format=bitsandbytes'

  if( is_value(model.max_batch_size) ) {
    sub['MAX_BATCH_SIZE'] = model.max_batch_size;
  }

  if( is_value(model.max_context_len) ) {
    sub['MAX_CONTEXT_LEN'] = model.max_context_len;
  }

  return substitution(args.join(' '), sub);
}
