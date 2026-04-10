'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

export default function CommentsGiscus() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-12 border-t pt-10">
      <h2 className="text-2xl font-semibold tracking-tight">评论</h2>
      <div className="mt-6">
        <Giscus
          id="comments"
          repo="hezongcheng/vichengnet"
          repoId="R_kgDOR9W8iQ"
          category="General"
          categoryId="DIC_kwDOR9W8ic4C6bf3"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
          lang="zh-CN"
          loading="lazy"
        />
      </div>
    </div>
  );
}
