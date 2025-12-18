#!/usr/bin/env node
import { 
  PropertyField, PropertyLabel, htmlToNode, 
  as_element, make_url, exists
} from '../nanolab.js';


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
