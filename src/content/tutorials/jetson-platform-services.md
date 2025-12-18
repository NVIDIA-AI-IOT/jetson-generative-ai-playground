---
title: "Jetson Platform Services"
description: "Build and deploy AI-powered edge applications using Jetson Platform Services (JPS). Learn to create modular microservices for video analytics, VLM alerts, and zero-shot detection."
category: "Multimodal"
section: "AI Microservices"
order: 2
tags: ["jps", "jetson", "microservices", "vlm", "deepstream", "video-analytics", "edge-ai", "nanoowl"]
---

Jetson Platform Services (JPS) provide a platform to simplify development, deployment and management of Edge AI applications on NVIDIA Jetson. JPS is a modular & extensible architecture for developers to distill large complex applications into smaller modular microservices with APIs to integrate into other apps & services.

At its core are a collection of AI services leveraging generative AI, deep learning, and analytics, which provide state of the art capabilities including:

- **Video analytics**
- **Video understanding and summarization**
- **Text based prompting**
- **Zero shot detection**
- **Spatio temporal analysis of object movement**

![VLM Workflow](https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/jps_vlm_workflow.gif)
*VLM Alert Workflow built with JPS*

---

## Prerequisites

**Supported Devices:**
- Jetson AGX Orin (64GB)
- Jetson AGX Orin (32GB)
- Jetson Orin NX (16GB)
- Jetson Orin Nano (8GB)

**JetPack Version:**
- JetPack 6 (L4T r36.x)

**Storage:** NVMe SSD **highly recommended** for storage speed and space

---

## Getting Started

To get started with Jetson Platform Services, follow the quickstart guide to install and setup JPS. Then explore the reference workflows to learn how to use DeepStream, Analytics, Generative AI and more with JPS:

### 1. Quick Start Guide

Get JPS installed and running on your Jetson:

[Quick Start Guide →](https://docs.nvidia.com/jetson/jps/setup/quick-start.html)

### 2. AI Powered Network Video Recorder

Set up an AI-powered NVR for intelligent video recording and analysis:

[AI NVR Setup →](https://docs.nvidia.com/jetson/jps/setup/ai-nvr.html)

### 3. Zero Shot Detection with NanoOWL

Detect objects without training using natural language descriptions:

[Zero Shot Detection →](https://docs.nvidia.com/jetson/jps/workflows/zero_shot_detection_workflow.html)

### 4. Visual Language Model Alerts

Create intelligent alert systems powered by VLMs:

[VLM Alerts →](https://docs.nvidia.com/jetson/jps/workflows/vlm_workflow.html)

---

## Reference Workflows

The reference workflows demonstrate how to use the microservices provided in JPS to build full end-to-end systems on your Jetson.

![JPS VLM Workflow Architecture](https://raw.githubusercontent.com/dusty-nv/jetson-containers/docs/docs/images/jps_vlm_workflow.png)
*VLM Alert Workflow Architecture*

---

## Resources

- [VLM Alert Blog](https://developer.nvidia.com/blog/develop-generative-ai-powered-visual-ai-agents-for-the-edge/) - Deep dive into building VLM-powered visual AI agents
- [JPS Product Page](https://developer.nvidia.com/embedded/jetpack/jetson-platform-services-get-started) - Official product information
- [JPS Documentation](https://docs.nvidia.com/jetson/jps/moj-overview.html) - Complete documentation

---

## Demo Video

Watch the VLM Alert Demo to see JPS in action:

<iframe width="100%" style="aspect-ratio: 16/9; max-width: 640px;" src="https://www.youtube.com/embed/0ZbDzaBfsrw" title="JPS VLM Alert Demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

---

## Next Steps

- [Live VLM Web UI](/tutorials/live-vlm-webui) - Run vision-language models on live camera feeds
- [GenAI Benchmarking](/tutorials/genai-benchmarking) - Benchmark LLMs and VLMs on your Jetson

