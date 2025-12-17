# 🎯 Tutorial Template – Unified System

## 📋 How to Publish a New Tutorial

### 1. Create the Markdown file

Place a `.md` file inside `src/content/tutorials/` using the structure below:

```markdown
---
title: "Tutorial Title"
description: "Concise summary of the tutorial"
difficulty: "Beginner"
duration: "30 min"
tags: ["tag1", "tag2", "tag3"]
model: "model-name"
publishedAt: 2024-09-15
author: "Asier Arranz"
featured: true
---

## 🎯 Overview

Tutorial introduction...

## 📋 Prerequisites

### Hardware Requirements
- **Jetson Thor** (128GB)
- **AGX Orin 64GB/32GB**
- **Orin NX 16GB**
- **Orin Nano 8GB**

### Software Requirements
- **JetPack 5.1+**
- **Python 3.8+**

## 🚀 Step 1: Install Dependencies

```bash
echo "Install your dependencies here"
```

## ⚙️ Step 2: Configuration

```bash
python configure.py --flag example
```

## 📊 Performance Benchmarks

| Device | Model Size | Memory Usage | Speed | Quality |
|--------|------------|--------------|-------|---------|
| Jetson Thor | 7B | 8GB | 45 tokens/s | Excellent |
| AGX Orin 64GB | 7B | 12GB | 35 tokens/s | Excellent |
| AGX Orin 32GB | 7B | 12GB | 35 tokens/s | Excellent |
| Orin NX 16GB | 3B | 6GB | 25 tokens/s | Good |
| Orin Nano 8GB | 1B | 3GB | 15 tokens/s | Good |

## 🔧 Troubleshooting

### Common Issues

**Issue 1: Memory Error**
```bash
python fix_memory.py
```

**Issue 2: CUDA Error**
```bash
python resolve_cuda.py
```

## 🎉 Conclusion

Wrap-up text...

## 🔗 Next Steps

- [Related Tutorial 1](/tutorials/tutorial-1)
- [Related Tutorial 2](/tutorials/tutorial-2)
```

Accepted values for `difficulty`: `Beginner`, `Intermediate`, `Advanced`.

### 2. Create the Astro page

Add a minimal `.astro` file under `src/pages/tutorials/`:

```astro
---
import TutorialLayout from '../../layouts/TutorialLayout.astro';
---

<TutorialLayout tutorialId="markdown-file-name" />
```

### 3. Update the tutorial directory

Include the new tutorial in the array inside `src/pages/tutorials/index.astro`:

```javascript
{
  id: 'markdown-file-name',
  title: 'Tutorial Title',
  description: 'Summary of the tutorial',
  category: 'Text',
  difficulty: 'Beginner',
  duration: '30 min',
  devices: ['Jetson Thor', 'AGX Orin 64GB', 'AGX Orin 32GB', 'Orin NX 16GB', 'Orin Nano 8GB'],
  tags: ['tag1', 'tag2', 'tag3'],
  featured: true
}
```

## ✅ Why the Unified System Helps

### 🎨 Automatic Styling
- ✅ Elegant hero section
- ✅ Professional typography
- ✅ Consistent NVIDIA palette
- ✅ Syntax highlighting for code
- ✅ Rich tables
- ✅ Related tutorials section

### 🔧 Easy Maintenance
- ✅ Single source of style overrides
- ✅ Global changes propagate instantly
- ✅ No duplicated code
- ✅ Predictable layout

### 📱 Responsive By Design
- ✅ Mobile-first layout
- ✅ Works on any screen size
- ✅ Smooth navigation

### 🚀 Built for Growth
- ✅ Add tutorials in seconds
- ✅ Modular structure
- ✅ Simple to extend

## 📁 File Structure

```
src/
├── layouts/
│   └── TutorialLayout.astro          # Unified layout
├── content/
│   └── tutorials/
│       ├── tutorial-1.md             # Markdown content
│       ├── tutorial-2.md
│       └── ...
└── pages/
    └── tutorials/
        ├── tutorial-1.astro          # Three-line page
        ├── tutorial-2.astro
        └── index.astro               # Tutorial directory
```

## 🎯 Complete Example

### File: `src/content/tutorials/my-tutorial.md`
```markdown
---
title: "Custom Tutorial"
description: "Walkthrough of my workflow"
difficulty: "Intermediate"
duration: "45 min"
tags: ["custom", "example", "demo"]
model: "custom"
publishedAt: 2024-09-15
author: "Asier Arranz"
featured: true
---

## 🎯 Overview

Custom tutorial content...

## 📋 Prerequisites

### Hardware Requirements
- **Jetson Thor** (128GB)
- **AGX Orin 64GB/32GB**
- **Orin NX 16GB**
- **Orin Nano 8GB**

## 🚀 Step 1: Setup

```bash
python custom_setup.py
```

## 🎉 Conclusion

Tutorial completed!
```

### File: `src/pages/tutorials/my-tutorial.astro`
```astro
---
import TutorialLayout from '../../layouts/TutorialLayout.astro';
---

<TutorialLayout tutorialId="my-tutorial" />
```

## 🎉 You're All Set

With a Markdown file and three lines of Astro, the tutorial is ready with:

- ✅ Professional design
- ✅ Consistent styling
- ✅ Integrated navigation
- ✅ Related recommendations
- ✅ Responsive layout
- ✅ SEO-ready metadata

The system handles the rest for you. 🚀
