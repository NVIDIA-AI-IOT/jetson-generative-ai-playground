#!/usr/bin/env node
import { 
  GraphDB, TreeGrid, TreeList, ToggleSwitch, 
  ConfigEditor, htmlToNode, exists, ZipGenerator,
  SideBar, as_element, is_string, is_list, len,
} from '../nanolab.js';

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
      value: 'hidden', 
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
    sidebar.classList.add('hidden');

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