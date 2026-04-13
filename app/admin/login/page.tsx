import { Suspense } from 'react';
import AdminLoginClient from './AdminLoginClient';
import { getAdminLocale } from '@/lib/i18n/admin';

export default function AdminLoginPage() {
  const locale = getAdminLocale();

  return (
    <Suspense fallback={<LoginSkeleton />}>
      <AdminLoginClient locale={locale} />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-6 h-8 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-3 h-4 w-72 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>

          <div className="space-y-4">
            <div className="h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900" />
            <div className="h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900" />
            <div className="h-10 w-24 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </main>
  );
}
