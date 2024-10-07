# Jetson Generative AI Lab

Document generation status: [![example workflow](https://github.com/NVIDIA-AI-IOT/jetson-generative-ai-playground/actions/workflows/ci.yml/badge.svg)](https://github.com/NVIDIA-AI-IOT/jetson-generative-ai-playground/actions)

# About this repo

This repo is to host a tutorial documentation site for running generative AI models on NVIDIA Jetson devices.

The auto generated documentation is hosted on the following, using their CI/CD feature to automatically generate/update the HTML documentation site upon new commit:
  - [GitHub Pages site](https://nvidia-ai-iot.github.io/jetson-generative-ai-playground)

## How to use this repo locally

### MkDocs: Initial setup

https://squidfunk.github.io/mkdocs-material/getting-started/

```bash
sudo apt install -y docker.io
sudo docker pull squidfunk/mkdocs-material
```

### Mkdocs: Start development server on http://localhost:8000

```bash
docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material
```

### Test the post-processing

```bash
docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material build
pip install beautifulsoup4
pip install lxml
python3 ./scripts/duplicate_site_with_postprocess.py ./site ./site_postprocessed
sudo apt install python3-livereload
livereload ./site_postprocessed
```

## Troubleshooting

> If you get "docker: Got permission denied while trying to connect to the Docker daemon socket at ..." error, 
> issue `sudo usermod -aG docker $USER; newgrp docker` to get around with the issue.

