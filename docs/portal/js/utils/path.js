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
  console.log('PACKAGE ROOT', import.meta.url, dirname(import.meta.url, 2));
  return dirname(import.meta.url, 2);
}

export function file_extension(x) {
  return x.split('.').pop();
}

export function has_extension(x, ...ext) {
  return ext.includes(file_extension(x));
}

export function make_url(url, domain='hf.co') {
  const x = url.toLowerCase();
  if( !x.startsWith('http') && !x.startsWith('www') ) {
    if( !x.startsWith('huggingface') && !x.startsWith('hf.co') ) {
      url = domain + '/' + url;
    }  
    url = 'https://' + url;
  }
  return url;
}

/* Browser file downloader */
export function save_page({page}) {
  if( is_list(page) )
    return save_pages(page);
  var blob = new Blob([page.value + "\n"], {type: "text/plain;charset=utf-8"});
  saveAs(blob, page.filename);
}

export function save_pages(tabs, key) {
  let pages = {};

  for( const page_group in tabs ) {
    for( const page_key in tabs[page_group] ) {
      pages[page_key] = tabs[page_group][page_key];
    }
  }

  key ??= find_key(pages);
  let zip = new JSZip();
  let folder = zip.folder(key);

  for( const page_key in pages ) {
    const page = pages[page_key];
    console.log('saving page', page);
    folder.file(page.filename, page.value);
  }

  const zip_name = `${key}.zip`;
  zip.generateAsync({type:"blob"})
  .then(function(content) {
      saveAs(content, zip_name); 
  });
}

function find_key(x) {
  for( const z in x ) {
    if( exists(x[z].key) )
      return x[z].key;
  }
}
