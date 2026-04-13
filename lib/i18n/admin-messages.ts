import type { Locale } from '@/lib/i18n/config';

export function getAdminMessages(locale: Locale) {
  if (locale === 'en') {
    return {
      brand: 'Vicheng Notes',
      panel: 'Admin Panel',
      nav: {
        dashboard: 'Dashboard',
        posts: 'Posts',
        projects: 'Projects',
        nav: 'Directory',
        settings: 'Settings',
      },
      header: {
        title: 'Admin Console',
        desc: 'Manage content and site settings in one place',
        logout: 'Sign out',
      },
    } as const;
  }

  return {
    brand: '维成小站',
    panel: '后台管理',
    nav: {
      dashboard: '仪表盘',
      posts: '文章管理',
      projects: '项目管理',
      nav: '导航管理',
      settings: '系统设置',
    },
    header: {
      title: '后台管理',
      desc: '统一管理文章、项目、导航与站点设置',
      logout: '退出登录',
    },
  } as const;
}
