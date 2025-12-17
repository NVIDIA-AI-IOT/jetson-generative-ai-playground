#!/usr/bin/env node
import { 
  htmlToNode, htmlToNodes, RollUp
} from '../nanolab.js';
  

/*
 * Create sidebar of rolldown panels / help docs
 */
export function SideBar({id, parent}) {

  const node = htmlToNode(
    `<div id="${id}" class="flex flex-column" style="margin-top: 70px;">\n`,
    parent
  );

  const statusMsg = StatusMessages({parent: node});
  const deviceConfig = DeviceConfigHelp({parent: node});
  const downloadPanel = DownloadPanel({parent: node});

  return node;
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
        Welcome to a live preview of Jetson AI Lab!  This model configuration/quantization tool is for launching local AI microservices.<br/><br/>
        We'll be populating more LLMs, VLMs, agent tools, and web UI's - come find us on <a href="https://github.com/dusty-nv/jetson-containers" target="_blank">GitHub</a> or <a href="https://discord.gg/vpmNaT46" target="_blank">Discord</a> for help or to get involved!<br/><br/>
        Warm thanks to all our partners, researchers, and contributors in the field <span style="font-size: 135%">🤗 🤖</span>
      </div>
    `);
  
    return RollUp({
      id: id,
      title: `Under Development`,
      body: node,
      icon: 'bi-exclamation-triangle-fill',
      expanded: true,
      parent: parent
    });
  }

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
    expanded: true,
    parent: parent
  });
}

export function DownloadPanel({id, parent}) {
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
  });

  node.querySelector(`#${download_all_id}`).addEventListener('click', (evt) => {
    console.log(`Downloading all ${evt}`);
  });
  
  return RollUp({
    id: id,
    title: `Downloads`,
    body: node,
    expanded: true,
    parent: parent,
    icon: 'bi-arrow-down-circle'
  });
}