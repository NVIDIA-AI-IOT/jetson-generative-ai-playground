# Jetson AI Lab 2.0 - Staging Repository

This is the **staging repository** for Jetson AI Lab 2.0, a complete redesign and rebump of the [jetson-generative-ai-playground](https://github.com/NVIDIA-AI-IOT/jetson-generative-ai-playground) using modern web technologies.

> **⚠️ Staging Repository**: This repository is for staging, testing, and validating the new Jetson AI Lab 2.0 before merging into the main repository.

## Migration Status

This repository contains the content from **PR #318** (jetson-ai-lab-2.0 branch) from the original repository. We are using this staging environment to:

- ✅ Verify the complete Astro-based redesign
- 🔄 Complete and test CI/CD configuration
- 🔄 Test GitHub Pages deployment (private)
- 🔄 Validate all content and features
- ⏳ Prepare for final merge to main repository

## About

Jetson AI Lab 2.0 is the refreshed NVIDIA experience for experimenting with Jetson-optimized generative AI models entirely on-device. The site pairs a polished Astro frontend with a content-driven workflow so new tutorials, models, and posts can be published without touching layout code.

### Key Features

- Optimized showcase for flagship models such as Llama 4, Gemma 3, SDXL, Whisper, and VoiceCraft
- Curated tutorials, benchmarks, and blog posts with consistent styling and navigation
- Local-first architecture: everything runs on Jetson hardware with no cloud dependency
- Content authored in Markdown/JSON for fast iteration and git-friendly reviews
- Public site by default; no password gate or authentication

### Technology Stack

- **Astro 5** - Static-first frontend framework
- **Tailwind CSS** - Design system and styling
- **MDX & Markdown** - Rich content with interactive elements
- **TypeScript** - Type safety across data collections
- **Chart.js** - Interactive benchmark visualizations

## How the Project Is Organized

```
/
├── src/
│   ├── components/           Shared UI elements (e.g., AuthGuard)
│   ├── content/              Markdown and JSON content repositories
│   │   ├── home.json         Homepage metrics and featured models
│   │   ├── models/           Model deep dives authored in Markdown
│   │   ├── posts/            Blog articles
│   │   └── tutorials/        Long-form tutorials with frontmatter
│   ├── layouts/              Base layouts for pages and tutorials
│   └── pages/                Astro routes for the site
├── public/                   Static assets and robots configuration
├── astro.config.mjs          Astro configuration
├── tailwind.config.mjs       Tailwind theme definitions
└── TUTORIAL_TEMPLATE.md      Authoring guide for new tutorials
```

### Authoring Workflow

1. **Models**: Add a Markdown file under `src/content/models/` with frontmatter and sections for overview, benchmarks, and usage. Link the model from `src/pages/models/index.astro` if it should appear in the directory or homepage highlights.
2. **Tutorials**: Follow the `TUTORIAL_TEMPLATE.md` instructions. Each tutorial is a Markdown file in `src/content/tutorials/` plus a three-line Astro wrapper under `src/pages/tutorials/`.
3. **Posts**: Create Markdown files in `src/content/posts/` with publication metadata; the blog listing pulls entries automatically.
4. **Homepage**: Adjust `src/content/home.json` to update hero metrics, featured models, and stats.

### Development Tasks

- `src/layouts/Layout.astro` centralizes metadata, navigation, and footer content.
- `src/layouts/TutorialLayout.astro` renders tutorial Markdown with enhanced typography and handles related-content links.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup Instructions

1. **Clone the repository**

```bash
git clone git@github.com:NVIDIA-AI-IOT/jetson-ai-lab-stg.git
cd jetson-ai-lab-stg
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

The development server will be available at <http://localhost:4321>

4. **Build for production**

```bash
npm run build
npm run preview
```

The preview server will serve the built site at <http://localhost:4321>

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build static site for production
- `npm run preview` - Preview production build locally
- `npm run astro` - Run Astro CLI commands

## Content Tips

- Prefer Markdown headings and tables over raw HTML for consistent styling.
- Keep tutorial frontmatter accurate; `difficulty` accepts `Beginner`, `Intermediate`, or `Advanced`.
- Use the provided template for new tutorials to benefit from automatic navigation and SEO metadata.
- Store media assets under `public/` and reference them with absolute paths.

## Deployment

The project ships as static assets and works on Netlify, Vercel, GitHub Pages, or any static hosting service. Netlify defaults are already configured in `netlify.toml`.

### Staging Website

> **Coming Soon**: The staging site will be available at a private GitHub Pages URL once CI/CD is configured.

Staging URL: TBD (private GitHub Pages)

### CI/CD Pipeline

> **Coming Soon**: GitHub Actions workflow for automated deployment.

We are setting up automated deployment via GitHub Actions for:
- ✅ Automated builds on push to main
- ✅ Deployment to GitHub Pages (private)
- ✅ Build status badges
- ✅ Preview deployments for pull requests

## Contact

Asier Arranz (asier@nvidia.com)
Khalil Ben Khaled (kbenkhaled@nvidia.com, PR #318 author)
Aditya Sahu (adsahu@nvidia.com)
Chitoku Yato (cyato@nvidia.com)
