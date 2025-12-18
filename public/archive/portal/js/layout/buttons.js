import { exists, capitalize } from "../nanolab.js";

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