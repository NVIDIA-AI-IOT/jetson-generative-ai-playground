#!/usr/bin/env node
import { 
  htmlToNode, exists, as_element
} from '../nanolab.js';

/*
 * Modal dialog maker
 */
export class ModalDialog {
  
  constructor({id, title, body, header='', menu='', classes=''}) {
    this.id = id;
    let html = `
      <div class="modal" id="${id}">
        <div class="modal-content" id="${id}-content">
          <div class="modal-header ${classes}" id="${id}-header">
            <div class="modal-title-bar" id="${id}-title-bar">
              <span class="modal-close">&times;</span>
              <span class="modal-title">${title}</span>
            </div>
            ${header}
          </div>
          <div class="modal-body" id="${id}-body">
          </div>
        </div>
      </div>`;

    /*<div class="modal-footer">Footer</div>*/

    this.node = htmlToNode(html);
    this.body = this.node.querySelector('.modal-body');

    if( nonempty(menu) ) {
      this.node.querySelector(
        '.modal-title-bar'
      ).appendChild(htmlToNode(menu));
    }

    if( exists(body) ) {
      this.body.appendChild(htmlToNode(body));
    }

    as_element('.root-container').appendChild(this.node);
    //as_element('.root-container').insertAdjacentElement("afterend", this.node);
    //document.body.insertBefore(this.node, document.body.firstChild);
    
    const close_btn = this.node.getElementsByClassName("modal-close")[0];
    close_btn.addEventListener('click', () => {this.remove();} );

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if( event.target == this.node ) {
        this.remove();
      }
    }
  }

  show() {
    this.node.style.display = "block";
    return this;
  }

  hide() {
    this.node.style.display = "none";
    return this;
  }

  remove() {
    console.log(`Closing dialog ${this.id}`);
    this.hide();

    window.setTimeout(() => {
      this.node.remove();
    }, 200);
  }
}