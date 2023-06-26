# Jetson Generative AI Playground

Document generation status: [![pipeline status](https://gitlab-master.nvidia.com/Jetson-TME/jetson-generative-ai-playground/badges/main/pipeline.svg)](https://gitlab-master.nvidia.com/Jetson-TME/jetson-generative-ai-playground/-/commits/main)

# About this repo

This repo is to host {}.

The auto generated documentation is hosted on the following, using their CI/CD feature to automatically generate/update the HTML documentation site upon new commit:
  - (Internal) [GitLab Pages site](Jetson-TME.gitlab-master-pages.nvidia.com/jetson-generative-ai-playground)
  - (**Not yet published**) GitHub Pages site

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

> If you get "docker: Got permission denied while trying to connect to the Docker daemon socket at ..." error, 
> issue `sudo chmod 666 /var/run/docker.sock` to get around with the issue.

## How to also publish on GitHub

(to be documented)