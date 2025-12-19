---
title: "GPT-OSS-20B Interactive Storyteller"
description: "An interactive storytelling system for children using Jetson AGX Orin with LLM, image generation, TTS, and voice control for creating dynamic stories with visuals and sound."
author: "Timothy Lovett"
date: "2025-09-23"
source: "Hackster"
link: "https://www.hackster.io/timo614/gpt-oss-20b-storyteller-c91042"
image: "https://hackster.imgix.net/uploads/attachments/1889223/_IGMA29ZuBT.blob?auto=compress%2Cformat&w=900&h=675&fit=min"
featured: true
tags: ["llm", "storytelling", "comfyui", "sdxl", "tts", "asr", "whisper", "ollama", "agx-orin"]
---

Timothy Lovett created an interactive storytelling system for children that combines multiple AI models on Jetson AGX Orin to generate dynamic stories with accompanying visuals, voice narration, and adaptive sound effects.

The system uses voice input from children to shape story direction, generates illustrations on-the-fly with ComfyUI and SDXL, narrates with Piper TTS, and controls mood-based background music through a Seeed MIDI Synthesizer. All processing runs locally on the edge without cloud connectivity.

### Features

- GPT-OSS-20B LLM via Ollama for story generation
- ComfyUI + SDXL with HyperSD LoRA for real-time image generation
- Faster Whisper for voice-to-text transcription
- Piper TTS for natural voice narration
- Seeed MIDI Synthesizer for interactive control and mood-based audio
- Projector display for immersive storytelling experience
- Fully local processing on Jetson AGX Orin

### Resources

- [Hackster Project](https://www.hackster.io/timo614/gpt-oss-20b-storyteller-c91042)
- [GitHub Repository](https://github.com/Timo614/gpt-oss-storyteller)


