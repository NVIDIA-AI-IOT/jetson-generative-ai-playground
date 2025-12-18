/*
 * Parse model names from path (normally this should just use the model key)
 */
import { exists } from '../nanolab.js';

export function get_model_name(model) {
  if( !exists(model) )
    return model;

  model = get_model_repo(model);

  if( model.toLowerCase().includes('.gguf') ) {
    const split = model.split('/');
    model = split[split.length-1];
  }

  return model;
}

export function get_model_repo(model) {
  if( !exists(model) )
    return model;

  model = model.replace('hf.co/', '');
  model = model.replace('ollama.com/library/', '');

  return model;
}

export function get_model_cache(env) {
  var model = env.url ?? env.model_name;
  const api = get_model_api(model);

  if( api == 'mlc' )
    var cache = 'mlc_llm';
  else if( api == 'llama.cpp' )
    var cache = 'llama_cpp';
  else if( api == 'ollama' )
    var cache = 'ollama';

  var repo = get_model_repo(model);
  var split = repo.split('/');

  if( split.length >= 3 && split[split.length-1].toLowerCase().includes('.gguf') )
    repo = split.slice(0, split.length-1).join('/');

  return `/root/.cache/${cache}/${repo}`;
}

export function get_model_api(model) {
  if( !is_string(model) )
    return null;
  model = model.toLowerCase();

  if( model.includes('mlc') )
    return 'mlc';
  else if( model.includes('.gguf') )
    return 'llama.cpp';
  else if( model.includes('ollama') )
    return 'ollama';
  else
    console.warn(`Unsupported / unrecognized model ${model}`);
}
