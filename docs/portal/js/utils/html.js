/*
 * Utilities for generating and manipulating HTML nodes in the DOM.
 */
import { exists, is_string } from "../nanolab.js";

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
  if( !exists(text) && arguments.length > 0 )
    text = arguments[0];

  const split = text.split(delim);
  let lines = [''];
  indent = (indent > 0) ? ' '.repeat(indent) : '';

  for( const i in split ) {
    const next = (i > 0 ? delim : '') + split[i];
    const last = lines.length - 1;

    if( lines[last].length + next.length >= max_length )
      lines.push(next);
    else
      lines[last] += next;
  }

  for( const i in lines ) {
    lines[i] = (i > 0 ? indent : '') + 
      lines[i].trim().replaceAll('  ', ' ');
  }

  return lines.join(newline).replace('^^^', ' ');
}