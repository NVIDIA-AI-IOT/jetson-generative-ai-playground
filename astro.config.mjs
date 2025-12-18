import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  integrations: [
    expressiveCode({
      themes: ['github-dark'],
      styleOverrides: {
        // Match your site's design
        borderRadius: '0.75rem',
      },
    }),
    tailwind(),
  ],
  site: 'https://www.jetson-ai-lab.com',
  markdown: {
    syntaxHighlight: false, // Disable Shiki, use Expressive Code instead
  },
  redirects: {
    // Jetson Setup Guide
    '/initial_setup_jon.html': '/tutorials/initial-setup-jetson-orin-nano/',
    '/initial_setup_jon': '/tutorials/initial-setup-jetson-orin-nano/',
    '/initial_setup_jon_sdkm.html': '/tutorials/initial-setup-sdk-manager/',
    '/initial_setup_jon_sdkm': '/tutorials/initial-setup-sdk-manager/',
    '/tips_ssd-docker.html': '/tutorials/ssd-docker-setup/',
    '/tips_ssd-docker': '/tutorials/ssd-docker-setup/',
    
    // Tutorials
    '/tutorial_ollama.html': '/tutorials/ollama/',
    '/tutorial_ollama': '/tutorials/ollama/',
    '/tutorial_nanoowl.html': '/tutorials/nanoowl/',
    '/tutorial_nanoowl': '/tutorials/nanoowl/',
    '/tutorial_live-vlm-webui.html': '/tutorials/live-vlm-webui/',
    '/tutorial_live-vlm-webui': '/tutorials/live-vlm-webui/',
    '/tutorial_jps.html': '/tutorials/jetson-platform-services/',
    '/tutorial_jps': '/tutorials/jetson-platform-services/',
    '/tutorial_gen-ai-benchmarking.html': '/tutorials/genai-benchmarking/',
    '/tutorial_gen-ai-benchmarking': '/tutorials/genai-benchmarking/',
    '/workshop_gtcdc2025.html': '/tutorials/workshop-gtc-dc-2025/',
    '/workshop_gtcdc2025': '/tutorials/workshop-gtc-dc-2025/',
    
    // Main sections - only redirect .html versions
    '/models.html': '/models/',
    '/benchmarks.html': '/archive/benchmarks.html',
    '/research.html': '/research/',
    '/community_articles.html': '/community/',
    
    // Catch common patterns - redirect to archive
    '/tutorial-intro.html': '/archive/tutorial-intro.html',
    '/tutorial-intro': '/archive/tutorial-intro.html',
  }
});
