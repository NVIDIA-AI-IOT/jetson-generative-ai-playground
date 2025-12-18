#!/usr/bin/env node

/*
 * Static definitions of preset query views and their associated tags.
 * These aren't pulled from the DB because they're used in the site-wide
 * menus, and we want to avoid loading the DB when otherwise unused.
 */
export const QueryViews = {
  all: {
    name: 'All',
    tags: ['models', 'webui'],
    menu: false
  },
  models: {
    name: 'Models',
    tags: ['models'],
    menu: false
  },
  llm: {
    name: 'LLM',
    tags: ['llm'],
    menu: true
  },
  vlm: {
    name: 'VLM',
    tags: ['vlm'],
    menu: true
  },
  webui: {
    name: 'Web UI',
    tags: ['webui'],
    menu: 'divider'
  },
  containers: {
    name: 'Containers',
    tags: ['jetson-containers'],
    menu: true
  }
}

/*
 * Get the specified view from the browser's query string (?view=xyz)
 */
export function QueryView(param='view', default_view='all') {
  const params = new URLSearchParams(window.location.search);
  const key = params.has(param) ? params.get(param) : default_view;
  
  if( !(key in QueryViews) )
    return;

  var view = QueryViews[key];
  view.key = key;

  return view;
}
