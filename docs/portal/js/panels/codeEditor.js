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
        save_pages(this.pages, this.key);
    });  

    if( this.parent )
      this.parent.appendChild(this.node);
  }

  /*
   * Layout components given a set of code tabs, sources, or files.
   */
  refresh(env) {
    if( !exists(env) )
      return;

    if( this.refreshing ) {
      console.warning(`[CodeEditor] detected re-entrant call to refresh(), skipping...`);
      return;
    }
    
    //console.log(`[CodeEditor] refreshing tabs with:`, env);

    this.key = env.key;
    this.refreshing = true;
    this.pages = this.createPageGroups(env);

    for( const tab_key in this.pages ) {
      const tabNode = this.createTab(env, tab_key);
      this.node.appendChild(tabNode);

      if( this.isActiveTab(tab_key) )
        this.setActiveTab(tab_key);
    }

    this.refreshing = false;
  }

  /*
   * Create a collapsable/scrollable area of paged resources.
   */
  createPage(page, page_key, page_ids, env) {
    const has_code = page.tags.includes('code');
    const expanded = page.expand ?? true;
    const expClass = {true: 'bi-chevron-down', false: 'bi-chevron-up'};

    let html = `<div id="${page_ids.page}" class="tab-page-container full-height"><div>`;
    html += `<i class="bi ${expClass[expanded]} tab-page-expand"></i>`;
    html += page.header ?? `<div class="tab-page-title-div"><span class="tab-page-title">${page.title ?? page.name}</span></div>`;
    html += '<div class="tab-page-body">';
    
    if( exists(page.text) ) {
      if( is_list(page.text) )
        page.text = page.text.join(' ');
      html += `<div class="tab-page-text">${page.text}</div>`;
    }

    html += '</div>';

    const pageNode = htmlToNode(html + '</div>');
    const pageBody = pageNode.querySelector('.tab-page-body');
    const expander = pageNode.querySelector('.tab-page-expand');

    if( has_code ) {
      pageBody.appendChild(this.createCodeBlock(page));
    }
    /*else if( exists(env.value) ) {
      pageBody.appendChild(htmlToNode(`<div>${env.value}</div>`));
    }*/

    if( exists(page.footer) ) {
      pageBody.appendChild(htmlToNode(
        `<div class="tab-page-text">${page.footer}</div>`
      ));
    }

    expander.addEventListener('click', (evt) => {
      if( expander.classList.contains(expClass[true]) ) {
        expander.classList.replace(expClass[true], expClass[false]);
        //console.log(`[Code Editor] Hiding page ${page.filename}`);
      }
      else {
        expander.classList.replace(expClass[false], expClass[true]);
        //console.log(`[Code Editor] Expanding page ${page.filename}`);
      }
      pageBody.classList.toggle('hidden');
    });

    return pageNode;
  }

  /*
   * Create a code block with syntax highlighting and copy/download buttons.
   */
  createCodeBlock(page) {
    const codeBlock = htmlToNode(
      `<pre><div class="absolute z-top" style="right: 10px;">` +
      `<i class="bi bi-copy code-button code-copy" title="Copy to clipboard"></i>` +
      `<i class="bi bi-arrow-down-square code-button code-download" title="Download ${page.filename}"></i></div>` +
      `<code class="language-${page.language} full-height" style="scroll-padding-left: 20px;">${page.value}</code></pre>`
    );
    
    Prism.highlightAllUnder(codeBlock);

    codeBlock.querySelector('.code-copy').addEventListener('click', (evt) => {
      console.log(`[Property Editor] Copying text from ${page.filename} to clipboard`);
      navigator.clipboard.writeText(page.value);
    });

    codeBlock.querySelector('.code-download').addEventListener('click', (evt) => {
      console.log(`[Property Editor] Downloading file ${page.filename}`, page);
      save_page({page:page});
    });

    return codeBlock;
  }

  /*
   * Group references by resource type (e.g. shell, compose, code, ect)
   */
  createPageGroups(env) {
    let references = env.resource_order ?? [];
    let pages = {};
    let db = env.db;

    for( const field_key in env.properties ) {
      if( references.includes(field_key) )
        continue;
      
      if( db.ancestors[field_key].includes('resource') )
        references.push(field_key);
    }

    for( const ref_key in env.references ) {
      if( !references.includes(ref_key) )
        references.push(ref_key);
    }

    for( const ref_key of references ) {
      if( !(ref_key in db.index) ) {
        console.warn(`Missing key '${ref_key}' from ${env.key}.${ref_key}`, references);
        continue;
      }

      if( ref_key in env.properties ) {
        var page = {...env.properties[ref_key]};

        if( exists(page.value) )
          page.default = page.value;

        page.value = env[ref_key];
      }
      else {
        var page = env.references[ref_key];
      }

      let group = page.group; // TODO default to root-1

      pages[group] ??= {};
      pages[group][ref_key] = page;

      /*if( !db.ancestors[ref_key].includes(groupBy) )
        continue;
      
      for( const ancestor of db.ancestors[field_key] ) {
        if( !db.children[groupBy].includes(ancestor) )
          continue;

        if( !(ancestor in pages) ) 
          pages[ancestor] = {};

        let page = {...env.properties[field_key]};

        if( exists(page.value) )
          page.default = page.value;

        page.value = env[field_key];
        pages[ancestor][field_key] = page;
      }*/
    }

    return pages;
  }

  /*
   * Create a tab from the tab group, along with its paged content.
   */
  createTab(env, tab_key) {
    const tab = this.pages[tab_key];
    const ids = this.ids(tab_key);
    
    if( !exists(document.getElementById(ids.tab)) )
    {
      const tabNodes = htmlToNodes(
        `<input type="radio" id="${ids.tab}" class="btn-group-item" name="${this.id}-tab-group" ` +
        `${this.isActiveTab(tab_key) ? ' checked ' : ' '}> <label for="${ids.tab}">${tab_key}</label>`
      );

      for( const node of tabNodes ) {
        this.tabs.appendChild(node);  
        node.addEventListener('click', (evt) => {
          this.setActiveTab(tab_key);
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

    return tabNode;
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
   * Check if this is the active tab
   */
  isActiveTab(key) {
    const activeTab = this.getActiveTab();
    return exists(activeTab) ? (this.ids(key).tab === activeTab.id) : true;
  }

  /*
   * Change the selected tab
   */
  setActiveTab(key) {
    if( !exists(key) )
      return;

    //console.log(`[CodeEditor] changing active tab to '${key}'`);

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
    };
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
}

