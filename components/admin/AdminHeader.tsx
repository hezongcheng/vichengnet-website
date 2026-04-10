'use client';

import { signOut } from 'next-auth/react';
import { LogOut, PanelTopOpen } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/85 px-4 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80 md:px-6">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            <PanelTopOpen size={18} />
          </span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">后台管理</h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">文章、SEO 与站点设置统一管理</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">退出登录</span>
        </button>
      </div>
    </header>
  );
}
