'use client';

import { FormEvent, useMemo, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import type { Locale } from '@/lib/i18n/config';

export default function AdminLoginClient({ locale }: { locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';
  const t = useMemo(
    () =>
      locale === 'en'
        ? {
            site: 'Vicheng Notes',
            title: 'Admin Login',
            desc: 'Minimal and focused workspace. Sign in with your admin account to continue.',
            email: 'Email',
            password: 'Password',
            passwordPlaceholder: 'Enter your password',
            submit: 'Sign in',
            submitting: 'Signing in...',
            invalid: 'Invalid email or password',
          }
        : {
            site: '维成小站',
            title: '后台登录',
            desc: '极简、专注、无干扰。输入管理员账号后进入后台。',
            email: '邮箱',
            password: '密码',
            passwordPlaceholder: '请输入密码',
            submit: '登录',
            submitting: '登录中...',
            invalid: '邮箱或密码错误',
          },
    [locale]
  );

  const [email, setEmail] = useState('admin@vichengnet.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError(t.invalid);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6">
        <div className="w-full">
          <div className="mb-10">
            <a href="/" className="text-sm font-semibold tracking-tight">
              {t.site}
            </a>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">{t.title}</h1>
            <p className="mt-3 max-w-md text-sm leading-7 text-neutral-500 dark:text-neutral-400">{t.desc}</p>
          </div>

          <form onSubmit={onSubmit} className="max-w-md space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.email}</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="admin@vichengnet.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.password}</label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder={t.passwordPlaceholder}
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            ) : null}

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? t.submitting : t.submit}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
