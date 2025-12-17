# Jetson AI Lab - Redesign

Jetson AI Lab - Redesign is the refreshed NVIDIA experience for experimenting with Jetson-optimized generative AI models entirely on-device. The site pairs a polished Astro frontend with a content-driven workflow so new tutorials, models, and posts can be published without touching layout code.

## Highlights

- Optimized showcase for flagship models such as Llama 4, Gemma 3n, SDXL, Whisper, and VoiceCraft
- Curated tutorials, benchmarks, and blog posts with consistent styling and navigation
- Local-first architecture: everything runs on Jetson hardware with no cloud dependency
- Content authored in Markdown/JSON for fast iteration and git-friendly reviews
- Public site by default; no password gate or authentication

## Technology Stack

- **Astro 5** for the static-first front end
- **Tailwind CSS** for the design system
- **MDX & Markdown** for rich content with interactive elements
- **TypeScript** for typings across data collections

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

```bash
npm install
npm run dev
```

The development server defaults to <http://localhost:4321>.

To build a production bundle:

```bash
npm run build
npm run preview
```

## Content Tips

- Prefer Markdown headings and tables over raw HTML for consistent styling.
- Keep tutorial frontmatter accurate; `difficulty` accepts `Beginner`, `Intermediate`, or `Advanced`.
- Use the provided template for new tutorials to benefit from automatic navigation and SEO metadata.
- Store media assets under `public/` and reference them with absolute paths.

## Deployment

The project ships as static assets and works on Netlify, Vercel, or any static hosting service. Netlify defaults are already configured in `netlify.toml`.

## Contact

Asier Arranz (asier@nvidia.com)
