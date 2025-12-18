/*
 * Browser file archiver/downloader
 */

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

export function save_all({db, keys}) {

  if( !exists(keys) ) {
    keys = [];
    for( const key in db.ancestors ) {
      const o = db.ancestors[key];
      if( o.includes('container') && o.includes('models') )
        keys.push(key);
    }
  }

  const root_name = keys.length > 1 ? 'jetson-ai-lab' : keys[0];
  const zip_name = `${root_name}.zip`;

  let zip = new JSZip();
  let root = zip.folder(root_name);
  let folders = {};

  const families = db.children['llm'];
  
  for( const family_name of families ) {
    let family_dir = root.folder(family_name);

    folders[family_name] = {
      dir: family_dir,
      subdirs: {}
    };

    for( const model_name of db.children[family_name] ) {
      folders[family_name].subdirs[model_name] = {
        dir: family_dir.folder(model_name),
        subdirs: {}
      };
    }
  }

  for( const key of keys ) {
    const env = db.resolve(key);

    if( !exists(env) )
      continue;

    const x = db.flat[key];

    function find_family() {
      for( const family_name of families ) {
        if( db.ancestors[key].includes(family_name) ) {
          for( const model_name in folders[family_name].subdirs ) {
            if( db.ancestors[key].includes(model_name) ) {
              return [family_name, model_name];
            }
          }
        }
      }
    }

    const family_names = find_family();
    const group = family_names[0];
    const model_name = family_names[1];
    console.log('GROUP', group, 'MODEL', model_name);
    if( exists(group) ) {
      if( exists(model_name) )
        var key_folder = folders[group].subdirs[model_name].dir;
      else
        var key_folder = folders[group].dir;
    }
    else {
      var key_folder = root;
    }

    key_folder = key_folder.folder(key);

    //const key_folder = exists(group) ? folders[group].folder(key) : root.folder(key);

    for( const res_key in env.references ) {
      const page = env.references[res_key];
      const file = get_page_name(page);
      key_folder.file(file, page.value);
    }
  }

  zip.generateAsync({type:"blob"})
  .then(function(content) {
      saveAs(content, zip_name); // see FileSaver.js
  });
}


/*
 * Generate a filename for content if they don't already have one
 */
export function get_page_name(page) {
  let file = page.filename;

  if( !exists(file) ) {
    file = `${page.key.replace('_', '-')}${page.extension}`;
  }

  return file;
}