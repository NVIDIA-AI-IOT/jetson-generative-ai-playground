
/*
 * Generates HTML for list view
 */
export function TreeList(x) {
  x.name = x.db.index[x.key].name;
  switch(x.depth) {
    case 1:
      return TreeListHeader(x);
    case 2:
      return TreeListGroup(x);
    case 3:
      return TreeListItem(x);
    default:
      return x.data;
  }
}

/*
 * Root-level headers
 */
export function TreeListHeader(x) {
  return `
    <div>
      <h1 style="margin-bottom: 15px;">${x.name}</h1>
      <div class="flex flex-column">
        ${x.data}
      </div>
    </div>`;
}

/*
 * Group cards
 */
export function TreeListGroup(x) {
  return `
    <div>
      <h2>${x.name}</h2>
      <div class="flex flex-row">
        ${x.data}
      </div>
    </div>`;
}

/*
 * Nested items
 */
export function TreeListItem(x) {
  return `
  <div>
    <h3>${x.name}</h3>
    <div class="flex flex-row">
      ${x.data}
    </div>
  </div>`;
}
