/*
 * Assorted typing functions and conversions.
 */
export function exists(x) {
  return (x !== null && x !== undefined);
}

export function len(x) {
  if( !exists(x) )
    return 0;
  if( is_list(x) || is_string(x) )
    return x.length;
  else
    return Object.keys(x).length;
}

export function nonempty(x, key) {
  if( exists(key) ) { // key is optional
    if( key in x )
      x = key;
    else
      return false;
  }
  if( !exists(x) )
    return false;
  else if( is_number(x) || is_bool(x) )
    return true;
  else
    return len(x) > 0;
}

export function is_empty(x, key) {
  return !nonempty(x, key);
}

export function is_string(x) {
  if( typeof x === 'string' || x instanceof String )
    return true;
  else
    return false;
}

export function is_bool(x) {
  return typeof x === 'boolean';
}

export function is_number(x) {
  return typeof x === 'number';
}

export function is_function(x) {
  return (x instanceof Function);
}

export function is_dict(x) {
  return exists(x) && (x.constructor == Object);
}

export function is_list(x) {
  return Array.isArray(x);
}

export function as_list(x) {
  if( !exists(x) )
    return [] 
  return x;
}

export function is_value(x) {
  return exists(x) && (is_string(x) || is_number(x) || is_bool(x));
}

export function as_element(x) {
  if( !exists(x) )
    return x;

  if( is_string(x) )
    return document.querySelector(x); /*document.getElementById(x);*/

  return x;
}

export function is_promise(x) {
  return exists(x) && (
    (x instanceof Promise) ||
    (x.then && typeof x.then === 'function')
  );
}

export function is_url(x) {
  return nonempty(x) && (x.startsWith('http') || x.startsWith('www'));
}

export function make_url(url, domain='hf.co') {
  const x = url.toLowerCase();
  if( !is_url(x) ) {
    if( !x.includes('.co') ) {
      if( !x.startsWith('huggingface') && !x.startsWith('hf.co') ) {
        url = domain + '/' + url;
      }  
    }
    url = 'https://' + url;
  }
  return url;
}

export function dict_keys(x) {
  return is_dict(x) ? Object.keys(x) : [];
}

export function includes_any(x, y) {
  for( const val of y ) {
    if( x.includes(val) )
      return true;
  }
  return false;
}

export function toTitleCase(x) {
  return x.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

/*
 * Merge and deduplicate two lists (https://stackoverflow.com/a/1584377)
 *
 *   const merged = merge_lists(['a', 'b', 'c'], ['c', 'x', 'd']);
 * 
 *   merge_lists([{id: 1}, {id: 2}], [{id: 2}, {id: 3}], (a, b) => a.id === b.id);
 */
export function merge_lists(a, b, predicate = (a, b) => a === b) {
  const c = [...a]; // copy to avoid side effects
  // add all items from B to copy C if they're not already present
  b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
  return c;
}

/* 
 * Recursively deep clone an object (sharing unserializable objects like functions) 
 * This is used to work around errors you get errors using structuredClone()
 */
export function deep_copy(obj) {
  /*try {
    return structuredClone(obj);
  } catch (error) {*/
    //let clone = obj.getClass().getDeclaredConstructor().newInstance();

  if( is_list(obj) )
    var clone = [];
  else if( is_dict(obj) )
    var clone = {};
  else
    return obj;  
  
  for( const k in obj ) {
    if( is_string(k) && k === 'db' )
      clone[k] = obj[k];
    else
      clone[k] = deep_copy(obj[k]);  
  }

  return clone;
}

/*
 * Perform variable substitution on references to environment variables (of the form $XYZ or ${XYZ})
 */
export function substitution(text, env) {

  if( is_empty(text) )
    return '';

  if( exists(env.tags) ) {
    if( exists(env.server_host) ) {
      const server_url = get_server_url(env);
      env.server_addr ??= server_url.hostname;
      env.server_port ??= server_url.port;
    }

    if( exists(env.url) && env.tags.includes('models') ) {
      env.model ??= get_model_repo(env.url ?? env.model_name);
    }
  }

  for( const k in env ) {
    const k1 = '$' + k.toUpperCase();
    const k2 = '${' + k.toUpperCase() + '}';

    let val = env[k];

    if( is_dict(val) ) {
      if( nonempty(val.value) )
        val = val.value;
      else if( exists(val.placeholder) )
        val = val.placeholder;
    }

    //var re = new RegExp(k1, 'g');
    //var rp = new RegExp(k2, 'g');

    //text = text.replace(re, map[k]);
    //text = text.replace(rp, map[k]);

    text = text.split(k1).join(val);
    text = text.split(k2).join(val);
  }

  return text;
}