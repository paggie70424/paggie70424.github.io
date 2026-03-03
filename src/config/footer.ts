/**
 * Footer Configuration
 *
 * Configure footer links, copyright, and display options.
 *
 * NOTE: For multi-language support, language-specific settings
 * (quickLinksTitle, quickLinks, contactTitle) should be configured
 * in astro.config.mjs under localeConfigs.
 * This file contains shared settings that are not language-specific.
 */

import type { FooterConfig } from '@jet-w/astro-blog';
import { socialLinks } from './social';

/**
 * Footer configuration (shared settings)
 *
 * Language-specific quickLinks and titles are configured in astro.config.mjs
 */
export const footerConfig: FooterConfig = {
  quickLinksTitle: '快速链接',
  quickLinks: [
    { name: '首页', href: '/' },
    { name: '文章', href: '/posts' },
    { name: '标签', href: '/tags' },
    { name: '归档', href: '/archives' },
    { name: '关于', href: '/about' }
  ],
  contactTitle: '联系方式',
  socialLinks: socialLinks,
  showRss: true,
  rssUrl: '/rss.xml',
  copyright: '© {year} {author}. All rights reserved.',
  poweredBy: {
    text: 'Astro',
    url: 'https://astro.build'
  }
};
