
/*
 * Generates HTML for grid view
 */
export function TreeGrid(x) {
  x.name = x.db.index[x.key].name;
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
    <div>
      <h1>${x.name}</h1>
      <div class="flex flex-row flex-wrap">
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
        <button data-model="${key}" class="btn-green btn-sm btn-open-item">${resource.name}</button>
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
