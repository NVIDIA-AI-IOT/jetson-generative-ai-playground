/*
 * Module loader / init (todo: minimize)
 */
import { exists, include } from "./js/nanolab.js";

// global side-effect imports
import './dist/jquery/jquery-3.7.1.min.js';
import './dist/jquery/jquery-ui.min.js';
import './dist/select2/select2.js';
import './dist/prism/prism.js';
import './dist/composerize/composerize.js';
import './dist/FileSaver/FileSaver.js';
import './dist/jszip/jszip.js';

if( exists(document) ) { // browser mode
  include(
    './css/themes.css',
    './dist/select2/select2.css',
    './dist/bootstrap-icons/bootstrap-icons.css',
    './dist/prism/prism.nvidia.css',
    './css/styles.css',
    './css/flex.css', 
    './css/card.css', 
    './css/code.css',
    './css/fields.css',
    './css/buttons.css', 
    './css/select.css',
    './css/modal.css',
    './data/models/models.css'
  );
}

// export package modules
export * from "./js/nanolab.js";