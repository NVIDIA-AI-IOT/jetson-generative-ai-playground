#!/usr/bin/env node
import {
  htmlToNodes, abspath, file_extension, is_string
} from '../nanolab.js';

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
