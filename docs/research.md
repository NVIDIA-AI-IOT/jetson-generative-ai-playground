---
title: Jetson AI Lab Research Group
hide:
  - navigation
---

# Jetson AI Lab Research Group

The Jetson AI Lab Research Group is a global collective for advancing open-source Edge ML, open to anyone to join and collaborate with others from the community and leverage each other's work.  Our goal is using advanced AI for good in real-world applications in accessible and responsible ways.  By coordinating together as a group, we can keep up with the rapidly evolving pace of AI and more quickly arrive at deploying intelligent multimodal agents and autonomous robots into the field.

There are virtual [meetings](#meeting-schedule) that anyone is welcome to join, offline discussion on the [Jetson Projects](https://forums.developer.nvidia.com/c/agx-autonomous-machines/jetson-embedded-systems/jetson-projects/78){:target="_blank"} forum, and guidelines for upstreaming open-source [contributions](#contribution-guidelines). 

!!! abstract "Next Meeting - 10/29"
    <!--The next team meeting is on Tuesday, June 11<sup>th</sup> at 9am PST.  View the [recording](#past-meetings) from the last meeting below.-->
    The next team meeting is on Tuesday, October 29<sup>th</sup> at 9am PST - see the [invite](#meeting-schedule) below or click [here](https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTA4ZmE4MDAtYWUwMS00ZTczLWE0YWEtNTE5Y2JkNTFmOWM1%40thread.v2/0?context=%7b%22Tid%22%3a%2243083d15-7273-40c1-b7db-39efd9ccc17a%22%2c%22Oid%22%3a%221f165bb6-326c-4610-b292-af9159272b08%22%7d){:target="_blank"} to join the meeting in progress.

## Topics of Interest

These are some initial research topics for us to discuss and investigate. This list will vary over time as experiments evolve and the SOTA progresses:

<table>
  <tr>
    <td>• Controller LLMs for dynamic pipeline code generation</td>
    <td>• Fine-tuning LLM/VLM onboard Jetson AGX Orin 64GB</td>
  </tr>
  <tr>
    <td>• HomeAssistant.io integration for smart home [<a href="https://www.home-assistant.io" target="_blank">1</a>] [<a href="https://github.com/dusty-nv/jetson-containers/pull/442" target="_blank">2</a>]</td>
    <td>• Continuous multi-image VLM streaming and change detection</td>
  </tr>
  <tr>
    <td>• Recurrent LLM architectures (Mamba, RKVW, ect) [<a href="https://github.com/dusty-nv/jetson-containers/issues/447" target="_blank">1</a>]</td>
    <td>• Lightweight low-memory streaming ASR/TTS models</td>
  </tr>
  <tr>
    <td>• Diffusion models for image processing and enhancement</td>
    <td>• Time Series Forecasting with Transformers [<a href="https://huggingface.co/blog/autoformer" target="_blank">1</a>] [<a href="https://github.com/time-series-foundation-models/lag-llama" target="_blank">2</a>]</td>
  </tr>
  <tr>
    <td>• Guidance, grammars, and guardrails for constrained output</td>
    <td>• Inline LLM function calling / plugins from API definitions</td>
  </tr>
  <tr>
    <td>• ML DevOps, edge deployment, and orchestration</td>
    <td>• Robotics, IoT, and cyberphysical systems integration</td>
  </tr>
</table>

New topics can be raised to the group either during the meetings or on the [forums](https://forums.developer.nvidia.com/c/agx-autonomous-machines/jetson-embedded-systems/jetson-projects/78){:target="_blank"} (people are welcome to work on whatever they want of course)

## Contribution Guidelines

<!--<img src="research/images/robots_1.jpg" style="max-height: 325px;" align="right"></img>-->

When experiments are successful, ideally the results will be packaged in such a way that they are easily reusable for others to integrate into their own projects:

<div style="display: flex; align-items: center;">
	<span style="min-width: 365px;">
		<ul>
			<li>Open-source libraries & code on GitHub</li>
			<li>Models on <a href="https://huggingface.co/models" target="_blank">HuggingFace Hub</a></li>
			<li>Containers provided by <a href="https://github.com/dusty-nv/jetson-containers" target="_blank">jetson-containers</a></li>
			<li>Discussions on the <a href="https://forums.developer.nvidia.com/c/agx-autonomous-machines/jetson-embedded-systems/jetson-projects/78" target="_blank">Jetson Projects</a> forum</li>
			<li>Documentation & tutorials on Jetson AI Lab</li>
			<li><a href="https://www.hackster.io/" target="_blank">Hackster.io</a> for hardware-centric builds</li>
		</ul>
	</span>
	<span style="margin-left: 2em;">
		<img src="research/images/robots_0.jpg" style="max-height: 220px;">
	</span>
</div>

Ongoing technical discussions are encouraged to occur on the forums or GitHub Issues, with status updates on projects given during the meetings.

## Meeting Schedule

We'll aim to meet monthly or bi-weekly as a team in virtual meetings that anyone is welcome to join and speak during.  We'll discuss the latest updates and experiments that we want to explore.  Please remain courteous to others during the calls.  We'll stick around after for anyone who has questions or didn't get the chance to be heard.

!!! abstract "Tuesday October 29<sup>th</sup> at 9am PST (10/29/24)"

	- Microsoft Teams - [Meeting Link](https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTA4ZmE4MDAtYWUwMS00ZTczLWE0YWEtNTE5Y2JkNTFmOWM1%40thread.v2/0?context=%7b%22Tid%22%3a%2243083d15-7273-40c1-b7db-39efd9ccc17a%22%2c%22Oid%22%3a%221f165bb6-326c-4610-b292-af9159272b08%22%7d){:target="_blank"} 
	- Meeting ID: `264 770 145 196`
    - Passcode: `Uwbdgj`	
	- Outlook Invite:  [`Jetson AI Lab Research Group.ics`](research/invites/Jetson AI Lab Research Group.ics){:target="_blank"} 
<!--
    - Agenda:
	    * OpenVLA on [MimicGen](https://mimicgen.github.io/){:target="_blank"} 
	    * [Phi-3 Vision via ONNX](https://techcommunity.microsoft.com/t5/educator-developer-blog/running-phi-3-vision-via-onnx-on-jetson-platform/ba-p/4195041){:target="_blank"} (Jambo Chen)
	    * [OStream GenRunner](https://genainerds.com/#/Gapi){:target="_blank"} - GAPI (Kerry Shih)
	    * Open Q&A

	- Forum Topic:  [`forums.developer.nvidia.com/t/293749`](https://forums.developer.nvidia.com/t/jetson-ai-lab-research-group-meeting-on-5-29/293749)
	
	- Agenda:
	    * OpenAI-style Tools with <a href="https://huggingface.co/NousResearch/Hermes-2-Pro-Llama-3-8B" target="_blank">NousResearch/Hermes-2-Pro-Llama-3-8B</a>
	    * Jetson Copilot with <a href="https://github.com/dusty-nv/jetson-containers/tree/master/packages/rag/jetrag" target="_blank">jetrag</a>
	    * <a href="https://github.com/NVIDIA-AI-IOT/whisper_trt" target="_blank">whisper_trt</a> for Orin Nano
	    * Open Q&A
-->   
The agenda will be listed here beforehand - post to the forum to add agenda items.  The meetings will be recorded so anyone unable to attend live can watch them after.

## Past Meetings

<details open><summary>October 15, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/Dpe48AVKc4c" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
    <li><a href="./lerobot" target="_blank">HuggingFace LeRobot</a> (Chitoku Yato)</li>
    <li><a href="https://www.davesarmoury.com/" target="_blank">Stanley H1 Humanoid</a> (Dave Niewinski)</li>
</ul>

</details>

<details><summary>October 1, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/HfJR3NwsM4M" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
    <li><a href="https://nvidia-ai-iot.github.io/remembr/" target="_blank">ReMEmbR: Long-Horizon Memory for Navigation</a> (Abrar Anwar)</li>
    <li><a href="https://3d-diffusion-policy.github.io/" target="_blank">Diffusion Policies</a>, <a href="https://github.com/qizekun/ShapeLLM" target="_blank">Shape LLM</a>, <a href="https://paperswithcode.com/sota/3d-point-cloud-classification-on-scanobjectnn" target="_blank">3D Encoders</a></li>
</ul>

</details>

<details><summary>September 17, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/Gys_AUOYZ4c" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
    <li><a href="https://github.com/nasa-jpl/rosa" target="_blank">NASA JPL - ROSA</a> (Rob Royce & Shehryar Khattak)</li>
    <li><a href="https://www.jetson-ai-lab.com/lerobot.html" target="_blank">LeRobot Walkthrough</a> (Chitoku Yato)</li>
	<li><a href="https://medium.com/@kabilankb2003/building-a-multimodal-ai-agent-integrating-vision-language-models-in-nvidia-isaac-sim-with-jetson-20592d4ef6c5" target="_blank">VLM Agent in Isaac Sim/ROS</a> (Kabilan Kb)</li>
</ul>

</details>

<details><summary>September 3, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/r1i3QQrRnfI" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
    <li><a href="https://github.com/dusty-nv/jetson-containers/tree/master/packages/nerf/nerfstudio" target="_blank">Edge NeRF's and nerfstudio</a> (Johnny Núñez Cano)</li>
    <li>Review of <a href="https://www.jetson-ai-lab.com/openvla.html" target="_blank">OpenVLA results</a> (Dustin Franklin)</li>
	<li><a href="https://github.com/tekntrash/oculusdobotcontrol/" target="_blank">Oculus Interface for Jetson</a> (Al Costa)</li>
	<li><a href="https://developer.nvidia.com/blog/new-foundational-models-and-training-capabilities-with-nvidia-tao-5-5/" target="_blank">TAO Toolkit 5.5</a></li>
</ul>

</details>

<details><summary>August 20, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/WOv_GymDDNs" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
    <li><a href="https://www.jetson-ai-lab.com/ros.html" target="_blank">GenAI ROS Nodes for VLM</a> (Khannah Shaltiel)</li>
	<li><a href="https://github.com/kabilan2003/NVIDIA-Isaac-Sim-and-Isaac-ROS-Integration-on-Jetson-Orin-Nano" target="_blank">Isaac Sim and Orin Nano with Hardware-in-the-Loop</a> (Kabilan Kb)</li>
	<li><a href="https://www.miruml.com/" target="_blank">Miru Edge Deployment Infrastructure</a> (Vedant Nair)</li>
</ul>

</details>

<details><summary>August 6, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/W1o-9MZQYMA" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
    <li>OpenVLA Fine-Tuning</li>
	<li>Gemma-2-2b (Asier Arranz)</li>
	<li>Ultralytics YOLOv8 (Lakshantha Dissanayake)</li>
</ul>

</details>

<details><summary>July 23, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/pURku7OAWuo" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
    <li><a href="https://huggingface.co/blog/llama31" target="_blank">Llama-3</a> Function & Specs</a></li>
	<li>OpenVLA with <a href="https://mimicgen.github.io/" target="_blank">MimicGen</a></li>
	<li><a href="https://techcommunity.microsoft.com/t5/educator-developer-blog/running-phi-3-vision-via-onnx-on-jetson-platform/ba-p/4195041" target="_blank">Phi-3 Vision via ONNX</a> (Jambo Chen)</li>
    <li><a href="https://genainerds.com/#/Gapi" target="_blank">OStream GenRunner</a> (Kerry Shih)</li>
</ul>

</details>

<details><summary>July 9, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/Ngaq2WCDlZM" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
	<li>OpenVLA Quantization (<a href="https://openvla.github.io/" target="_blank">openvla.github.io</a>)</li>
	<li>visualnav-transformer (<a href="https://github.com/robodhruv/visualnav-transformer" target="_blank">robodhruv/visualnav-transformer</a>)</li>
    <li>Florence-2, Holoscan, Grammars (Nigel Nelson, <a href="https://github.com/nvidia-holoscan/holohub/tree/main/applications/florence-2-vision" target="_blank">florence-2-vision</a>)</li>
    <li>LLaMa-Factory (<a href="https://github.com/hiyouga/LLaMA-Factory" target="_blank">hiyouga/LLaMA-Factory</a>)</li>
</ul>

</details>

<details><summary>June 25, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/mIrxJiF1NiI" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
	<li>Function Calling in Agent Studio</li>
	<li><a href="https://www.jetson-ai-lab.com/tutorial_jetson-copilot.html">Jetson Copilot</a> (Chitoku Yato)</li>
    <li><a href="https://docs.nvidia.com/jetson/jps/moj-overview.html" target="_blank">Jetson Platform Services</a> (Sammy Ochoa)</li>
    <li><a href="https://www.hackster.io/shahizat/fine-tuning-llms-using-nvidia-jetson-agx-orin-b17c4d" target="_blank">On-device Fine-tuning</a> (Nurgaliyev Shakhizat)</li>
</ul>

</details>

<details><summary>June 11, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/0GV5cYKz7Rc" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
	<li>Agent Studio</li>
	<li>HomeAssistant 2024.6</li>
	<li>AWS IoT Greengrass (Romil Shah)</li>
</ul>

</details>

<details><summary>May 29, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/aq7QS9AtwE8" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
	<li>OpenAI-style Tools with <a href="https://huggingface.co/NousResearch/Hermes-2-Pro-Llama-3-8B" target="_blank">NousResearch/Hermes-2-Pro-Llama-3-8B</a></li>
	<li>Jetson Copilot with <a href="https://github.com/dusty-nv/jetson-containers/tree/master/packages/rag/jetrag" target="_blank">jetrag</a></li>
	<li><a href="https://github.com/NVIDIA-AI-IOT/whisper_trt" target="_blank">whisper_trt</a> for Orin Nano</li>
</ul>

</details>

<details><summary>May 15, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/zoyONbiHd14" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
	<li><a href="https://forums.developer.nvidia.com/t/new-vila-1-5-multimodal-vision-language-models-released-in-3b-8b-13b-40b/291784" target="_blank">VILA-1.5 on Video Sequences</a></li>
	<li>Voicecraft Container (<a href="https://github.com/dusty-nv/jetson-containers/pull/498" target="_blank">Martin Cerven</a>)</li>
	<li>JetBot / Nanosaur Updates for Orin Nano (Chitoku Yato & Raffaello Bonghi)</li>
	<li>Controller LLM & Advanced Function Calling (<a href="https://huggingface.co/NousResearch/Hermes-2-Pro-Llama-3-8B" target="_blank"><code>NousResearch/Hermes-2-Pro-Llama-3-8B</code></a>)</li>
	<li>RAG Samples with LlamaIndex (Chitoku Yato)</li>
</ul>

</details>

<details><summary>May 1, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/L4i5x8zzyNc" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
	<li><a href="https://forums.developer.nvidia.com/t/jetson-ai-lab-agent-controller-llm/288229/2" target="_blank">Function Calling with Llama-3</a></li>
	<li><a href="https://forums.developer.nvidia.com/t/jetson-ai-lab-home-assistant-integration/288225" target="_blank">Home Assistant / Wyoming (Mieszko Syty)</a></li>
	<li><a href="https://forums.developer.nvidia.com/t/system-to-capture-consumption-data-measuring-weight-and-temperature-of-products-disposed/290402" target="_blank">Smart Sorting / Recycling (Alvaro Costa)</a></li>
</ul>

</details>

<details><summary>April 17, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/F0v0OsqGsVw" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Topics Covered:</p>

<ul>
	<li><a href="https://forums.developer.nvidia.com/t/introducing-ollama-support-for-jetson-devices/289333" target="_blank">Ollama Support for Jetson Devices</li>
	<li><a href="https://forums.developer.nvidia.com/t/jetson-ai-lab-homeassistant-io-integration/288225" target="_blank">Home Assistant Integration</a></li>
	<li><a href="https://forums.developer.nvidia.com/t/jetson-ai-lab-ml-devops-containers-core-inferencing/288235/15?u=dusty_nv" target="_blank"><code>jetson-container</code> Updates</a></li>
	<li>Upgrading JetBot with Orin Nano</a></li>
</ul>

</details>

<details><summary>April 3, 2024</summary>

<div><iframe width="850" height="476" src="https://www.youtube.com/embed/7w3RHoIIkNE" style="margin-top: 1em;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>

<p>Project Kickoffs:</p>

<ul>
	<li><a href="https://forums.developer.nvidia.com/t/jetson-ai-lab-homeassistant-io-integration/288225" target="_blank">Home Assistant Integration</a></li>
	<li><a href="https://forums.developer.nvidia.com/t/jetson-ai-lab-controller-agent-llm/288229" target="_blank">Agent Controller LLM</li>
	<li><a href="https://forums.developer.nvidia.com/t/jetson-ai-lab-ml-devops-containers-core-inferencing/288235" target="_blank">ML DevOps, Containers, Core Inferencing</a></li>
</ul>

</details>
		
## Team Members

Below are shown some of the sustaining members of the group who have been working on generative AI in edge computing:

<style>
.shadow {
   box-shadow: 0 5px 15px rgba(0, 0, 0, .1) !important;
   transition: .3s ease;
   display: block !important;
}
    
.padding-feature-box-item{
   padding-left: 0.8rem!important;
   padding-right: 0.8rem!important;
   padding-top: 0.8rem!important;
   padding-bottom: 0.8rem!important;
}
    
.padding-graph{
   padding-left: 0.5rem!important;
   padding-right: 0.5rem!important;
   padding-top: 0.5rem!important;
   padding-bottom: 0.5rem!important;
}
    
.d-block {
   display: block!important;
}
 
.bg-white{background-color:#fff!important} 

.col, .col-1, .col-10, .col-11, .col-12, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-auto, .col-lg, .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-auto, .col-md, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-auto, .col-sm, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-auto {
   position: relative;
   width: 100%;
   min-height: 1px;
   padding: 5px;
}

@media (min-width: 576px) {
   .col-sm-6 {
	  -ms-flex: 0 0 50%;
	  flex: 0 0 50%;
	  max-width: 50%;
   }
   .col-sm-4 {
	  -ms-flex: 0 0 25%;
	  flex: 0 0 25%;
	  max-width: 25%;
   }
}
@media (min-width: 720px) {
   .col-lg-4 {
	  -ms-flex: 0 0 25%;
	  flex: 0 0 25%;
	  max-width: 25%;
   }
   .col-lg-3 {
	  -ms-flex: 0 0 33.333333%;
	  flex: 0 0 33.333333%;
	  max-width: 33.333333%;
   }
}
@media (min-width: 992px) {
   .col-lg-4 {
	  -ms-flex: 0 0 25%;
	  flex: 0 0 25%;
	  max-width: 25%;
   }
   .col-lg-3 {
	  -ms-flex: 0 0 33.333333%;
	  flex: 0 0 33.333333%;
	  max-width: 33.333333%;
   }
}
.text-center {
   text-align: center!important;
}
.justify-content-center {
   -ms-flex-pack:center!important;justify-content:center!important
}
.row {
   display:-ms-flexbox;
   display:flex;
   -ms-flex-wrap:wrap;
   flex-wrap:wrap;
   /* margin-right:-15px;
   margin-left:-15px */
}

.bio-logo {
	width: 25px;
	vertical-align: middle;
	opacity: 0.8;
	filter: grayscale(1.0);
}
    
.bio-image {
	max-height: 355px;
}

.bio-container {
    min-width: 355px;
}
</style>

<div class="row justify-content-center">
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/dustin-franklin-b3aaa173/" target="_blank"><img class="bio-image" src="research/images/Dustin_Franklin.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/dustin-franklin-b3aaa173/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.youtube.com/playlist?list=PL5B692fm6--sdf3tQk-1kp9T65y8p-D5u" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			<a href="https://www.github.com/dusty-nv" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Dustin Franklin, NVIDIA<br/>
			<small>
				Principal Engineer | Pittsburgh, PA<br/>
				(<a href="https://github.com/dusty-nv/jetson-inference" target="_blank">jetson-inference</a>, <a href="https://github.com/dusty-nv/jetson-containers" target="_blank">jetson-containers</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.hackster.io/shahizat" target="_blank"><img class="bio-image" src="research/images/Shakhizat_Nurgaliyev.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/shakhizat-nurgaliyev/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.hackster.io/shahizat" target="_blank"><img class="bio-logo" src="research/images/hackster.png"></img></a>
			Nurgaliyev Shakhizat<br/>
			<small>
				Institute of Smart Systems and AI | Kazakhstan<br/>
				(<a href="https://www.hackster.io/shahizat/ai-powered-application-for-the-blind-and-visually-impaired-df3f9e" target="_blank">Assistive Devices</a>, <a href="https://www.hackster.io/shahizat/vision2audio-giving-the-blind-an-understanding-through-ai-33f929" target="_blank">Vision2Audio</a>, <a href="https://www.hackster.io/shahizat/running-a-chatgpt-like-llm-llama2-on-a-nvidia-jetson-cluster-cbc7d4" target="_blank">HPC</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.youtube.com/@kerseyfabs" target="_blank"><img class="bio-image"src="research/images/Kris_Kersey.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/kriskersey/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.youtube.com/@kerseyfabs" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			Kris Kersey, <small>Kersey Fabrications</small><br/>
			<small>
				Embedded Software Engineer | Atlanta, GA<br/>
				(<a href="https://www.youtube.com/@oasis-project" target="_blank">The OASIS Project</a>, AR/VR, 3D Fabrication)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/johnnycano/" target="_blank"><img class="bio-image" src="research/images/Johnny_Cano.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/johnnycano/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/johnnynunez" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Johnny Núñez Cano<br/>
			<small>
				PhD Researcher in CV/AI | Barcelona, Spain<br/>
				(Recurrent LLMs, Pose & Behavior Analysis)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/doruk-sonmez/" target="_blank"><img class="bio-image" src="research/images/Doruk_Sonmez.png"></img></a><br/>
			<a href="https://www.linkedin.com/in/doruk-sonmez/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/doruksonmez" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Doruk Sönmez, <a href="https://connecttech.com/jetson/" target="_blank">ConnectTech</a><br/>
			<small>
				Intelligent Video Analytics Engineer | Turkey<br/>
				(NVIDIA DLI Certified Instructor, IVA, VLM)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://github.com/kingardor" target="_blank"><img class="bio-image" src="research/images/Akash_James.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/akashjames/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.youtube.com/channel/UCgJZkbxrBpbuHv4jOFuR8zQ" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			<a href="https://github.com/kingardor" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Akash James, <a href="https://www.sparkcognition.com/" target="_blank"><small>Spark Cognition</small></a><br/>
			<small>
				AI Architect, UC Berkeley Researcher | Oakland<br/>
				(NVIDIA AI Ambassador, <a href="https://www.youtube.com/channel/UCgJZkbxrBpbuHv4jOFuR8zQ" target="_blank">Personal Assistants</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/mieszkosyty/" target="_blank"><img class="bio-image" src="research/images/Mieszko_Syty.jpg" title="Hey there, I'm Mieszko Syty—your friendly neighbourhood AI/ML enthusiast, Design lover, and Front-End Engineer. With a knack for coding since I was knee-high, and a solid design foundation from the Fine Arts I bring a unique blend of creativity and tech expertise to the table.&#013;&#013;By day, I'm conquering the digital space as a Lead Front-End Engineer, orchestrating projects for News, Fin-tech, and Private Banking on a global scale. But when the sun sets, you'll find me knee-deep in ML & NLP escapades, especially in the areas of Home Automation, Personal Assistants and LLM/VLM driven apps.&#013;&#013;Oh, and did I mention I'm a Sci-Fi fan? Yep, I'm all about turning your childhood dreams into cutting-edge & edge-computing reality! So, if you're ready to embark on a journey where tech meets imagination, let's connect and make some digital magic happen!"></img></a><br/>
			<a href="https://www.linkedin.com/in/mieszkosyty/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/ms1design" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Mieszko Syty, MS/1 Design<br/>
			<small>
				AI/ML Engineer | Warsaw, Poland<br/>
				(LLM, Home Assistants, ML DevOps)
			</small>
		</div>
	</div>	
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://jetsonhacks.com/" target="_blank"><img class="bio-image" src="research/images/Jim_Benson.png"></img></a><br/>
			<a href="https://www.youtube.com/@JetsonHacks" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			<a href="https://github.com/jetsonhacks" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Jim Benson, <a href="https://jetsonhacks.com/" target="_blank">JetsonHacks</a><br/>
			<small>
				DIY Extraordinaire | Los Angeles, CA<br/>
				(AI in Education, <a href="https://racecarj.com/" target="_blank">RACECAR/J</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/chitoku-yato-01ba304/" target="_blank"><img class="bio-image" src="research/images/Chitoku_Yato.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/chitoku-yato-01ba304/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/tokk-nv" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Chitoku Yato, NVIDIA<br/>
			<small>
				Jetson AI DevTech | Santa Clara, CA<br/>
				(<a href="https://jetbot.org/master/" target="_blank">JetBot</a>, <a href="https://github.com/NVIDIA-AI-IOT/jetracer" target="_blank">JetRacer</a>, <a href="https://nvidia-ai-iot.github.io/jetson-min-disk/" target="_blank">MinDisk</a>, Containers)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/danasheahen/" target="_blank"><img class="bio-image" src="research/images/Dana_Sheahen.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/danasheahen/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			Dana Sheahen, NVIDIA<br/>
			<small>
				DLI Curriculum Developer | Santa Clara, CA<br/>
				(AI in Education, <a href="https://developer.nvidia.com/embedded/learn/jetson-ai-certification-programs" target="_blank">Jetson AI Fundamentals</a>)
			</small>
		</div>
	</div>	
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/sammy-ochoa/" target="_blank"><img class="bio-image" src="research/images/Sammy_Ochoa.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/sammy-ochoa/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/NVIDIA-AI-IOT/mmj_genai" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Sammy Ochoa, NVIDIA<br/>
			<small>
				Jetson AI DevTech | Austin, TX<br/>
				(<a href="https://developer.nvidia.com/metropolis-microservices" target="_blank">Metropolis Microservices</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/john-w-213126183/" target="_blank"><img class="bio-image" src="research/images/John_Welsh.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/john-w-213126183/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/jaybdub" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			John Welsh, NVIDIA<br/>
			<small>
				(<a href="https://www.jetson-ai-lab.com/vit/tutorial_nanoowl.html" target="_blank">NanoOWL</a>, <a href="https://www.jetson-ai-lab.com/vit/tutorial_nanosam.html" target="_blank">NanoSAM</a>, <a href="https://jetbot.org/master/" target="_blank">JetBot</a>, <a href="https://github.com/NVIDIA-AI-IOT/jetracer" target="_blank">JetRacer</a>, <a href="https://github.com/NVIDIA-AI-IOT/torch2trt" target="_blank">torch2trt</a>, <a href="https://github.com/NVIDIA-AI-IOT/trt_pose" target="_blank">trt_pose</a>, <a href="https://github.com/NVIDIA-AI-IOT/jetson-intro-to-distillation" target="_blank">Knowledge Distillation</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.davesarmoury.com/" target="_blank"><img class="bio-image" src="research/images/Dave_Niewinski.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/dave-niewinski-b5691132/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.youtube.com/davesarmoury" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			<a href="https://github.com/dniewinski" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Dave Niewinski<br/>
			<small>
				<a href="https://www.davesarmoury.com/" target="_blank">Dave's Armoury</a> | Waterloo, Ontario<br/>
				(<a href="https://youtu.be/yNcKTZsHyfA" target="_blank">GLaDOS</a>, <a href="https://youtu.be/yNozb8ljpgI" target="_blank">Fetch</a>, <a href="https://youtu.be/h0uvkaR6fvo" target="_blank">Offroad La-Z-Boy</a>, <a href="https://www.youtube.com/watch?v=agUdUvgV-A8" target="_blank">KUKA Bot</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://rebotnix.com/" target="_blank"><img class="bio-image" src="research/images/Gary_Hilgemann.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/gary-hilgemann-84423a6b/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.youtube.com/channel/UCJv_UknY5ueEjbko2M2Iv4Q" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			<a href="https://github.com/rebotnix" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Gary Hilgemann, <a href="https://rebotnix.com/" target="_blank">REBOTNIX</a><br/>
			<small>
				CEO & AI Roboticist | Lünen, Germany<br/>
				(<a href="https://rebotnix.com/gustav/" target="_blank">GUSTAV</a>, <a href="https://rebotnix.com/spike/" target="_blank">SPIKE</a>, <a href="https://rebotnix.com/visiontools/" target="_blank">VisionTools</a>, <a href="https://rebotnix.com/genai/" target="_blank">GenAI</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.seeedstudio.com/tag/nvidia.html" target="_blank"><img class="bio-image" src="research/images/Elaine_Wu.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/elaine1994/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.youtube.com/channel/UCJv_UknY5ueEjbko2M2Iv4Q" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			<a href="https://github.com/Seeed-Projects" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Elaine Wu, <a href="https://www.seeedstudio.com/tag/nvidia.html" target="_blank">Seeed Studio</a><br/>
			<small>
				AI & Robotics Partnerships | Shenzhen, China<br/>
				(<a href="https://www.seeedstudio.com/Nvidia-Jetson-c-2016.html" target="_blank">reComputer</a>, <a href="https://wiki.seeedstudio.com/YOLOv8-TRT-Jetson/" target="_blank">YOLOv8</a>, <a href="https://github.com/Seeed-Projects/LocalJARVIS" target="_blank">LocalJARVIS</a>, <a href="https://wiki.seeedstudio.com/Local_Voice_Chatbot/" target="_blank">Voice Bot</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/pattydelafuente/" target="_blank"><img class="bio-image" src="research/images/Patty_Delafuente.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/pattydelafuente/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			Patty Delafuente, NVIDIA<br/>
			<small>
				Data Scientist & UMBC PhD Student | MD<br/>
				(AI in Education, <a href="https://www.nvidia.com/en-us/training/teaching-kits/" target="_blank">DLI Robotics Teaching Kit</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://hanlab.mit.edu/songhan" target="_blank"><img class="bio-image" src="research/images/Song_Han.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/songhanmit/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/mit-han-lab" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Song Han, <a href="https://hanlab.mit.edu/" target="_blank"">MIT HAN Lab</a><br/>
			<small>
				<a href="https://research.nvidia.com/person/song-han" target="_blank">NVIDIA Research</a> | Cambridge, MA<br/>
				(<a href="https://github.com/Efficient-Large-Model" target="_blank">Efficient Large Models</a>, <a href="https://github.com/mit-han-lab/llm-awq" target="_blank">AWQ</a>, <a href="https://github.com/Efficient-Large-Model/VILA" target="_blank">VILA</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/bhughes/" target="_blank"><img class="bio-image" src="research/images/Bryan_Hughes.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/bhughes/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/bryanhughes" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Bryan Hughes, Mimzy AI<br/>
			<small>
				Founder, Entrepreneur | SF Bay Area<br/>
				(Multimodal Assistants, AI at the Edge)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://tqchen.com/" target="_blank"><img class="bio-image" src="research/images/Tianqi_Chen.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/tianqi-chen-679a9856/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/mlc-ai/mlc-llm" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Tianqi Chen, <a href="https://catalyst.cs.cmu.edu/" target="_blank"">CMU Catalyst</a><br/>
			<small>
				<a href="https://octo.ai/" target="_blank">OctoML</a>, CTO | Seattle, WA<br/>
				(<a href="https://llm.mlc.ai/" target="_blank">MLC</a>, <a href="https://tvm.apache.org/" target="_blank">Apache TVM</a>, <a href="https://xgboost.ai/" target="_blank">XGBoost</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/michael-gr%C3%BCner-9249562a/" target="_blank"><img class="bio-image" src="research/images/Michael_Gruner.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/michael-gr%C3%BCner-9249562a/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/michaelgruner" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Michael Grüner, <a href="https://www.ridgerun.com/" target="_blank"">RidgeRun</a><br/>
			<small>
				Team Lead / Architect | Costa Rica<br/>
				(Embedded Vision & AI, Multimedia)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/jesse-flot-51b50bb9/" target="_blank"><img class="bio-image" src="research/images/Jesse_Flot.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/jesse-flot-51b50bb9/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			Jesse Flot, <a href="https://www.cmu.edu/roboticsacademy/" target="_blank"">CMU Robotics Academy</a><br/>
			<small>
				Co-Director | Pittsburgh, PA<br/>
				(<a href="https://www.cmu.edu/roboticsacademy/roboticscurriculum/nvidia_curriculum/applied_ai.html" target="_blank">Applied AI & Robotics</a>, <a href="https://www.cmu.edu/roboticsacademy/roboticscurriculum/nvidia_curriculum/autonomy_foundations.html" target="_blank">Autonomy Foundations</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/pjdecarlo/" target="_blank"><img class="bio-image" src="research/images/Paul_DeCarlo.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/pjdecarlo/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.hackster.io/pjdecarlo" target="_blank"><img class="bio-logo" src="research/images/hackster.png"></img></a>
			<a href="https://github.com/toolboc" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Paul DeCarlo, <a href="https://azure.microsoft.com/en-us/solutions/iot">Microsoft</a><br/>
			<small>
				Professor | University of Houston<br/>
				(<a href="https://www.hackster.io/pjdecarlo/nvidia-deepstream-integration-with-azure-iot-central-d9f834">Azure IoT</a>, <a href="https://github.com/toolboc/Intelligent-Video-Analytics-with-NVIDIA-Jetson-and-Microsoft-Azure" target="_blank">Video Analytics</a>, <a href="https://www.hackster.io/pjdecarlo/llm-based-multimodal-ai-w-azure-open-ai-nvidia-jetson-135ff2" target="_blank">Microsoft JARVIS</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/michael-hansen-9885b2105/" target="_blank"><img class="bio-image" src="research/images/Mike_Hansen.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/michael-hansen-9885b2105/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/synesthesiam" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Mike Hansen, <a href="https://www.nabucasa.com/" target="_blank"">Nabu Casa</a><br/>
			<small>
				Voice Engineering Lead | Urbandale, Iowa<br/>
				(<a href="https://www.home-assistant.io" target="_blank">Home Assistant</a>, <a href="https://github.com/rhasspy/piper" target="_blank">Piper TTS</a>, <a href="https://github.com/rhasspy/wyoming" target="_blank">Wyoming</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/lakshanthad/" target="_blank"><img class="bio-image" src="research/images/Lakshantha_Dissanayake.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/lakshanthad/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/lakshanthad" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			<small>Lakshantha Dissanayake, <a href="https://www.ultralytics.com/" target="_blank">Ultralytics</a></small><br/>
			<small>
				Embedded CV Engineer | Vancouver, BC<br/>
				(<a href="https://github.com/ultralytics/ultralytics" target="_blank">YOLOv8</a>, <a href="https://docs.ultralytics.com/integrations/tensorrt/" target="_blank">TensorRT</a>, <a href="https://docs.ultralytics.com/yolov5/tutorials/running_on_jetson_nano/" target="_blank">DeepStream</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/kerryshih" target="_blank"><img class="bio-image" src="research/images/Kerry_Shih.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/kerryshih" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.youtube.com/channel/UCpxVxnt4KO2AzuV_XOE-97Q" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			Kerry Shih, <a href="https://GenAINerds.com/" target="_blank">GenAI Nerds</a><br/>
			<small>
				Founder, CEO | Los Angeles, CA<br/>
				(<a href="https://GenAINerds.com/#/Gapi" target="_blank">Gapi</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.ece.cmu.edu/directory/bios/Ziad%20Youssfi.html" target="_blank"><img class="bio-image" src="research/images/Ziad_Youssfi.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/ziadyoussfi/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			Ziad Youssfi, <a href="https://www.ece.cmu.edu/directory/bios/Ziad%20Youssfi.html" target="_blank">CMU</a><br/>
			<small>
				ECE Professor | Pittsburgh, PA<br/>
				(ML in Robotics & Embedded Systems)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/walterlucetti/" target="_blank"><img class="bio-image" src="research/images/Walter_Lucetti.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/walterlucetti/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/Myzhar" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Walter Lucetti, <a href="https://www.stereolabs.com" target="_blank">Stereolabs</a><br/>
			<small>
				Robotics & Vision Engineer | Paris, France<br/>
				(<a href="https://www.myzhar.com" target="_blank">MyzharBot</a>, <a href="https://github.com/stereolabs/zed-ros2-wrapper" target="_blank">ROS2</a>, <a href="https://github.com/stereolabs/zed-gstreamer" target="_blank">GStreamer</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://rnext.it/" target="_blank"><img class="bio-image" src="research/images/Raffaello_Bonghi.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/raffaello-bonghi/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/rbonghi" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			<a href="https://www.youtube.com/@rbonghi" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			Raffaello Bonghi, NVIDIA<br/>
			<small>
				AI & Robotics Engineer | Manchester, UK<br/>
				(<a href="https://nanosaur.ai/" target="_blank">Nanosaur</a>, <a href="https://rpanther.github.io/" target="_blank">Panther</a>, <a href="https://rnext.it/jetson_stats/" target="_blank">jetson-stats</a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/alvaro01/" target="_blank"><img class="bio-image" src="research/images/Alvaro_Costa.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/alvaro01/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			Alvaro Costa, <a href="https://www.ans.co.uk/" target="_blank">ANS Group</a><br/>
			<small>
				AI & Robotics Lead | Epsom, UK<br/>
				(<a href="https://www.tekntrash.com/" target="_blank">TeknTrash</a>, <a href="https://www.youtube.com/watch?v=-L6kDVr5tfU&t=137s" target="_blank">StipraPOD</a>)
			</small>
		</div>
	</div>
    <div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/dvdprsn/" target="_blank"><img class="bio-image" src="research/images/David_Pearson.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/dvdprsn/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			David Pearson, <a href="https://connecttech.com/jetson/" target="_blank">ConnectTech</a><br/>
			<small>
				Embedded Systems Engineer | Ontario, CA<br/>
				(Edge AI Systems, Vision/Language Models)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/jason-seawall-65313a11/" target="_blank"><img class="bio-image" src="research/images/Jason_Seawall.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/jason-seawall-65313a11/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.youtube.com/@Numurus-NEPI" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			<a href="https://github.com/nepi-engine" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Jason Seawall, <a href="https://numurus.com/" target="_blank">Numurus</a><br/>
			<small>
				CEO | Seattle, WA<br/>
				(<a href="https://nepi.com/" target="_blank">NEPI</a>, Edge AI & Automation)
			</small>
		</div>
	</div>
    <div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/martincerven/" target="_blank"><img class="bio-image" src="research/images/Martin_Cerven.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/martincerven/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.youtube.com/c/martincerven/featured" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			<a href="https://github.com/martincerven" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Martin Cerven<br/>
			<small>
				AI Researcher | Germany<br/>
				(Autonomous Robotics, Voicecraft)
			</small>
		</div>
	</div>
    <div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/rams16592/" target="_blank"><img class="bio-image" src="research/images/Romil_Shah.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/rams16592/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/aws-samples/genai-at-edge" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Romil Shah, Amazon<br/>
			<small>
				GenAI IIoT @ AWS | San Jose, CA<br/>
				(<a href="https://github.com/aws-samples/genai-at-edge" target="_blank"><code>aws-samples/genai-at-edge</code></a>)
			</small>
		</div>
	</div>
	<div class="bio-container col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/kabilan-kb/" target="_blank"><img class="bio-image" src="research/images/Kabilan_Kb.jpg"></img></a><br/>
			<a href="https://www.linkedin.com/in/kabilan-kb/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.youtube.com/@kabilankb2003" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			<a href="https://github.com/kabilan2003" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Kabilan Kb, Roboticist<br/>
			<small>
				NVIDIA DLI Ambassador | Tamil Nadu, IN<br/>
				(<a href="https://medium.com/@kabilankb2003" target="_blank">ROS2 Tutorials</a>, <a href="https://blogs.nvidia.com/blog/kabilan-kb-autonomous-wheelchair/" target="_blank">Autonomous Wheelchair</a>)
			</small>
		</div>
	</div>
</div>
