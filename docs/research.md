---
title: Jetson AI Lab Research Group
hide:
  - navigation
---

# Jetson AI Lab Research Group

The Jetson AI Lab Research Group is a global collective for advancing open-source Edge ML, open to anyone to join and collaborate with others from the community and leverage each other's work.  Our goal is using advanced AI for good in real-world applications in accessible and responsible ways.  By coordinating together as a group, we can keep up with the rapidly evolving pace of AI and more quickly arrive at deploying intelligent multimodal agents and autonomous robots into the field.

There are virtual [meetings](#meeting-schedule) that anyone is welcome to join, offline discussion on the [Jetson Projects](https://forums.developer.nvidia.com/c/agx-autonomous-machines/jetson-embedded-systems/jetson-projects/78){:target="_blank"} forum, and guidelines for upstreaming open-source [contributions](#contribution-guidelines). 

!!! abstract "Next Meeting"

    The first team meeting is on Wednesday, April 3rd at 9am PST - see the [calendar invite](#meeting-schedule) below or click [here](https://teams.microsoft.com/l/meetup-join/19%3ameeting_YzczZmJmZmItYzRiNi00ZWU0LWFmY2MtNTc0ZmM5NzA5NDVm%40thread.v2/0?context=%7b%22Tid%22%3a%2243083d15-7273-40c1-b7db-39efd9ccc17a%22%2c%22Oid%22%3a%221f165bb6-326c-4610-b292-af9159272b08%22%7d){:target="_blank"}  to attend! 

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

When experiments are successful, ideally the results will be packaged in such a way that they are easily reusable for others to integrate into their own projects:

* Open-source libraries & code on GitHub
* Models on [HuggingFace Hub](https://huggingface.co/models){:target="_blank"}
* Containers provided by [jetson-containers](https://github.com/dusty-nv/jetson-containers){:target="_blank"}
* Documentation / tutorials on Jetson AI Lab
* [Hackster.io](https://www.hackster.io/){:target="_blank"} for hardware-centric builds

Ongoing technical discussions can occur on the [Jetson Projects](https://forums.developer.nvidia.com/c/agx-autonomous-machines/jetson-embedded-systems/jetson-projects/78){:target="_blank"} forum (or GitHub Issues), with status updates given during the meetings.

## Meeting Schedule

We'll aim to meet monthly or bi-weekly as a team in virtual meetings that anyone is welcome to join and speak during.  We'll discuss the latest updates and experiments that we want to explore.  Please remain courteous to others during the calls.  We'll stick around after for anyone who has questions or didn't get the chance to be heard.

* Wednesday, April 3 at 9am PST (4/3/24)
	- Microsoft Teams - [Meeting Link](https://teams.microsoft.com/l/meetup-join/19%3ameeting_YzczZmJmZmItYzRiNi00ZWU0LWFmY2MtNTc0ZmM5NzA5NDVm%40thread.v2/0?context=%7b%22Tid%22%3a%2243083d15-7273-40c1-b7db-39efd9ccc17a%22%2c%22Oid%22%3a%221f165bb6-326c-4610-b292-af9159272b08%22%7d){:target="_blank"} 
	- Meeting ID: `223 573 467 074`  
	- Passcode: `6ybvCg` 
	- Outlook Invite:  [`Jetson AI Lab Research Group (4324).ics`](research/invites/Jetson AI Lab Research Group (4324).ics){:target="_blank"} 

The meetings will be recorded and posted so that anyone unable to attend live will be able to watch them after.

## Active Members

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
</style>

<div class="row justify-content-center">
	<div class="col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/dustin-franklin-b3aaa173/" target="_blank"><img class="bio-image" src="research/images/Dustin_Franklin.jpg"></img></a>
			<a href="https://www.linkedin.com/in/dustin-franklin-b3aaa173/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.youtube.com/@dusty-nv" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			<a href="https://www.github.com/dusty-nv" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Dustin Franklin, NVIDIA<br/>
			<small>
				Principal Engineer | Pittsburgh, PA<br/>
				(<a href="https://github.com/dusty-nv/jetson-inference" target="_blank">jetson-inference</a>, <a href="https://github.com/dusty-nv/jetson-containers" target="_blank">jetson-containers</a>)
			</small>
		</div>
	</div>
	<div class="col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.hackster.io/shahizat" target="_blank"><img class="bio-image" src="research/images/Shakhizat_Nurgaliyev.jpg"></img></a>
			<a href="https://www.linkedin.com/in/shakhizat-nurgaliyev/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.hackster.io/shahizat" target="_blank"><img class="bio-logo" src="research/images/hackster.png"></img></a>
			Nurgaliyev Shakhizat<br/>
			<small>
				Institute of Smart Systems and AI | Kazakhstan<br/>
				(<a href="https://www.hackster.io/shahizat/ai-powered-application-for-the-blind-and-visually-impaired-df3f9e" target="_blank">Assistive Devices</a>, <a href="https://www.hackster.io/shahizat/vision2audio-giving-the-blind-an-understanding-through-ai-33f929" target="_blank">Vision2Audio</a>, <a href="https://www.hackster.io/shahizat/running-a-chatgpt-like-llm-llama2-on-a-nvidia-jetson-cluster-cbc7d4" target="_blank">HPEC Clusters</a>)
			</small>
		</div>
	</div>
	<div class="col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.youtube.com/@kerseyfabs" target="_blank"><img class="bio-image"src="research/images/Kris_Kersey.jpg"></img></a>
			<a href="https://www.linkedin.com/in/kriskersey/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://www.youtube.com/@kerseyfabs" target="_blank"><img class="bio-logo" src="research/images/youtube.png"></img></a>
			Kris Kersey, <small>Kersey Fabrications</small><br/>
			<small>
				Embedded Software Engineer | Atlanta, GA<br/>
				(<a href="https://www.youtube.com/@oasis-project" target="_blank">The OASIS Project</a>, AR/VR, 3D Fabrication)
			</small>
		</div>
	</div>
	<div class="col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/johnnycano/" target="_blank"><img class="bio-image" src="research/images/Johnny_Cano.jpg"></img></a>
			<a href="https://www.linkedin.com/in/johnnycano/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/johnnynunez" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Johnny Núñez Cano<br/>
			<small>
				PhD Researcher in CV/AI | Barcelona, Spain<br/>
				(Recurrent LLMs, Pose & Behavior Analysis)
			</small>
		</div>
	</div>
	<div class="col-lg-4 col-sm-4">
		<div class="padding-graph bg-white shadow padding-feature-box-item text-center d-block match-height">
			<a href="https://www.linkedin.com/in/doruk-sonmez/" target="_blank"><img class="bio-image" src="research/images/Doruk_Sonmez.png"></img></a><br/>
			<a href="https://www.linkedin.com/in/doruk-sonmez/" target="_blank"><img class="bio-logo" src="research/images/linkedin.png"></img></a>
			<a href="https://github.com/doruksonmez" target="_blank"><img class="bio-logo" src="research/images/github.png"></img></a>
			Doruk Sönmez, <a href="https://openzeka.com/en/" target="_blank">Open Zeka</a><br/>
			<small>
				Intelligent Video Analytics Engineer | Turkey<br/>
				(NVIDIA DLI Certified Instructor, IVA, VLM)
			</small>
		</div>
	</div>
	<div class="col-lg-4 col-sm-4">
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
	<div class="col-lg-4 col-sm-4">
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
	<div class="col-lg-4 col-sm-4">
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
	<div class="col-lg-4 col-sm-4">
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
	<div class="col-lg-4 col-sm-4">
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
	<div class="col-lg-4 col-sm-4">
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
	<div class="col-lg-4 col-sm-4">
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
	<div class="col-lg-4 col-sm-4">
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
	<div class="col-lg-4 col-sm-4">
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
	<div class="col-lg-4 col-sm-4">
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
	<div class="col-lg-4 col-sm-4">
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
</div>

Anyone is welcome to join this group after contributing, and open a PR against the [site repo](https://github.com/NVIDIA-AI-IOT/jetson-generative-ai-playground){:target="_blank"} with their info 😊
