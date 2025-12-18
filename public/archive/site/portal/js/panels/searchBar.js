#!/usr/bin/env node
import { 
  GraphTags, TreeGrid, TreeList, ToggleSwitch, 
  ConfigEditor, htmlToNode, exists, ZipGenerator,
  as_element, is_string, is_list, len,
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
    this.gate = args.gate ?? 'and'; // 'and' | 'or'
    this.node = null;
    this.parent = as_element(args.parent);
    this.layout = args.layout ?? 'grid';
    this.default_tags = this.tags;

    this.layouts = {
      grid: TreeGrid,
      list: TreeList,
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

    if( this.gate === 'or' )
      tags = [tags];  // nest tags for compound OR

    this.results = this.db.query({
      select: 'keys',
      from: '*',
      where: 'ancestors',
      in: tags
    });

    for( const tag of tags ) { // add tags themselves from query
      if( !this.results.includes(tag) )
        this.results.push(tag); 
    } 

    if( update ?? true )
      this.refresh();

    return this.results;
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

    html += this.db.treeReduce(
      ({db, key, data, depth}) => {
      return `<option class="select2-tree-option-${(this.db.children[key].length > 0) ? 'down' : 'leaf'} select2-tree-depth-${depth}" 
        ${self.tags.includes(key) ? "selected" : ""} 
        value="${key}">${db.index[key].name}</option>`
        + data;
    });

    const gateSwitch = new ToggleSwitch({
      id: `${this.id}-gate-switch`, 
      states: ['and', 'or'], 
      value: 'and', 
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

    html += `</select>
          ${gateSwitch.html()}
          ${layoutSwitch.html()}
        </div>
        <div id="${this.id}-card-container">
        </div>
        ${this.createInfoPanel()};
      </div>
    `;

    this.node = htmlToNode(html);
    this.parent.appendChild(this.node);

    $(`#${this.id}-help-container`).draggable();

    this.node.querySelector(`#${this.id}-download-set`)
      .addEventListener('click', (evt) => {
      console.log("Preparing current selection for download");  
      ZipGenerator({db: this.db, keys: this.results ?? Object.keys(this.db)});
    });

    this.node.querySelector(`#${this.id}-download-all`)
      .addEventListener('click', () => {
      console.log("Preparing all items for download");  
      ZipGenerator({db: this.db, keys: this.results ?? Object.keys(this.db)});
      //ZipGenerator({db: this.db, keys: Object.keys(this.db)});
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
      self.refresh({tags});
    });
  }

  /*
   * Create help / info panel (as HTML)
   */
  createInfoPanel() {
    const html = `
     <div id="${this.id}-help-container" class="flex flex-column help-container">
          <div class="help-container-header"><div><b><i class="bi bi-nvidia" style="font-size: 120%; color: rgba(255,255,255,0.7);"></i></b>&nbsp; Device Configuration</div></div>
          <div class="help-container-body">
            <div>
              Deploy open AI/ML microservices and models optimized with quantization for local serving via OpenAI endpoints.<br/><br/>
              This generates <span class="monospace" style="font-size: 95%">docker-compose</span> stacks that launch 
              <span class="monospace" style="font-size: 95%"><a href="https://github.com/dusty-nv/jetson-containers" target="_blank">jetson-containers</a></span> 
              along with benchmarks & prompt templates for Python, JavaScript, and Bash.<br/><br/>
              The page uses a serverless graph DB, and you can download the stacks from your query as a .zip to your Jetson
            </div>
            <div style="margin: 15px 5px">
              <button id="${this.id}-download-set" class="btn-green btn-sm" title="Download the set of docker-compose templates and scripts corresponding to your selection from the search query.">
              <i class="bi bi-cloud-download" style="font-size: 120%; font-weight: 600; margin-right: 5px;"></i>Download Set</button>
              <button id="${this.id}-download-all" class="btn-green btn-sm" title="Download all the templates from every model and service currently available in the index.">
              <i class="bi bi-cloud-download" style="font-size: 120%; font-weight: 600; margin-right: 5px;"></i>Download All</button>
            </div>
            We'll continue populating more models, services, and interactive elements to the site.  Find us on <a href="https://discord.gg/vpmNaT46" target="_blank">Discord</a> to get involved.
            <br/><br/>Warm thanks to our partners, researchers, and contributors in the field! <span style="font-size: 135%">🤗 🤖</span> 
          </div>
        </div>
    `;

    return html;
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

    if( !exists(keys) )
      keys = this.results;

    console.log(`[SearchBar] Updating layout with ${len(keys)} results`, keys);

    // reset dynamic cards
    let card_container = $(`#${this.id}-card-container`);
    card_container.empty(); 

    // generate dynamic content
    let html = `<div style="margin-top: 15px;">`;

    html += this.db.treeReduce({
      func: this.layouts[this.layout],
      mask: this.results
    });

    html += `</div>`;

    /*html += `
      <div class="code-container" id="${this.id}-code-container">
        <div class="flex flex-row">
          <div class="btn-group">
            <input type="radio" id="toggle-on" name="toggle" checked>
            <label for="toggle-on">docker run</label>
            <input type="radio" id="toggle-off" name="toggle">
            <label for="toggle-off">docker compose</label>
            <input type="radio" id="toggle-three" name="toggle">
            <label for="toggle-three">Benchmarks</label>
          </div>

          <div class="btn-copy" id="${this.id}-btn-copy">
            <i class="bi bi-copy" title="Copy to clipboard"></i>
          </div>
        </div>
        <div class="code-block">
          abc123
        </div>
      </div>`;*/

    card_container.html(html);

    $('.btn-open-item').on('click', (evt) => {
      const dialog = new ConfigEditor({
        db: this.db,
        key: evt.target.dataset.model,
      });
    });
    
    /*for( let button of node.getElementsByClassName("btn-open-model") ) {
      button.addEventListener('click', this.onModelOpen.bind(this));
    }*/
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