/*
 * Generation parameters
 */
export function GenerationConfig({env, quote='', assign='=', indent=2}) {
  env.temperature ??= env.key.includes('deepseek') ? 0.6 : 0.2;
  env.top_p ??= env.key.includes('deepseek') ? 0.95 : 0.7;

  const params = {
    'temperature': 'temperature',
    'top_p': 'top_p',
    'max_context_len': 'max_tokens'
  }

  let txt = '';

  for( const param_key in params ) {
    if( !is_value(env[param_key]) )
      continue
    txt += `\n${' '.repeat(indent)}${quote}${params[param_key]}${quote}${assign}${env[param_key]},`
  }

  return txt;
}