
/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/graphDB.js */
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
/* import {
  exists, is_string, is_dict, is_list
 } from "../nanolab.js";
 */

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
  static async load(urls) {
    if( is_string(urls) )
      urls = [urls];
    
    console.log('LOAD', urls);
    
    let root_idx = {};

    for( const url of urls ) {
      // https://www.geeksforgeeks.org/how-to-convert-an-onload-promise-into-async-await/
      console.log(`[GraphDB] fetching index from ${url}`);
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`GraphDB failed to fetch index from ${url}`);
      let index = await response.json();
      console.log(`[GraphDB] loaded ${url} (${Object.keys(index).length} records)`);
      for( const key in index ) {
        if( !(key in root_idx) ) {
          root_idx[key] = index[key];
        }
        else {
          const renamed = `${key}-${index[key].tags[0]}`;
          console.warn(`[GraphDB] duplicate key '${key}' found, renaming to '${renamed}'`);
          this.rename_key(index, key, renamed);
          root_idx[renamed] = index[key];
        }
      }
    }

    console.log(`[GraphDB] loaded ${Object.keys(root_idx).length} records total`);
    return new GraphDB(root_idx);
  }

  /*
   * Rename a key an index to another key in the event of collisions.
   */
  static rename_key(index, key, renamed) {
    for( const k in index ) {
      if( !exists(index[k].tags) )
        continue;

      const index_of = index[k].tags.indexOf(key);

      if( index_of >= 0 )
        index[k].tags[index_of] = renamed;
    }

    /*if( key in index ) {
      index[renamed] = index[key];
      delete index[key];
    }*/

    return index;
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
    args.db ??= this;
    
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
  treeReduce({tags=null, key=null, func=null, data='', depth=0, mask=null}) {
    if( !(func instanceof Function ))
      throw new Error(`[GraphDB] treeReduce() requires 'func' callback (was ${func})`);

    if( is_string(key) ) {
      if( exists(mask) ) { // only traverse paths on the goal mask
        let pass = mask.includes(key);
        /*if( pass ) { // remove reached keys from the goal mask
          delete mask[mask.indexOf(key)];
        }
        else { // check if any nodes in the mask are descendants    
          //pass = includes_any(mask, this.descendants[key]); 
          pass = roots.includes(this.primaryRoot(key));
        }*/
        if( !pass )
          return data;
      } // recurse into each child node
      if( !(key in this.children) ) 
        throw new Error(`Missing children for key ${key}`);
      for( const child of this.children[key] ) {
        data += this.treeReduce({
          tags: tags,
          key: child, 
          func: func,
          data: '',
          depth: depth+1,
          mask: mask
        });
      } // process this node (DFS)
      return func({db: this, key: key, data: data, depth: depth});
    }
    else if( is_list(tags) ) { // list of inital keys - add shortest paths to roots to the mask
      var roots = this.primaryRoots(tags);

      for( const tag of tags ) { // cover tags that are roots themselves
        if( this.roots.includes(tag) && !roots.includes(tag) )
          roots.push(tag);
      }

      if( exists(mask) ) { // enable shortest paths for masks->tags->roots
        mask = [...mask]; // make a copy as this gets modified

        for( const mask_key of mask ) { // enable paths from masks->tags
          for( const tag of tags ) {
            if( this.ancestors[mask_key].includes(tag) ) {
              for( const ancestor of this.ancestors[mask_key] ) {
                if( this.ancestors[ancestor].includes(tag) ) {
                  if( !mask.includes(ancestor) )
                    mask.push(ancestor);
                }
              }
              break; // only enable shortest path
            }
          }
        }

        for( const tag of tags ) { // enable paths from tags->roots
          if( !mask.includes(tag) )
            mask.push(tag);

          const ancestors = this.primaryAncestors(tag);

          for( const ancestor of ancestors ) {
            if( !mask.includes(ancestor) )
              mask.push(ancestor);
          }
        }
      }

      for( let root of roots ) {
        data += this.treeReduce({
          tags: tags,
          key: root, 
          func: func,
          data: '',
          depth: depth ?? 0,
          mask: mask,
        });
      }
    }
    else { // global traversal (called with no tags)
      data += this.treeReduce({
        tags: this.roots,
        func: func,
        data: '',
        depth: depth,
        mask: mask,
      });
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

    if( env.tags.includes('resource') && is_empty(env.value) && is_url(env.url) ) { // download remote assets
      const url = env.url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/refs/heads/');
      console.log(`[GraphDB]  Fetching resource '${key}' from:  ${url}`);
      env.promise = fetch(url).then(response => { // use env.promise.then() to wait
        if( !response.ok ) {
          const error_msg = `HTTP error ${response.status} while fetching resource for '${key}' from:  ${url}`;
          env.value = error_msg;
          throw new Error(`[GraphDB]  ${error_msg}`);
        }
        return response.text(); // or response.json(), response.blob(), etc.
      }).then(data => {
        console.log(`[GraphDB]  Downloaded ${data.length} bytes for resource '${key}' from:  ${url}`);
        env.value = data;
        return data;
      }).catch(error => {
        const error_msg = `Error '${error}' while fetching content for resource '${key}' from:  ${url}`;
        env.value = error_msg;
        throw new Error(`[GraphDB]  ${error_msg}`);
      });
    }

    if( !exists(parent) ) {
      this.crossReference(env); // related references

      if( 'func' in env ) // root modifications
        env.func(env);

      let promises = []; // agreggate all promises

      if( env.promise )
        promises.push(env.promise);

      for( const ref_key in env.references ) {
        const ref_promise = env.references[ref_key].promise;
        if( ref_promise )
          promises.push(ref_promise);
      }
      
      if( promises.length > 0 )
        console.log(`[GraphDB]  Promises left to resolve '${env.key}' (count=${promises.length})`);

      env.promise = Promise.allSettled(promises);
    }

    return env;
  }
    
  /*
   * Wait on promises to resolve the values of async keys.
   */
  async value(env) {
    if( is_empty(env.value) )
      return env.value;
    if( is_promise(env.value) ) {
      await env.value;
    }
    return env.value;
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

    for( const ancestor of ancestors )
      ancestors = merge_lists(ancestors, this.ancestors[ancestor]);

    for( const descendant of descendants )
      descendants = merge_lists(descendants, this.descendants[descendant]);

    descendants = this.filter({
      keys: descendants,
      refs: true, leafs: leafs
    });

    //console.log(`XREF ans=${ancestors}  desc=${descendants}`);

    for( const ancestor of ancestors ) {
      for( const descendant of descendants ) {
        if( ancestors.includes(descendant) )
          continue;
        if( this.flat[descendant].refs.includes(ancestor) ) {
          if( !refs.includes(descendant) )
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

      if( refs === true && is_empty(this.flat[key].refs) || this.flat[key].xref === false )
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
   * Returns true if this key has no children, false otherwise.
   */
  isLeaf(key) {
    return (this.children[key].length == 0);
  }
  
  /*
   * Find all the root nodes of this key or list of keys.
   * If `primary=true`, then only the shortest path is used.
   */
  findRoots(key, primary=false, out=[]) {
    if( is_list(key) ) {
      for( const k of key ) {
        this.findRoots(k, primary, out);
      }
      return out;
    }

    if( primary ) {
      const root = this.primaryRoot(key);
      if( !out.includes(root) ) {
        out.push(root);
        console.log(`[GraphDB]  Adding primary root '${root}' for '${key}'`);
      }
    }
    else {
      for( const ancestor of this.ancestors[key] ) {
        if( this.roots.includes(ancestor) ) {
          if( !out.includes(ancestor) )
            out.push(ancestor);
        }
      }
    }

    return out;
  }

  /*
   * Find the set of primary root nodes for the list of keys.
   */
  primaryRoots(keys) {
    return this.findRoots(keys, true);
  }

  /*
   * Find the root node with the shortest path to this node.
   */
  primaryRoot(key) {
    if( this.roots.includes(key) )
      return key;

    /*for( const parent of this.ancestors[key] ) {
      if( this.roots.includes(parent) )
        return parent;
    }*/
    return this.primaryAncestors(key).pop();
  }

  /*
   * Find the shortest path of parent nodes to the root node.
   */
  primaryAncestors(key, out=[]) {
    if( is_empty(this.parents[key]) )
      return out;

    const parent = this.parents[key][0];

    if( !out.includes(parent) )
      out.push(parent);

    return this.primaryAncestors(parent, out);
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

/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/graphDB.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/models.js */
/*
 * Parse model names from path (normally this should just use the model key)
 */
/* import { exists } from '../nanolab.js';
 */
export function get_model_name(model) {
  if( !exists(model) )
    return model;

  model = get_model_repo(model);

  if( model.toLowerCase().includes('.gguf') ) {
    const split = model.split('/');
    model = split[split.length-1];
  }

  return model;
}

export function get_model_repo(model) {
  if( !exists(model) )
    return model;

  model = model.replace('hf.co/', '');
  model = model.replace('ollama.com/library/', '');

  return model;
}

export function get_model_cache(env) {
  var model = env.url ?? env.model_name;
  const api = get_model_api(model);

  if( api == 'mlc' )
    var cache = 'mlc_llm';
  else if( api == 'llama.cpp' )
    var cache = 'llama_cpp';
  else if( api == 'ollama' )
    var cache = 'ollama';

  var repo = get_model_repo(model);
  var split = repo.split('/');

  if( split.length >= 3 && split[split.length-1].toLowerCase().includes('.gguf') )
    repo = split.slice(0, split.length-1).join('/');

  return `/root/.cache/${cache}/${repo}`;
}

export function get_model_api(model) {
  if( !is_string(model) )
    return null;
  model = model.toLowerCase();

  if( model.includes('mlc') )
    return 'mlc';
  else if( model.includes('.gguf') )
    return 'llama.cpp';
  else if( model.includes('ollama') )
    return 'ollama';
  else
    console.warn(`Unsupported / unrecognized model ${model}`);
}

/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/models.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/html.js */
/*
 * Utilities for generating and manipulating HTML nodes in the DOM.
 */
/* import { exists, is_string } from "../nanolab.js";
 */
/**
 * Wrapper to create single HTML node from string (https://stackoverflow.com/a/35385518)
 * The node will optionally be added to the DOM if a parent element is specified.
 * 
 *   document.body.appendChild( htmlToNode(`<p>Hello World</p>`) );
 *   const element = htmlToNode(`<p>Hello World</p>`, document.body);
 *       
 * @param {String} HTML representing a single node (which might be an Element, a text node, or a comment).
 * @param {Node} Parent element that this new node will be added to as a child (optional)
 * @return {Node} The Node that was created from the HTML string.
 */
export function htmlToNode(html, parent=null) {
  const template = document.createElement('template');

  if( is_string(html) )
    template.innerHTML = html.trim();
  else
    template.content.appendChild(html);

  const nNodes = template.content.childNodes.length;
  const child = template.content.firstChild;

  if (nNodes !== 1) {
      throw new Error(
          `html parameter must represent a single node; got ${nNodes}. ` +
          'Note that leading or trailing spaces around an element in your ' +
          'HTML, like " <img/> ", get parsed as text nodes neighbouring ' +
          'the element; call .trim() on your input to avoid this.'
      );
  }

  if( exists(parent) ) {
    parent.appendChild(child);
  }

  return child;
}
  
/**
 * Parse HTML from string and return list of nodes.  This is similar to the `htmlToNode()`
 * function above, except that it accepts any number of nodes, and returns a list.
 * 
 * @param {String} HTML representing any number of sibling nodes
 * @param {Node} Parent element these new nodes will be added to as a children (optional)
 * @return {NodeList} List of Nodes that were created from the HTML string.
 */
export function htmlToNodes(html, parent=null) {
  /*console.group('htmlToNodes');
  console.log('HTML\n', html);*/

  const template = document.createElement('template');

  if( is_string(html) )
    template.innerHTML = html.trim();
  else
    template.content.appendChild(html);

  /*console.log('Nodes', template.content.childNodes);
  console.log('Parent', parent);
  console.groupEnd();*/

  // was having issues loading jQuery from modules and resolving exports
  // but this was a good thread:  https://stackoverflow.com/a/36343307
  // this was a good one for CSS: https://stackoverflow.com/a/40933978

  /*for( const child of template.content.childNodes ) {
    child.onreadystatechange = (evt) => {console.log('SCRIPT ON READY', html, evt);};
    child.onload = (evt) => {console.log('SCRIPT ON LOAD', html, evt);};
  }*/

  if( exists(parent) ) {
    for( const child of template.content.childNodes )
      parent.appendChild(child); //parent.insertBefore(child, parent.firstChild);
  }

  //sleep(1000);
  return template.content.childNodes;
}
  
/*
 * Remove an element from DOM (https://stackoverflow.com/a/50475223)
 * document.getElementsByID('my_div').remove();
 */
Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

/*
 * Remove children from DOM (see above)
 */
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for(var i = this.length - 1; i >= 0; i--) {
      if(this[i] && this[i].parentElement) {
          this[i].parentElement.removeChild(this[i]);
      }
  }
}

/*
 * Perform some HTML substitutions
 * https://stackoverflow.com/a/6234804
 */
export function escapeHTML(unsafe) {
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
    .replaceAll('\n', '<br/>');
}

/*
 * Prepare strings for web presentation
 */
export function strToWeb(option) {
  if( option == 'api' )
    return 'API';
  else
    return capitalize(option);
}

/*
 * Capitalize the first character of string
 */
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/*
 * Insert line breaks when a string gets too long
 * (this is setup for multi-line shell commands)
 */
export function wrapLines({text, delim=' -', newline=' \\\n', indent=2, max_length=20}) {
  if( is_empty(text) ) {
    if( arguments.length > 0 && is_string(arguments[0]) )
      text = arguments[0];
    else
      return '';
  }
  console.log('WRAP LINES text=', text);
  const split = text.split(delim);
  let lines = [''];
  indent = (indent > 0) ? ' '.repeat(indent) : '';

  for( const i in split ) {
    const next = (i > 0 ? delim : '') + split[i];
    const last = lines.length - 1;

    if( i > 0 && lines[last].length + next.length >= max_length )
      lines.push(next);
    else
      lines[last] += next;
  }

  if( lines[0].length == 0 )
    lines.shift(); // remove leading empty element

  for( const i in lines ) {
    lines[i] = (i > 0 ? indent : '') + 
      lines[i].trim().replaceAll('  ', ' ');
  }

  return lines.join(newline).replace('^^^', ' ');
}
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/html.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/path.js */
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
  //console.log('PACKAGE ROOT', import.meta.url, dirname(import.meta.url, 2));
  return dirname(import.meta.url, 2);
}

export function file_extension(x) {
  return x.split('.').pop();
}

export function has_extension(x, ...ext) {
  return ext.includes(file_extension(x));
}

/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/path.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/types.js */
/*
 * Assorted typing functions and conversions.
 */
export function exists(x) {
  return (x !== null && x !== undefined);
}

export function len(x) {
  if( !exists(x) )
    return 0;
  if( is_list(x) || is_string(x) )
    return x.length;
  else
    return Object.keys(x).length;
}

export function nonempty(x, key) {
  if( exists(key) ) { // key is optional
    if( key in x )
      x = key;
    else
      return false;
  }
  if( !exists(x) )
    return false;
  else if( is_number(x) || is_bool(x) )
    return true;
  else
    return len(x) > 0;
}

export function is_empty(x, key) {
  return !nonempty(x, key);
}

export function is_string(x) {
  if( typeof x === 'string' || x instanceof String )
    return true;
  else
    return false;
}

export function is_bool(x) {
  return typeof x === 'boolean';
}

export function is_number(x) {
  return typeof x === 'number';
}

export function is_function(x) {
  return (x instanceof Function);
}

export function is_dict(x) {
  return exists(x) && (x.constructor == Object);
}

export function is_list(x) {
  return Array.isArray(x);
}

export function as_list(x) {
  if( !exists(x) )
    return [] 
  return x;
}

export function is_value(x) {
  return exists(x) && (is_string(x) || is_number(x) || is_bool(x));
}

export function as_element(x) {
  if( !exists(x) )
    return x;

  if( is_string(x) )
    return document.querySelector(x); /*document.getElementById(x);*/

  return x;
}

export function is_promise(x) {
  return exists(x) && (
    (x instanceof Promise) ||
    (x.then && typeof x.then === 'function')
  );
}

export function is_url(x) {
  return nonempty(x) && (x.startsWith('http') || x.startsWith('www'));
}

export function make_url(url, domain='hf.co') {
  const x = url.toLowerCase();
  if( !is_url(x) ) {
    if( !x.includes('.co') ) {
      if( !x.startsWith('huggingface') && !x.startsWith('hf.co') ) {
        url = domain + '/' + url;
      }  
    }
    url = 'https://' + url;
  }
  return url;
}

export function dict_keys(x) {
  return is_dict(x) ? Object.keys(x) : [];
}

export function includes_any(x, y) {
  for( const val of y ) {
    if( x.includes(val) )
      return true;
  }
  return false;
}

export function toTitleCase(x) {
  return x.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

/*
 * Merge and deduplicate two lists (https://stackoverflow.com/a/1584377)
 *
 *   const merged = merge_lists(['a', 'b', 'c'], ['c', 'x', 'd']);
 * 
 *   merge_lists([{id: 1}, {id: 2}], [{id: 2}, {id: 3}], (a, b) => a.id === b.id);
 */
export function merge_lists(a, b, predicate = (a, b) => a === b) {
  const c = [...a]; // copy to avoid side effects
  // add all items from B to copy C if they're not already present
  b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
  return c;
}

/* 
 * Recursively deep clone an object (sharing unserializable objects like functions) 
 * This is used to work around errors you get errors using structuredClone()
 */
export function deep_copy(obj) {
  /*try {
    return structuredClone(obj);
  } catch (error) {*/
    //let clone = obj.getClass().getDeclaredConstructor().newInstance();

  if( is_list(obj) )
    var clone = [];
  else if( is_dict(obj) )
    var clone = {};
  else
    return obj;  
  
  for( const k in obj ) {
    if( is_string(k) && k === 'db' )
      clone[k] = obj[k];
    else
      clone[k] = deep_copy(obj[k]);  
  }

  return clone;
}

/*
 * Perform variable substitution on references to environment variables (of the form $XYZ or ${XYZ})
 */
export function substitution(text, env) {

  if( is_empty(text) )
    return '';

  if( exists(env.tags) ) {
    if( exists(env.server_host) ) {
      const server_url = get_server_url(env);
      env.server_addr ??= server_url.hostname;
      env.server_port ??= server_url.port;
    }

    if( exists(env.url) && env.tags.includes('models') ) {
      env.model ??= get_model_repo(env.url ?? env.model_name);
    }
  }

  for( const k in env ) {
    const k1 = '$' + k.toUpperCase();
    const k2 = '${' + k.toUpperCase() + '}';

    let val = env[k];

    if( is_dict(val) ) {
      if( nonempty(val.value) )
        val = val.value;
      else if( exists(val.placeholder) )
        val = val.placeholder;
    }

    //var re = new RegExp(k1, 'g');
    //var rp = new RegExp(k2, 'g');

    //text = text.replace(re, map[k]);
    //text = text.replace(rp, map[k]);

    text = text.split(k1).join(val);
    text = text.split(k2).join(val);
  }

  return text;
}
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/types.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/download.js */
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
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/download.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/time.js */
/*
 * Timers and date/clock functions (TODO)
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/time.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/include.js */
/* #!/usr/bin/env node
 *//* import {
  htmlToNodes, abspath, file_extension, is_string
} from '../nanolab.js';
 */
/*
 * Add a script or stylesheet to the DOM, by default with global scope as last child of `<head>`.
 * This will create `<style>` and `<link>` objects from HTML, and accepts a variable number of
 * source paths to .js/.css files that it will resolve and add to the DOM once.  
 * 
 *     include('./scripts/app.js');
 *     include('./css/theme.css');
 *     include('./scripts/app.js', './css/theme.css', parent='#my-app');
 * 
 * The source paths can be a remote URL or local path on the server. If the path is relative,
 * it is assumed to be relative to the nanodev module root directory, and will automatically 
 * be adapted to be absolute. Use modules and imports instead when possible.
 * 
 * Set the last argument to parent node in the DOM under which to add the `<script>/<link>`
 * elements and to change the scope of these from being added to the global namespace.
 */
export function include(...src) {
  let html = ``; // https://stackoverflow.com/a/950146
  let parent = document.head;

  for( const i in src ) {
    if( i == src.length - 1 && !is_string(src[i]) ) {
      parent = src[i];  // reserve last element for parent
      break;
    }

    const x = src[i].trim();

    if( x.includes('<script') || x.includes('<link') ) {
      html += x;
      continue;
    }

    const ext = file_extension(x);

    if( ext === 'css' )
      html += `<link href="${abspath(x)}" rel="stylesheet">\n`;
    else  // the line breaks are needed for correct parsing of multiple sources
      html += `<script type="text/javascript" src="${abspath(x)}"></script>\n`;
  }

  console.group(`Including scripts ${src}`);
  const nodes = htmlToNodes(html, parent);
  console.groupEnd();
  return nodes;
}

/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/utils/include.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/views.js */
/* #!/usr/bin/env node
 */
/*
 * Static definitions of preset query views and their associated tags.
 * These aren't pulled from the DB because they're used in the site-wide
 * menus, and we want to avoid loading the DB when otherwise unused.
 */
export const QueryViews = {
  all: {
    name: 'All',
    tags: ['models', 'webui'],
    menu: false
  },
  models: {
    name: 'Models',
    tags: ['models'],
    menu: false
  },
  llm: {
    name: 'LLM',
    tags: ['llm'],
    menu: true
  },
  vlm: {
    name: 'VLM',
    tags: ['vlm'],
    menu: true
  },
  webui: {
    name: 'Web UI',
    tags: ['webui'],
    menu: 'divider'
  },
  containers: {
    name: 'Containers',
    tags: ['jetson-containers'],
    menu: true
  }
}

/*
 * Get the specified view from the browser's query string (?view=xyz)
 */
export function QueryView(param='view', default_view='all') {
  const params = new URLSearchParams(window.location.search);
  const key = params.has(param) ? params.get(param) : default_view;
  
  if( !(key in QueryViews) )
    return;

  var view = QueryViews[key];
  view.key = key;

  return view;
}

/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/views.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/portainer.js */
/*
 * portainer launcher
 */

export function portainer(env) {

  let server_host = env.server_host.split(':');
 
  const PORT = server_host.pop();
  const ADDR = server_host.pop();

  env.properties.docker_run.text = [
    `<a href="https://www.portainer.io/" target="_blank">Portainer</a> is web-based management platform for deploying containers,`,
    `orchestrating microservices, and control of distributed edge devices.`,
  ].join(' ');

  env.properties.docker_run.footer = [
    `After you start Portainer, navigate to`,
    `<a href="http://${ADDR}:${PORT}" target="_blank" class="code">http://${ADDR}:${PORT}</a>`,
    `to establish a login and enter the management console.`,
    `The command above mounts the system's socket for the docker daemon, so it can launch containers from within.`
  ].join(' ');

  env.docker_run = substitution(docker_run(env), {
    'cache_dir': env.cache_dir,
    'port': PORT
  });
  
  return env.docker_run;
}

// map ports 9000 and 9443
Resolver({
  func: portainer,
  name: 'Portainer CE',
  filename: 'portainer.sh',
  server_host: '0.0.0.0:9100',
  docker_image: 'portainer/portainer-ce:lts',
  docker_options: [
    '-it --rm --name=portainer',
    '-p ${PORT}:9000 -p 9443:9443',
    '-v /var/run/docker.sock:/var/run/docker.sock',
    '-v ${CACHE_DIR}/portainer:/data',
    '-v ${CACHE_DIR}:/root/.cache'
  ].join(' '),
  docker_run: 'docker run $OPTIONS $IMAGE',
  thumbnail: '/portal/dist/images/portainer.webp',
  nav_class: 'theme-light',
  nav_style: 'background-size: 150%;',
  hidden: true,
  tags: ['webui', 'shell'],
  links: {
    website: {
      name: "Portainer.io",
      url: "https://www.portainer.io/"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/portainer/portainer"
    },
    docs: {
      name: "Docs",
      url: "https://docs.portainer.io/"
    }
  }
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/portainer.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/n8n.js */
/*
 * n8n launcher
 */

export function n8n(env) {

  let server_host = env.server_host.split(':');
 
  const PORT = server_host.pop();
  const ADDR = server_host.pop();

  env.properties.docker_run.text = [
    `Use <a href="https://github.com/n8n-io/n8n" target="_blank">n8n</a> workflow automation platform to build AI-enabled bots from LangChain graphs.`,
    `Launch the server and navigate to <a href="http://${ADDR}:${PORT}" target="_blank" class="code">http://${ADDR}:${PORT}</a>`
  ].join(' ');

  env.properties.docker_run.footer = [
    'n8n has many <a href="https://docs.n8n.io/hosting/configuration/environment-variables/" target="_blank">environment variables</a>',
    'for configuring different API adapters in LangChain and <a href="https://docs.n8n.io/integrations/community-nodes/installation/" target="_blank">community nodes</a>',
    'for connecting LLMs to various messaging services, databases, and embedding endpoints for RAG.'
  ].join(' ');

  env.docker_run = substitution(docker_run(env), {
    'server_addr': ADDR,
    //'server_llm': as_url(env.server_llm),
    'cache_dir': env.cache_dir,
    'port': PORT
  });
  
  return env.docker_run;
}

Resolver({
  func: n8n,
  name: 'n8n',
  filename: 'n8n.sh',
  server_host: '0.0.0.0:5678',
  //server_llm: '0.0.0.0:9000',
  docker_image: 'n8nio/n8n:stable',
  docker_options: [
    '-it --rm --name=n8n --network=host',
    '-e N8N_LISTEN_ADDRESS=${SERVER_ADDR}',
    '-e N8N_PORT=${PORT}',
    '-e N8N_SECURE_COOKIE=false',
    //'-e OPENAI_API_BASE=${SERVER_LLM}v1 -e OPENAI_API_KEY=foo',
    '-v ${CACHE_DIR}/n8n:/root/node/.n8n',
  ].join(' '),
  docker_run: 'docker run $OPTIONS $IMAGE',
  CUDA_VISIBLE_DEVICES: "none",
  thumbnail: '/portal/dist/images/n8n.webp',
  nav_class: 'theme-light',
  nav_style: 'background-size: 150%; background-position: -120px, -55px;',
  hidden: true,
  tags: ['webui', 'shell'],
  links: {
    website: {
      name: "n8n.io",
      url: "https://n8n.io/"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/n8n-io/n8n"
    }
  }
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/n8n.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/aim.js */
/*
 * aim launcher
 */

export function aim_server(env) {

  let server_host = env.server_host.split(':');
  let web_host = env.web_host.split(':');

  const SERVER_PORT = server_host.pop();
  const SERVER_ADDR = server_host.pop();

  const WEB_PORT = web_host.pop();
  const WEB_ADDR = web_host.pop();

  env.properties.docker_run.text = [
    `Collect, monitor, and analyze multimodal ML/AI datasets and metrics with <a href="https://github.com/aimhubio" target="_blank">Aim</a>,<br/>`,
    `an open-source experiment tracker for visualization and model development.`,
  ].join(' ');

  env.properties.docker_run.footer = `
    This starts a centralized <a href="https://aimstack.readthedocs.io/en/latest/using/remote_tracking.html" target="_blank">remote server</a>
    that can be reached on your LAN from:<br/><br/>
    &nbsp;&nbsp;&nbsp;&nbsp; <b>Browser</b> &nbsp;
    <a href="http://${WEB_ADDR}:${WEB_PORT}" target="_blank" class="code">http://${WEB_ADDR}:${WEB_PORT}</a>
    &nbsp;&nbsp;&nbsp;&nbsp; <b>Python</b> &nbsp;
    <a href="http://${SERVER_ADDR}:${SERVER_PORT}" target="_blank" class="code">http://${SERVER_ADDR}:${SERVER_PORT}</a>
    <br/><br/>
    The data is logged from <a href="https://aimstack.readthedocs.io/en/latest/using/remote_tracking.html#client-side-setup" target="_blank">Python clients</a>
    during jobs and is stored locally.  See these <a href="https://aimstack.readthedocs.io/en/latest/examples/images_explorer_gan.html" target="_blank">examples</a>.
  `;

  env.docker_run = substitution(docker_run(env), {
    CACHE_DIR: env.cache_dir,
    SERVER_PORT: SERVER_PORT,
    SERVER_ADDR: SERVER_ADDR,
    WEB_PORT: WEB_PORT,
    WEB_ADDR: WEB_ADDR,
  });
  
  return env.docker_run;
}

Resolver({
  func: aim_server,
  name: 'Aim',
  filename: 'aim.sh',
  web_host: '0.0.0.0:9200',
  server_host: '0.0.0.0:53800',
  docker_image: 'dustynv/aim:3.27.0-r36.4.0',
  docker_options: [
    '-it --rm --name=aim',
    '--entrypoint /opt/aim/start-servers.sh',
    '--volume ${CACHE_DIR}/aim:/repo',
    '--env WEB_HOST=${WEB_ADDR}',
    '--env WEB_PORT=${WEB_PORT}',
    '--env SERVER_HOST=${SERVER_ADDR}',
    '--env SERVER_PORT=${SERVER_PORT}',
    '--publish ${WEB_PORT}:${WEB_PORT}',
    '--publish ${SERVER_PORT}:${SERVER_PORT}',
  ].join(' '),
  docker_run: [
    'docker run $OPTIONS $IMAGE'
  ].join(' '),
  thumbnail: '/portal/dist/images/aim.webp',
  nav_style: 'background-size: 125%;',
  nav_class: 'theme-light',
  hidden: true,
  tags: ['webui', 'shell'],
  links: {
    website: {
      name: "aimstack.io",
      url: "https://aimstack.io/"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/aimhubio/aim"
    },
    docs: {
      name: "Docs",
      url: "https://aimstack.readthedocs.io/en/latest"
    }
  }
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/aim.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/flowise.js */
/*
 * Flowise launcher
 */

export function flowise(env) {
  const PORT = env.server_host.split(':').pop();

  env.properties.docker_run.text = [
    `Start <a href="https://github.com/FlowiseAI" target="_blank">Flowise</a> server to use the graphical agent builder and create chat flows.`,
    `Then navigate your browser to <a href="http://0.0.0.0:${PORT}" target="_blank" class="code">http://0.0.0.0:${PORT}</a> (or your Jetson's IP)`
  ].join('<br/>');

  env.properties.docker_run.footer = [
    'To use local models, first start one of the <a href="models.html?view=llm" target="_blank">LLM Servers</a>,',
    'then in Flowise select the <span class="code">ChatOpenAI Custom</span> model type, and enter any value for the <span class="code">Model Name</span>.<br/><br/>',
    'The default login is defined in the docker environment with the following:</br>',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code">* username: nvidia</span></br>',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code">* password: nvidia</span></br>'
  ].join(' ');

  env.docker_run = substitution(docker_run(env), {
    'server_llm': as_url(env.server_llm),
    'cache_dir': env.cache_dir,
    'server_port': PORT
  });
  
  return env.docker_run;
}

Resolver({
  func: flowise,
  name: 'Flowise',
  filename: 'flowise.sh',
  server_host: '0.0.0.0:3000',
  server_llm: '0.0.0.0:9000',
  docker_image: 'flowiseai/flowise:latest',
  docker_options: [
    '-it --rm --name=flowise --network=host -e PORT=${SERVER_PORT}',
    '-e FLOWISE_USERNAME=nvidia -e FLOWISE_PASSWORD=nvidia',
    '-e OPENAI_API_BASE=${SERVER_LLM}/v1 -e OPENAI_API_KEY=foo',
    '-v ${CACHE_DIR}/flowise:/root/.flowise',
  ].join(' '),
  docker_run: 'docker run $OPTIONS $IMAGE',
  CUDA_VISIBLE_DEVICES: "none",
  thumbnail: '/portal/dist/images/flowise.webp',
  hidden: true,
  tags: ['webui', 'shell'],
  links: {
    website: {
      name: "FlowiseAI.com",
      url: "https://flowiseai.com/"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/FlowiseAI"
    }
  }
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/flowise.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/python.js */
/*
 * Python example
 */

export function python_chat(env) {
  const root = exists(env.parent) ? env.parent : env;

  const code = 
`# use 'pip install openai' before running this
from openai import OpenAI

client = OpenAI(
  base_url = '${get_server_url(env)}v1',
  api_key = 'foo' # not enforced
)

chat = [{
  'role': 'user',
  'content': '${TEST_PROMPT}'
}]

completion = client.chat.completions.create(
  model=\'default\', # not enforced
  messages=chat,${GenerationConfig({env:env})}
  stream=True
)

for chunk in completion:
  if chunk.choices[0].delta.content is not None:
    print(chunk.choices[0].delta.content, end='')
`;

  return code;
}


Resolver({
  func: python_chat,
  title: 'Python',
  filename: 'llm.py',
  hidden: true,
  group: ['python'],
  refs: ['llm'],
  tags: ['python'],
  text: [
    `This standalone Python example sends a <a href="https://platform.openai.com/docs/api-reference/chat/create" target="_blank" class="code">chat.completion</a> request to a LLM server and streams the response.`,
    `You can run this outside of container with minimal dependencies to install, or from other devices on your LAN.`
  ].join(' '),
  footer: [
    `For API documentation of the OpenAI Python client library, see:<br/>&nbsp;&nbsp;&nbsp;`,
    `<a href="https://github.com/openai/openai-python" target="_blank" class="code">https://github.com/openai/openai-python</a><br/>&nbsp;&nbsp;&nbsp;`,
    `<a href="https://platform.openai.com/docs/api-reference" target="_blank" class="code">https://platform.openai.com/docs/api-reference</a>`
  ].join(' ')
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/python.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/llama-factory.js */
/*
 * llama-factory launcher
 */

export function llama_factory(env) {

  let server_host = env.server_host.split(':');
  let web_host = env.web_host.split(':');

  const SERVER_PORT = server_host.pop();
  const SERVER_ADDR = server_host.pop();

  const WEB_PORT = web_host.pop();
  const WEB_ADDR = web_host.pop();

  const DOCKER_IMAGE = env.docker_image;

  env.properties.docker_run.text = `
    Fine-tune multimodal LLMs with <a href="https://github.com/hiyouga/LLaMA-Factory" target="_blank">LLaMa-Factory</a>,
    supporting PEFT, QLoRA, RLHF, KTO, SFT, reward modelling, and pretraining through HuggingFace <a href="https://github.com/huggingface/trl" target="_blank">TRL</a>.

    <p style="opacity: 80%; margin-top: 7px;">&nbsp;&nbsp;&nbsp;
      <i class="bi bi-exclamation-triangle-fill"></i>&nbsp;&nbsp;
      May exceed memory limits (Jetson AGX Orin 64GB recommended)
    </p>
  `;

  env.properties.docker_run.footer = `
    After you start the server, navigate your browser to <a href="http://${WEB_ADDR}:${WEB_PORT}" target="_blank" class="code">http://${WEB_ADDR}:${WEB_PORT}</a>
    <br/>
      This also supports serving a 
      <a href="https://github.com/hiyouga/LLaMA-Factory/tree/main?tab=readme-ov-file#deploy-with-openai-style-api-and-vllm" target="_blank">
        <span class="code">chat.completion</span>
      </a>
      inference endpoint with vLLM.
    <p>
      The <a href="https://github.com/hiyouga/LLaMA-Factory/blob/main/data/README.md" target="_blank">dataset formats</a> supported are Alpaca and ShareGPT,
      and there are several build-in <a href="https://github.com/hiyouga/LLaMA-Factory/tree/main/examples" target="_blank">examples</a> that will automatically download test data subsets & models.
    </p>
    <p>
      This is the build configuration of <span class="code">${DOCKER_IMAGE}</span> container:
      <pre class="code" style="color: revert; line-height: revert; margin: 0px;">
  - llamafactory version: 0.9.2
  - Platform: Linux-5.15.148-tegra-aarch64-with-glibc2.35
  - Python version: 3.10.12
  - PyTorch version: 2.6.0 (GPU)
  - Transformers version: 4.49.0
  - Datasets version: 3.2.0
  - Accelerate version: 1.2.1
  - PEFT version: 0.12.0
  - TRL version: 0.9.6
  - Bitsandbytes version: 0.45.4.dev0
  - vLLM version: 0.7.4
      </pre>
    You can change to the dark theme by adding <span class="code">?__theme=dark</span> to the URL.
    </p>
  `;

  env.docker_run = substitution(docker_run(env), {
    CACHE_DIR: env.cache_dir,
    SERVER_PORT: SERVER_PORT,
    SERVER_ADDR: SERVER_ADDR,
    WEB_PORT: WEB_PORT,
    WEB_ADDR: WEB_ADDR,
  });
  
  return env.docker_run;
}

Resolver({
  func: llama_factory,
  name: 'LLaMa Factory',
  filename: 'llama-factory.sh',
  web_host: '0.0.0.0:7860',
  server_host: '0.0.0.0:9000',
  hf_token: null,
  docker_image: 'dustynv/llama-factory:r36.4.0',
  docker_options: [
    '-it --rm --name=llama-factory',
    '-v ${CACHE_DIR}/llama-factory/cache:/data/llama-factory/cache',
    '-v ${CACHE_DIR}/llama-factory/config:/data/llama-factory/config',
    '-v ${CACHE_DIR}/llama-factory/data:/data/llama-factory/data',
    '-v ${CACHE_DIR}/llama-factory/saves:/data/llama-factory/saves',
    '-e GRADIO_SERVER_PORT=${WEB_PORT}',
    '-e API_PORT=${SERVER_PORT}',
    '-p ${WEB_PORT}:${WEB_PORT}',
    '-p ${SERVER_PORT}:${SERVER_PORT}',
  ].join(' '),
  docker_run: [
    'docker run $OPTIONS $IMAGE'
  ].join(' '),
  thumbnail: '/portal/dist/images/llama-factory.webp',
  nav_style: 'background-size: 115%;',
  nav_class: 'theme-light',
  hidden: true,
  tags: ['webui', 'shell'],
  links: {
    github: {
      name: "GitHub",
      url: "https://github.com/hiyouga/LLaMA-Factory"
    },
    docs: {
      name: "Docs",
      url: "https://llamafactory.readthedocs.io/en/latest/"
    }
  }
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/llama-factory.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/jupyterlab.js */
/*
 * jupyterlab launcher
 */

export function jupyterlab_server(env) {

  let server_host = env.server_host.split(':');
 
  const PORT = server_host.pop();
  const ADDR = server_host.pop();

  env.properties.docker_run.text = [
    `<a href="https://jupyter.org/" target="_blank">JupyterLab</a> is a remote web-based IDE with classic IPython notebook support`,
    `along with Linux terminals, file browsers, scientific plotting, and more.`,
  ].join(' ');

  env.properties.docker_run.footer = [
    `After you start Jupyter, copy the login token that it prints in the terminal, and navigate to`,
    `<a href="http://${ADDR}:${PORT}" target="_blank" class="code">http://${ADDR}:${PORT}</a>`,
    `to set an initial password.<br/><br/>`,
    `The environment is configured to automatically install GPU-accelerated Python wheels from the Jetson AI Lab`,
    `<a href="https://pypi.jetson-ai-lab.dev/jp6/cu126" target="_blank">pip server</a>, which`,
    `gets set like below:<br/><br/>&nbsp;&nbsp;&nbsp`,
    `<span class="code">PIP_INDEX_URL=<a href="https://pypi.jetson-ai-lab.dev/jp6/cu126" target="_blank">https://pypi.jetson-ai-lab.dev/jp6/cu126</a></span>`
  ].join(' ');

  env.docker_run = substitution(docker_run(env), {
    'cache_dir': env.cache_dir,
    'port': PORT
  });
  
  return env.docker_run;
}

Resolver({
  func: jupyterlab_server,
  name: 'JupyterLab',
  filename: 'jupyterlab.sh',
  server_host: '0.0.0.0:8888',
  docker_image: 'dustynv/jupyterlab:r36.4.0',
  docker_options: [
    '-it --rm --name=jupyterlab --network=host',
    '-e JUPYTER_PORT=${PORT}',
    '-e JUPYTER_LOGS=/root/.cache/jupyter/jupyter.log',
    //'-e OPENAI_API_BASE=${SERVER_LLM}v1 -e OPENAI_API_KEY=foo',
    '-v ${CACHE_DIR}/jupyter:/root/.cache/jupyter',
    '-v ${CACHE_DIR}/jupyter/ipynb_checkpoints:/root/.ipynb_checkpoints',
    '-v ${CACHE_DIR}/jupyter/ipython:/root/.ipython',
    '-v ${CACHE_DIR}/jupyter/jupyter:/root/.jupyter'
  ].join(' '),
  docker_run: 'docker run $OPTIONS $IMAGE',
  thumbnail: '/portal/dist/images/jupyterlab.webp',
  nav_class: 'theme-light',
  hidden: true,
  tags: ['webui', 'shell'],
  links: {
    website: {
      name: "Project Jupyter",
      url: "https://jupyter.org/"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/jupyterlab"
    },
    docs: {
      name: "Docs",
      url: "https://jupyterlab.readthedocs.io/en/latest/"
    }
  }
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/jupyterlab.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/perf_bench.js */
/*
 * Generate benchmarking
 */

export function llm_perf_bench(env) {

  if( env.parent ) {
    env.server_host = env.parent.server_host;
  }

  /*const perf_container = 'dustynv/mlc:r36.4.0';
  const server_url = get_server_url(env, 'http://0.0.0.0:9000');
  const newline = ' \\\n ';

  let perf_cmd = [
    `docker run ${wrapLines(docker_options(env, false))} --network=host`,
    ` -v /var/run/docker.sock:/var/run/docker.sock`,
    ` ${perf_container} sudonim bench stop`,
    `  --host ${server_url.hostname ?? '0.0.0.0'}`,
    `  --port ${server_url.port ?? 9000}`,
    `  --model ${env.url}`
  ];

  if( 'tokenizer' in env )
    perf_cmd.push(` --tokenizer ${env.tokenizer}`);

  return perf_cmd.join(newline);*/

  return docker_run(env);
}

Resolvers({perf_bench: {
  func: llm_perf_bench,
  title: 'Performance Benchmark',
  filename: 'perf-bench.sh',
  hidden: true,
  docker_image: "dustynv/mlc:r36.4.0",
  docker_options: "-it --rm --network=host -v /var/run/docker.sock:/var/run/docker.sock",
  docker_cmd: "sudonim bench stop",
  group: ['shell'],
  refs: ['llm'],
  tags: ['docker_profile', 'shell', 'container'],
  text: `Profile the decode generation rate (tokens/sec) and context prefill latency:`,
  footer: [
    `This client benchmarks the <span class="code">chat.completion</span> endpoint,`, 
    `so it needs the LLM server to be running. The results are saved under`,
    `<span class="code">$CACHE/benchmarks</span>`
  ].join(' ')
}});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/perf_bench.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/open_webui.js */
/*
  OpenWebUI launcher

  docker run -it --rm --network=host \
    -e ENABLE_OPENAI_API=True \
    -e ENABLE_OLLAMA_API=False \
    -e OPENAI_API_BASE_URL=http://localhost:9000/v1 \
    -e OPENAI_API_KEY=foo \
    -v /mnt/nvme/cache:/root/.cache \
    -v /mnt/nvme/cache/open-webui:/app/backend/data \
    --name open-webui \
      ghcr.io/open-webui/open-webui:main
*/

export function open_webui(env) {
  
  const port = env.server_host.split(':').pop();

  if( exists(env.parent) ) {
    var root = env.parent;
    var server_llm = get_server_url(env.parent ?? {});
  }
  else {
    var root = env;
    root.properties.docker_run.text = [
      `Start an <a href="https://github.com/open-webui/open-webui" target="_blank">Open WebUI</a> server that uses a running <span class="code">chat.completion</span> model:`,
      `Then navigate your browser to <a href="http://0.0.0.0:${port}" target="_blank" class="code">http://0.0.0.0:${port}</a> (or your Jetson's IP)`
    ].join('<br/>'),
    root.properties.docker_run.footer = env.footer; // `These individual commands are typically meant for exploratory use - see the <span class="code">Compose</span> tab for managed deployments of models and microservices.`
  }

  env.cache_dir = root.cache_dir;

  env.docker_run = substitution(docker_run(env), {
    server_llm: server_llm ?? as_url(env.server_llm),
    server_asr: as_url(env.server_asr),
    server_tts: as_url(env.server_tts),
    cache_dir: root.cache_dir,
    port: port
  });

  return env.docker_run;
}

Resolver({
  func: open_webui,
  name: 'Open WebUI',
  filename: 'open-webui.sh',
  server_host: '0.0.0.0:8080',
  server_llm: '0.0.0.0:9000',
  server_asr: '0.0.0.0:8990',
  server_tts: '0.0.0.0:8995',
  docker_image: 'ghcr.io/open-webui/open-webui:main',
  docker_options: [
    '-it --rm --name open-webui --network=host -e PORT=${PORT}', /* --net-alias open-webui */
    '-e ENABLE_OPENAI_API=True -e ENABLE_OLLAMA_API=False',
    '-e OPENAI_API_BASE_URL=${SERVER_LLM}/v1 -e OPENAI_API_KEY=foo',
    '-e AUDIO_STT_ENGINE=openai -e AUDIO_TTS_ENGINE=openai',
    '-e AUDIO_STT_OPENAI_API_BASE_URL=${SERVER_ASR}/v1',
    '-e AUDIO_TTS_OPENAI_API_BASE_URL=${SERVER_TTS}/v1',
    '-v ${CACHE_DIR}/open-webui:/app/backend/data',
  ].join(' '),
  docker_run: 'docker run $OPTIONS $IMAGE',
  CUDA_VISIBLE_DEVICES: "none",
  thumbnail: '/portal/dist/images/open-webui.webp',
  nav_style: 'background-size: auto;',
  hidden: true,
  group: ['shell'],
  refs: ['llm'],
  tags: ['docker_profile', 'shell', 'webui'],
  links: {
    website: {
      name: "openwebui.com",
      url: "https://openwebui.com/"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/open-webui/open-webui"
    }
  },
  text: [
    `Start an <a href="https://github.com/open-webui/open-webui" target="_blank">Open WebUI</a> user interface with this model, as per this <a href="/tutorial_openwebui.html" target="_blank">tutorial</a>.`,
    `Then navigate your browser to <a href="http://0.0.0.0:8080" target="_blank" class="code">http://0.0.0.0:8080</a> (or your Jetson's IP)`
  ].join('<br/>'),
  footer: [
    `The <span class="code">chat.completion</span> model server should already be running before starting Open WebUI`, 
    `(which is handled automatically when using docker-compose)<br/>`,
    `It will have you create a login on the first use, but its only stored locally.`
  ].join(' ')
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/open_webui.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/curl.js */
/*
 * Generate curl test script
 */

export function curl_llm(env) {
  if( exists(env.parent) )
    env = env.parent;
  
  const code = 
  `curl http://${env.server_host}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${TEST_KEY}" \\
  -d '{
    "model": "${TEST_MODEL}",
    "messages": [{"role":"user","content":"${TEST_PROMPT}"}],${GenerationConfig({env:env, indent: 4, assign: ': ', quote: '\"'})}
    "stream": true                
  }'`;

  return code;
}

export function curl_vlm(env) {
  if( exists(env.parent) )
    env = env.parent;

  const code =
  `curl http://${env.server_host}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{
      "role": "user",
      "content": [{
        "type": "text",
        "text": "What is in this image?"
      },
      {
        "type": "image_url",
        "image_url": {
          "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
        }
      }
    ]}],
    "max_tokens": 300
  }'`;

  return code;
}

Resolvers({
  curl_request: {
    func: curl_llm,
    title: 'Curl Request',
    filename: 'curl.sh',
    hidden: true,
    group: 'shell',
    tags: ['string', 'shell'],
    refs: ['llm'],
    text: `Check the connection and model response with a simple test query:`,
    footer: `The LLM reply is interleaved in the output stream and not particularly readable, but will produce errors if there was an issue with the request.`
  },
  curl_vlm: {
    func: curl_vlm,
    title: 'Curl Request',
    filename: 'curl-vlm.sh',
    hidden: true,
    group: 'shell',
    tags: ['string', 'shell'],
    refs: ['vlm'],
    text: `This curl query is for vision/language models and uses images in the prompt:`,
    footer: `<b>Note:</b> for ollama, see the Python examples that use base64 encoding instead.`
  },
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/curl.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/vlm.js */
/*
 * VLM code examples (todo move under clients/ or resources/)
 */

Resolver({
  key: 'python-vlm-simple',
  url: 'https://github.com/dusty-nv/sudonim/blob/main/sudonim/clients/vlm-simple.py',
  title: '<span class="code" style="font-size: 105%">vlm.py</span>',
  filename: 'vlm.py',
  hidden: true,
  refs: ['vlm'],
  group: ['python'],
  tags: ['python'],
  text: `
    This simple VLM <a href="https://github.com/dusty-nv/sudonim/blob/main/sudonim/clients/vlm-simple.py" target="_blank">client</a>
    shows how to embed images in the <span class="code">chat.completion</span> messages and run an example query.  It supports streaming outputs.
  `,
  footer: `
    Before running <span class="code">vlm.py</span>, the model service container should be started, and you should <span class="code">pip install openai</span>
    in your Python environment if needed. 
    <br/>
    Due to the lightweight dependencies, you can install clients natively outside of container, or in other containers.
    <br/><br/>
    For relevant API documentation from the OpenAI Python library, see:<br/>&nbsp;&nbsp;&nbsp;
    <a href="https://github.com/openai/openai-python" target="_blank" class="code">https://github.com/openai/openai-python</a><br/>&nbsp;&nbsp;&nbsp;
    <a href="https://platform.openai.com/docs/guides/images" target="_blank" class="code">https://platform.openai.com/docs/guides/images</a>
  `
});

Resolver({
  key: 'python-vlm',
  url: 'https://github.com/dusty-nv/sudonim/blob/main/sudonim/clients/vlm.py',
  title: '<span class="code" style="font-size: 105%">vlm-bench.py</span>',
  filename: 'vlm-bench.py',
  hidden: true,
  refs: ['vlm'],
  group: ['python'],
  tags: ['python'],
  text: `
    This multimodal <span class="code">chat.completion</span> 
    <a href="https://github.com/dusty-nv/sudonim/blob/main/sudonim/clients/vlm.py" target="_blank">client</a>
    supports text/image inputs and streaming text output.  It runs some example Visual Question Answering (VQA) prompts
    on these <a href="https://github.com/dusty-nv/jetson-containers/tree/master/data/images" target="_blank">test images</a>,
    encoded as <a href="https://annacsmedeiros.medium.com/efficient-image-processing-in-python-a-straightforward-guide-to-base64-and-numpy-conversions-e9e3aac13312" target="_blank">base64</a>
    in the chat message URLs.
  `,
  footer: `
    This tool measures the performance of the VLM in terms of the <b>Time To First Token (TTFT)</b> -
    how long until the model started generating output, 
    which includes the VIT processing, multimodal projector, and prefill latency -
    and the decode generation rate in tokens per second. 
  `
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/launchers/vlm.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/profiles.js */
export function docker_profile(env, depends) {

  const profile_name = env.key.replace('_', '-');
  const profile_cmd = env.value;

  if( is_empty(profile_cmd) ) {
    console.warn(`Missing resolved ${env.key}.value for docker_profile`);
    return;
  }

  /*if( nonempty(env, profile_key) )
    profile_cmd = env[profile_key];
  else {
    if( exists(env.properties[profile_key].func) )
      profile_cmd = env.properties[profile_key].func(env);
  }*/

  let comp = composerize(profile_cmd, null, 'latest', 2);

  while( comp.startsWith('#') ) {
    console.warn(`Ignoring comment in generated docker-compose:`, comp);
    comp = comp.substring(comp.indexOf("\n") + 1);
  }

  for( let n=0; n < 3; n++ )
    comp = comp.substring(comp.indexOf("\n") + 1);

  const comp_pre = `  ${profile_name}:\n    profiles:\n      - ${profile_name}\n` +
    `    depends_on:\n      ${depends}:\n        condition: service_healthy\n`;

  return docker_service_name(comp_pre + comp, profile_name);
}

export function docker_profiles(env, depends) {

  let root_env = exists(env.parent) ? env.parent : env;
  let profiles = {};

  for( const ref_key in root_env['references'] ) {
    const ref = root_env.references[ref_key];

    if( !ref.tags.includes('docker_profile') )
      continue;

    let profile_cmd = docker_profile(ref, depends);

    if( !exists(profile_cmd) )
      continue;

    profiles[ref_key.replace('_', '-')] = profile_cmd;
  }

  return profiles;
}

export function docker_service_name(compose, name) {
  for( const api of ['mlc', 'llama_cpp', 'ollama', 'tensorrt_llm', 'vllm', 'awq'] )
    compose = compose.replace(`  ${api}:`, `  ${name}:`);
  return compose;
}
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/profiles.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/compose.js */
/*
 * Generate 'docker run' templates for launching models & containers
 */
export function docker_compose(env, service_name='llm-server') {

  //if( !env.db.ancestors[env.key].includes('container') )
  //  return;

  var root = exists(env.parent) ? env.parent : env;
  var compose = composerize(root.docker_run ?? docker_run(root), null, 'latest', 2); // this gets imported globally by nanolab.js
  compose = compose.substring(compose.indexOf("\n") + 1); // first line from composerize is an unwanted name

  const server_url = get_server_url(root, 'http://0.0.0.0:9000');

  /*compose = `# Save as compose.yml and run 'docker compose up'\n` +
    `# Benchmark:  docker compose --profile perf-bench up\n` + 
    `# Open WebUI: docker compose --profile open-webui up\n` + 
    (model_api === 'llama.cpp' ? '# With llama.cpp backend, you may encounter request ack/response errors (these can safely be ignored during the benchmark)\n' : '') 
    + compose;*/
  
  compose = docker_service_name(compose, service_name);

  if( env.db.ancestors[root.key].includes('models') ) {
    compose += `\n    healthcheck:`;
    compose += `\n      test: ["CMD", "curl", "-f", "http://${server_url.hostname}:${server_url.port}/v1/models"]`;
    compose += `\n      interval: 20s`;
    compose += `\n      timeout: 60s`;
    compose += `\n      retries: 45`;    
    compose += `\n      start_period: 15s`; 
  }
  
  const profiles = docker_profiles(root, service_name);

  let profile_docs = [];
  let profile_text = '';

  for( const profile in profiles ) {
    profile_docs.push(`* docker compose --profile ${profile} up`)
    compose += '\n' + profiles[profile];
  }

  if( nonempty(profile_docs) ) {
    profile_text = substitution(env.profile_text, {
      DOCKER_PROFILE_LIST: profile_docs.join('<br/>')
    });
  }

  env.text = substitution(env.text, {
    DOCKER_PROFILE_DOCS: profile_text
  });

  return compose;
}

Resolver({
  key: 'compose',
  name: 'Compose',
  tags: ['code', 'resource'],
  language: 'yaml',
  hidden: true
});

Resolver({
  func: docker_compose,
  name: 'Docker Compose',
  filename: 'compose.yml',
  language: 'yaml',
  hidden: true,
  group: "compose",
  tags: ['compose'],
  refs: ['llm', 'vlm', 'webui'],
  text: [
    'Use this <a href="https://docs.docker.com/reference/compose-file/services/" ' +
    'title="To install docker compose on your Jetson use:\n ' +
    'sudo apt install docker-compose-v2" target="_blank" class="code">compose.yml</a> ' +
    'to manage microservice deployments and workflows.<br/>' +
    '${DOCKER_PROFILE_DOCS}' +
    'By default,<span class="code"> docker compose up </span>will prepare the model and start the server. <br/>' +
    'To stop the containers, run<span class="code"> docker compose down --remove-orphans</span>'
  ].join(' '),
  profile_text: [
    'These embedded docker profiles launch the example scripts & tools:<br/>',
    '<div class="code" style="margin: 5px 0px 5px 25px">${DOCKER_PROFILE_LIST}<br/></div>'
  ].join('')
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/compose.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/run.js */
/* import { substitution } from "../../nanolab";
 */
/*
 * Generate 'docker run' templates for launching models & containers
 */
export function docker_run(env) {
  const opt = wrapLines(
    nonempty(env.docker_options) ? env.docker_options : docker_options(env)
  ) + ' \\\n ';

  const indent = ' '.repeat(4);
  const line_sep = '\\\n';
  const line_indent = line_sep + indent;
  
  const image = `${env.docker_image} ${line_sep}   `; 
  const exec = nonempty(env.docker_cmd) ? `${env.docker_cmd} ${line_sep}     ` : ``;

  let args = wrapLines({text: docker_args(env), indent: 6});
  let cmd = nonempty(env.docker_run) ? env.docker_run : env.db.index['docker_run'].value;

  cmd = cmd
    .trim()
    .replace('$OPTIONS', '${OPTIONS}')
    .replace('$IMAGE', '${IMAGE}')
    .replace('$COMMAND', '${COMMAND}')
    .replace('$ARGS', '${ARGS}');

  if( !cmd.endsWith('${ARGS}') )
    args += ' ' + line_sep + ' '.repeat(6);  // line break for user args

  cmd = cmd
    .replace('${OPTIONS}', opt)
    .replace('${IMAGE}', image)
    .replace('${COMMAND}', exec)
    .replace('${ARGS}', args);

  console.log('EXEC', exec);
  console.log('ARGS', args);
  
  cmd = substitution(cmd, env).trim();

  cmd = cmd
    .replace('\\ ', '\\')
    .replace('  \\', ' \\');  

  if( cmd.endsWith(line_sep) )
    cmd = cmd.slice(0, -line_sep.length + 1);

  if( cmd.endsWith(' \\') )
    cmd = cmd.slice(0, -2);

  if( cmd.endsWith('\\') )
    cmd = cmd.slice(0, -1);

  return cmd; 
}

Resolver({
  func: docker_run,
  name: 'Docker Run Cmd',
  title: 'Docker Run',
  filename: 'docker-run.sh',
  value: "docker run $OPTIONS $IMAGE $COMMAND $ARGS",
  group: 'shell',
  tags: ['string', 'shell'],
  help: [
    `Template that builds the 'docker run' command from $OPTIONS $IMAGE $COMMAND $ARGS\n`,
    `You can more deeply customize the container settings by altering these.`,
  ],
  text: `Run these terminal commands from the host device or SSH, this one downloading the model and starting an <span class="code">openai.chat.completion</span> server:`,
  footer: `These individual commands are typically meant for exploratory use - see the <span class="code">Compose</span> tab for managed deployments of models and microservices.`
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/run.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/args.js */
/*
 * These are docker run CMD entrypoint arguments that follow the container name.
 */
export function docker_args(env) {

  if( env.tags.includes('models') ) // TODO findParent() / findAncestor()
    var model = env;
  else if( exists(env.parent) && env.parent.tags.includes('models') )
    var model = env.parent;
  else 
    return env.docker_args ?? '';

  const model_id = model.url ?? model.model_name;
  const model_api = get_model_api(model_id)
  const model_repo = get_model_repo(model_id);
  const server_url = get_server_url(model);

  let args = [];
  
  if( env.tags.includes('sudonim') ) {
    args.push(
      `--model ${model_repo}`,
      `--quantization ${model.quantization}`,
      `--max-batch-size ${model.max_batch_size}`
    );

    if( is_value(model.max_context_len) ) {
      args.push(`--max-context-len ${model.max_context_len}`);
    }

    if( is_value(model.prefill_chunk) ) {
      args.push(`--prefill-chunk ${model.prefill_chunk}`);
    }

    if( nonempty(model.chat_template) ) {
      args.push(`--chat-template ${model.chat_template}`);
    }

    if( exists(server_url) ) {
      args.push(
        `--host ${server_url.hostname}`,
        `--port ${server_url.port}`
      );
    }
  }

  if( exists(env.docker_args) ) {
    args.push(env.docker_args);
  }

  let sub = {
    'SERVER_ADDR': server_url.hostname,
    'SERVER_PORT': server_url.port,
    'MAX_CONTEXT_LEN': is_value(model.max_context_len) ? model.max_context_len : 4096,
    'MAX_BATCH_SIZE': is_value(model.max_batch_size) ? model.max_batch_size : 1,
    'MODEL': model_repo,
  };

  if( env.quantization === "fp16" )
    sub['VLLM_QUANTIZATION'] = '';
  else if( env.quantization === "fp8" )
    sub['VLLM_QUANTIZATION'] = '--quantization=fp8'
  else if( env.quantization === "bnb4" )
    sub['VLLM_QUANTIZATION'] = '--quantization=bitsandbytes --load-format=bitsandbytes'

  if( is_value(model.max_batch_size) ) {
    sub['MAX_BATCH_SIZE'] = model.max_batch_size;
  }

  if( is_value(model.max_context_len) ) {
    sub['MAX_CONTEXT_LEN'] = model.max_context_len;
  }

  return substitution(args.join(' '), sub);
}

/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/args.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/network.js */
/*
 * Networking options for docker
 */

export function as_url(url) {
  return new URL('http://' + url);
}

export function get_server_url(env, default_host='0.0.0.0:9000') {
  if( nonempty(env.server_host) )
    var host = env.server_host;
  else if( exists(env.parent) && exists(env.parent.server_host) )
    var host = env.parent.server_host;
  else
    var host = default_host;

  return as_url(host);
}

export function get_endpoint_url(env, default_host='0.0.0.0:9000') {
  return `${get_server_url(env, default_host)}/v1/chat/completions`;
}

export function docker_network(env) {
  if( exists(env.docker_options) ) { // skip these defaults if manually specified
    if( env.docker_options.includes('--network') || env.docker_options.includes('-p ') || env.docker_options.includes('--publish ') )
      return;
  }

  const server_url = get_server_url(env);

  if( exists(server_url) )
    return `-p ${server_url.port}:${server_url.port}`;

  return '--network host';
}
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/network.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/docker.js */
/*
 * Generate 'docker run' and docker-compose templates for launching models & containers
 */

Resolvers({
  container: {
    name: "Docker Container",
    tags: [],
    docker_options: null,
    docker_image: null,
    docker_cmd: null,
    docker_run: null,
    auto_update: null,
    cache_dir: null,
    CUDA_VISIBLE_DEVICES: "all"
  },

  docker_image: {
    tags: "string",
    help: [
      "Specify the container image to run and launch the server.\n",
      "On Jetson, pick a tag that is compatible with your version of JetPack.\n",
      "For example, L4T r36.4.0 images are compatible with JetPack 6.1 and 6.2.\n",
      "These are built from jetson-containers with CUDA and are on DockerHub."
    ]
  },

  docker_cmd: {
    name: "Docker Entrypoint",
    tags: "string",
    help: [
      "Override the default docker entrypoint command and its arguments that get executed when the container starts.",
    ]
  },

  docker_profile: {
    tags: ["string"]
  },

  auto_update: {
    tags: "string",
    options: ["on", "off"],
    help: "When set to 'on', will automatically pull the latest container on start-up."
  },

  cache_dir: {
    tags: "path",
    value: "/mnt/nvme/cache",
    help: [
      "Path on the server's native filesystem that will be mounted into the container\n",
      "for saving the models.\nIt is recommended this be relocated to NVME storage."
    ]
  },

  web_host: {
    name: "Webserver IP / Port",
    tags: "string",
    help: [
      "This is the hostname/IP and port of the frontend webserver that browsers would navigate to."
    ]
  },

  server_host: {
    name: "Server IP / Port",
    tags: "string",
    help: [
      "The server's hostname/IP and port that it is listening on for incoming requests.\n",
      "0.0.0.0 will listen on all network interfaces (127.0.0.1 from localhost only)\n",
      "This IP address also gets populated in the examples, so set it to your device."
    ]
  },

  server_llm: {
    name: "LLM Server URL",
    tags: "string",
    help: [
      "The LLM server's hostname/IP and port (commonly OPENAI_API_BASE_URL)\n",
      "The server implements the chat.completion endpoint for LLMs.\n",
    ]
  },

  server_asr: {
    name: "ASR Server URL",
    tags: "string",
    help: [
      "The speech-to-text server's hostname/IP and port\n",
      "The server implements the audio.transcriptions endpoint for ASR/STT.\n",
    ]
  },

  server_tts: {
    name: "TTS Server URL",
    tags: "string",
    help: [
      "The text-to-speech server's hostname/IP and port\n",
      "The server implements the audio.transcriptions endpoint for TTS.\n",
    ]
  }
});
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/docker.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/options.js */
/*
 * These are docker options that preceed the container image name.
 */
export function docker_options(env, use_cuda=true) {
  let opt = [];
  const root = exists(env.parent) ? env.parent : env;

  if( nonempty(env.docker_options) )
    opt.push(env.docker_options);

  if( exists(env.docker_options) && !env.docker_options.includes('--name') && env.tags.includes('llm') )
    opt.push(`--name llm_server`);

  if( use_cuda && nonempty(env.CUDA_VISIBLE_DEVICES) && env.CUDA_VISIBLE_DEVICES.toLowerCase() != 'none' )
    opt.push(`--gpus ${env.CUDA_VISIBLE_DEVICES}`);

  const network_flags = docker_network(env);

  if( nonempty(network_flags) )
    opt.push(network_flags);

  const autoUpdate = env.auto_update ?? (exists(env.parent) ? env.parent.auto_update : 'on');

  if( !exists(autoUpdate) || autoUpdate != 'off' ) {
    opt.push('-e DOCKER_PULL=always^^^--pull always');
  }

  if( exists(env.hf_token) ) {
    const tr = env.hf_token.trim();
    if( tr.length > 0 )
      opt.push(`-e HF_TOKEN=${tr}`);
  }

  if( exists(root.cache_dir) ) {
    const tr = root.cache_dir.trim();
    if( tr.length > 0 ) {
      var cache_dir = `-v ${tr}:/root/.cache `;
      var hf_hub_dir = `-e HF_HUB_CACHE=/root/.cache/huggingface `;
      opt.push(hf_hub_dir + cache_dir);
    }
  }

  return opt.join(' ');
}

Resolver({
  func: docker_options,
  tags: 'string',
  value: '-it --rm',
  help: [
    `These are extra prefix flags that get passed to 'docker run' when starting the container.`,  
    `These are the arguments that come before the container image name, for example --volume ~/workspace:/workspace --env WORKSPACE=/workspace"`
  ]
});

/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/docker/options.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/models/generation.js */
/*
 * Generation parameters
 */
export function GenerationConfig({env, quote='', assign='=', indent=2}) {
  env.temperature ??= env.key.includes('deepseek') ? 0.6 : 0.2;
  env.top_p ??= env.key.includes('deepseek') ? 0.95 : 0.7;

  const params = {
    'temperature': 'temperature',
    'top_p': 'top_p',
    'max_context_len': 'max_tokens'
  }

  let txt = '';

  for( const param_key in params ) {
    if( !is_value(env[param_key]) )
      continue
    txt += `\n${' '.repeat(indent)}${quote}${params[param_key]}${quote}${assign}${env[param_key]},`
  }

  return txt;
}
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/models/generation.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/models/prompts.js */

const TEST_PROMPT = "Why did the LLM cross the road?";
const TEST_MODEL = "default";
const TEST_KEY = "foo";

//const TEST_PROMPT = "You can put multiple chat turns in here.";
//const TEST_PROMPT = "Please tell me about your features as an LLM.";
//const TEST_PROMPT = "Write a limerick about the wonders of GPU computing.";

/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/resolvers/models/prompts.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/panels/propertyTable.js */
/* #!/usr/bin/env node
 *//* import { 
  PropertyField, PropertyLabel, htmlToNode, 
  as_element, make_url, exists
} from '../nanolab.js';
 */

/*
 * Introspective table for displaying and editing graph node properties.
 * This will build the UI controls for an object's properties in a <table> element.
 */
export class PropertyTable {
  /*
   * Args:
   *   db (GraphDB) -- The previously loaded graph DB containing the index.
   *   key (str) -- The resource/model/service to use from the registry index.
   */
  constructor({db, key, env, id, parent}) {
    this.db = db;
    this.key = key ?? env.key;
    this.id = id ?? `${key}-property-table`;

    this.events = {};
    this.parent = as_element(parent);
    this.node = htmlToNode(`<table id="${this.id}" class="property-table"></table>`, this.parent);

    if( !(this.key in this.db.index) )
      throw new Error(`could not find '${this.key}' trying to open property editor`);

    this.refresh(this.key, env);
  }

  /*
   * Bind event handler on 'change' and 'keydown'
   */
  on(event, handler) {
    this.events[event] = handler;
    return this;
  }

  /*
   * update dynamic elements on selection changes
   */
  refresh(key, env) {
    if( exists(key) )
      this.key = key;
    else if( exists(env) )
      this.key = key = env.key;

    key ??= this.key;
    env ??= this.db.resolve(key);

    let html = '';
    let fields = env.property_order ?? [];

    for( const field_key in env.properties ) {
      if( !fields.includes(field_key) )
        fields.push(field_key);
    }

    for( const field_key of fields ) {
      if( is_empty(env.properties, field_key) ) {
        console.warn(`[Property Editor] Missing property '${field_key}' in '${env.key}'  (skipping...)`);
        continue;
      }

      if( env.properties[field_key].hidden )
        continue;

      const field = Object.assign({
        db: this.db,
        key: field_key,
        value: env[field_key],
        id: `${field_key}-control`,
      }, 
      env.properties[field_key]);
      /*this.db.flatten({
        key: key, 
        property: field_key
      }));*/
      //console.log(field);
      
      html += `<tr><td style="white-space: nowrap; vertical-align: center;">${PropertyLabel(field)}</td><td style="width: 99%;">${PropertyField(field)}</td></tr>`;
    }

    this.node.innerHTML = html;

    // bind handlers to update the property values
    for( let control of this.node.getElementsByClassName("property-field") ) {
      const event_key = control.dataset.key; const self = this;

      //control.addEventListener('change', this.setProperty.bind(this));
      control.addEventListener('input', this.setProperty.bind(this));

      /*control.addEventListener('keydown', (evt) => {
        console.log(`[Property Editor] Value of ${event_key} (id=${control.id}) changed to '${control.value}'`);
        if( event_key == 'url' )
          self.updateURL({id: evt.target.id, url: evt.target.value});
      });*/

      if( event_key == 'url' )
        this.updateURL({id: control.id, url: control.value});
    }
  }

  setProperty(args={}) {
    const id = args.target.id;
    let value = args.target.value;
    const event_key = args.target.dataset.key;

    console.log(`[Property Editor] Value of ${event_key} (id=${id}) for ${this.key} changed to '${value}'`);

    //if( this.db.ancestors[event_key].includes('number') ) 
      //value = Number(value);

    this.db.flat[this.key][event_key] = value;
    
    if( event_key == 'url' ) {
      this.updateURL({id: id, url: value});
    }

    if( 'change' in this.events ) {
      this.events.change({
        db: this.db, key: this.key, property: event_key, value: value
      });
    }
  }

  updateURL({id,url}) {
    url = make_url(url);
    let link = this.node.querySelector(`#${id}-link`);
    link.href = url;
    link.title = url;
    console.log(`[Property Editor] Updated link (${id}) to ${url}`);
  }
}

/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/panels/propertyTable.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/panels/codeEditor.js */
/* #!/usr/bin/env node
 *//* import { 
  htmlToNode, htmlToNodes, exists, nonempty, as_element, save_page, save_pages
} from '../nanolab.js';
 */

/**
 * Multi-file / multi-tab code editor with interactive syntax highlighting
 */
export class CodeEditor {
  /*
   * Args:
   *  id -- the desired ID for the CodeEditor component (or 'code-editor' by default)
   *  parent -- the parent HTML node to add this component to as a child
   */
  constructor({id,parent}={}) {
    this.id = id ?? `code-editor`;
    this.parent = as_element(parent);
    this.outerHTML = `
      <div id="${this.id}" class="code-editor">
        <div id="${this.id}-tab-group" class="btn-group">
            <i id="${this.id}-download-set" class="bi bi-arrow-down-circle btn-float btn-absolute" title="Download the set of scripts for this model in a zip"></i>
        </div>
      </div>`;

    this.node = htmlToNode(this.outerHTML);
    this.tabs = this.node.getElementsByClassName('btn-group')[0];
    
    this.download_set = this.node.querySelector(`#${this.id}-download-set`);
    this.download_set.addEventListener('click', (evt) => {
      if( exists(this.pages) )
        save_pages(this.pages, this.key);
    });  

    if( this.parent )
      this.parent.appendChild(this.node);
  }

  /*
   * Layout components given a set of code tabs, sources, or files.
   */
  refresh(env) {
    if( !exists(env) )
      return;

    if( this.refreshing ) {
      console.warning(`[CodeEditor] detected re-entrant call to refresh(), skipping...`);
      return;
    }
    
    //console.log(`[CodeEditor] refreshing tabs with:`, env);

    this.key = env.key;
    this.refreshing = true;
    this.pages = this.createPageGroups(env);

    for( const tab_key in this.pages ) {
      const tabNode = this.createTab(env, tab_key);
      this.node.appendChild(tabNode);

      if( this.isActiveTab(tab_key) )
        this.setActiveTab(tab_key);
    }

    this.refreshing = false;
  }

  /*
   * Create a collapsable/scrollable area of paged resources.
   */
  createPage(page, page_key, page_ids, env) {
    const has_code = page.tags.includes('code');
    const expanded = page.expand ?? true;
    const expClass = {true: 'bi-chevron-down', false: 'bi-chevron-up'};

    let pageTitle = page.title ?? page.name;
    
    if( nonempty(page.url) )
      pageTitle = `<a href="${page.url}" target="_blank" class="tab-page-title">${pageTitle}</a>`;
    else
      pageTitle = `<span class="tab-page-title">${pageTitle}</span>`;

    let html = `<div id="${page_ids.page}" class="tab-page-container full-height"><div>`;

    html += `<i class="bi ${expClass[expanded]} tab-page-expand"></i>`;
    html += page.header ?? `<div class="tab-page-title-div">${pageTitle}</div>`;
    html += '<div class="tab-page-body">';
    
    if( exists(page.text) ) {
      if( is_list(page.text) )
        page.text = page.text.join(' ');
      html += `<div class="tab-page-text">${page.text}</div>`;
    }

    html += '</div>';

    const pageNode = htmlToNode(html + '</div>');
    const pageBody = pageNode.querySelector('.tab-page-body');
    const expander = pageNode.querySelector('.tab-page-expand');

    if( !expanded ) 
      pageBody.classList.toggle('hidden');

    if( has_code )
      pageBody.appendChild(this.createCodeBlock(page));

    /*else if( exists(env.value) ) {
      pageBody.appendChild(htmlToNode(`<div>${env.value}</div>`));
    }*/

    if( exists(page.footer) ) {
      pageBody.appendChild(htmlToNode(
        `<div class="tab-page-text">${page.footer}</div>`
      ));
    }

    expander.addEventListener('click', (evt) => {
      if( expander.classList.contains(expClass[true]) ) {
        expander.classList.replace(expClass[true], expClass[false]);
        //console.log(`[Code Editor] Hiding page ${page.filename}`);
      }
      else {
        expander.classList.replace(expClass[false], expClass[true]);
        //console.log(`[Code Editor] Expanding page ${page.filename}`);
      }
      pageBody.classList.toggle('hidden');
    });

    return pageNode;
  }

  /*
   * Create a code block with syntax highlighting and copy/download buttons.
   */
  createCodeBlock(page) {
    let code = page.value;

    if( page.language === 'python' ) {
      if( code.startsWith('#!') )
        code = code.split('\n').slice(1).join('\n');
      //if( nonempty(page.url) )
      //  code = `# ${page.url}\n` + code;      
    }

    const codeBlock = htmlToNode(
      `<pre><div class="absolute z-top" style="right: 10px;">` +
      `<span style="margin-left: auto; padding-left: 10px; background: var(--theme-gray-darker);">` +
      `<i class="bi bi-copy code-button code-copy" title="Copy to clipboard"></i>` +
      `<i class="bi bi-arrow-down-square code-button code-download" title="Download ${page.filename}"></i></span></div>` +
      `<code class="language-${page.language} full-height" style="scroll-padding-left: 20px;">${code}</code></pre>`
    );
    
    Prism.highlightAllUnder(codeBlock);

    codeBlock.querySelector('.code-copy').addEventListener('click', (evt) => {
      console.log(`[Property Editor] Copying text from ${page.filename} to clipboard`);
      navigator.clipboard.writeText(page.value);
    });

    codeBlock.querySelector('.code-download').addEventListener('click', (evt) => {
      console.log(`[Property Editor] Downloading file ${page.filename}`, page);
      save_page({page:page});
    });

    return codeBlock;
  }

  /*
   * Group references by resource type (e.g. shell, compose, code, ect)
   */
  createPageGroups(env) {
    let references = env.resource_order ?? [];
    let pages = {};
    let db = env.db;

    for( const field_key in env.properties ) {
      if( references.includes(field_key) )
        continue;
      
      if( db.ancestors[field_key].includes('resource') )
        references.push(field_key);
    }

    for( const ref_key in env.references ) {
      if( !references.includes(ref_key) )
        references.push(ref_key);
    }

    for( const ref_key of references ) {
      if( !(ref_key in db.index) ) {
        console.warn(`Missing key '${ref_key}' from ${env.key}.${ref_key}`, references);
        continue;
      }

      if( ref_key in env.properties ) {
        var page = {...env.properties[ref_key]};

        if( exists(page.value) )
          page.default = page.value;

        page.value = env[ref_key];
      }
      else {
        var page = env.references[ref_key];
      }

      let group = page.group; // TODO default to root-1

      pages[group] ??= {};
      pages[group][ref_key] = page;

      /*if( !db.ancestors[ref_key].includes(groupBy) )
        continue;
      
      for( const ancestor of db.ancestors[field_key] ) {
        if( !db.children[groupBy].includes(ancestor) )
          continue;

        if( !(ancestor in pages) ) 
          pages[ancestor] = {};

        let page = {...env.properties[field_key]};

        if( exists(page.value) )
          page.default = page.value;

        page.value = env[field_key];
        pages[ancestor][field_key] = page;
      }*/
    }

    return pages;
  }

  /*
   * Create a tab from the tab group, along with its paged content.
   */
  createTab(env, tab_key) {
    const tab = this.pages[tab_key];
    const ids = this.ids(tab_key);
    
    if( !exists(document.getElementById(ids.tab)) )
    {
      const tabNodes = htmlToNodes(
        `<input type="radio" id="${ids.tab}" class="btn-group-item" name="${this.id}-tab-group" ` +
        `${this.isActiveTab(tab_key) ? ' checked ' : ' '}> <label for="${ids.tab}">${tab_key}</label>`
      );

      for( const node of tabNodes ) {
        this.tabs.appendChild(node);  
        node.addEventListener('click', (evt) => {
          this.setActiveTab(tab_key);
        });  
      }
    }

    let tabNode = this.node.querySelector(`#${ids.page}`);

    if( exists(tabNode) )
      tabNode.remove();

    tabNode = htmlToNode(`
      <div class="code-container full-height hidden" id="${ids.page}">
        <div class="tab-scroll-container"></div>
      </div>`
    );

    const scrollArea = tabNode.querySelector('.tab-scroll-container');

    for( const page_key in tab ) {
      tab[page_key].expand = (scrollArea.childElementCount === 0);
      scrollArea.appendChild(this.createPage(
        tab[page_key], 
        page_key,
        this.ids(`${tab_key}-${page_key}`),
        env,
      ));
    }

    return tabNode;
  }

  /*
   * Get the active tab
   */
  getActiveTab() {
    const tabs = this.node.getElementsByClassName('btn-group-item');

    if( !nonempty(tabs) )
      return;

    for( const page of tabs ) {
      if( page.checked )
        return page;
    }

    return tabs[0];
  }

  /*
   * Check if this is the active tab
   */
  isActiveTab(key) {
    const activeTab = this.getActiveTab();
    return exists(activeTab) ? (this.ids(key).tab === activeTab.id) : true;
  }

  /*
   * Change the selected tab
   */
  setActiveTab(key) {
    if( !exists(key) )
      return;

    //console.log(`[CodeEditor] changing active tab to '${key}'`);

    const ids = this.ids(key);
    const tab = document.getElementById(ids.tab);

    if( tab.checked != true )
      tab.checked = true;  // this still fires events...

    for( const page of this.node.getElementsByClassName('code-container') ) {
      if( page.id === ids.page )
        page.classList.remove('hidden');
      else
        page.classList.add('hidden');
    };
  }

  /*
   * Get a dict of element IDs specific to a tab
   */
  ids(key) {
    const pre = `${this.id}-${key}-`;
    return {
      tab: pre + 'tab',
      page: pre + 'page',
    };
  }

  /*
   * Remove this from the DOM
   */
  remove() {
    if( !exists(this.node) )
      return;

    this.node.remove();
    this.node = null;
  }
}


/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/panels/codeEditor.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/panels/searchBar.js */
/* #!/usr/bin/env node
 *//* import { 
  GraphDB, TreeGrid, TreeList, ToggleSwitch, 
  ConfigEditor, htmlToNode, exists, ZipGenerator,
  SideBar, as_element, is_string, is_list, len,
} from '../nanolab.js';
 */
/*
 * UI for entering queries and tags against graph DB
 */
export class SearchBar {
  /*
   * Create HTML elements and add them to parent, if provided.
   * Required args: registry, parent
   * Optional args: id, tags, gate, layout)
   */
  constructor(args) {
    this.db = args.db;
    this.id = args.id ?? 'search-bar';
    this.tags = args.tags ?? [];    // default tags
    this.gate = args.gate ?? 'or'; // 'and' | 'or'
    this.view = args.view ?? 'models';
    this.node = null;
    this.parent = as_element(args.parent);
    this.layout = args.layout ?? (this.view === 'models') ? 'grid' : 'list';
    this.default_tags = this.tags;

    this.layouts = {
      grid: TreeLayout(TreeGrid),
      list: TreeLayout(TreeList),
      //table: DataTable,
    };

    this.init();
    this.query();
  }
 
  /*
   * Query the registry for resources that have matching tags.
   * This changes the filtering tags and mode (between 'or' and 'and')
   */
  query({tags, gate, update}={}) {
    console.log('[SearchBar] applying filters for query:', tags, gate);

    if( exists(tags) )
      this.tags = tags;

    if( exists(gate) )
      this.gate = gate;

    if( exists(this.tags) && this.tags.length )
      tags = this.tags; // make sure at least 1 tag was set
    else
      tags = this.default_tags; // default search pattern

    const queryTags = (this.gate === 'or') ? [tags] : tags; // nest tags for compound OR

    this.last_query = this.db.query({
      select: 'keys',
      from: '*',
      where: 'ancestors',
      in: queryTags
    });

    /*for( const tag of tags ) { // add tags themselves from query
      if( !this.results.includes(tag) )
        this.results.push(tag); 
    } */

    this.last_query.tags = tags;

    if( update ?? true )
      this.refresh();

    return this.last_query;
  }

  /*
   * Generate the static components
   */
  init() {
    const select2_id = `${this.id}-select2`;
    const self = this; // use in nested functions

    let html = `
      <div class="flex flex-column">
        <div class="flex flex-row">
          <style>
            .select2-tree-option-down:before { content: "⏷"; padding-right: 7px; }
            .select2-tree-option-leaf:before { content: "–"; padding-right: 7px; }
    `;

    for( let i=1; i < 10; i++ ) {
      html += `.select2-tree-depth-${i} { padding-left: ${i*20}px; } \n`
    }
    
    html += `
      </style>
      <select id="${select2_id}" class="${select2_id}" multiple style="flex-grow: 1;">
    `;

    html += this.db.treeReduce({func: ({db, key, data, depth}) => {
      return `<option class="select2-tree-option-${(this.db.children[key].length > 0) ? 'down' : 'leaf'} select2-tree-depth-${depth}" 
        ${self.tags.includes(key) ? "selected" : ""} 
        value="${key}">${db.index[key].name}</option>`
        + data;
    }});

    const gateSwitch = new ToggleSwitch({
      id: `${this.id}-gate-switch`, 
      states: ['and', 'or'], 
      value: this.gate, 
      help: 'OR will search for any of the tags.\nAND will search for resources having all the tags.'
    });

    const layoutSwitch = new ToggleSwitch({
      id: `${this.id}-layout-switch`, 
      value: 'grid', 
      states: ['grid', 'list'], 
      labels: ['', ''],
      classes: [
        ['bi', 'bi-grid-3x3-gap-fill'], 
        ['bi', 'bi-list-ul']
      ],
      help: 'Grid or list layout'
    });

    const sidebarSwitch = new ToggleSwitch({
      id: `${this.id}-sidebar-switch`, 
      value: 'visible', 
      states: ['visible', 'hidden'], 
      labels: ['', ''],
      classes: [
        ['bi', 'bi bi-chevron-left'], 
        ['bi', 'bi bi-chevron-right']
      ],
      help: 'Show/hide the Help bar'
    });

    html += `</select>
          ${gateSwitch.html()}
          ${sidebarSwitch.html()}
        </div>
        <div id="${this.id}-results-area" class="search-results-area">
          <div id="${this.id}-results-container" class="search-results-container">
          </div>
        </div>
      </div>
    `;

    this.node = htmlToNode(html);
    this.parent.appendChild(this.node);

    const sidebar = SideBar({id: `${this.id}-sidebar`, searchBar: this});
    this.node.querySelector(`#${this.id}-results-area`).appendChild(sidebar);

    sidebarSwitch.toggled((state) => {
      const result = sidebar.classList.toggle('hidden');
      console.log(`Toggled sidebar to ${state} (${result})`);
    });

    gateSwitch.toggled((gate) => self.refresh({gate: gate}));
    //layoutSwitch.toggled((layout) => self.refresh({layout: layout}));


    $(`#${select2_id}`).select2({
      allowClear: true,
      tags: true,
      tokenSeparators: [',', ' '],
      placeholder: 'Select tags to filter',
      templateResult: function (data) { 
        if (!data.element) // https://stackoverflow.com/a/30948247
          return data.text;
        var $element = $(data.element);
        var $wrapper = $('<span></span>');
        $wrapper.addClass($element[0].className);
        $wrapper.text(data.text);
        return $wrapper;
      }
    });

    $(`#${select2_id}`).on('change', (evt) => {
      const tags = Array.from(evt.target.selectedOptions)
                        .map(({ value }) => value);
      self.refresh({tags: tags});
    });
  }

  /*
   * Generate the templated html and add elements to the dom
   */
  refresh({keys, tags, gate, layout}={}) {
    if( exists(layout) ) {
      if( !(layout in this.layouts) )
        throw new Error(`[SearchBar] Unsupported layout requested:  '${this.layout}`);
      this.layout = layout;
    }

    if( exists(tags) || exists(gate) ) {
      this.query({tags, gate, update: false}); // avoid self-recursion
    }

    if( exists(keys) ) // TODO reconcile this properly
      this.last_query.results = keys;

    // reset dynamic cards
    let card_container = $(`#${this.id}-results-container`);
    card_container.empty(); 

    console.group(`[SearchBar] Updating layout with ${len(this.last_query.results)} results`);
    console.log('KEYS', this.last_query.results);
    let html = this.layouts[this.layout](this.last_query); // generate dynamic view
    console.groupEnd();

    if( is_empty(html) )
      return;

    card_container.html(`<div style="overflow-x: scroll;">${html}</div>`);

    $('.btn-open-item, .nav-tree-app').on('click', (evt) => {
      const dialog = new ConfigEditor({
        db: this.db,
        key: evt.currentTarget.dataset.key,
      });
    });
  }

  /*
   * Remove this from the DOM
   */
  remove() {
    if( !exists(this.node) )
      return;

    this.node.remove();
    this.node = null;
  }

  /*
   * Download archive
   */
  download(group='all') {
    console.log("Preparing current selection for download"); 
    save_all({db: this.db}); //, keys: this.results ?? Object.keys(this.db)});
    //ZipGenerator({db: this.db, keys: Object.keys(this.db)});
  }

}
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/panels/searchBar.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/panels/sideBar.js */
/* #!/usr/bin/env node
 *//* import { 
  htmlToNode, htmlToNodes, RollUp
} from '../nanolab.js';
 */  

/*
 * Create sidebar of rolldown panels / help docs
 */
export function SideBar({id, parent, searchBar}) {

  // <div id="${id}-container" class="sidebar-container">
  const sidebar = htmlToNode(`
      <div id="${id}" class="flex flex-column sidebar">
        <!-- <div class="sidebar-controls"><i class="bi bi-chevron-left sidebar-toggle"></i></div> -->
      </div>\n`,
    parent
  );

  //const sidebar = node.querySelector('.sidebar');

  const statusMsg = StatusMessages({parent: sidebar});
  const deviceConfig = DeviceConfigHelp({parent: sidebar});
  const downloadPanel = DownloadPanel({parent: sidebar, searchBar: searchBar});
  const pipPanel = PipPanel({parent: sidebar, searchBar: searchBar});

  return sidebar;
}

/*const node = htmlToNode(`
  <div>
    Deploy open AI/ML microservices and models optimized with quantization for local serving via OpenAI endpoints.<br/><br/>
    This generates <span class="monospace" style="font-size: 95%">docker-compose</span> stacks that launch 
    <span class="monospace" style="font-size: 95%"><a href="https://github.com/dusty-nv/jetson-containers" target="_blank">jetson-containers</a></span> 
    along with benchmarks & prompt templates for Python, JavaScript, and Bash.<br/><br/>
    Find us on <a href="https://discord.gg/vpmNaT46" target="_blank">Discord</a> to get involved.
    Warm thanks to our partners, researchers, and contributors in the field! <span style="font-size: 135%">🤗 🤖</span>
  </div>
`);*/

export function StatusMessages({id, parent}) {
  id ??= `${parent.id}-status`;

  const node = htmlToNode(`
    <div>
      This interactive configuration/quantization tool is for launching 
      <a href="https://github.com/dusty-nv/jetson-containers" target="_blank">local AI microservices</a>
      for on-device LLMs, VLMs, agents, and web UI's.<br/><br/>
      Check out the <a href="tutorials/microservices_intro.html" target="_blank">tutorial</a> and community 
      <a href="https://discord.gg/BmqNSK4886" target="_blank">Discord</a> channel for help or to get involved!<br/><br/>
      Warm thanks to all our partners, researchers, and contributors in the field <span style="font-size: 135%">🤗 🤖</span>
    </div>
  `);

  return RollUp({
    id: id,
    title: `AI Microservices`,
    body: node,
    icon: 'bi-nvidia',
    expanded: true,
    parent: parent
  });
}

/*export function StatusMessages({id, parent}) {
    id ??= `${parent.id}-status`;
  
    const node = htmlToNode(`
      <div>
        This interactive configuration/quantization tool is for launching local AI microservices.<br/><br/>
        We'll be populating more LLMs, VLMs, agent tools, and web UI's - come find us on <a href="https://github.com/dusty-nv/jetson-containers" target="_blank">GitHub</a> or <a href="https://discord.gg/vpmNaT46" target="_blank">Discord</a> for help or to get involved!<br/><br/>
        Warm thanks to all our partners, researchers, and contributors in the field <span style="font-size: 135%">🤗 🤖</span>
      </div>
    `);
  
    return RollUp({
      id: id,
      title: `Under Construction`,
      body: node,
      icon: 'bi-exclamation-triangle-fill',
      expanded: true,
      parent: parent
    });
  }*/

    
export function DeviceConfigHelp({id, parent}) {
  id ??= `${parent.id}-device-config`;

  const node = htmlToNode(`
    <div>
      For installation, first see the <a href="/initial_setup_jon.html" target="_blank">Initial Setup Guide for Jetson Orin Nano Developer Kit</a> to flash your device with the latest <a href="https://developer.nvidia.com/embedded/jetpack" target="_blank">JetPack</a>.<br/><br/>
      Then install <a href="https://github.com/dusty-nv/jetson-containers" target="_blank"><span class="monospace" style="font-size: 95%">jetson-containers</span></a> to configure Docker and low-memory settings.<br/><br/>
      By default it's recommended to mount NVME storage under <span class="monospace" style="font-size: 95%">/mnt/nvme</span></a> and to allocatate additional SWAP as needed.
    </div>
  `);

  return RollUp({
    id: id,
    title: `Device Setup`,
    body: node,
    icon: 'bi-motherboard-fill',
    expanded: false,
    parent: parent
  });
}

export function DownloadPanel({id, parent, searchBar}) {
  id ??= `${parent.id}-download-panel`;

  const download_set_id = `${id}-download-set`;
  const download_all_id = `${id}-download-all`;

  const node = htmlToNode(`
    <div>
    <div>
      Download the generated docker-compose stacks and examples as a .zip to your Jetson:
    </div>
    <div style="margin: 15px 15px">
      <button id="${download_set_id}" class="btn-green btn-sm" title="Download the set of docker-compose templates and scripts corresponding to your selection from the search query.">
      <i class="bi bi-cloud-download" style="font-size: 120%; font-weight: 600; margin-right: 5px;"></i>Download Set</button>
      <button id="${download_all_id}" class="btn-green btn-sm" title="Download all the templates from every model and service currently available in the index.">
      <i class="bi bi-cloud-download" style="font-size: 120%; font-weight: 600; margin-right: 5px;"></i>Download All</button>
    </div>
    </div>
  `);

  node.querySelector(`#${download_set_id}`).addEventListener('click', (evt) => {
    console.log(`Downloading set ${evt}`);
    searchBar.download('set');
  });

  node.querySelector(`#${download_all_id}`).addEventListener('click', (evt) => {
    console.log(`Downloading all ${evt}`);
    searchBar.download('all');
  });
  
  return RollUp({
    id: id,
    title: `Downloads`,
    body: node,
    expanded: false,
    parent: parent,
    icon: 'bi-arrow-down-circle'
  });
}

export function PipPanel({id, parent, searchBar}) {
  id ??= `${parent.id}-pip-panel`;

  const node = htmlToNode(`
    <div>
      Download CUDA wheels built by jetson-containers from <a href="https://pypi.jetson-ai-lab.dev" target="_blank" class="monospace">pypi.jetson-ai-lab.dev</a><br/><br/>
      To enable this by default in pip for JetPack 6, and mirror PyPi for non-GPU packages:</br></br><span class="monospace">export PIP_INDEX_URL=https://pypi.jetson-ai-lab.dev/jp6/cu126</span>
    </div>
  `);

  return RollUp({
    id: id,
    title: `Pip Server`,
    body: node,
    expanded: false,
    parent: parent,
    icon: 'bi-gear-fill'
  });
}
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/panels/sideBar.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/panels/configEditor.js */
/* #!/usr/bin/env node
 *//* import { 
  PropertyTable, CodeEditor, ModalDialog, 
  htmlToNode, escapeHTML, exists, nonempty, is_dict,
} from '../nanolab.js';
 */

/*
 * Model configuration dialog
 */
export class ConfigEditor {
  /*
   * Args:
   *   db (GraphDB) -- The previously loaded graph DB containing the index.
   *   key (str) -- The resource/model/service to use from the registry index.
   *   show (bool) -- Display the launcher dialog upon create (default=true)
   */
  constructor({db, key, id, show=true}) {
    this.db = db;
    this.id = id ?? `${key.replace('.','')}-config-editor`;

    this.key = key;
    this.key_org = key;

    if( !(this.key in this.db.index) )
      throw new Error(`could not find '${this.key}' trying to open editor`);

    let env = this.db.resolve(this.key);
    const self = this;

    // generate children ID's from parent ID
    this.ids = {};

    for( const k of ['container', 'header-ext', 'preset-menu', 'dialog', 'property_table', 'property_panel', 'code_panel', 'code_editor'])
      this.ids[k.replace('-','_')] = `${this.id}-${k}`;

    console.log(`[Property Editor] opening key '${key}'`);

    // get flattened objects and headers (optional)
    this.header_class = env.header;
    this.has_header = exists(this.header_class);
    this.children = this.db.children[this.key];
    this.menu = this.createMenu();

    // create layout and placeholder for dynamic content
    this.body = htmlToNode(`
      <div id="${this.ids.container}" class="flex flex-row full-width">
        <div class="flex flex-row" style="flex-grow: 1; min-height: 500px;">
          <div id="${this.ids.property_panel}" style="flex: 1 1 0px;">
            <!-- PROPERTY TABLE -->
          </div>
          <div id="${this.ids.code_panel}" style="margin-left: 10px; height: 465px; width: 565px;">
            <!-- CODE EDITOR -->
          </div>
        </div>
      </div>
    `);

    this.property_panel = this.body.querySelector(`#${this.ids.property_panel}`);
    
    if( exists(env.thumbnail) ) {
      let classes = exists(env.nav_class) ? env.nav_class : '';

      if( is_string(classes) )
        classes = [classes];
  
      classes = classes.join(' ');

      let html = `<div class="property-thumbnail-panel ${classes}">`;

      if( nonempty(env.links) ) {
        let links = `<div class="property-thumbnail-links"><div class="property-thumbnail-links-heading">LINKS</div>`;
        for( const link_key in env.links ) {
          const link = env.links[link_key];
          var link_url = link.url;
          links += `
            <div class="property-thumnail-link">
              &nbsp;<a href="${link.url}" title="${link.url}" target="_blank">${link.name}</a>
              <a href="${link.url}" title="${link.url}" class="property-field-link bi bi-box-arrow-up-right" target="_blank"></a>
            </div>`;
        }
        links += `</div>`;
        html += `<a href="${link_url}" title="${link_url}" target="_blank"><img src="${env.thumbnail}" class="property-thumbnail"></img></a>`;
        html += links;
      } 
      else {
        html += `<img src="${env.thumbnail}" class="property-thumbnail"></img>`;
      }
      
      html += '</div>';

      this.thumbnail_panel = htmlToNode(html, this.property_panel);
    }

    this.properties = new PropertyTable({
      db: db,
      env: env,
      id: this.ids.property_table,
      parent: this.property_panel,
    });

    this.properties.on('change', (event) => {self.updateCode()});

    this.code = new CodeEditor({
      id: this.ids.code_editor, 
      parent: this.body.querySelector(`#${this.ids.code_panel}`)
    });

    this.dialog = new ModalDialog({
      id: this.ids.dialog, 
      title: exists(env.title) ? env.title : env.name, 
      body: this.body,
      menu: this.menu,
      header: this.has_header ? `<div id="${this.ids.header_ext}" style="width: 45%;"></div>` : '',
      classes: this.has_header ? `modal-header-extensions ${this.header_class}` : ''
    });
    
    // select from child instances
    if( this.children.length > 0 ) {
      this.key = this.children[0];
      env = this.db.resolve(this.key);
    }
    
    // populate dynamic components
    this.refresh(this.key, env);

    // it would seem it automatically shows by default
    /*if( show ?? true ) {
      this.dialog.show();
    } */
  }

  /*
   * create the presets menu html (if this resource has children)
   */
  createMenu() {
    if( this.children.length == 0 ) 
      return;

    //html += `<label for="${this.id}-preset-select" style="margin-right: 5px;">Preset</label>`;

    let html = `
      <select id="${this.ids.preset_menu}" class="property-presets" 
        ${this.has_header ? ' ' : 'style="margin-right: 10px; width: 100%;"'}
      >`;

    for( const child_key of this.children ) {
      const title = this.db.flat[child_key].title ?? this.db.flat[child_key].name;
      html += `<option value="${child_key}" ${(key === child_key) ? 'selected' : ''}>${title}</option>\n`;
    }

    html += `</select>`;

    let menu = htmlToNode(html);

    menu.addEventListener('change', (evt) => {
      console.log(`[Property Editor] Changing to preset ${evt.target.value}`, evt, this);
      this.refresh(evt.target.value);
    });

    return menu;
  }

  /*
   * update dynamic elements on selection changes
   */
  refresh(key, env=null, async=true) {
    if( exists(key) )
      this.key = key;

    key ??= this.key;

    if( !exists(env) )
      env = this.db.resolve(key);

    if( async ) {
      env.promise.then(x => this.refresh(key, env, false));
      return;
    }

    if( this.has_header ) {
      let header = '';

      if( nonempty(env.links) ) {
        header += '<div style="margin-top: 15px; margin-left: 10px;">';
        for( const link_name in env.links ) {
          const link = env.links[link_name];
          header += `<a href="${link.url}" title="${link.url}" class="btn-oval" target="_blank">${link.name}</a>`;
        }
        header += '</div>';
      }

      if( nonempty(env.stats) ) {
        header += `<table 
            class="tag-oval monospace" 
            style="min-width: 255px; border: 1px solid rgba(255,255,255,0.1);" 
            title="This table shows the generation performance in tokens/second (decode)\nThe GPU memory usage is an estimate as reported by the inference API.\nAll measurements for Orin Nano are with Super mode enabled (25W MAX-N)"
          ><tr>`;
        
        let row = '';

        for( const stat_key in env.stats ) {
          const stats = env.stats[stat_key];
          
          if( is_dict(stats) ) {
            var type = Object.keys(stats)[0];
            var text = `${stats[type]}`;
          }
          else {
            var type = stat_key;
            var text = `${stats}`;
          }

          const typedef = this.db.flat[type];

          if( 'units' in typedef )
            text += ` ${typedef.units_short ?? typedef.units}`;

          header += `<td align="center"><b>${this.db.flat[stat_key].name}</b></td>`;
          row += `<td align="center">${text}</td>`;
        }

        header += `</tr><tr>${row}</tr></table>`;
      }

      this.dialog.node.querySelector(`#${this.ids.header_ext}`).innerHTML = header;
    }

    this.properties.refresh(key);
    this.updateCode(key, env, async);
  }

  updateCode(key, env=null, async=true) {
    key ??= this.key;

    if( !exists(env) )
      env = this.db.resolve(key);

    if( async ) {
      env.promise.then(x => this.updateCode(key, env, false));
      return;
    }

    this.code.refresh(env);
    console.log(`[GraphDB]  Resolved ${key}`, env);
  }
}

/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/panels/configEditor.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/buttons.js */
/* import { exists, capitalize } from "../nanolab.js";
 */
/*
 * Switch that toggles between multiple states (right now on/off)
 */
export class ToggleSwitch {

  /*
   * Create the wrapper (this will not add the element to DOM)
   * If `labels` or `classes` are specified, they should be lists
   * the same length as `states`, and get added to those buttons.
   */
  constructor({
    id='toggle-switch', 
    states=['on', 'off'], value='on', 
    labels=null, classes=null, help=null
  }) {
    this.id = id;
    this.states = states;
    this.value = value;
    this.default = value;
    this.help = help;
    this.classes = classes;
    this.labels = labels;

    if( !exists(this.labels) ){
      this.labels = [];
      for( const state of this.states )
        this.labels.push(capitalize(state));
    }

    if( !exists(this.classes) ){
      this.classes = [];
      for( const state of this.states )
        this.classes.push([]);
    }
  }

  /*
   * Return the HTML generated for the element
   */
  html() {
    const title = exists(this.help) ? `title="${this.help}"` : '';
    let html = `<div id="${this.id}" class="toggle-btn-container" ${title}>`;
    for( const idx in this.states ) {
      const state = this.states[idx];
      const classes = this.classes[idx].join(' ');
      html += `
        <input 
          id="${this.id}-${state}" 
          class="toggle toggle-${idx > 0 ? 'right' : 'left'} ${classes}" 
          name="${this.id}" 
          value="${state}" 
          type="radio" 
          ${this.value === state ? "checked" : ''}
        >
        <label for="${this.id}-${state}" class="toggle-btn ${classes}">${this.labels[idx]}</label>
      `;
    }
    html += `</div>`;
    return html;  
  }

  /*
   * Add an event handler (node should have been added to DOM)
   */
  toggled(handler) {
    const self = this;
    function inner_handler(state) {
      self.state = state;
      handler(state);
    }
    for( const state of this.states ) {
      document.getElementById(`${this.id}-${state}`)
              .addEventListener('click', () => {
        inner_handler(state);
      });
    }
  }
}
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/buttons.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/fields.js */
/* #!/usr/bin/env node
 *//* import { 
  exists, nonempty, is_string
} from '../nanolab.js';
 */

/*
 * Controls for changing strings, numbers, bools, and drop-downs.
 * These have the `.field-control` class applied for selecting from the DOM.
 */
export function PropertyField({
  db, key, value, id=null, 
  multiple=null, multiline=null, 
  password=null, label=null,
  placeholder=null,
}) {
  const field = db.flat[key];
  const type_key = db.parents[key][0];
  const children = db.children[key];

  const data = `data-key="${key}"`;
  const title = exists(db.flat[key].help) ? `title="${db.flat[key].help}"` : ``;
  const value_html = exists(value) ? `value="${value}"` : "";

  placeholder = exists(placeholder) ? `placeholder="${placeholder}"` : '';

  id ??= `${key}-control`;

  multiple ??= field.multiple;
  multiline ??= field.multiline;
  password ??= field.password;
  
  let html = ``;

  if( label ) {
    html += PropertyLabel({db: db, key: key, value: value, id: id});
  }

  /* <label for="${id}" class="form-label">${field.name}</label> */

  if( type_key === 'enum' || 'options' in field ) {
    let multiple_html = multiple ? 'multiple="multiple"' : '';

      /*var options = param['options'];
      if( options.length > 8 )
        select2_args[id] = {};
      else
        select2_args[id] = {minimumResultsForSearch: Infinity};
    }
    else if( has_suggestions ) {
      var options = param['suggestions'];
      select2_args[id] = {tags: true, placeholder: 'enter'}; //tags: true, placeholder: 'enter'};
    }*/

    const use_options = nonempty(field.options);
    const options = use_options ? field.options : children;

    let opt_html = '';
    let opt_max_len = 0;
    let opt_styles = 'property-field';

    if( nonempty(field.styles) ) {
      if( is_string(field.styles) )
        field.styles = [field.styles];
      opt_styles += ' ' + field.styles.join(' ');
    }

    for( let opt_key of options ) {
      if( opt_key == value )
        var selected = ` selected="selected"`;
      else
        var selected = '';
      const opt_name = use_options ? opt_key : db.index[opt_key].name;
      opt_max_len = Math.max(opt_max_len, opt_name.length);
      opt_html += `  <option value="${opt_key}" ${selected}>${opt_name}</option>\n`;
    }
    
    html += `<select id="${id}" class="${opt_styles}" ${data} ${multiple_html} ${title}>\n`;
    html += opt_html + `</select>\n`;
  }
  /*else if( 'suggestions' in param ) {
    const list_id = `${id}_list`;
    var input_html = `<input id="${id}" type="${type}" class="form-control" list="${list_id}"/>`;
    
    input_html += `<datalist id="${list_id}">`;
    
    for( i in param['suggestions'] ) {
      input_html += `<option>${param['suggestions'][i]}</option>`;
    }
    
    input_html += `</datalist>`; 
  }*/
  else if( exists(multiline) ) { // form-control
    html += `<textarea id="${id}" class="property-field" rows=${multiline} ${data} ${title}>${value}</textarea>`;
  }
  else if( type_key == 'color' ) {
    html += `<input id="${id}" class="property-field" type="color" ${value_html} ${data} ${title}/>`;
  }
  else {
    let type = type_key;

    if( type === 'string' )
      type = 'text'; // text has 30K char limit, string has 255

    if( password )
      type = 'password';


    html += `
      <input id="${id}" class="property-field" type="${type}" 
        ${(type === 'text' || type === 'path') ? 'style="width: 100%"' : ''} 
        ${value_html} ${placeholder} ${data} ${title}>`;
  }

  //html += `</div>`;
  //console.log(`Generated ${type_key} control for '${key}' (id=${id})\n  ${html}`);
  return html;
}


export function PropertyLabel({
  db, key, value, id
}) {
  let title = exists(db.flat[key].help) ? `title="${db.flat[key].help}"` : ``;

  let html = `
    <label for="${id}" class="form-label property-label" ${title}>${db.flat[key].name}</label>
  `;
      
  // https://stackoverflow.com/questions/3060055/link-in-input-text-field
  if( key === 'url' || db.parents[key][0] === 'url' )
    html += `<sup><a id="${id}-link" class="property-field-link bi bi-box-arrow-up-right" target="_blank"></a></sup>`;

  return html;
}
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/fields.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/rollup.js */
/* #!/usr/bin/env node
 *//* import { 
  htmlToNode, nonempty
} from '../nanolab.js';
 */  

/*
  * Create rolldown panel
  */
export function RollUp({title, id, body, parent, expanded=false, icon='bi-nvidia'}) {

  icon = nonempty(icon) ? `<b><i class="bi ${icon} rollup-container-icon"></i></b>` : ``;

  const node = htmlToNode(`
    <div id="${id}-rollup" class="flex flex-column rollup-container">
      <div class="rollup-container-header">
        <div>
          ${icon}&nbsp; <span class="rollup-container-title">${title}</span>
        </div>
      </div>
      <div class="rollup-container-body">
      </div>
    </div>
  `, parent);

  const body_node = node.querySelector('.rollup-container-body');
  const head_node = node.querySelector('.rollup-container-header');

  if( exists(body) )
    body_node.appendChild(body);

  head_node.addEventListener('click', (evt) => {
    const result = body_node.classList.toggle('hidden');
    node.classList.toggle('hidden_body');
    console.log(`Toggled rolldown '${title}' to ${result}`, evt);
  });
  
  if( !expanded ) {
    body_node.classList.toggle('hidden');
    node.classList.toggle('hidden_body');
  }
  
  return node;
}
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/rollup.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/modal.js */
/* #!/usr/bin/env node
 *//* import { 
  htmlToNode, exists, as_element
} from '../nanolab.js';
 */
/*
 * Modal dialog maker
 */
export class ModalDialog {
  
  constructor({id, title, body, header='', menu='', classes=''}) {
    this.id = id;
    
    const header_mod = is_empty(classes) ? 'modal-header-mod' : classes;
    const title_bar_mod = 'modal-title-bar-mod'; //is_empty(classes) ? 'modal-title-bar-mod' : classes;

    let html = `
      <div class="modal" id="${id}">
        <div class="modal-content" id="${id}-content">
          <div class="modal-header ${header_mod}" id="${id}-header">
            <div class="modal-title-bar ${title_bar_mod}" id="${id}-title-bar">
              <span class="modal-close">&times;</span>
              <span class="modal-title">${title}</span>
            </div>
            ${header}
          </div>
          <div class="modal-body" id="${id}-body">
          </div>
        </div>
      </div>`;

    /*<div class="modal-footer">Footer</div>*/

    this.node = htmlToNode(html);
    this.body = this.node.querySelector('.modal-body');

    if( nonempty(menu) ) {
      this.node.querySelector(
        '.modal-title-bar'
      ).appendChild(htmlToNode(menu));
    }

    if( exists(body) ) {
      this.body.appendChild(htmlToNode(body));
    }

    as_element('.root-container').appendChild(this.node);
    //as_element('.root-container').insertAdjacentElement("afterend", this.node);
    //document.body.insertBefore(this.node, document.body.firstChild);
    
    const close_btn = this.node.getElementsByClassName("modal-close")[0];
    close_btn.addEventListener('click', () => {this.remove();} );

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if( event.target == this.node ) {
        this.remove();
      }
    }
  }

  show() {
    this.node.style.display = "block";
    return this;
  }

  hide() {
    this.node.style.display = "none";
    return this;
  }

  remove() {
    console.log(`Closing dialog ${this.id}`);
    this.hide();

    window.setTimeout(() => {
      this.node.remove();
    }, 200);
  }
}
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/modal.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/dataTable.js */

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



/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/dataTable.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/treeList.js */

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

/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/treeList.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/menu.js */
/* #!/usr/bin/env node
 *//* import { 
  htmlToNode, QueryViews
} from '../nanolab.js';
 */  

/*
 * Attach extra navigation drop-down menus or context menus in the DOM.
 */
export function addNavMenus() {
  return [
    addNavMenuViews('models.html', QueryViews)
  ]
}

/*
 * Create a navigation drop-down menu of the different query views,
 * and add it to the DOM. This attaches the menu to to one of the 
 * top-level navigation tabs, as specified by it's page name.
 */
export function addNavMenu(page, children) {

  var navDropdown = htmlToNode(`
    <div class="nav-menu-dropdown">
      ${children}
    </div>
  `);

  const onNavMenuHide = (evt) => {
    const mx = evt.clientX;
    const my = evt.clientY;
    const dd = navDropdown.getBoundingClientRect();
    if( my < dd.top || my > dd.bottom || mx < dd.left || mx > dd.right )
      navDropdown.style.display = "none";
  };

  navDropdown.addEventListener("mouseleave", onNavMenuHide);

  navDropdown.childNodes.forEach((navMenuItem) => {
    navMenuItem.addEventListener("click", (evt) => {
      navDropdown.style.display = "none";
    })
  });

  var navTabs = document.querySelectorAll('.md-tabs__item');

  navTabs.forEach((navTab) => {
    const navTabLink = navTab.querySelector('a');
    const navTabPage = navTabLink.href.split('/').pop();
    if( navTabPage != page )
      return;
    //navTabLink.appendChild(htmlToNode(`<i class="nav-tab-icon"></i>`));
    navTab.addEventListener("mouseenter", (evt) => {
      const navLinkRect = navTabLink.getBoundingClientRect();
      const navTabRect = navTab.getBoundingClientRect();
      navDropdown.style.display = "flex";
      navDropdown.style.left = `${navLinkRect.x - 5}px`;
      navDropdown.style.top = `${navTabRect.bottom}px`;
    });
    navTab.addEventListener("mouseleave", onNavMenuHide);
  });

  document.body.appendChild(navDropdown);
  return navDropdown;
}

/*
 * Add a nav drop-down menu based on the different graphDB views.
 */
export function addNavMenuViews(page, views) {
  var html = '';

  for( const key in views ) {
    const view = views[key];
    if( !view.menu )
      continue;
    if( view.menu === 'divider' )
      html += `<div class="nav-menu-divider"></div>`;
    html += `<a href="${page}?view=${key}">${view.name}</a>`;
  }

  return addNavMenu(page, html);
}
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/menu.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/treeGrid.js */

/*
 * Generates HTML for grid view
 */
export function TreeGrid(x) {
  x.name = x.db.index[x.key].name;

  if( x.depth <= 2 && x.db.isLeaf(x.key) ) {
    return GalleryItem(x);
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
      <div id="${x.key}-nav-grid" class="flex flex-row" style="padding-bottom: 45px;">
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

/*
 * Gallery items with background image
 */
export function GalleryItem(x) {
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
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/treeGrid.js */

/* BEGIN: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/treeLayout.js */

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
/* END: /mnt/NVME/src/jetson-ai-lab/docs/portal/js/layout/treeLayout.js */
