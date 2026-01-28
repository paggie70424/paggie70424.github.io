import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import path from 'path';
import { fileURLToPath } from 'url';

// Import plugins and integration from @jet-w/astro-blog
import { astroBlog } from '@jet-w/astro-blog';
import { remarkContainers } from '@jet-w/astro-blog/plugins/remark-containers.mjs';
import { remarkMermaid } from '@jet-w/astro-blog/plugins/remark-mermaid.mjs';
import { rehypeCleanContainers } from '@jet-w/astro-blog/plugins/rehype-clean-containers.mjs';
import { rehypeTabs } from '@jet-w/astro-blog/plugins/rehype-tabs.mjs';
import { rehypeRelativeLinks } from '@jet-w/astro-blog/plugins/rehype-relative-links.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@astrojs/rss': path.resolve(__dirname, 'node_modules/@astrojs/rss'),
        '@jet-w/astro-blog/config': path.resolve(__dirname, 'src/config/index.ts'),
        '@': path.resolve(__dirname, 'node_modules/@jet-w/astro-blog/src'),
        '@blog': path.resolve(__dirname, 'src'),
      },
    },
  },
  integrations: [
    astroBlog(),
    vue(),
    mdx(),
    tailwind({
      applyBaseStyles: false,
    })
  ],
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkMath,
      remarkContainers,
      remarkMermaid,
    ],
    rehypePlugins: [
      rehypeRaw,
      rehypeKatex,
      rehypeCleanContainers,
      rehypeTabs,
      rehypeRelativeLinks,
    ],
    shikiConfig: {
      theme: 'github-dark',
      langs: [],
      wrap: true
    }
  },
  site: 'https://example.com',
  base: '/',
  build: {
    assets: 'assets'
  }
});
