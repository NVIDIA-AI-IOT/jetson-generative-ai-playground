#!/usr/bin/env node
import { 
  htmlToNode, htmlToNodes, RollUp
} from '../nanolab.js';
  

/*
 * Create sidebar of rolldown panels / help docs
 */
export function SideBar({id, parent, searchBar}) {

  // <div id="${id}-container" class="sidebar-container">
  const sidebar = htmlToNode(`
      <div id="${id}" class="flex flex-column sidebar">
        <!-- <div class="sidebar-controls"><i class="bi bi-chevron-left sidebar-toggle"></i></div> -->
      </div>\n`,
    parent
  );

  //const sidebar = node.querySelector('.sidebar');

  const statusMsg = StatusMessages({parent: sidebar});
  const deviceConfig = DeviceConfigHelp({parent: sidebar});
  const downloadPanel = DownloadPanel({parent: sidebar, searchBar: searchBar});
  const pipPanel = PipPanel({parent: sidebar, searchBar: searchBar});

  return sidebar;
}

/*const node = htmlToNode(`
  <div>
    Deploy open AI/ML microservices and models optimized with quantization for local serving via OpenAI endpoints.<br/><br/>
    This generates <span class="monospace" style="font-size: 95%">docker-compose</span> stacks that launch 
    <span class="monospace" style="font-size: 95%"><a href="https://github.com/dusty-nv/jetson-containers" target="_blank">jetson-containers</a></span> 
    along with benchmarks & prompt templates for Python, JavaScript, and Bash.<br/><br/>
    Find us on <a href="https://discord.gg/vpmNaT46" target="_blank">Discord</a> to get involved.
    Warm thanks to our partners, researchers, and contributors in the field! <span style="font-size: 135%">🤗 🤖</span>
  </div>
`);*/

export function StatusMessages({id, parent}) {
  id ??= `${parent.id}-status`;

  const node = htmlToNode(`
    <div>
      This interactive configuration/quantization tool is for launching 
      <a href="https://github.com/dusty-nv/jetson-containers" target="_blank">local AI microservices</a>
      for on-device LLMs, VLMs, agents, and web UI's.<br/><br/>
      Check out the <a href="tutorials/microservices_intro.html" target="_blank">tutorial</a> and community 
      <a href="https://discord.gg/BmqNSK4886" target="_blank">Discord</a> channel for help or to get involved!<br/><br/>
      Warm thanks to all our partners, researchers, and contributors in the field <span style="font-size: 135%">🤗 🤖</span>
    </div>
  `);

  return RollUp({
    id: id,
    title: `AI Microservices`,
    body: node,
    icon: 'bi-nvidia',
    expanded: true,
    parent: parent
  });
}

/*export function StatusMessages({id, parent}) {
    id ??= `${parent.id}-status`;
  
    const node = htmlToNode(`
      <div>
        This interactive configuration/quantization tool is for launching local AI microservices.<br/><br/>
        We'll be populating more LLMs, VLMs, agent tools, and web UI's - come find us on <a href="https://github.com/dusty-nv/jetson-containers" target="_blank">GitHub</a> or <a href="https://discord.gg/vpmNaT46" target="_blank">Discord</a> for help or to get involved!<br/><br/>
        Warm thanks to all our partners, researchers, and contributors in the field <span style="font-size: 135%">🤗 🤖</span>
      </div>
    `);
  
    return RollUp({
      id: id,
      title: `Under Construction`,
      body: node,
      icon: 'bi-exclamation-triangle-fill',
      expanded: true,
      parent: parent
    });
  }*/

    
export function DeviceConfigHelp({id, parent}) {
  id ??= `${parent.id}-device-config`;

  const node = htmlToNode(`
    <div>
      For installation, first see the <a href="/initial_setup_jon.html" target="_blank">Initial Setup Guide for Jetson Orin Nano Developer Kit</a> to flash your device with the latest <a href="https://developer.nvidia.com/embedded/jetpack" target="_blank">JetPack</a>.<br/><br/>
      Then install <a href="https://github.com/dusty-nv/jetson-containers" target="_blank"><span class="monospace" style="font-size: 95%">jetson-containers</span></a> to configure Docker and low-memory settings.<br/><br/>
      By default it's recommended to mount NVME storage under <span class="monospace" style="font-size: 95%">/mnt/nvme</span></a> and to allocatate additional SWAP as needed.
    </div>
  `);

  return RollUp({
    id: id,
    title: `Device Setup`,
    body: node,
    icon: 'bi-motherboard-fill',
    expanded: false,
    parent: parent
  });
}

export function DownloadPanel({id, parent, searchBar}) {
  id ??= `${parent.id}-download-panel`;

  const download_set_id = `${id}-download-set`;
  const download_all_id = `${id}-download-all`;

  const node = htmlToNode(`
    <div>
    <div>
      Download the generated docker-compose stacks and examples as a .zip to your Jetson:
    </div>
    <div style="margin: 15px 15px">
      <button id="${download_set_id}" class="btn-green btn-sm" title="Download the set of docker-compose templates and scripts corresponding to your selection from the search query.">
      <i class="bi bi-cloud-download" style="font-size: 120%; font-weight: 600; margin-right: 5px;"></i>Download Set</button>
      <button id="${download_all_id}" class="btn-green btn-sm" title="Download all the templates from every model and service currently available in the index.">
      <i class="bi bi-cloud-download" style="font-size: 120%; font-weight: 600; margin-right: 5px;"></i>Download All</button>
    </div>
    </div>
  `);

  node.querySelector(`#${download_set_id}`).addEventListener('click', (evt) => {
    console.log(`Downloading set ${evt}`);
    searchBar.download('set');
  });

  node.querySelector(`#${download_all_id}`).addEventListener('click', (evt) => {
    console.log(`Downloading all ${evt}`);
    searchBar.download('all');
  });
  
  return RollUp({
    id: id,
    title: `Downloads`,
    body: node,
    expanded: false,
    parent: parent,
    icon: 'bi-arrow-down-circle'
  });
}

export function PipPanel({id, parent, searchBar}) {
  id ??= `${parent.id}-pip-panel`;

  const node = htmlToNode(`
    <div>
      Download CUDA wheels built by jetson-containers from <a href="https://pypi.jetson-ai-lab.dev" target="_blank" class="monospace">pypi.jetson-ai-lab.dev</a><br/><br/>
      To enable this by default in pip for JetPack 6, and mirror PyPi for non-GPU packages:</br></br><span class="monospace">export PIP_INDEX_URL=https://pypi.jetson-ai-lab.dev/jp6/cu126</span>
    </div>
  `);

  return RollUp({
    id: id,
    title: `Pip Server`,
    body: node,
    expanded: false,
    parent: parent,
    icon: 'bi-gear-fill'
  });
}