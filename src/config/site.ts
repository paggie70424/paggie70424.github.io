/**
 * Site Configuration
 *
 * Basic site settings including title, description, author info, etc.
 */

import type { SiteConfig } from '@jet-w/astro-blog';
import { menu } from './menu';

/**
 * Site configuration
 */
export const siteConfig: SiteConfig = {
  title: "Paggie's Blog",
  description: 'A FrontEnd programmer',
  author: 'Paggie',
  email: '',
  avatar: '/images/paggie.png',
  social: {
    github: 'https://github.com/paggie70424',
    twitter: '',
    linkedin: '',
    email: ''
  },
  menu
};

/**
 * Default SEO settings
 */
export const defaultSEO = {
  title: siteConfig.title,
  description: siteConfig.description,
  image: '/images/og-image.jpg',
  type: 'website' as const
};
