# Content Management Guide

This guide explains how to manage content for Jetson AI Lab - Redesign using Markdown and JSON files.

## Overview

The website now uses a content-driven approach where all content is defined in Markdown and JSON files, making it easy to update without touching HTML code.

## File Structure

```
src/
├── content/
│   ├── home.json              # Home page content
│   ├── models/                # Model documentation
│   │   ├── gemma-3n.md
│   │   └── llama-4.md
│   ├── tutorials/             # Tutorial guides
│   │   └── whisper-jetson.md
│   └── posts/                 # Blog posts
│       └── welcome.md
```

## Home Page Content (`src/content/home.json`)

The home page content is defined in JSON format for easy editing:

```json
{
  "hero": {
    "title": "Experience Generative AI on Jetson",
    "subtitle": "Run the latest AI models locally",
    "description": "Discover optimized models for Jetson devices..."
  },
  "features": [
    {
      "title": "Local & Offline",
      "description": "Run AI models directly on your Jetson device...",
      "icon": "🚀"
    }
  ],
  "stats": [
    {
      "number": "15+",
      "label": "Optimized Models"
    }
  ],
  "featuredModels": [
    {
      "title": "Gemma 3n",
      "description": "Google's latest lightweight language model...",
      "badge": "NEW",
      "performance": {
        "speed": "2.5x faster",
        "accuracy": "95% accuracy"
      },
      "devices": ["Jetson Orin", "Jetson Xavier"],
      "link": "/models/gemma-3n"
    }
  ]
}
```

### How to Update Home Page

1. Edit `src/content/home.json`
2. Save the file
3. The changes will automatically appear on the home page

## Model Documentation (`src/content/models/`)

Each model has its own Markdown file with frontmatter and detailed content.

### Frontmatter Structure

```yaml
---
title: "Model Name"
description: "Brief description"
category: "Language Models"
tags: ["tag1", "tag2"]
image: "/images/models/model.jpg"
performance:
  speed: "2.5x faster"
  accuracy: "95% accuracy"
  memory: "4GB RAM required"
devices: ["Jetson Orin", "Jetson Xavier"]
installation: |
  ```bash
  # Installation commands
  ```
usage: |
  ```python
  # Usage example
  ```
isHighlighted: true
isNew: true
---
```

### Content Structure

The Markdown content can include:

- **Overview**: Model description and key features
- **Performance Specifications**: Tables with metrics
- **Use Cases**: List of applications
- **Installation**: Step-by-step setup
- **Quick Start**: Basic usage examples
- **Advanced Usage**: Complex scenarios
- **Device Compatibility**: Supported devices
- **Troubleshooting**: Common issues and solutions
- **Related Models**: Links to other models

### How to Add a New Model

1. Create a new file in `src/content/models/model-name.md`
2. Add the frontmatter with all required fields
3. Write the content in Markdown
4. Add the model to `home.json` featuredModels if needed

## Tutorials (`src/content/tutorials/`)

Tutorials are written in Markdown with specific frontmatter:

```yaml
---
title: "Tutorial Title"
description: "Brief description"
difficulty: "Beginner"  # Beginner, Intermediate, Advanced
duration: "15 min"
tags: ["tag1", "tag2"]
model: "model-name"
publishedAt: 2024-01-15
---
```

### Tutorial Content

Tutorials can include:

- **Prerequisites**: Requirements and setup
- **Installation**: Step-by-step installation
- **Basic Usage**: Simple examples
- **Advanced Usage**: Complex scenarios
- **Troubleshooting**: Common issues
- **Use Cases**: Practical applications

## Blog Posts (`src/content/posts/`)

Blog posts use this frontmatter structure:

```yaml
---
title: "Post Title"
description: "Brief description"
author: "Author Name"
publishedAt: 2024-01-15
tags: ["tag1", "tag2"]
featured: true
---
```

## Benefits of This Approach

1. **Easy Content Management**: Update content without touching code
2. **Version Control**: All content is tracked in Git
3. **Structured Data**: Consistent format across all content
4. **Separation of Concerns**: Content separate from presentation
5. **Scalable**: Easy to add new models, tutorials, and posts
6. **Markdown Support**: Rich formatting with code blocks, tables, etc.

## Adding New Content

### New Model
1. Create `src/content/models/model-name.md`
2. Add to `home.json` featuredModels if needed
3. Update models page if required

### New Tutorial
1. Create `src/content/tutorials/tutorial-name.md`
2. Follow the frontmatter structure
3. Write detailed step-by-step content

### New Blog Post
1. Create `src/content/posts/post-name.md`
2. Add frontmatter with required fields
3. Write content in Markdown

## Best Practices

1. **Consistent Formatting**: Use the same structure across similar content
2. **Clear Descriptions**: Write concise but informative descriptions
3. **Code Examples**: Include working code examples
4. **Images**: Use descriptive image paths
5. **Tags**: Use consistent tagging system
6. **Links**: Include relevant internal and external links

## Development

To run the development server:

```bash
npm run dev
```

The site will automatically reload when you make changes to content files. 
