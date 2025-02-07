#!/usr/bin/env node
import { 
  htmlToNode, htmlToNodes, exists, nonempty, as_element, save_page, save_pages
} from '../nanolab.js';


/**
 * Multi-file / multi-tab code editor with interactive syntax highlighting
 */
export class CodeEditor {
  /*
   * Args:
   *  id -- the desired ID for the CodeEditor component (or 'code-editor' by default)
   *  parent -- the parent HTML node to add this component to as a child
   */
  constructor({id,parent}={}) {
    this.id = id ?? `code-editor`;
    this.parent = as_element(parent);
    this.outerHTML = `
      <div id="${this.id}" class="code-editor">
        <div id="${this.id}-tab-group" class="btn-group">
            <i id="${this.id}-download-set" class="bi bi-arrow-down-circle btn-float btn-absolute" title="Download the set of scripts for this model in a zip"></i>
        </div>
      </div>`;

    this.node = htmlToNode(this.outerHTML);
    this.tabs = this.node.getElementsByClassName('btn-group')[0];
    
    this.download_set = this.node.querySelector(`#${this.id}-download-set`);
    this.download_set.addEventListener('click', (evt) => {
      if( exists(this.pages) )
        save_pages(this.pages);
    });  

    if( this.parent )
      this.parent.appendChild(this.node);
  }

  /*
   * Layout components given a set of code tabs, sources, or files.
   */
  refresh(env, group_by='resource') {
    const db = env.db;
    const self = this;
    
    if( !exists(env) )
      return;

    if( this.refreshing ) {
      console.warning(`[CodeEditor] detected re-entrant call to refresh(), skipping...`);
      return;
    }
    
    console.log(`[CodeEditor] refreshing tabs with:`, env);

    this.refreshing = true;
    this.pages = {};

    let properties = env.property_order ?? [];

    for( const field_key in env.properties ) {
      if( !properties.includes(field_key) )
        properties.push(field_key);
    }

    for( const field_key of properties ) {
      if( !(field_key in db.index) ) {
        console.warn(`Missing key '${field_key}' from ${env.key}.${field_key}`, properties);
        continue;
      }

      if( !db.ancestors[field_key].includes(group_by) )
        continue;
      
      for( const ancestor of db.ancestors[field_key] ) {
        if( !db.children[group_by].includes(ancestor) )
          continue;

        if( !(ancestor in this.pages) ) 
          this.pages[ancestor] = {};

        let page = {...env.properties[field_key]};

        if( exists(page.value) )
          page.default = page.value;

        page.value = env[field_key];
        this.pages[ancestor][field_key] = page;
      }
    }

    for( const tab_key in this.pages ) {
      const tab = this.pages[tab_key];
      const ids = this.ids(tab_key);

      const activeTab = this.getActiveTab();
      const isActive = exists(activeTab) ? (ids.tab === activeTab.id) : true; //this.tabs.children.length === 0);

      if( !exists(document.getElementById(ids.tab)) )
      {
        const tabNodes = htmlToNodes(
          `<input type="radio" id="${ids.tab}" class="btn-group-item" name="${this.id}-tab-group" ` +
          `${isActive ? ' checked ' : ' '}> <label for="${ids.tab}">${tab_key}</label>`
        );

        for( const node of tabNodes ) {
          this.tabs.appendChild(node);  
          node.addEventListener('click', (evt) => {
            self.setActiveTab(tab_key);
          });  
        }
      }

      let tabNode = this.node.querySelector(`#${ids.page}`);

      if( exists(tabNode) )
        tabNode.remove();

      tabNode = htmlToNode(`
        <div class="code-container full-height hidden" id="${ids.page}">
          <div class="tab-scroll-container"></div>
        </div>`
      );

      const scrollArea = tabNode.querySelector('.tab-scroll-container');

      for( const page_key in tab ) {
        scrollArea.appendChild(this.createPage(
          tab[page_key], 
          page_key,
          this.ids(`${tab_key}-${page_key}`),
          env,
        ));
      }

      this.node.appendChild(tabNode);

      if( isActive )
        this.setActiveTab(tab_key);
    }

    this.refreshing = false;
  }

  /*
   * Create a page of resources
   */
  createPage(page, page_key, page_ids, env) {
    /*const page_key = page.key;*/
    const property = env.properties[page_key];
    const has_code = property.tags.includes('code');
        
    let html = `<div id="${page_ids.page}" class="tab-page-container full-height"><div>`;

    html += page.header ?? `<div class="tab-page-title">${property.title ?? property.name}</div>`;
  
    if( exists(page.text) ) {
      if( is_list(page.text) )
        page.text = page.text.join(' ');
      html += `<div class="tab-page-text">${page.text}</div>`;
    }

    html += '</div><div class="tab-res-container"></div>';

    if( exists(page.footer) )
      html += `<div class="tab-page-text">${page.footer}</div>`;

    const pageNode = htmlToNode(html + '</div>');
    const pageBody = pageNode.querySelector('.tab-res-container');

    if( has_code ) {
      const codeBlock = htmlToNode(
        `<pre><div class="absolute z-top" style="right: 10px;">` +
        `<i id="${page_ids.copy}" class="bi bi-copy code-button" title="Copy to clipboard"></i>` +
        `<i id="${page_ids.download}" class="bi bi-arrow-down-square code-button" title="Download ${page.filename}"></i></div>` +
        `<code class="language-${page.language} full-height" style="scroll-padding-left: 20px;">${page.value}</code></pre>`
      );
      
      Prism.highlightAllUnder(codeBlock);

      codeBlock.querySelector(`#${page_ids.copy}`).addEventListener('click', (evt) => {
        console.log(`[Property Editor] Copying text from code block to clipboard`);
        navigator.clipboard.writeText(page.value);
      });

      codeBlock.querySelector(`#${page_ids.download}`).addEventListener('click', (evt) => {
        console.log(`[Property Editor] Downloading file ${page_key}`, page);
        save_page({page:page});
      });

      pageBody.appendChild(codeBlock);
    }
    else if( exists(env.value) ) {
      pageBody.appendChild(htmlToNode(`<div>${env.value}</div>`));
    }

    return pageNode;
  }

  /*
   * Remove this from the DOM
   */
  remove() {
    if( !exists(this.node) )
      return;

    this.node.remove();
    this.node = null;
  }

  /*
   * Get the active tab
   */
  getActiveTab() {
    const tabs = this.node.getElementsByClassName('btn-group-item');

    if( !nonempty(tabs) )
      return;

    for( const page of tabs ) {
      if( page.checked )
        return page;
    }

    return tabs[0];
  }

  /*
   * Change the selected tab
   */
  setActiveTab(key) {
    if( !exists(key) )
      return;

    console.log(`[CodeEditor] changing active tab to '${key}'`);

    const ids = this.ids(key);
    const tab = document.getElementById(ids.tab);

    if( tab.checked != true )
      tab.checked = true;  // this still fires events...

    for( const page of this.node.getElementsByClassName('code-container') ) {
      if( page.id === ids.page )
        page.classList.remove('hidden');
      else
        page.classList.add('hidden');
    };
  }

  /*
   * Get a dict of element IDs specific to a tab
   */
  ids(key) {
    const pre = `${this.id}-${key}-`;
    return {
      tab: pre + 'tab',
      page: pre + 'page',
      copy: pre + 'copy',
      download: pre + 'download'
    };
  }
}

