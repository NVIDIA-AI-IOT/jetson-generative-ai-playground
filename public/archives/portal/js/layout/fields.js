#!/usr/bin/env node
import { 
  exists, nonempty, is_string
} from '../nanolab.js';


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