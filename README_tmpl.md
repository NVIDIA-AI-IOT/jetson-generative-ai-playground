# Jetson Mkdocs Template

## How to use this template

### [1] Create your project from this template

1. On the top bar of GitLab web interface, select **Menu** > **Projects** > **Create new project**.
2. Select **Create from template**.
3. Select **Group**.
4. Under "**jetson/template**", find "**Jetson Mkdocs Template**". Select **Use template**.
5. Enter the project details
    - In the **Project name** field, enter the name of your project. You cannot use special characters at the start or end of a project name.
    - In the "Project URL" field, select "jetson/jetson-docs" as the group your new project resides ***for now***. You can later move to your own user namespace. 
    - In the **Project slug** field, enter the path to your project. The GitLab instance uses the slug as the URL path to the project. To change the slug, first enter the project name, then change the slug.
    - The description of your project’s dashboard in the **Project description (optional)** field.
    - To modify the project’s viewing and access rights for users, change the Visibility Level.
6. Select **Create project**.
7. Move the project to your namespace.
    - On the left menu of GitLab web interface, select **Settings** > **General**.
    - On **Advanced** click "**Expand**".
    - On **Transfer project** (2nd from the bottom), in **Select a new namespace**, pick your user namespace (or any desired group), and select **Transfer project**.

Let's say your new project URL is following.
> `https://gitlab-master.nvidia.com/${group}/${project_slug}`

### [2] Replace

Once copied, perform repo-wide text replacement.

|    | TEMPLATE | Yours |
| -- | -- | -- |
| Repo URL | `TEMPLATE_REPO_URL` | `https://gitlab-master.nvidia.com/${group}/${project_slug}` |
| Page URL | `TEMPLATE_PAGE_URL` | `${group}.gitlab-master-pages.nvidia.com/${project_slug}/` |
| Repo name | `TEMPLATE_REPO_NAME` | `${repo_name}/` |
| Site name | `TEMPLATE_PAGE_NAME` | `${page_name}/` |

Set environment variables.
```bash
$ group=MY_GROUP
$ project_slug=MY_PROJECT_SLUG
$ repo_name=MY_REPO_NAME
$ page_name=MY_SITE_NAME
```

First clone the repo to your local machine.
```bash
git clone https://gitlab-master.nvidia.com/${group}/${project_slug}
cd ${project_slug}
```

Then, copy the following and execute.
```bash
find . -type f ! -name "README.md" ! -path "./.git/*" -exec grep -Iq . {} \; -and -exec sed -i "s|TEMPLATE_REPO_URL|https://gitlab-master.nvidia.com/${group}/${project_slug}|g" {} \;
find . -type f ! -name "README.md" ! -path "./.git/*" -exec grep -Iq . {} \; -and -exec sed -i "s|TEMPLATE_PAGE_URL|${group}.gitlab-master-pages.nvidia.com/${project_slug}|g" {} \;
find . -type f ! -name "README.md" ! -path "./.git/*" -exec grep -Iq . {} \; -and -exec sed -i "s|TEMPLATE_REPO_NAME|${repo_name}|g" {} \;
find . -type f ! -name "README.md" ! -path "./.git/*" -exec grep -Iq . {} \; -and -exec sed -i "s|TEMPLATE_PAGE_NAME|${page_name}|g" {} \;
```

### [3] Enable GitLab Pages

1. Go to **Settings** > **CI/CD**, on **Runners** click "**Expand**".<br>Under "**Shared runners**", toggle "**Enable shared runners for this project**" on.
2. Make a small edit and commit.
    - Replace README
      ```
      mv README.md README_tmpl.md
      mv README_real.md README.md
      git add .
      git commit -m "Replace template README"
      git push
      ```
3. Go to **CI/CD** > **Pipeline**, and wait until the most recent pipeline status turns to **"passed"**.
4. Go to **Settings** > **Pages** to find the URL for your documentation site.

### [4] Remove template README.md

```
rm README.md
mv README_real.md README.md
git add .
git commit -m "Replace with the real README.md"
```

## How to also publish on GitHub

(to be documented)

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


## How this repo was initially set up

### On GitLab

#### 1. Prepare necessary files for mkdocs

- [`mkdocs.yml`](mkdocs.yml) : Check `nav:` section and make sure you have all markdown files under `docs` directory
- [`docs/index.md`](docs/index.md) 

#### 2. Enable shared runners

Go to **Settings** > **CI/CD**, on **Runners** click "**Expand**".

Under "**Shared runners**", toggle "**Enable shared runners for this project**" on.

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

Go to **CI/CD** > **Pipeline**, and wait until the most recent pipeline status turns to **"passed"**.


