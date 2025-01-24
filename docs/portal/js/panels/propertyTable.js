#!/usr/bin/env node
import { 
  PropertyField, PropertyLabel, htmlToNode, as_element, exists
} from '../nanolab.js';


/*
 * Introspective table for displaying and editing graph node properties.
 * This will build the UI controls for an object's properties in a <table> element.
 */
export class PropertyTable {
  /*
   * Args:
   *   db (GraphTags) -- The previously loaded graph DB containing the index.
   *   key (str) -- The resource/model/service to use from the registry index.
   *   show (bool) -- Display the launcher dialog upon create (default=true)
   */
  constructor({db, key, id, parent}) {
    this.db = db;
    this.key = key;
    this.id = id ?? `${key}-property-table`;

    this.events = {};
    this.parent = as_element(parent);
    this.node = htmlToNode(`<table id="${this.id}" class="property-table"></table>`, this.parent);

    if( !(this.key in this.db.index) )
      throw new Error(`could not find '${this.key}' trying to open property editor`);

    this.refresh();
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
  refresh(key) {
    if( exists(key) )
      this.key = key;

    key ??= this.key;

    let html = '';
    let fields = this.db.flat[key].property_order ?? [];

    for( const field_key of this.db.props[key] ) {
      if( !fields.includes(field_key) )
        fields.push(field_key);
    }

    for( const field_key of fields ) {
      const field = Object.assign({
        db: this.db,
        key: field_key,
        value: this.db.flat[key][field_key],
        id: `${field_key}-control`,
      }, 
      this.db.flatten({
        key: key, 
        property: field_key
      }));
      html += `<tr><td style="white-space: nowrap;">${PropertyLabel(field)}</td><td style="width: 99%;">${PropertyField(field)}</td></tr>`;
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
    const value = args.target.value;
    const event_key = args.target.dataset.key;

    console.log(`[Property Editor] Value of ${event_key} (id=${id}) for ${this.key} changed to '${value}'`);

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
    if( !url.startsWith('http') && !url.startsWith('www') )
      url = 'http://' + url;

    let link = this.node.querySelector(`#${id}-link`);
    link.href = url;
    link.title = url;
    console.log(`[Property Editor] Updated link (${id}) to ${url}`);
  }
}
