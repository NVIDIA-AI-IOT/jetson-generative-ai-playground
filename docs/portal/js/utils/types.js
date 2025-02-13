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

export function dict_keys(x) {
  return is_dict(x) ? Object.keys(x) : [];
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

export function toTitleCase(x) {
  return x.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

export function substitution(text, map) {
  for( const k in map ) {
    text = text.replace('$' + k.toUpperCase(), map[k]);
    text = text.replace('${' + k.toUpperCase() + '}', map[k]);
  }
  return text;
}