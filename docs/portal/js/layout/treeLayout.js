
/*
 * Route multiple views through a dict
 */
export function TreeLayout(map) {
  return function (x) {
    if( x.depth in map ) {
      if( exists(x.db.index[x.key].name) )
        x.name = x.db.index[x.key].name;
      return map[x.depth](x);
    }
    return x.data;
  }
} 