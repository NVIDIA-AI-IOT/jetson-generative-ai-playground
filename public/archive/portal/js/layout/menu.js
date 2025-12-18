#!/usr/bin/env node
import { 
  htmlToNode, QueryViews
} from '../nanolab.js';
  

/*
 * Attach extra navigation drop-down menus or context menus in the DOM.
 */
export function addNavMenus() {
  return [
    addNavMenuViews('models.html', QueryViews)
  ]
}

/*
 * Create a navigation drop-down menu of the different query views,
 * and add it to the DOM. This attaches the menu to to one of the 
 * top-level navigation tabs, as specified by it's page name.
 */
export function addNavMenu(page, children) {

  var navDropdown = htmlToNode(`
    <div class="nav-menu-dropdown">
      ${children}
    </div>
  `);

  const onNavMenuHide = (evt) => {
    const mx = evt.clientX;
    const my = evt.clientY;
    const dd = navDropdown.getBoundingClientRect();
    if( my < dd.top || my > dd.bottom || mx < dd.left || mx > dd.right )
      navDropdown.style.display = "none";
  };

  navDropdown.addEventListener("mouseleave", onNavMenuHide);

  navDropdown.childNodes.forEach((navMenuItem) => {
    navMenuItem.addEventListener("click", (evt) => {
      navDropdown.style.display = "none";
    })
  });

  var navTabs = document.querySelectorAll('.md-tabs__item');

  navTabs.forEach((navTab) => {
    const navTabLink = navTab.querySelector('a');
    const navTabPage = navTabLink.href.split('/').pop();
    if( navTabPage != page )
      return;
    //navTabLink.appendChild(htmlToNode(`<i class="nav-tab-icon"></i>`));
    navTab.addEventListener("mouseenter", (evt) => {
      const navLinkRect = navTabLink.getBoundingClientRect();
      const navTabRect = navTab.getBoundingClientRect();
      navDropdown.style.display = "flex";
      navDropdown.style.left = `${navLinkRect.x - 5}px`;
      navDropdown.style.top = `${navTabRect.bottom}px`;
    });
    navTab.addEventListener("mouseleave", onNavMenuHide);
  });

  document.body.appendChild(navDropdown);
  return navDropdown;
}

/*
 * Add a nav drop-down menu based on the different graphDB views.
 */
export function addNavMenuViews(page, views) {
  var html = '';

  for( const key in views ) {
    const view = views[key];
    if( !view.menu )
      continue;
    if( view.menu === 'divider' )
      html += `<div class="nav-menu-divider"></div>`;
    html += `<a href="${page}?view=${key}">${view.name}</a>`;
  }

  return addNavMenu(page, html);
}