# On-Device Generative AI on Jetson Thor
*Quality-first optimization with vLLM, FP8/FP4 quantization & speculative decoding*

> Welcome! In this hands-on, you’ll unlock truly high-performance, **on-device** generative AI using the new **NVIDIA Jetson Thor**. You’ll start with a clean quality baseline, then step through practical optimizations—**FP8**, **FP4**, and **speculative decoding**—measuring speed vs. quality at each stage.

## What you’ll build

- A local **vLLM** service running on Jetson Thor
- A simple **OpenAI-compatible** chat endpoint
- An **Open WebUI** front-end bound to your local vLLM server
- A repeatable procedure to compare FP16 → FP8 → FP4 → FP4+SpecDec

!!! tip "Who is this for?"
    Teams building edge apps (robots, kiosks, appliances) who need **fast, private, API-compatible** LLMs without cloud dependency.

---

## Prerequisites

- **Hardware**: Jetson **Thor** devkit (128 GB unified memory recommended)
- **Software**: JetPack 6.x+ (Thor image), Docker (rootless or root OK)
- **Network**: Internet access to pull containers/models (or a pre-warmed registry/cache)
- **CLI**: `docker`, `wget`, `curl`, `python3` (optional for quick tests)

??? info "Why Thor?"
    Thor’s memory capacity enables **large models** and **large context windows**, allows **serving multiple models concurrently**, and supports **high-concurrency batching** on-device.

---

## Quick Start (Demo: large open-weight model)

> This section shows the “it works!” moment—serving a large open-weight model locally and wiring Open WebUI. Replace the model with what your lab standardizes on.

### 1) (Optional) Install tokenizer encodings (for some backends/tools)

```bash
sudo mkdir -p /etc/encodings
sudo wget https://openaipublic.blob.core.windows.net/encodings/cl100k_base.tiktoken -O /etc/encodings/cl100k_base.tiktoken
sudo wget https://openaipublic.blob.core.windows.net/encodings/o200k_base.tiktoken -O /etc/encodings/o200k_base.tiktoken
export TIKTOKEN_ENCODINGS_BASE=/etc/encodings
```

### 2) Start vLLM (example large model)

```bash
vllm serve openai/gpt-oss-120b
```

> Replace with your chosen open-weight checkpoint if your org/lab uses a different model namespace.

### 3) Launch Open WebUI bound to vLLM

```bash
docker run -d --network=host   -v open-webui:/app/backend/data   -e OPENAI_API_BASE_URL=http://0.0.0.0:8000/v1   --name open-webui --restart always   ghcr.io/open-webui/open-webui:main
```

Open your browser to Open WebUI (default `http://<thor-ip>:8080/` if unchanged). Select your served model in the UI and chat.

!!! success "Key takeaway"
    You have a **large model** running **entirely on the edge**. This unlocks bigger models, larger contexts, multiple concurrent models, and high-concurrency inference—all **without cloud latency or data egress**.

---

## Two Ways to Build an LLM App

1. **Quality-First (recommended)**
   Start with a model that **meets task quality**, then optimize stepwise, **re-checking quality** each time.

2. **Capacity-First**
   Fit the **largest** model possible (e.g., 4-bit), then hope it covers tasks. Fast to demo, but harder to guarantee task quality.

This tutorial implements the **Quality-First** path and shows where FP4 + speculative decoding can shine without further quality loss.

---

## Part 1 — Establish a Quality Baseline (FP16)

We’ll use **Llama-3.1-8B-Instruct (FP16)** as our baseline.

### 1.1 Serve baseline model with vLLM

```bash
vllm serve meta-llama/Llama-3.1-8B-Instruct
```

Once loaded, select the model in Open WebUI.

### 1.2 Baseline prompt & measurements

**Prompt (copy/paste):**

> *Write a 5-sentence paragraph explaining the main benefit of using Jetson Thor for an autonomous robotics developer.*

**Observe:**

- **Time-to-First-Token (TTFT)** — perceived latency
- **Tokens/sec** — throughput (use Open WebUI stats or API logs)
- **Answer quality** — coherence, accuracy, task fit

??? example "API test without UI"
    ```bash
    curl http://localhost:8000/v1/chat/completions       -H "Content-Type: application/json"       -d '{
            "model": "meta-llama/Llama-3.1-8B-Instruct",
            "messages": [{"role":"user","content":"Write a 5-sentence paragraph explaining the main benefit of using Jetson Thor for an autonomous robotics developer."}],
            "max_tokens": 256,
            "temperature": 0.7
          }'
    ```

---

## Part 2 — “Safe First Step”: Quantize to FP8

FP8 reduces memory bandwidth/footprint and **often matches FP16 quality** for many tasks.

### 2.1 Relaunch in FP8

```bash
vllm serve nvidia/Llama-3.1-8B-Instruct-FP8
```

Select this FP8 variant in Open WebUI and repeat the same prompt.
Compare **TTFT**, **tokens/sec**, and **answer quality** vs. FP16.

---

## Part 3 — Push Further: FP4

FP4 halves memory again vs. FP8 and is **much faster**, but may introduce noticeable quality drift (hallucinations, repetition).

### 3.1 Relaunch in FP4

```bash
vllm serve nvidia/Llama-3.1-8B-Instruct-FP4
```

Run the **same prompt** and evaluate:

- **Speed**: should be visibly faster than FP16/FP8
- **Quality**: check fidelity to the prompt and coherence

!!! warning "Quality guardrail"
    If you see unacceptable degradation, consider **prompting tweaks**, **temperature/top-p** adjustments, or **domain-specific RAG** to anchor outputs.

---

## Part 4 — FP4 + Speculative Decoding (EAGLE3)

Speculative decoding pairs a small **draft model** with your main model. The main model **verifies** multiple drafted tokens in one step—**same final output**, higher throughput.

### 4.1 Relaunch FP4 with speculative decoding

```bash
vllm serve nvidia/Llama-3.1-8B-Instruct-FP4   --trust_remote_code   --speculative-config '{
    "method":"eagle3",
    "model":"yuhuili/EAGLE3-LLaMA3.1-Instruct-8B",
    "num_speculative_tokens":5
  }'
```

Select the FP4 model again in Open WebUI and re-run the **same prompt**.

**Expect:**
- **Throughput**: highest so far
- **Quality**: **identical** to plain FP4 (speculative decoding does not alter the final output)

!!! info "Where this truly shines"
    On **70B-class** models, FP4 + speculative decoding can feel close to smaller models for interactivity, while preserving large-model competence.

---

## Appendix — Operational Notes

### Open WebUI ↔ vLLM bindings

- Default vLLM OpenAI API endpoint: `http://0.0.0.0:8000/v1`
- Ensure WebUI container uses `--network=host` (or map ports accordingly).
- If running behind reverse proxies, pass through **HTTP/1.1 keep-alive** and **WebSocket** if enabled.

### Measuring performance programmatically

- Parse tokens/sec from vLLM logs or use `/v1/completions` with `stream:false` and time deltas.
- Run **3–5 trials** and report **median** for stable comparisons.
- Keep **prompt & sampling params identical** across runs.

### Concurrency & batching

- vLLM’s **PagedAttention** enables high request concurrency.
- Tune **`--max-num-seqs`, `--gpu-memory-utilization`** as your workload grows.
- Use a **fixed set of prompts** to test under load.

---

## Troubleshooting

??? question "Model doesn’t appear in Open WebUI"
    - Confirm WebUI uses `OPENAI_API_BASE_URL=http://<thor-ip>:8000/v1`
    - Verify `docker logs open-webui` shows successful backend registration
    - Check that vLLM is listening on `0.0.0.0:8000`

??? warning "OOM or slow loads"
    - Reduce **context window** or switch to **FP8/FP4**
    - Ensure **swap** is configured appropriately on Thor for your image
    - Close unused sessions/models

??? failure "Tokenizers/encodings error"
    - Re-export `TIKTOKEN_ENCODINGS_BASE`
    - Confirm files exist under `/etc/encodings/*.tiktoken`

---

## What to do next

- Try a **70B** FP4 model with speculative decoding and compare UX to 8B
- Add **RAG** (local vector DB) and measure quality gains vs. baseline
- Evaluate **guardrails** (structured outputs, JSON schemas, tool use)
- Add observability: **latency histograms**, **p95 TTFT**, **tokens/sec**

[Back to Tutorials](../index.md){ .md-button } [Open WebUI how-to](../vit/tutorial_openwebui.md){ .md-button }

---

### TODOs for the lab page (you mentioned you’ll add these)

- [ ] Screenshots/GIFs of Open WebUI model switching
- [ ] A small “Perf panel” screenshot with TTFT/tokens/sec per stage
- [ ] A table summarizing FP16 vs FP8 vs FP4 vs FP4+SpecDec

