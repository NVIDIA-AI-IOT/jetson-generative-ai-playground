#!/usr/bin/env node
import { 
  PropertyTable, CodeEditor, ModelGenerator, ModalDialog, 
  htmlToNode, escapeHTML, exists, nonempty, is_dict,
} from '../nanolab.js';


/*
 * Model configuration dialog
 */
export class ConfigEditor {
  /*
   * Args:
   *   db (GraphTags) -- The previously loaded graph DB containing the index.
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

    // generate children ID's from parent ID
    this.ids = {};

    for( const k of ['container', 'header-ext', 'preset-menu', 'dialog', 'property_table', 'property_panel', 'code_panel', 'code_editor'])
      this.ids[k.replace('-','_')] = `${this.id}-${k}`;

    console.log(`[Property Editor] opening ID='${this.id} with children IDs:`, this.ids);

    // get flattened objects and headers (optional)
    const obj = this.db.flat[this.key];
    const self = this;

    this.header_class = obj.header;
    this.has_header = exists(this.header_class);
    this.children = this.db.children[this.key];
    this.menu = this.createMenu();

    // create layout and placeholder for dynamic content
    this.body = htmlToNode(`
      <div id="${this.ids.container}" class="flex flex-row full-width">
        <div class="flex flex-row" style="flex-grow: 1;">
          <div id="${this.ids.property_panel}" style="flex: 1 1 0px;">
            <!-- PROPERTY TABLE -->
          </div>
          <div id="${this.ids.code_panel}" style="margin-left: 10px; height: 400px; width: 500px;">
            <!-- CODE EDITOR -->
          </div>
        </div>
      </div>
    `);

    this.properties = new PropertyTable({
      db: db,
      key: key,
      id: this.ids.property_table,
      parent: this.body.querySelector(`#${this.ids.property_panel}`)
    });

    this.properties.on('change', (event) => {self.updateCode()});

    this.code = new CodeEditor({
      id: this.ids.code_editor, 
      parent: this.body.querySelector(`#${this.ids.code_panel}`)
    });

    this.dialog = new ModalDialog({
      id: this.ids.dialog, 
      title: exists(obj.title) ? obj.title : obj.name, 
      body: this.body,
      menu: this.menu,
      header: this.has_header ? `<div id="${this.ids.header_ext}" style="width: 45%;"></div>` : '',
      classes: this.has_header ? `modal-header-extensions ${this.header_class}` : ''
    });
    
    // select from child instances
    if( this.children.length > 0 )
      this.key = this.children[0];

    // populate dynamic components
    this.refresh();

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
  refresh(key) {
    if( exists(key) )
      this.key = key;

    key ??= this.key;

    const obj = this.db.flat[key];

    if( this.has_header ) {
      let header = '';

      if( nonempty(obj.links) ) {
        header += '<div style="margin-left: 10px">';
        for( const link_name in obj.links ) {
          const link = obj.links[link_name];
          header += `<a href="${link.url}" title="${link.url}" class="btn-oval" target="_blank">${link.name}</a>`;
        }
        header += '</div>';
      }

      if( nonempty(obj.stats) ) {
        header += `<table 
            class="tag-oval monospace" 
            style="min-width: 255px; border: 1px solid rgba(255,255,255,0.1);" 
            title="This table shows the generation performance in tokens/second (decode)\nThe GPU memory usage is an estimate as reported by the inference API.\nAll measurements for Orin Nano are with Super mode enabled (25W MAX-N)"
          ><tr>`;
        
        let row = '';

        for( const stat_key in obj.stats ) {
          const stats = obj.stats[stat_key];
          
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
    this.updateCode(key);
  }

  updateCode(key) {
    this.code.refresh(ModelGenerator({db: this.db, key: key ?? this.key}).pages);
  }
}
