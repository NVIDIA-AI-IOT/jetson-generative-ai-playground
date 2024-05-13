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

**Tip**: If you see the following output:   
> "docker: Got permission denied while trying to connect to the Docker daemon socket at ..." 

You can execute the following (preferred) and then logout and login for it to take effect:
```
sudo groupadd docker
sudo usermod -aG docker ${USER}
newgrp docker # If you don't want to logout and login
```
OR the following (as a temporary workaround)
```
sudo chmod 666 /var/run/docker.sock 
```

## How to also publish on GitHub

(to be documented)
