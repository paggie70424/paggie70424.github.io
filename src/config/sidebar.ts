/**
 * Sidebar Configuration
 *
 * Configure sidebar display options, groups, and widgets
 */

import type { SidebarConfig } from '@jet-w/astro-blog';

/**
 * Sidebar configuration
 */
export const sidebarConfig: SidebarConfig = {
  enabled: true,
  showSearch: true,
  showRecentPosts: true,
  recentPostsCount: 5,
  showPopularTags: true,
  popularTagsCount: 8,
  showArchives: true,
  archivesCount: 6,
  showFriendLinks: false,
  friendLinks: [
    { title: 'Vue.js', url: 'https://vuejs.org', icon: 'ri:vuejs-line' },
  ],
  groups: [
    // 博客使用指南（置顶）
    // {
    //   type: 'scan',
    //   title: '博客指南',
    //   icon: 'ri:book-open-line',
    //   scanPath: 'blog_docs',
    //   collapsed: true,
    //   showForPaths: ['/posts/blog_docs/**']
    // },

    // 分隔符
    { type: 'divider', title: 'Technology' },

    // // 扫描技术文档目录
    // {
    //   type: 'scan',
    //   title: '数学',
    //   icon: 'ri:folder-3-line',
    //   scanPath: 'math',
    //   collapsed: true,
    //   showForPaths: ['/posts/math/**']
    // },

    // // 扫描技术文档目录
    // {
    //   type: 'scan',
    //   title: '工具',
    //   icon: 'ri:folder-3-line',
    //   scanPath: 'tools',
    //   collapsed: true,
    //   showForPaths: ['/posts/tools/**']
    // },

    // // 扫描技术文档目录
    // {
    //   type: 'scan',
    //   title: '量化',
    //   icon: 'ri:folder-3-line',
    //   scanPath: 'qt-model',
    //   collapsed: true,
    //   showForPaths: ['/posts/qt-model/**']
    // },

    // // 扫描技术文档目录
    // {
    //   type: 'scan',
    //   title: '技术',
    //   icon: 'ri:folder-3-line',
    //   scanPath: 'techniques',
    //   collapsed: true,
    //   showForPaths: ['/posts/techniques/**']
    // },

    // // 扫描技术文档目录
    // {
    //   type: 'scan',
    //   title: '媒体',
    //   icon: 'ri:folder-3-line',
    //   scanPath: 'media',
    //   collapsed: true,
    //   showForPaths: ['/posts/media/**']
    // },
    // 扫描技术文档目录
    // {
    //   type: 'scan',
    //   title: 'PTE',
    //   icon: 'ri:folder-3-line',
    //   scanPath: 'PTE',
    //   collapsed: true,
    //   showForPaths: ['/posts/PTE/**']
    // },
    // 示例：混合配置
    // {
    //   type: 'mixed',
    //   title: '学习资源',
    //   icon: 'ri:book-line',
    //   sections: [
    //     {
    //       type: 'manual',
    //       title: '推荐阅读',
    //       items: [
    //         { title: '入门教程', slug: 'tutorial/intro', badge: 'HOT', badgeType: 'error' },
    //       ]
    //     },
    //     {
    //       type: 'scan',
    //       title: '系列教程',
    //       scanPath: 'tutorials',
    //     }
    //   ]
    // },
    
  ]
};
