/*
 * Lightweight serverless graph database of heirarchial & composable tags 
 * for querying attribute types and semantic relationships between objects.
 * 
 * It shares from property graphs like Neo4j, GraphQL, Graphology, and RDF,
 * In the spirit of sqlite, this distributed implementation runs in-memory
 * on the client using a DAG with multiple children, parents, and roots. 
 * 
 * First an index of tags gets fetched from json, where each tag has a unique
 * key for its type and values, along with the parent tags it inherits from:
 *
 *   {
 *     "fruit": {
 *       "quantity": 0,
 *       "price": null,
 *     },
 *     "apple": {
 *       "tags": ["fruit"],
 *       "acidity": 5,
 *     },
 *     "cosmic-crisp": {
 *       "name": "Cosmic Crisp",
 *       "tags": ["apple"],
 *       "quantity": 6,
 *       "price": 0.5,
 *     },
 *     "granny-smith": {
 *       "name": "Granny Smith",
 *       "tags": ["apple"],
 *       "quantity": 12,
 *       "price": 0.25,
 *       "acidity": 9,
 *     },
 *   }
 * 
 * The graph is mapped from this index to flattened sets of parents, children, and fields
 * that get composed from each tag's ancestors and descendants.  These mappings are cached
 * to accelerate lookups on the client and can be accessed via these records in the database:
 * 
 *  -------------------------------------------------------------------------------
 *   Mapping       Type                    Description
 *  -------------------------------------------------------------------------------
 *    db.index      dict[key, dict[tag]]    Original key->tag definitions
 *    db.flat       dict[key, dict[tag]]    Expanded inherited/composed fields
 *    db.props      dict[key, list[prop]]   List of typed property keys
 *    db.parents    dict[key, list[key]]    List of keys of all ancestors
 *    db.children   dict[key, list[key]]    List of keys of all descendants
 *    db.roots      list[key]               List of keys of root elements
 * 
 * The database can be searched and filtered with `db.query()` to traverse the graph
 * and find the tags that include the set of requested tags from the query:
 *
 *    db.query({  
 *      select: '*',      // '*' or null will return flattened tag records, 'keys' for key list
 *      from: '*',        // key that limits scope to its children ('*' or null for all roots)
 *      where: 'parents', // where those tags are included in 'parents' (the default)
 *      in: ['image', '4k', ['apple, 'orange']] // 'image' AND '4k' AND ('apple' OR 'orange')
 *    });
 * 
 * See the GraphBrowser from browser.js for examples of visualizing records interactively.
 */ 
import {
  exists, is_string, is_dict, is_list
 } from "../nanolab.js";


export class GraphTags {
  /*
   * Create database instance from the index of tags, either provided as a dict
   * or having been loaded from json (see `TagDB.load` to load from file)
   */
  constructor(index) {
      this.index = this.sanitize(index);
      this.flat = this.flatten();
      this.props = this.typed();
      [
        this.parents, this.children, 
        this.ancestors, this.descendants,
        this.roots,
      ] = this.map_topology();
      this.log();
  }

  /*
   * Fetch the index json, parse it, and return the GraphTag instance.
   */
  static async load(url) {
    // https://www.geeksforgeeks.org/how-to-convert-an-onload-promise-into-async-await/
    console.log(`[GraphTags] fetching index from ${url}`);
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`GraphTags failed to fetch index from ${url}`);
    const index = await response.json();
    console.log(`[GraphTags] loaded ${url} (${Object.keys(index).length} records)`);
    return new GraphTags(index);
  }

  /*
   * Run a SQL-like query on the graph and return the filtered records.
   * Since parts of the graph have been flattened, more straightforward
   * SQL queries are able to be used efficiently as opposed to GQL.
   */
  query(args={}) {
    args.select ??= '*';
    args.from ??= '*';
    args.results ??= (args.select == '*') ? {} : [];

    if( args.from === '*' ) { // aggegrated results over all records
      console.group('[GraphTags] Evaluate Query');
      console.log('QUERY', args);
      for( const id in this.index ) {
        args.from = id;
        this.query(args); // records aggregated into `results`
      }
      console.log('RESULTS', args.results);
      console.groupEnd();
    }
    else if( this.eval(args) ) { // just filter against this key only
      //console.log('FILTER TRUE', args);
      if( args.select === '*' )
        args.results[args.from] = this.flat[args.from];
      else if( args.select === 'keys' )
        args.results.push(args.from);
      else
        throw new Error(`[GraphTags] query invalid 'select' argument '${args.select}' ('*' or 'keys' are supported)`);
    }

    return args.results;
  }

  /*
   * Evaluate the WHERE or IN condition on a specific tag, and return true/false.
   * These are specified as compound AND statements and nested OR comparisons.
   * `['vehicle', ['car', 'bus']]` would look for "vehicle AND (card OR bus)"
   */
  eval(args={}) {
    if( !exists(args.where) || !exists(args.in) ) {
      console.warning(`[GraphTags] query missing WHERE or IN selectors (defaulting to include records)`, args);
      return true;
    }

    if( !exists(args.from) || !(args.from in this.index) ) {
      console.warning(`[GraphTags] query FROM selector '${args.from}' was missing from the index`, args);
      return false;
    }

    if( args.where in this )
      var where = this[args.where][args.from];
    else if( args.where in this.flat[args.from] )
      var where = this.flat[args.from][args.where];
    else {
      console.warning(`[GraphTags] query WHERE selector '${args.where}' was missing from the index`, args);
      return false;
    }
    
    // TODO add general WHERE comparisons (this implements WHERE IN)
    for( let tag of args.in ) { // iterate over list[key|list[key]]
      if( is_string(tag) ) { // top-level individual tags use AND
        if( !where.includes(tag) ){
          //console.log('FROM', args.from, 'WHERE', args.where, where, 'IN', args.in, ' => FALSE (AND)');
          return false;   
        }
      }
      else if( is_list(tag) ) { // nested lists use OR
        let or_result = false;
        for( let or_tag of tag ) { // check that any are true
          if( where.includes(or_tag) ) {
            or_result = true;
            break;
          }
        }
        if( !or_result ) {
          return false;
        }
      }
      else {
        throw new Error(`[GraphTags] query had invalid value for IN selector '${tag}'`);
      }
    }
    return true; // default filter passthrough
  }

  /**
   * An additional wrapper on top of `walk()` that builds in the agreggation
   * by appending the output from the last node with the previous.
   */
  treeReduce(func) {
    if( func instanceof Function ) {
      var key=this.roots; var data=''; var depth=0; var mask=null;
    }
    else { // passed a dict
      if( !exists(func.func) )
        throw new Error(`[GraphTags] treeReduce() requires 'func' callback (was ${func})`);
      var key = func.key ?? this.roots;
      var data = '';
      var depth = func.depth ?? 0;
      var mask = func.mask;
      func = func.func;
    }
    if( is_string(key) ) {
      if( exists(mask) ) { // only traverse paths on the goal mask
        let pass=mask.includes(key); 
        if( pass ) { // remove reached keys from the goal mask
          delete mask[mask.indexOf(key)];
        }
        else { // check if any nodes in the mask are descendants    
          for( const m of mask ) {
            if( this.descendants[key].includes(m) ) {
              pass=true;
              break;
        }}}
        if( !pass )
          return data;
      } // recurse into each child node
      for( let child of this.children[key] ) {
        data += this.treeReduce({
          key: child, 
          func: func,
          data: '',
          depth: depth+1,
          mask: mask
        });
      } // process this node (DFS)
      return func({db: this, key: key, data: data, depth: depth});
    }
    else { // handle initial set of root keys
      if( exists(mask) )
        mask = [...mask]; // make a copy as this gets modified

      for( let root in key ) {
        if( is_list(key) ) // list[key] instead of dict[key]
          root = key[root]; 
        data += this.treeReduce({
          key: root, 
          func: func,
          data: '',
          depth: depth ?? 0,
          mask: mask
        });
      }
    }
    return data;
  }
  
  /*
   * Recursively traverse resource tree and notify a visitor function
   * upon visiting each node in the graph.  A data element is provided to
   * the callback function that is used to gather and combine the results.
   */
  walk(args) {
    if( !exists(args.key) || !exists(args.func) ) {
      console.error(`[GraphTags] walk() requires 'key' and 'func' arguments`, args);
      return;
    }
    if( is_string(args.key) ) {
      for( let child of this.children[args.key] )
        args.data = this.walk({
          key: child, 
          func: args.func,
          data: args.data,
          depth: args.depth+1,
        });
      return args.func(this, args.key, args.data, args.depth ?? 0);
    }
    else {
      for( let root in args.key ) {
        if( is_list(args.key) ) // list[key] instead of dict[key]
          root = args.key[root]; 
        args.data = this.walk({
          key: root, 
          func: args.func,
          data: args.data,
          depth: args.depth ?? 0,
        });
      }
    }
    return args.data;
  }

  /*
   * Return an index where the tag lists include all parent tags
   * in the heirarchy, up to and including the maximum tree depth.
   * 
   * If given a property, it will flatten that property for the given key.
   * 
   * @note index-level flatten is performed automatically during construction,
   *       and can be accessed through its cached copy with `db.flat`
   */
  flatten(args={}) {
    const key = args.key;
    const depth = args.depth;
    const property = args.property;

    var output = args.output ?? {tags: []};
    
    if( exists(key) ) { // flatten just one in particular
      if( exists(depth) )
        depth -= 1;

      if( !(key in this.index) ) {
        console.warn(`missing tag '${key}' from index`);
        return output;
      }

      if( exists(property) ) { // return just this key's property
        output = structuredClone(this.flat[property]);
        const ancestors = this.ancestors[key].reverse().concat([key]);
        for( const ancestor of ancestors ) {
          if( !(property in this.flat[ancestor]) )
            continue;
          let prop_dict = this.flat[ancestor][property];
          if( !(is_dict(prop_dict)) )
            prop_dict = {value: prop_dict};
          Object.assign(output, prop_dict); // inherit values up the tree
        }
        return output;
      }

      for( const var_key in this.index[key] ) { // add properties from this key
        if( !(var_key in output) )
          output[var_key] = this.index[key][var_key];
      }

      for( const key_tag of this.index[key].tags ) { // add tags from this key
        if( !output.tags.includes(key_tag) )
          output.tags.push(key_tag);

        if( !exists(depth) || depth >= 0 )
          output = this.flatten({depth: depth, key: key_tag, output: output});
      }

      return output;
    }
    else { // flatten all resources in the index
      let flat = {};

      for( let key in this.index ) {
        flat[key] = this.flatten({depth: depth, key: key});
      }

      return flat;
    }
  }

  /*
   * Given a set of keys, return a new db instance with a graph pruned
   * to only include these keys and their anscestors, such that it remains
   * topologically compatible up to the depth of the given keys.
   */
  closure(keys) {
    const self = this;
    let index = {};

    function closure_up(key) {
      index[key] = self.index[key];
      for( const tag of index[key].tags )
        closure_up(tag);
    }

    for( const key of keys )
      closure_up(key);

    console.group(`[GraphTags] Closure with ${keys}`);
    const graph = new GraphTags(index);
    console.groupEnd();
    return graph;
  }

  /**
   * Return the set of typed properties for each tag, only including
   * those fields exposed with the 'property' tag in their ancestor tree.
   * 
   * @note this should only be run after flatten() and is performed
   * on initialization (the results are cached under `db.props`)
   */
  typed(index=this.index) {
    var fields = {};
    for( let key in index ) {
      for( let field in this.flat[key] ) {
        if( !(field in this.index) )
          continue;
        if( !this.flat[field].tags.includes('property') )
          continue;
        if( !(key in fields) )
          fields[key] = [];
        if( !fields[key].includes(field) )
          fields[key].push(field);
      }
    }
    return fields;
  }

  /**
   * Build the tree of parents and children from the flat list of tags.
   * @note this is automatically performed on init and the results cached.
   */
  map_topology(index=this.index) {
    //const index = exists(args.index) ? args.index : this.index;
    var parents = {}, children = {}, roots = [];
    var ancestors = {}, descendants = {};

    for( let key in index ) {
      parents[key] = [], children[key] = [];
      ancestors[key] = [], descendants[key] = [];
    }

    for( let key in index ) {
      for( let tag of this.index[key].tags ) {
        if( !(tag in index) ) {
          console.warn(`tag '${tag}' was missing from index, skipping it in the tree`);
          continue;
        }
        parents[key].push(tag);
        children[tag].push(key);

        ancestors[key].push(tag);
        descendants[tag].push(key); 
      }
    }

    function up_tree(k,o) {
      for( const a of ancestors[k] ) {
        if( !ancestors[o].includes(a) )
          ancestors[o].push(a);
        up_tree(a,o);
      }
    }

    function down_tree(k,o) {
      for( const d of descendants[k] ) {
        if( !descendants[o].includes(d) )
          descendants[o].push(d);
        down_tree(d,o);
      }
    }

    for( let key in index ) {
      up_tree(key, key);
      down_tree(key, key);
    }

    for( let key in index ) {
      if( parents[key].length == 0 )
        roots.push(key);
    }

    return [parents, children, ancestors, descendants, roots];
  }

  /**
   * Check for missing entries and malformed keys
   */
  sanitize(index) {
    for( let key in index ) {
      let obj = index[key];
      if( is_string(obj) )
        obj = [obj];
      if( is_list(obj) )
        obj = {name: key, tags: obj};
      if( !('name' in obj) )
        obj.name = key;
      if( !('tags' in obj) )
        obj.tags = [];
      index[key] = obj;
    }
    return index;
  }

  /**
   * Log info about the database to the console
   */
  log() {
    console.group(`[GraphTags] Topology Map (${Object.keys(this.index).length} nodes)`);
    console.log('INDEX', this.index);
    console.log('FLAT', this.flat);
    console.log('PARENTS', this.parents);
    console.log('CHILDREN', this.children);
    console.log('ANCESTORS', this.ancestors);
    console.log('DESCENDANTS', this.descendants);
    console.log('PROPERTIES', this.props);
    console.log('ROOTS', this.roots);
    console.groupEnd();
  }
}
