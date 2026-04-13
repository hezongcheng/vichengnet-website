import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { defaultNavCategories } from '../lib/nav';

async function upsertContentBlock(item: {
  key: string;
  locale: 'zh' | 'en';
  title: string;
  value: string;
  type: string;
}) {
  await prisma.contentBlock.upsert({
    where: {
      key_locale: {
        key: item.key,
        locale: item.locale,
      },
    },
    update: item,
    create: item,
  });
}

async function seedNav() {
  const count = await prisma.navCategory.count();
  if (count > 0) return;

  for (let i = 0; i < defaultNavCategories.length; i += 1) {
    const category = defaultNavCategories[i];
    const createdCategory = await prisma.navCategory.create({
      data: {
        key: category.key,
        label: category.label,
        labelZh: category.label,
        labelEn: category.label,
        sortOrder: i,
      },
    });

    for (let j = 0; j < category.sites.length; j += 1) {
      const site = category.sites[j];
      await prisma.navSite.create({
        data: {
          categoryId: createdCategory.id,
          name: site.name,
          nameZh: site.name,
          nameEn: site.name,
          url: site.url,
          description: site.description,
          descriptionZh: site.description,
          descriptionEn: site.description,
          tags: site.tags,
          sortOrder: j,
        },
      });
    }
  }
}

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
    { key: 'site.name', locale: 'zh', title: '站点名称', value: '维成小站', type: 'text' },
    { key: 'site.name', locale: 'en', title: 'Site Name', value: 'Vicheng Notes', type: 'text' },
    { key: 'home.hero.title', locale: 'zh', title: '首页标题', value: '维成小站', type: 'text' },
    { key: 'home.hero.title', locale: 'en', title: 'Home Title', value: 'Vicheng Notes', type: 'text' },
    {
      key: 'home.hero.description',
      locale: 'zh',
      title: '首页描述',
      value: '一个简洁、安静、内容优先的个人站点。',
      type: 'text',
    },
    {
      key: 'home.hero.description',
      locale: 'en',
      title: 'Home Description',
      value: 'A minimal and content-first personal website.',
      type: 'text',
    },
    { key: 'about.body', locale: 'zh', title: '关于页正文', value: '这里是关于页内容。', type: 'text' },
    { key: 'about.body', locale: 'en', title: 'About Body', value: 'This is the about page content.', type: 'text' },
    { key: 'site.footer.icp', locale: 'zh', title: '备案号', value: '蜀ICP备2025127626号-1', type: 'text' },
    { key: 'site.footer.icp', locale: 'en', title: 'ICP Record', value: 'Sichuan ICP 2025127626-1', type: 'text' },
    { key: 'site.footer.domain', locale: 'zh', title: '域名', value: 'vichengnet.com', type: 'text' },
    { key: 'site.footer.domain', locale: 'en', title: 'Domain', value: 'vichengnet.com', type: 'text' },
    { key: 'seo.default.title', locale: 'zh', title: 'SEO 默认标题', value: '维成小站', type: 'text' },
    { key: 'seo.default.title', locale: 'en', title: 'SEO Default Title', value: 'Vicheng Notes', type: 'text' },
    {
      key: 'seo.default.description',
      locale: 'zh',
      title: 'SEO 默认描述',
      value: '一个简洁、安静、内容优先的个人站点。',
      type: 'text',
    },
    {
      key: 'seo.default.description',
      locale: 'en',
      title: 'SEO Default Description',
      value: 'A minimal and content-first personal website.',
      type: 'text',
    },
  ] as const;

  for (const item of contentBlocks) {
    await upsertContentBlock(item);
  }

  await seedNav();
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
