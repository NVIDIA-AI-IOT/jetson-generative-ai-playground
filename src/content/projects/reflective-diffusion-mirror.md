---
title: "Reflective Diffusion: AI Magic Mirror"
description: "An interactive magic mirror using Jetson AGX Orin with SDXL diffusion to render artistic images from voice prompts and camera captures."
author: "Timothy Lovett & Kerin Lovett"
date: "2025-08-15"
source: "Hackster"
image: "https://hackster.imgix.net/uploads/attachments/1875147/_37gyfNJtG3.blob?auto=compress%2Cformat&w=900&h=675&fit=min"
link: "https://www.hackster.io/irelas/reflective-diffusion-0824ae"
featured: true
tags: ["sdxl", "diffusion", "comfyui", "whisper", "image-generation", "mirror", "esp32", "agx-orin"]
---

Timothy and Kerin Lovett created an interactive magic mirror that combines a wall-mounted display with real-time SDXL image generation. The system captures photos and voice prompts via ESP32S3, processes them through ComfyUI on Jetson AGX Orin, and renders artistic transformations on a mirror-enclosed screen.

The magic mirror uses mirror acrylic that appears as a normal mirror when off but displays generated images when active. Voice prompts are transcribed with Whisper, combined with camera captures, and processed through SDXL with ControlNet++ and Depth Anything V2 for coherent artistic renderings.

### Features

- Real-time SDXL image generation with ComfyUI
- Voice-activated prompting using Whisper for transcription
- ESP32S3 Sense for wireless camera and audio capture
- ControlNet++ with Depth Anything V2 for depth-aware generation
- HyperSD LoRA for fast 2-step diffusion
- Mirror acrylic display in shadow box frame
- WebSocket-based image streaming
- Fully local processing on Jetson AGX Orin

### Resources

- [Hackster Project](https://www.hackster.io/irelas/reflective-diffusion-0824ae)
- [GitHub Repository](https://github.com/Timo614/reflective-diffusion)


