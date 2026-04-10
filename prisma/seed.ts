import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@vichengnet.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123456';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Admin',
      passwordHash,
      role: 'admin',
    },
  });

  const contentBlocks = [
    { key: 'site.name', title: '站点名称', value: '维成小站', type: 'text' },
    { key: 'home.hero.title', title: '首页标题', value: '维成小站', type: 'text' },
    {
      key: 'home.hero.description',
      title: '首页描述',
      value: '一个简洁、安静、内容优先的个人站点。这里记录技术、生活、项目与长期兴趣。',
      type: 'text',
    },
    { key: 'about.body', title: '关于页正文', value: '这里是关于页内容。', type: 'text' },
    { key: 'site.footer.icp', title: '备案号', value: '蜀ICP备2025127626号-1', type: 'text' },
    { key: 'site.footer.domain', title: '域名', value: 'vichengnet.com', type: 'text' },
    { key: 'seo.default.title', title: 'SEO 默认标题', value: '维成小站', type: 'text' },
    {
      key: 'seo.default.description',
      title: 'SEO 默认描述',
      value: '一个简洁、安静、内容优先的个人站点。',
      type: 'text',
    },
  ];

  for (const item of contentBlocks) {
    await prisma.contentBlock.upsert({
      where: { key: item.key },
      update: item,
      create: item,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
