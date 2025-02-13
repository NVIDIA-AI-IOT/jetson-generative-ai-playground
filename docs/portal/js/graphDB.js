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
 * These can also be in javascript to attach resolver functions for generating dynamic content.
 * See the resolvers/ directory for the metadata and templates that actually make up the graph.
 * 
 * The graph is mapped from this index to flattened sets of parents, children, and fields
 * that get composed from each tag's ancestors and descendants.  These mappings are cached
 * to accelerate lookups on the client and can be accessed via these records in the database:
 * 
 *  -------------------------------------------------------------------------------
 *   Mapping       Type                    Description
 *  -------------------------------------------------------------------------------
 *    db.index       dict[key, dict[tag]]    Original key->tag definitions
 *    db.flat        dict[key, dict[tag]]    Expanded inherited/composed fields
 *    db.props       dict[key, list[prop]]   List of typed property keys
 *    db.roots       list[key]               List of keys of root elements
 *    db.children    dict[key, list[key]]    List of keys that tag this key
 *    db.ancestors   dict[key, list[key]]    Flattened list of all parents in the heirarchies
 *    db.descendants dict[key, list[key]]    Flattened list of all children in the heirarchies
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


export function Resolver(env)  { return GraphDB.Resolver(env); }
export function Resolvers(env) { return GraphDB.Resolvers(env); }


export class GraphDB {

  // Set of types defined in code
  static RESOLVERS = {};

  /*
   * Register a resolver function or static resource
   */
  static Resolver(env) {
    
    env = GraphDB.sanitize(env);
    console.log(`[GraphDB]  Registering Resolver:  ${env.key}`, env);

    if( env.key in GraphDB.RESOLVERS )
      throw new Error(`Resolver key ${env.key} is already used in the GraphDB`);

    GraphDB.RESOLVERS[env.key] = env;
    return env;
  }

  /*
   * Register multiple resolvers (a dict, where each key is another resolver)
   */
  static Resolvers(envs) {
    for( const key in envs ) {
      envs[key].key ??= key;
      GraphDB.Resolver(envs[key]);
    }
    return envs;
  }

  /*
   * Create database instance from the index of tags, either provided as a dict
   * or having been loaded from json (see `GraphDB.load` to load from file)
   */
  constructor(index) {
      this.index = GraphDB.sanitizeIndex(Object.assign({}, GraphDB.RESOLVERS, index));
      this.flat = this.flatten();
      this.props = this.typed();
      [
        this.parents, this.children, 
        this.ancestors, this.descendants,
        this.roots,
      ] = this.mapTopology();
      this.log();
  }

  /*
   * Fetch the index json, parse it, and return the GraphTag instance.
   */
  static async load(url) {
    // https://www.geeksforgeeks.org/how-to-convert-an-onload-promise-into-async-await/
    console.log(`[GraphDB] fetching index from ${url}`);
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`GraphDB failed to fetch index from ${url}`);
    const index = await response.json();
    console.log(`[GraphDB] loaded ${url} (${Object.keys(index).length} records)`);
    return new GraphDB(index);
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
    args.roots ??= [];

    if( args.from === '*' ) { // aggegrated results over all records
      console.group('[GraphDB] Evaluate Query');
      console.log('QUERY', args);
      for( const id in this.index ) {
        args.from = id;
        this.query(args); // records aggregated into `results`
      }
      console.log('RESULTS', args.results);
      console.groupEnd();
    }
    else if( this.eval(args) ) { // just filter against this key only
      const root = this.primaryRoot(args.from);
      if( exists(root) && !args.roots.includes(root) )
        args.roots.push(root);
      if( args.select === '*' )
        args.results[args.from] = this.flat[args.from];
      else if( args.select === 'keys' )
        args.results.push(args.from);
      else
        throw new Error(`[GraphDB] query invalid 'select' argument '${args.select}' ('*' or 'keys' are supported)`);
    }

    return args;
  }

  /*
   * Evaluate the WHERE or IN condition on a specific tag, and return true/false.
   * These are specified as compound AND statements and nested OR comparisons.
   * `['vehicle', ['car', 'bus']]` would look for "vehicle AND (card OR bus)"
   */
  eval(args={}) {
    if( !exists(args.where) || !exists(args.in) ) {
      console.warning(`[GraphDB] query missing WHERE or IN selectors (defaulting to include records)`, args);
      return true;
    }

    if( !exists(args.from) || !(args.from in this.index) ) {
      console.warning(`[GraphDB] query FROM selector '${args.from}' was missing from the index`, args);
      return false;
    }

    if( args.where in this )
      var where = this[args.where][args.from];
    else if( args.where in this.flat[args.from] )
      var where = this.flat[args.from][args.where];
    else {
      console.warning(`[GraphDB] query WHERE selector '${args.where}' was missing from the index`, args);
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
        throw new Error(`[GraphDB] query had invalid value for IN selector '${tag}'`);
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
        throw new Error(`[GraphDB] treeReduce() requires 'func' callback (was ${func})`);
      var key = func.key ?? func.keys ?? this.roots;
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
      console.error(`[GraphDB] walk() requires 'key' and 'func' arguments`, args);
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
   * Return a copy of the fully-evaluated object, including any templating
   * or resolver functions recursively applied that fetch or generate content.
   * 
   * If the key has cross-references in its `refs` field, then leaf nodes that
   * descend from `refs` will be added as dynamically composed properties.
   */
  resolve(key, parent=null) {
    let env = {db: this, key: key, properties: {}, references: {}};
  
    if( exists(parent) )
      env.parent = parent;

    if( nonempty(this.props[key]) ) { // property definitions
      for( const field_key of this.props[key] ) {
        env.properties[field_key] = this.flatten({key: key, property: field_key});
        env[field_key] = env.properties[field_key].value;
      }
    }

    for( const field_key in this.flat[key] ) { // other fields
      if( !exists(env[field_key]) )
        env[field_key] = this.flat[key][field_key];
    }

    for( const field_key in env ) { // evaluate resolvers
      if( field_key in env.properties && 'func' in env.properties[field_key] )
        env[field_key] = env.properties[field_key]['func'](env);
    }

    if( !exists(parent) )
      this.crossReference(env); // related references

    return env;
  }
    
  /*
   * Discover mutual references from other types of nodes.
   */
  crossReference(env, refs=null) {
    env.refs = this.crossReferences(env.key, refs ?? env.refs);
    env.references ??= {};

    if( exists(env.reference_order) ) {
      let reordered = [];
      for( const ref_key of env.reference_order ) {
        
        if( env.refs.includes(ref_key) && !reordered.includes(ref_key) )
          reordered.push(ref_key);
      }
      for( const ref_key of env.refs ) {
        if( !reordered.includes(ref_key) )
          reordered.push(ref_key);
      }
      env.refs = reordered;
    }

    for( const ref_key of env.refs ) {
      if( nonempty(env.references, ref_key) )
        continue;

      let ref_env = this.resolve(ref_key, env);
      env.references[ref_key] = ref_env;

      if( 'func' in ref_env ) {
        ref_env.value = ref_env.func(ref_env);
      }

      /*let property = this.flatten({key: env.key, property: ref_key});
      env.properties[ref_key] = property;

      property.parent = env;
      property.db = this;
      property.key = ref_key;

      if( 'func' in property )
        env[ref_key] = property['func'](property); // using the base env
      else
        env[ref_key] = property.value;*/
    }

    return env;
  }

  /*
   * Return the set of keys with mutual references.
   */
  crossReferences(ancestors, descendants, leafs=true, refs=[]) {
    
    if( !exists(ancestors) || !exists(descendants) )
      return [];

    if( is_string(ancestors) )
      ancestors = [ancestors];

    if( is_string(descendants) )
      descendants = [descendants];

    //console.log('[GraphDB]  cross-referencing ancestors of:', ancestors, 'with descendants of:', descendants);

    ancestors = this.ancestors[ancestors].concat(ancestors);

    descendants = this.filter({
      keys: this.descendants[descendants].concat(descendants),
      refs: true, leafs: leafs
    });

    for( const ancestor of ancestors ) {
      for( const descendant of descendants ) {
        if( this.flat[descendant].refs.includes(ancestor) ) {
          refs.push(descendant);
          //break;
        }
      }
    }

    return refs;
  }

  /*
   * Filter keys from the list or dict by their properties.
   */
  filter({keys, refs=null, children=null, leafs=false}) {
    let out = [];

    if( is_empty(keys) )
      return [];

    if( is_string(keys) )
      keys = [keys];

    if( is_dict(keys) )
      keys = Object.keys(keys);

    for( const key of keys ) {
      if( exists(children) ) {
        if( is_number(children) && this.children[key].length != children )
          continue;
      }

      if( leafs && this.children[key].length != 0 )
        continue;

      if( refs === true && is_empty(this.flat[key].refs) )
        continue;

      out.push(key);
    }

    return out;
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

    if( exists(key) ) { // flatten just one in particular
      let output = args.output ?? {key: key, tags: []};
      //console.log(`Flatten ${key}`, output);

      if( exists(depth) )
        depth -= 1;

      if( !(key in this.index) ) {
        console.warn(`missing tag '${key}' from index`);
        return output;
      }

      if( exists(property) ) { // return just this key's property
        output = deep_copy(this.flat[property]);
        const ancestors = this.ancestors[key].reverse().concat([key]);
        for( const ancestor of ancestors ) {
          if( !(property in this.flat[ancestor]) )
            continue;
          let prop_dict = this.flat[ancestor][property];
          if( !(is_dict(prop_dict)) )
            prop_dict = {value: prop_dict};
          //const prev_key = output.key;
          const prev_value = output.value;
          Object.assign(output, prop_dict); // inherit values up the tree
          if( exists(prev_value) && !exists(output.value) )
            output.value = prev_value; // restore nulls
          //output.key = prev_key;
        }
        return output;
      }

      for( const var_key in this.index[key] ) { // add properties from this key
        if( var_key === 'tags' || var_key === 'key' )
          continue; // tags get handled recursively after properties are filled

        const value = this.index[key][var_key];

        if( is_empty(output, var_key) /*&& nonempty(value)*/ ) {
          output[var_key] = deep_copy(value);
        }
        else if( is_dict(value) ) {
          Object.assign(output[var_key], value);  
        }
        else if( is_list(value) ) {
          output[var_key] = output[var_key].concat(value);
        }
        /*else if( nonempty(value) && !unique.includes(var_key) ) {
          output[var_key] = value;
        }*/
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

      for( const k in this.index ) {
        //console.groupCollapsed(`Flatten ${k}`);
        flat[k] = this.flatten({depth: depth, key: k});
        //console.groupEnd();
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

    console.group(`[GraphDB] Closure with ${keys}`);
    const graph = new GraphDB(index);
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


  /*
   * Find the root node with the shortest path to this node.
   */
  primaryRoot(key) {
    for( const parent of this.ancestors[key] ) {
      if( this.roots.includes(parent) )
        return parent;
    }
  }

  /**
   * Build the tree of parents and children from the flat list of tags.
   * @note this is automatically performed on init and the results cached.
   */
  mapTopology(index=this.index) {
    //const index = exists(args.index) ? args.index : this.index;
    var parents = {}, children = {}, roots = [];
    var ancestors = {}, descendants = {};

    for( const key in index ) {
      parents[key] = [], children[key] = [];
      ancestors[key] = [], descendants[key] = [];
    }

    for( const key in index ) {
      for( const tag of this.index[key].tags ) {
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

    for( const key in index ) {
      up_tree(key, key);
      down_tree(key, key);
    }

    for( const key in index ) {
      if( parents[key].length == 0 )
        roots.push(key);
    }

    for( const key in index ) {
      if( is_empty(index[key], 'child_order') )
        continue;

      let reordered = [];

      for( const child_key of index[key].child_order ) {
        if( children[key].includes(child_key) )
          reordered.push(child_key);
      }

      for( const child_key of children[key] ) {
        if( !reordered.includes(child_key) )
          reordered.push(child_key);
      }

      children[key] = reordered;
    }

    return [parents, children, ancestors, descendants, roots];
  }

  /*
   * Check for missing entries and malformed keys
   */
  static sanitize(obj, key) {

    if( !exists(obj.key) ) {
      if( exists(key) )
        obj.key = key;
      else if( exists(obj.func) )
        obj.key = obj.func.name;
      else if( exists(obj.name) )
        obj.key = obj.name.toLowerCase().replace(' ', '-');
      else
        throw new Error(`Object was missing key, name, and function - it needs at least one (${obj}, ${key})`);
    }

    if( exists(key) && key != obj.key )
      throw new Error(`Mismatch between provided key and object's key:  ${key}  ${obj.key}  (${obj})`);

    key = obj.key;

    if( !exists(obj.name) )
      obj.name = toTitleCase(key.replace('-', ' ').replace('_', ' '));

    if( !exists(obj.tags) )
      obj.tags = [];
    else if( is_string(obj.tags) )
      obj.tags = [obj.tags];

    if( exists(obj.refs) && is_string(obj.refs) )
      obj.refs = [obj.refs];

    if( exists(obj.help) && is_list(obj.help) )
      obj.help = obj.help.join(' ');

    return obj;
  }

  /*
   * Validate all items in the index
   */
  static sanitizeIndex(index) {
    for( let key in index ) {
      let obj = index[key];

      if( is_string(obj) || is_list(obj) )
        throw new Error(`Invalid graph object with key '${key}' (${obj}) - all root-level definitions should be dicts`);

      index[key] = GraphDB.sanitize(obj, key);
    }
    return index;
  }

  /*
   * Log info about the database to the console
   */
  log() {
    console.group(`[GraphDB] Topology Map (${Object.keys(this.index).length} nodes)`);
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
