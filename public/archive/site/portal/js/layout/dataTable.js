
/*
 * Generates HTML for sortable data table (using tabulator)
 */
export function DataTable({db, tags, results}) {
  for( const result of results ) {
    if( db.descendants[result].length > 0 )
      continue;
  }
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


