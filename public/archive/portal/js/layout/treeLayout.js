
/*
 * Route tree traversal for heirarchial layouts
 */
export function TreeLayout(func) {
  return function (query) {
    return query.db.treeReduce({
      func: func,
      tags: query.tags,
      mask: query.results
    });
  }
}

/*export function TreeLayout(map) {
  return function (x) {
    if( x.depth in map ) {
      if( exists(x.db.index[x.key].name) )
        x.name = x.db.index[x.key].name;
      return map[x.depth](x);
    }
    return x.data;
  }
}*/