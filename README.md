# Jetson Mkdocs Template

Document generation status: [![pipeline status](https://gitlab-master.nvidia.com/jetson/jetson-mkdocs-template/badges/main/pipeline.svg)](https://gitlab-master.nvidia.com/cyato/jetson-camera-guide/-/commits/main)

# About this repo



The auto generated documentation is hosted on the following, using their CI/CD feature to automatically generate/update the HTML documentation site upon new commit:
  - (Internal) [GitLab Pages site](https://jetson.gitlab-master-pages.nvidia.com/jetson-mkdocs-template/)
  - (**Not published yet**) GitHub Pages site

## How to use this template

### 1. Copy

Copy this template repo to your own GitLab group/namespace.

Let's say this is your repo's new URL.

`https://gitlab-master.nvidia.com/${group}/${project_slug}`

### 2. Replace

Once copied, perform repo-wide text replacement.

|    | TEMPLATE | Yours |
| -- | -- | -- |
| Repo URL | `jetson/jetson-mkdocs-template/` | `${group}/${project_slug}` |
| Page URL | `jetson.gitlab-master-pages.nvidia.com/jetson-mkdocs-template/` | `${group}.gitlab-master-pages.nvidia.com/{project_slug}/` |

```bash
$ group=MY_GROUP
$ project_slug=MY_PROJECT_SLUG
$ # sed base comment to actually perform the replacements
```

### 3. Trim

Delete this ([How to use this template](#how-to-use-this-template)) section.

## How to use this repo

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


## How this repo was initially set up

### On GitLab

#### 1. Check necessary files for mkdocs

- [`mkdocs.yml`](mkdocs.yml) : Check `nav:` section and make sure you have all markdown files under `docs` directory
- [`docs/index.md`](docs/index.md) 

#### 2. Enable shared runners

Go to `Settings` > [`CI/CD`](https://gitlab-master.nvidia.com/jetson/jetson-mkdocs-template/-/settings/ci_cd), on `Runners` click "`Expand`".

Under "`Shared runners`", toggle "`Enable shared runners for this project`" on.

#### 3. Create a `.gitlab-ci.yml` file and commit

```
image: python:latest
pages:
  stage: deploy
  only:
    - master 
    - main
  script:
    - pip install mkdocs-material
    - mkdocs build --site-dir public
  artifacts:
    paths:
      - public
  tags:
    - pages
```

#### 4. Check the build process

Go to `CI/CD` > [`Pipeline`](https://gitlab-master.nvidia.com/jetson/jetson-mkdocs-template/-/pipelines), and wait until the most recent pipeline status turns to `"passed"`.

#### 5. Go to rendered site

Go to https://jetson.gitlab-master-pages.nvidia.com/jetson-mkdocs-template/


