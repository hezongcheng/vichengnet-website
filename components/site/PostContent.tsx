'use client';

import { useEffect, useRef } from 'react';

type PostContentProps = {
  html: string;
};

export default function PostContent({ html }: PostContentProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const codeBlocks = root.querySelectorAll<HTMLPreElement>('pre');
    codeBlocks.forEach((pre) => {
      if (pre.querySelector('.copy-code-btn')) return;

      pre.classList.add('code-block');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-code-btn';
      button.textContent = '复制代码';
      button.setAttribute('aria-label', '复制代码');

      button.addEventListener('click', async () => {
        const codeText = pre.querySelector('code')?.textContent || pre.textContent || '';
        try {
          await navigator.clipboard.writeText(codeText);
          button.textContent = '已复制';
          window.setTimeout(() => {
            button.textContent = '复制代码';
          }, 1200);
        } catch {
          button.textContent = '复制失败';
          window.setTimeout(() => {
            button.textContent = '复制代码';
          }, 1200);
        }
      });

      pre.appendChild(button);
    });
  }, [html]);

  return (
    <div
      ref={rootRef}
      data-post-content
      className="prose mt-10 max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
