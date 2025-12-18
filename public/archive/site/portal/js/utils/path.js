/*
 * Path functions for resolving relative paths.
 */
export function abspath(x) {
  if( x.charAt(0) != '.' )
    return x;
  return package_root() + x.slice(1);
}

export function dirname(x, levels=1) {
  for( let i=levels; i>0; i-- ) {
    const l = x.lastIndexOf('/');
    if( l < 0 )
      return null;
    x = x.slice(0,l);
  }
  return x;
}

export function package_root() {
  return dirname(import.meta.url, 3);
}

export function file_extension(x) {
  return x.split('.').pop();
}

export function has_extension(x, ...ext) {
  return ext.includes(file_extension(x));
}
