#!/usr/bin/env node
import { 
  htmlToNode, nonempty
} from '../nanolab.js';
  

/*
  * Create rolldown panel
  */
export function RollUp({title, id, body, parent, expanded=false, icon='bi-nvidia'}) {

  icon = nonempty(icon) ? `<b><i class="bi ${icon} rollup-container-icon"></i></b>` : ``;

  const node = htmlToNode(`
    <div id="${id}-rollup" class="flex flex-column rollup-container">
      <div class="rollup-container-header">
        <div>
          ${icon}&nbsp; <span class="rollup-container-title">${title}</span>
        </div>
      </div>
      <div class="rollup-container-body">
      </div>
    </div>
  `, parent);

  const body_node = node.querySelector('.rollup-container-body');
  const head_node = node.querySelector('.rollup-container-header');

  body_node.appendChild(body);

  head_node.addEventListener('click', (evt) => {
    const result = body_node.classList.toggle('hidden');
    node.classList.toggle('hidden_body');
    console.log(`Toggled rolldown '${title}' to ${result}`, evt);
  });
  
  return node;
}