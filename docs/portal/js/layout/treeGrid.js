
/*
 * Generates HTML for grid view
 */
export function TreeGrid(x) {
  x.name = x.db.index[x.key].name;

  if( x.depth <= 2 && x.db.isLeaf(x.key) ) {
    const env = x.db.flat[x.key];
    
    if( exists(env.thumbnail) )
      var style = `background-image: url('${env.thumbnail}'); `;
    else
      var style = `background: #76B900; `;

    if( exists(env.nav_style) )
      style += env.nav_style;
    
    let classes = exists(env.nav_class) ? env.nav_class : '';

    if( is_string(classes) )
      classes = [classes];

    classes = classes.join(' ');

    return `
    <div class="card nav-tree-app ${classes}" id="${x.key}_card" data-key="${x.key}" style="${style}">
      <div class="nav-tree-app-text">
        ${x.name}
      </div>
    </div>`;
  }

  switch(x.depth) {
    case 1:
      return TreeGridHeader(x);
    case 2:
      return TreeGridGroup(x);
    case 3:
      return TreeGridItem(x);
    default:
      return x.data;
  }
}

/*
 * Root-level headers
 */
export function TreeGridHeader(x) {
  return `
    <div style="white-space: nowrap;">
      <h1 style="margin-bottom: 15px;">${x.name}</h1>
      <div class="flex flex-row" style="padding-bottom: 45px;">
        ${x.data}
      </div>
    </div>`;
}

/*
 * Group cards
 */
export function TreeGridGroup(x) {
  return `
    <div class="card align-top" id="${x.key}_card">
      <div class="card-body">
        <span class="card-title">${x.name}</span>
        ${x.data}
      </div>
    </div>`;
}

/*
 * Nested items
 */
export function TreeGridItem({db, key, data, name}) {
  for( let tag of db.flat[key].tags ) {
    const resource = db.index[tag];
    if( resource.pin ) {
      data = data + `
        <button data-key="${key}" class="btn-green btn-sm btn-open-item">${resource.name}</button>
      `;
    }
  }
  return `
    <div class="card-sm align-top" id="${key}_card">
      <div class="card-body-sm">
        <div class="card-title-sm">${name}</div>
        ${data}
      </div>
    </div>`;
}
