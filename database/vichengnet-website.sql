/*
 Navicat Premium Dump SQL

 Source Server         : 腾讯云-43.173.119.223
 Source Server Type    : PostgreSQL
 Source Server Version : 180003 (180003)
 Source Host           : 43.173.119.223:5432
 Source Catalog        : vichengnet-site
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 180003 (180003)
 File Encoding         : 65001

 Date: 07/05/2026 15:09:43
*/


-- 创建 PostStatus 枚举类型
DO $$ BEGIN
    CREATE TYPE "public"."PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ----------------------------
-- Table structure for _prisma_migrations
-- ----------------------------
DROP TABLE IF EXISTS "public"."_prisma_migrations";
CREATE TABLE "public"."_prisma_migrations" (
  "id" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
  "checksum" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "finished_at" timestamptz(6),
  "migration_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "logs" text COLLATE "pg_catalog"."default",
  "rolled_back_at" timestamptz(6),
  "started_at" timestamptz(6) NOT NULL DEFAULT now(),
  "applied_steps_count" int4 NOT NULL DEFAULT 0
)
;

-- ----------------------------
-- Records of _prisma_migrations
-- ----------------------------
INSERT INTO "public"."_prisma_migrations" VALUES ('c8571546-3679-4c07-afa7-f8405a5f2ee8', '4ebdde8186610b84ba0e4c863444db67b4cd73dcff0062fe4c71176535d69145', '2026-04-08 18:16:55.179099+00', '20260408181654_init', NULL, NULL, '2026-04-08 18:16:54.743812+00', 1);
INSERT INTO "public"."_prisma_migrations" VALUES ('139c5eb6-de4b-4581-bdac-82def3d8d9a5', 'a6c2274661e52bd4832e46976071dd81f5d344686907028f3e8a166d7e199a09', '2026-04-08 19:03:05.348245+00', '20260408190304_init', NULL, NULL, '2026-04-08 19:03:04.920707+00', 1);
INSERT INTO "public"."_prisma_migrations" VALUES ('125a6fd5-20c0-496b-97c0-911d5e81934a', 'd282337d1fb776d5a27651a5607a2b8ec8a87e9d23d1f3a2f302ae5f6ad3f610', '2026-04-13 14:32:51.19343+00', '20260413200000_init_core', NULL, NULL, '2026-04-13 14:32:50.683181+00', 1);
INSERT INTO "public"."_prisma_migrations" VALUES ('ca18322d-577d-4126-aa2c-b750abee391b', 'fd2c9d7ae4d1739a4b4b6927b575fb495540fc9b8d0b28028f99b4e13f3aee11', '2026-04-13 14:32:51.805554+00', '20260413212000_add_nav_tables', NULL, NULL, '2026-04-13 14:32:51.362899+00', 1);
INSERT INTO "public"."_prisma_migrations" VALUES ('125c3165-a859-4136-a7f9-835b1bd987f7', 'f11dec5f12a15aa4f6690da0a1512d19fdf4bea9af30f0b7967dc023fa41c258', '2026-04-13 14:32:52.392956+00', '20260413223500_i18n_content_and_nav', NULL, NULL, '2026-04-13 14:32:51.972989+00', 1);
INSERT INTO "public"."_prisma_migrations" VALUES ('6836077d-d0c6-4798-ab22-cca0f3882915', '2929245502bdf5afc36c81a414c75cc1db1bd02922d22afd18f00e6a5cd829e7', '2026-04-13 16:41:50.952921+00', '20260414110000_add_post_i18n_fields', NULL, NULL, '2026-04-13 16:41:50.550467+00', 1);

-- ----------------------------
-- Table structure for ContentBlock
-- ----------------------------
DROP TABLE IF EXISTS "public"."ContentBlock";
CREATE TABLE "public"."ContentBlock" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "key" text COLLATE "pg_catalog"."default" NOT NULL,
  "title" text COLLATE "pg_catalog"."default",
  "value" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'text'::text,
  "updatedAt" timestamp(3) NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "locale" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'zh'::text
)
;

-- ----------------------------
-- Records of ContentBlock
-- ----------------------------
INSERT INTO "public"."ContentBlock" VALUES ('cmny22bxs000a371ym88w98ki', 'home.hero.title', '首页标题', 'Vichengnet Blog', 'text', '2026-04-14 03:45:28.563', '2026-04-14 03:22:00.938', 'en');
INSERT INTO "public"."ContentBlock" VALUES ('cmny22bn20004371yns9qm3ri', 'about.body', '关于页正文', 'I’m a backend-focused developer with a strong foundation in PHP and web technologies.
Over the past few years, I’ve worked on a variety of projects ranging from content management systems and enterprise tools to interactive H5 applications and data-driven platforms.

My work mainly revolves around building reliable backend services, designing scalable systems, and improving performance through practical engineering solutions.

I’m comfortable working across the full web stack — from frontend interfaces (Vue) to backend services (Laravel, ThinkPHP), as well as deployment and infrastructure (Docker, Nginx, MySQL).', 'textarea', '2026-04-14 03:45:28.564', '2026-04-14 03:22:00.938', 'en');
INSERT INTO "public"."ContentBlock" VALUES ('cmny22bru0005371ytwhpj3hd', 'seo.default.title', 'SEO 默认标题', 'Vichengnet Blog', 'text', '2026-04-14 03:45:28.564', '2026-04-14 03:22:00.938', 'en');
INSERT INTO "public"."ContentBlock" VALUES ('cmny22bwn0007371y6p1sqsfr', 'seo.default.description', 'SEO 默认描述', 'A quiet corner on the web — simple, focused, and content-first.', 'textarea', '2026-04-14 03:45:28.564', '2026-04-14 03:22:00.938', 'en');
INSERT INTO "public"."ContentBlock" VALUES ('cmny3lx7o00096myxcgi5mq2r', 'projects.items', 'Projects Items', '[{"nameZh":"个人博客系统","nameEn":"Personal Blog System","descriptionZh":"基于 Next.js 与 Prisma 的内容站，支持多语言、后台管理和访问统计。","descriptionEn":"A Next.js + Prisma content site with i18n, admin tools, and analytics.","url":"https://github.com/hezongcheng/vichengnet-website"}]', 'json', '2026-04-14 04:05:15.314', '2026-04-14 04:05:15.314', 'zh');
INSERT INTO "public"."ContentBlock" VALUES ('cmnqdel5h0001hkjuexrahtcc', 'home.hero.title', '首页标题', '维成小站', 'text', '2026-04-14 03:24:37.995', '2026-04-08 18:17:20.021', 'zh');
INSERT INTO "public"."ContentBlock" VALUES ('cmnqdela00002hkju37sfnhxd', 'home.hero.description', '首页描述', '一个简洁、安静、内容优先的个人站点。这里记录技术、生活、项目与长期兴趣。', 'textarea', '2026-04-14 03:24:37.995', '2026-04-08 18:17:20.185', 'zh');
INSERT INTO "public"."ContentBlock" VALUES ('cmnqf1l8u0001bqxn3lfypuax', 'site.name', '站点名称', '维成小站', 'text', '2026-04-14 03:24:37.993', '2026-04-08 19:03:12.846', 'zh');
INSERT INTO "public"."ContentBlock" VALUES ('cmnqdelca0003hkjuecnbrko9', 'about.body', '关于页正文', '我是一名以 PHP 为主的后端开发工程师，具备完整的 Web 开发经验。
过去几年中，参与并负责过多种类型的项目，包括内容管理系统、企业后台系统、H5 活动以及数据平台等。

日常工作主要围绕后端服务开发、系统设计以及性能优化，注重在实际业务场景中构建稳定、可维护的系统。

同时也具备一定的前端能力（Vue），以及基础的部署与运维经验（Docker / Nginx / MySQL）。', 'textarea', '2026-04-14 03:24:37.995', '2026-04-08 18:17:20.267', 'zh');
INSERT INTO "public"."ContentBlock" VALUES ('cmnqdelj30006hkju47pd0xyx', 'seo.default.title', 'SEO 默认标题', '维成小站', 'text', '2026-04-14 03:24:37.995', '2026-04-08 18:17:20.511', 'zh');
INSERT INTO "public"."ContentBlock" VALUES ('cmnqdellc0007hkjutkup2bku', 'seo.default.description', 'SEO 默认描述', '一个简洁、安静、内容优先的个人站点。', 'textarea', '2026-04-14 03:24:37.996', '2026-04-08 18:17:20.593', 'zh');
INSERT INTO "public"."ContentBlock" VALUES ('cmnqdelek0004hkjulj6e7j4f', 'site.footer.icp', '备案号', '蜀ICP备2025127626号-1', 'text', '2026-04-14 03:45:28.563', '2026-04-08 18:17:20.349', 'zh');
INSERT INTO "public"."ContentBlock" VALUES ('cmny22bx40009371y1ta1efuv', 'home.hero.description', '首页描述', 'A quiet corner on the web — simple, focused, and content-first.', 'textarea', '2026-04-14 03:45:28.564', '2026-04-14 03:22:00.938', 'en');
INSERT INTO "public"."ContentBlock" VALUES ('cmny22bwx0008371y7zcqxnag', 'site.name', '站点名称', 'Vichengnet Blog', 'text', '2026-04-14 03:45:28.563', '2026-04-14 03:22:00.938', 'en');
INSERT INTO "public"."ContentBlock" VALUES ('cmnqdelgu0005hkjuuxqm00el', 'site.footer.domain', '域名', 'vichengnet.com', 'text', '2026-04-14 03:45:28.563', '2026-04-08 18:17:20.43', 'zh');

-- ----------------------------
-- Table structure for NavCategory
-- ----------------------------
DROP TABLE IF EXISTS "public"."NavCategory";
CREATE TABLE "public"."NavCategory" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "key" text COLLATE "pg_catalog"."default" NOT NULL,
  "label" text COLLATE "pg_catalog"."default" NOT NULL,
  "sortOrder" int4 NOT NULL DEFAULT 0,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "labelZh" text COLLATE "pg_catalog"."default",
  "labelEn" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of NavCategory
-- ----------------------------

-- ----------------------------
-- Table structure for NavSite
-- ----------------------------
DROP TABLE IF EXISTS "public"."NavSite";
CREATE TABLE "public"."NavSite" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "categoryId" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "url" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "tags" text[] COLLATE "pg_catalog"."default",
  "sortOrder" int4 NOT NULL DEFAULT 0,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "nameZh" text COLLATE "pg_catalog"."default",
  "nameEn" text COLLATE "pg_catalog"."default",
  "descriptionZh" text COLLATE "pg_catalog"."default",
  "descriptionEn" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of NavSite
-- ----------------------------

-- ----------------------------
-- Table structure for Post
-- ----------------------------
DROP TABLE IF EXISTS "public"."Post";
CREATE TABLE "public"."Post" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "slug" text COLLATE "pg_catalog"."default" NOT NULL,
  "summary" text COLLATE "pg_catalog"."default",
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "coverImage" text COLLATE "pg_catalog"."default",
  "category" text COLLATE "pg_catalog"."default",
  "tags" text[] COLLATE "pg_catalog"."default",
  "status" "public"."PostStatus" NOT NULL DEFAULT 'DRAFT'::"PostStatus",
  "publishedAt" timestamp(3),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "seoDescription" text COLLATE "pg_catalog"."default",
  "seoKeywords" text COLLATE "pg_catalog"."default",
  "seoTitle" text COLLATE "pg_catalog"."default",
  "titleEn" text COLLATE "pg_catalog"."default",
  "summaryEn" text COLLATE "pg_catalog"."default",
  "contentEn" text COLLATE "pg_catalog"."default",
  "categoryEn" text COLLATE "pg_catalog"."default",
  "seoTitleEn" text COLLATE "pg_catalog"."default",
  "seoDescriptionEn" text COLLATE "pg_catalog"."default",
  "seoKeywordsEn" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of Post
-- ----------------------------
INSERT INTO "public"."Post" VALUES ('cmnqwhgca002a13xcdkwqn7mg', 'Clash 使用指南：从 0 搭建 Xray 代理节点（完整教程）', 'clash-xray-setup-guide', '本文介绍如何从零开始搭建 Clash 所需的代理节点，包括服务器准备、Xray 安装与配置、端口开放以及客户端接入流程，并附常见问题排查与优化建议。', '<h1>Clash 使用指南：从 0 搭建 Xray 代理节点</h1><h2>一、前言</h2><p>Clash 是一个代理客户端工具，本身<strong>不提供代理服务</strong>。</p><p>这意味着：</p><blockquote><p>👉 使用 Clash 之前，你必须先拥有一个可用的代理节点。</p></blockquote><p>通常的做法是：</p><ul><li><p>在云服务器上部署代理服务（如 Xray）</p></li><li><p>再在本地通过 Clash 接入该节点</p></li></ul><hr><h2>二、基本架构</h2><p>整体网络流程如下：</p><pre><code>本地设备（Clash）
        ↓
云服务器（Xray）
        ↓
目标网站</code></pre><p>简单理解：</p><blockquote><p>👉 Clash 负责“使用代理”<br><br>👉 Xray 负责“提供代理”</p></blockquote><hr><h2>三、服务器准备</h2><p>在开始之前，你需要准备一台云服务器。</p><h3>基本要求</h3><ul><li><p><br>系统：Ubuntu 20.04 / 22.04<br></p></li><li><p><br>配置：1 核 1G 及以上<br></p></li><li><p><br>网络：公网 IP<br></p></li></ul><h3>端口要求</h3><p>需要开放一个端口，例如：</p><ul><li><p><code>10086</code>（测试用）<br></p></li><li><p><code>443</code>（生产推荐）<br></p></li></ul><hr><h2>四、安装 Xray</h2><p>执行以下命令，一键安装 Xray：</p><pre><code>bash &lt;(curl -Ls https://raw.githubusercontent.com/XTLS/Xray-install/main/install-release.sh)</code></pre><p>安装完成后，系统会自动注册服务。</p><hr><h2>五、配置 Xray 服务</h2><p>编辑配置文件：</p><pre><code>nano /usr/local/etc/xray/config.json</code></pre><p>示例配置：</p><pre><code>{
  "inbounds": [
    {
      "port": 10086,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "你的UUID",
            "alterId": 0
          }
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom"
    }
  ]
}</code></pre><h3>生成 UUID</h3><p>执行：</p><pre><code>cat /proc/sys/kernel/random/uuid</code></pre><p>将生成的 UUID 填入配置文件。</p><hr><h2>六、启动服务与开放端口</h2><h3>启动服务</h3><pre><code>systemctl restart xray
systemctl enable xray</code></pre><h3>开放端口（以 ufw 为例）</h3><pre><code>ufw allow 10086</code></pre><p>如果使用云厂商（如阿里云、腾讯云），还需要在控制台安全组中放行端口。</p><hr><h2>七、配置 Clash 客户端</h2><p>在 Clash 的 <code>config.yaml</code> 中添加节点：</p><pre><code>proxies:
  - name: my-node
    type: vmess
    server: 你的服务器IP
    port: 10086
    uuid: 你的UUID
    alterId: 0
    cipher: auto</code></pre><p>保存后，在 Clash 中选择该节点即可使用。</p><hr><h2>八、可选优化</h2><p>基础配置完成后，可以进一步优化：</p><h3>1. 启用 TLS</h3><p>提高安全性，避免流量被识别。</p><h3>2. 使用 Reality / WebSocket</h3><p>提升隐蔽性与兼容性。</p><h3>3. 绑定域名</h3><p>通过域名访问服务，方便管理。</p><h3>4. 接入 CDN（如 Cloudflare）</h3><p>可提升稳定性，并隐藏真实 IP。</p><hr><h2>九、常见问题</h2><h3>1. 无法连接</h3><p>检查：</p><ul><li><p><br>服务是否启动<br></p></li><li><p><br>端口是否开放<br></p></li><li><p><br>UUID 是否正确<br></p></li></ul><hr><h3>2. 速度较慢</h3><p>可能原因：</p><ul><li><p><br>服务器带宽不足<br></p></li><li><p><br>线路质量差<br></p></li><li><p><br>协议不合适<br></p></li></ul><p>👉 建议更换服务器或协议</p><hr><h3>3. 查看日志</h3><pre><code>journalctl -u xray -f</code></pre><p>用于实时查看运行状态与错误信息。</p><hr><h2>十、总结</h2><p>整体流程可以概括为：</p><ol><li><p><br>购买云服务器<br></p></li><li><p><br>安装 Xray<br></p></li><li><p><br>配置并启动服务<br></p></li><li><p><br>开放端口<br></p></li><li><p><br>在 Clash 中添加节点</p></li></ol>', '', '网络技术 / 工具使用', '{Clash,Xray,"Proxy Setup",VPN,Networking,Linux}', 'PUBLISHED', '2026-04-09 03:12:00', '2026-04-09 03:11:26.423', '2026-04-14 03:38:44.319', '本文详细讲解如何使用 Xray 搭建代理节点并接入 Clash，包括服务器准备、安装配置、端口开放与常见问题排查，适合新手入门。', 'Clash 教程, Xray 搭建, vmess 配置, 代理服务器, Linux 代理, Clash 节点', 'Clash 搭建教程：从 0 配置 Xray 节点（完整指南）', 'Clash Setup Guide: Build an Xray Proxy Node from Scratch', 'This guide explains how to set up a proxy node for Clash using Xray, including server preparation, installation, configuration, port setup, and client integration, along with troubleshooting and optimization tips.', '<h1>Clash Setup Guide: Build an Xray Proxy Node from Scratch</h1><h2>1. Introduction</h2><p>Clash is a proxy client and <strong>does not provide proxy services by itself</strong>.</p><p>This means:</p><blockquote><p>👉 To use Clash, you must first have a working proxy node.</p></blockquote><p>The typical approach is:</p><ul><li><p>Deploy a proxy service (e.g., Xray) on a cloud server</p></li><li><p>Connect to it using Clash on your local device</p></li></ul><hr><h2>2. Architecture Overview</h2><p>The basic workflow looks like this:</p><pre><code>Local Device (Clash)
        ↓
Cloud Server (Xray)
        ↓
Target Website</code></pre><p>In short:</p><blockquote><p>👉 Clash = client<br><br>👉 Xray = proxy provider</p></blockquote><hr><h2>3. Server Preparation</h2><p>Before starting, prepare a cloud server.</p><h3>Requirements</h3><ul><li><p><br>OS: Ubuntu 20.04 / 22.04<br></p></li><li><p><br>CPU/RAM: at least 1 Core / 1 GB<br></p></li><li><p><br>Public IP required<br></p></li></ul><h3>Ports</h3><p>You need to open a port, for example:</p><ul><li><p><code>10086</code> (for testing)<br></p></li><li><p><code>443</code> (recommended for production)<br></p></li></ul><hr><h2>4. Install Xray</h2><p>Run the following command to install Xray:</p><pre><code>bash &lt;(curl -Ls https://raw.githubusercontent.com/XTLS/Xray-install/main/install-release.sh)</code></pre><p>After installation, the service will be registered automatically.</p><hr><h2>5. Configure Xray</h2><p>Edit the configuration file:</p><pre><code>nano /usr/local/etc/xray/config.json</code></pre><p>Example configuration:</p><pre><code>{
  "inbounds": [
    {
      "port": 10086,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "YOUR_UUID",
            "alterId": 0
          }
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom"
    }
  ]
}</code></pre><h3>Generate UUID</h3><p>Run:</p><pre><code>cat /proc/sys/kernel/random/uuid</code></pre><p>Replace <code>YOUR_UUID</code> with the generated value.</p><hr><h2>6. Start Service and Open Port</h2><h3>Start Xray</h3><pre><code>systemctl restart xray
systemctl enable xray</code></pre><h3>Open port (using ufw)</h3><pre><code>ufw allow 10086</code></pre><p>If you are using a cloud provider (AWS, Alibaba Cloud, etc.), make sure to allow the port in the security group as well.</p><hr><h2>7. Configure Clash</h2><p>Add the following to your <code>config.yaml</code>:</p><pre><code>proxies:
  - name: my-node
    type: vmess
    server: YOUR_SERVER_IP
    port: 10086
    uuid: YOUR_UUID
    alterId: 0
    cipher: auto</code></pre><p>Save the file and select the node in Clash.</p><hr><h2>8. Optional Optimizations</h2><p>After basic setup, you can improve security and performance:</p><h3>Enable TLS</h3><p>Encrypt traffic to avoid detection.</p><h3>Use Reality / WebSocket</h3><p>Improve stealth and compatibility.</p><h3>Bind a domain</h3><p>Use a domain instead of raw IP.</p><h3>Use CDN (e.g., Cloudflare)</h3><p>Enhance stability and hide your real IP.</p><hr><h2>9. Common Issues</h2><h3>Cannot connect</h3><p>Check:</p><ul><li><p><br>Xray service status<br></p></li><li><p><br>Port availability<br></p></li><li><p><br>UUID correctness<br></p></li></ul><hr><h3>Slow speed</h3><p>Possible reasons:</p><ul><li><p><br>Low server bandwidth<br></p></li><li><p><br>Poor network routing<br></p></li><li><p><br>Suboptimal protocol<br></p></li></ul><p>👉 Consider changing server location or protocol.</p><hr><h3>View logs</h3><pre><code>journalctl -u xray -f</code></pre><p>Use this to monitor runtime logs and debug issues.</p><hr><h2>10. Conclusion</h2><p>The overall process is straightforward:</p><ol><li><p><br>Buy a cloud server<br></p></li><li><p><br>Install Xray<br></p></li><li><p><br>Configure the service<br></p></li><li><p><br>Open the port<br></p></li><li><p><br>Add the node to Clash</p></li></ol>', 'Networking / Tools', 'Clash Setup Guide: Build an Xray Proxy Node Step-by-Step', 'Learn how to set up a proxy node for Clash using Xray. This step-by-step guide covers server setup, configuration, port management, and troubleshooting.', 'Clash setup, Xray tutorial, vmess config, proxy server, Linux proxy, Clash node');
INSERT INTO "public"."Post" VALUES ('cmnqyhvbw0006o8wemptza20d', 'Giscus Key 如何获取？repo-id 与 category-id 获取完整指南', 'giscus-key-getting-guide', '本文详细介绍如何获取 Giscus 评论系统所需的两个关键参数：data-repo-id 和 data-category-id。内容包含完整配置流程、常见问题排查、关键注意事项以及接入建议，适合用于个人博客或文档站评论系统的搭建。', '<p>如果你正在为博客接入 Giscus 评论系统，大概率会遇到两个关键参数：</p><ul><li><p><code>data-repo-id</code></p></li><li><p><code>data-category-id</code></p></li></ul><p>很多人在这里卡住，不清楚这些值从哪里获取，也不知道为什么有时候页面无法生成对应配置。</p><p>本文会完整介绍 Giscus Key 的获取方式，并说明整个配置流程中需要注意的事项，帮助你顺利完成评论系统接入。</p><h2>一、什么是 Giscus Key？</h2><p>Giscus 是一个基于 GitHub Discussions 的评论系统。它的核心思路是：把博客评论映射到 GitHub 仓库中的 Discussions 讨论里。</p><p>在接入 Giscus 时，最常见的两个配置项就是：</p><ul><li><p><code>data-repo-id</code></p></li><li><p><code>data-category-id</code></p></li></ul><p>这两个值通常被称为 Giscus Key。</p><p>它们分别表示：</p><ul><li><p><code>repo-id</code>：你的 GitHub 仓库内部唯一标识</p></li><li><p><code>category-id</code>：你所选择的 Discussions 分类内部唯一标识</p></li></ul><p>也就是说，Giscus 需要通过这两个参数来确认评论应该属于哪个仓库、哪个讨论分类。</p><h2>二、开始之前需要准备什么？</h2><p>在正式获取 Giscus Key 之前，需要先确保以下条件已经满足：</p><h3>1. 拥有一个 GitHub 公共仓库</h3><p>Giscus 依赖 GitHub Discussions，而 GitHub Discussions 需要绑定在仓库上使用。通常建议使用公开仓库来承载评论。</p><h3>2. 安装 Giscus App</h3><p>你需要先在 GitHub 上安装 Giscus 官方应用，并授权它访问对应仓库。</p><p>安装地址：</p><pre><code>https://github.com/apps/giscus</code></pre><p>安装时记得选择你要接入评论的目标仓库。</p><h3>3. 仓库已开启 Discussions</h3><p>进入仓库设置页后，确认已经启用 Discussions 功能。</p><p>路径通常是：</p><pre><code>Settings → Features → Discussions</code></pre><p>如果没有开启，Giscus 无法读取讨论分类，也就无法正常生成 category-id。</p><h3>4. 至少存在一个 Discussion 分类</h3><p>进入仓库的 Discussions 页面后，确认已经创建至少一个分类，例如：</p><ul><li><p><br>General<br></p></li><li><p><br>Announcements<br></p></li><li><p><br>Blog Comments<br></p></li></ul><p>如果没有分类，后续即使识别到仓库，也无法生成完整配置。</p><hr><h2>三、Giscus Key 的完整获取步骤</h2><h3>第一步：打开 Giscus 官方配置页面</h3><p>访问官方配置工具：</p><pre><code>https://giscus.app/zh-CN</code></pre><p>这是 Giscus 提供的可视化配置页面，所有关键参数都会在这里自动生成。</p><h3>第二步：输入仓库信息</h3><p>在仓库输入框中填写你的 GitHub 仓库地址，格式如下：</p><pre><code>username/repo</code></pre><p>例如：</p><pre><code>hezongcheng/blog</code></pre><p>这一项非常关键。只有仓库被正确识别后，页面才会继续加载后续配置。</p><h3>第三步：等待系统自动解析仓库</h3><p>仓库输入正确后，Giscus 页面会自动执行几件事：</p><ul><li><p><br>拉取仓库信息<br></p></li><li><p><br>读取 Discussions 设置<br></p></li><li><p><br>获取仓库内部 ID<br></p></li><li><p><br>展示可选分类<br></p></li></ul><p>如果一切正常，你会看到类似下面的配置值：</p><pre><code>data-repo-id="R_kgDOxxxx"</code></pre><p>这就是对应仓库的 <code>repo-id</code>。</p><h3>第四步：选择 Discussions 分类</h3><p>在页面中的分类下拉框里选择一个分类，例如：</p><ul><li><p><br>General<br></p></li><li><p><br>Announcements<br></p></li><li><p><br>Blog Comments<br></p></li></ul><p>当你选中某个分类后，页面会自动生成该分类对应的 ID，例如：</p><pre><code>data-category-id="DIC_kwDOxxxx"</code></pre><p>这就是 <code>category-id</code>。</p><h3>第五步：从自动生成的 script 中提取 Key</h3><p>继续向下滚动页面，在底部会看到一段完整的嵌入代码，例如：</p><pre><code>&lt;script src="https://giscus.app/client.js"
        data-repo="username/repo"
        data-repo-id="R_kgDOxxxx"
        data-category="General"
        data-category-id="DIC_kwDOxxxx"
        async&gt;
&lt;/script&gt;</code></pre><p>这里你真正需要的就是：</p><ul><li><p><code>data-repo-id</code><br></p></li><li><p><code>data-category-id</code><br></p></li></ul><p>这两个值复制出来后，就可以配置到你的博客评论组件中。</p><hr><h2>四、一个最重要的结论</h2><p>很多人会误以为 Giscus Key 需要手动查找、通过接口获取，或者去 GitHub 后台单独复制。</p><p>实际上并不是。</p><p>Giscus Key 的正确获取方式只有一种：</p><p><strong>在 Giscus 官方配置页面中选择仓库与分类，然后从自动生成的 script 代码里提取。</strong></p><p>也就是说：</p><ul><li><p><code>repo-id</code> 不是手动创建的<br></p></li><li><p><code>category-id</code> 不是手动填写的<br></p></li><li><p><br>它们都由系统自动生成<br></p></li></ul><hr><h2>五、为什么没有生成 Key？常见问题排查</h2><p>如果你已经输入了仓库，但仍然看不到 <code>repo-id</code> 或 <code>category-id</code>，通常可以从下面几个方向检查。</p><h3>1. 没有登录 GitHub</h3><p>Giscus 页面需要读取你的仓库权限信息。如果没有登录 GitHub，部分数据可能无法正常加载。</p><p>解决方法很简单：先登录 GitHub，再重新打开配置页面。</p><h3>2. 没有安装 Giscus App</h3><p>如果仓库没有授权给 Giscus，配置页通常无法正确读取仓库状态。</p><p>这时需要重新检查 Giscus App 是否已经安装，以及是否选择了目标仓库。</p><h3>3. 仓库没有开启 Discussions</h3><p>Giscus 依赖 GitHub Discussions 作为评论存储载体。如果仓库没有启用 Discussions，分类就无法被读取。</p><p>进入仓库设置，开启 Discussions 后再返回配置页刷新。</p><h3>4. 没有创建分类</h3><p>就算开启了 Discussions，如果没有任何分类，也依然无法生成 <code>category-id</code>。</p><p>建议至少创建一个专门用于评论的分类，例如：</p><pre><code>Blog Comments</code></pre><p>这样既清晰，也方便后续管理。</p><h3>5. 仓库不是 Public</h3><p>如果你的仓库不可公开访问，Giscus 可能无法正常工作。通常建议直接使用公共仓库作为评论承载仓库。</p><h3>6. 权限不足</h3><p>如果你不是仓库所有者，或者没有足够权限，也可能导致配置项无法生成。</p><p>你至少需要具备以下身份之一：</p><ul><li><p><br>仓库 Owner<br></p></li><li><p><br>仓库 Collaborator<br></p></li></ul><hr><h2>六、关于 repo-id 和 category-id 的本质</h2><p>从本质上看，这两个值只是 GitHub 内部资源的唯一标识。</p><p>你可以这样理解：</p><ul><li><p><code>repo-id</code> 对应某一个具体仓库<br></p></li><li><p><code>category-id</code> 对应这个仓库下某一个具体的 Discussions 分类<br></p></li></ul><p>Giscus 在运行时会依靠这两个 ID，把评论正确写入对应位置。</p><p>所以它们并不是“额外的密钥”，而是系统识别资源所需要的内部参数。</p><hr><h2>七、实际使用时的建议</h2><h3>1. 建议单独创建评论分类</h3><p>不要直接把博客评论放进默认分类里，最好新建一个专门分类，比如：</p><ul><li><p><br>Blog Comments<br></p></li><li><p><br>Site Comments<br></p></li></ul><p>这样后续维护更清晰，也不会和普通 Discussions 混在一起。</p><h3>2. 尽量保持文章路径稳定</h3><p>如果你在接入时使用路径映射，例如 <code>pathname</code>，那么文章链接变化可能会影响评论匹配。</p><p>因此建议在博客上线后尽量不要频繁修改文章 URL。</p><h3>3. 先在测试环境验证一遍</h3><p>接入完成后，建议先在本地或测试环境检查以下内容：</p><ul><li><p><br>评论框是否正常显示<br></p></li><li><p><br>是否可以登录 GitHub<br></p></li><li><p><br>是否能成功创建评论<br></p></li><li><p><br>评论是否写入对应 Discussions 分类<br></p></li></ul><p>确认无误后再部署到正式环境。</p><hr><h2>八、总结</h2><p>获取 Giscus Key 的流程并不复杂，关键只有一句话：</p><p><strong>在 Giscus 官方配置页面中输入仓库、选择分类，然后从自动生成的 script 中复制 </strong><code>data-repo-id</code><strong> 和 </strong><code>data-category-id</code><strong>。</strong></p><p>只要你提前完成以下准备：</p><ul><li><p><br>安装 Giscus App<br></p></li><li><p><br>开启 Discussions<br></p></li><li><p><br>创建分类<br></p></li><li><p><br>使用公开仓库<br></p></li></ul><p>通常就能顺利拿到所需的 Key。</p><p>如果你的页面没有生成对应参数，优先检查登录状态、仓库权限、Discussions 开启情况以及分类是否存在，基本都能定位到问题。</p>', '', '前端开发 / 博客搭建', '{Giscus,"GitHub Discussions","Blog Comments",Frontend,"Blog Setup",repo-id,category-id}', 'PUBLISHED', '2026-04-10 14:23:00', '2026-04-09 04:07:45.107', '2026-04-14 03:40:43.885', '本文详细介绍 Giscus 评论系统中 repo-id 与 category-id 的获取方法，包含完整配置流程、常见问题排查和实用建议，适合博客评论系统接入参考。', 'Giscus Key, repo-id, category-id, Giscus 配置, GitHub Discussions, 博客评论系统, Giscus 教程', 'Giscus Key 获取指南：repo-id 与 category-id 完整配置教程', 'How to Get Giscus Keys: Complete Guide to repo-id and category-id', 'This article explains how to obtain the required Giscus keys (data-repo-id and data-category-id) for integrating a comment system into your blog. It includes a complete setup guide, common troubleshooting steps, and practical tips.', '<p>When integrating Giscus as your blog comment system, you will encounter two essential parameters:</p><ul><li><p><code>data-repo-id</code></p></li><li><p><code>data-category-id</code></p></li></ul><p>Many developers get stuck at this step, unsure where these values come from or why they sometimes fail to generate.</p><p>This guide walks you through:</p><ul><li><p>What Giscus keys are</p></li><li><p>How to obtain them correctly</p></li><li><p>Why they might not appear</p></li><li><p>How to troubleshoot common issues</p></li></ul><hr><h2>1. What is Giscus?</h2><p>Giscus is a comment system built on top of <strong>GitHub Discussions</strong>.</p><p>In simple terms:</p><blockquote><p>👉 Your blog comments are stored as GitHub Discussions.</p></blockquote><h3>Benefits</h3><ul><li><p>No database required</p></li><li><p>Free to use</p></li><li><p>Markdown support</p></li><li><p>GitHub authentication</p></li><li><p>Ideal for technical blogs</p></li></ul><hr><h2>2. What are Giscus Keys?</h2><p>To use Giscus, you need two key parameters:</p><pre><code>data-repo-id
data-category-id</code></pre><h3>What they mean</h3><p>ParameterDescriptionrepo-idUnique internal ID of your GitHub repositorycategory-idUnique ID of a Discussions category</p><p>⚠️ Important:</p><ul><li><p><br>These values are <strong>not manually created</strong><br></p></li><li><p><br>They are <strong>automatically generated by GitHub</strong><br></p></li></ul><hr><h2>3. Prerequisites</h2><p>Before getting started, make sure you have:</p><ul><li><p><br>A <strong>public GitHub repository</strong><br></p></li><li><p><br>Installed the Giscus App<br><br>👉 https://github.com/apps/giscus<br></p></li><li><p><br>Granted access to your repository<br></p></li><li><p><br>Enabled <strong>Discussions</strong> in your repository<br></p></li></ul><p>To enable Discussions:</p><pre><code>Settings → Features → Discussions</code></pre><p>Also ensure that at least one category exists:</p><ul><li><p><br>General<br></p></li><li><p><br>Announcements<br></p></li><li><p><br>Blog Comments (recommended)<br></p></li></ul><hr><h2>4. How to Get Giscus Keys (Step-by-Step)</h2><h3>Step 1: Open the official configuration page</h3><p>👉 https://giscus.app/zh-CN</p><hr><h3>Step 2: Enter your repository</h3><p>Format:</p><pre><code>username/repo</code></pre><p>Example:</p><pre><code>hezongcheng/blog</code></pre><p>⚠️ If the repository cannot be resolved, keys will not be generated.</p><hr><h3>Step 3: Wait for automatic loading</h3><p>Once the repository is recognized, the page will:</p><ul><li><p><br>Fetch repository data<br></p></li><li><p><br>Load Discussions categories<br></p></li><li><p><br>Generate the repo-id<br></p></li></ul><p>You will see something like:</p><pre><code>data-repo-id="R_kgDOxxxx"</code></pre><hr><h3>Step 4: Select a Discussions category</h3><p>Choose a category such as:</p><ul><li><p><br>General<br></p></li><li><p><br>Announcements<br></p></li><li><p><br>Blog Comments<br></p></li></ul><p>Then Giscus will generate:</p><pre><code>data-category-id="DIC_kwDOxxxx"</code></pre><hr><h3>Step 5: Copy the generated script</h3><p>Scroll down to the bottom of the page, and you will see:</p><pre><code>&lt;script src="https://giscus.app/client.js"
        data-repo="username/repo"
        data-repo-id="R_kgDOxxxx"
        data-category="General"
        data-category-id="DIC_kwDOxxxx"
        async&gt;
&lt;/script&gt;</code></pre><p>👉 The values you need are:</p><ul><li><p><code>data-repo-id</code><br></p></li><li><p><code>data-category-id</code><br></p></li></ul><hr><h2>5. Key Takeaway</h2><p>Giscus keys are <strong>not manually obtained</strong>.</p><blockquote><p>👉 They are automatically generated on the Giscus configuration page.</p></blockquote><p>In short:</p><p><strong>Select repository → Select category → Copy from generated script</strong></p><hr><h2>6. Common Issues &amp; Troubleshooting</h2><p>If the keys are not generated, check the following:</p><h3>1. Not logged into GitHub</h3><p>Make sure you are logged in on the Giscus page.</p><hr><h3>2. Giscus App not installed</h3><p>Install and authorize the app for your repository.</p><hr><h3>3. Discussions not enabled</h3><pre><code>Settings → Features → Discussions</code></pre><hr><h3>4. No categories created</h3><pre><code>Discussions → Categories → New</code></pre><hr><h3>5. Repository is not public</h3><p>Giscus typically works with public repositories.</p><hr><h3>6. Insufficient permissions</h3><p>You must be:</p><ul><li><p><br>Repository owner<br><br>or<br></p></li><li><p><br>Collaborator<br></p></li></ul><hr><h2>7. Understanding the Internals</h2><p>At its core:</p><ul><li><p><br>Each page → one GitHub Discussion<br></p></li><li><p><br>Each comment → a reply<br></p></li><li><p><br>Data → stored in GitHub<br></p></li></ul><p>So:</p><blockquote><p>👉 Giscus is essentially a GitHub-powered comment system.</p></blockquote><hr><h2>8. Practical Tips</h2><h3>Use a dedicated category</h3><p>Create a category like:</p><pre><code>Blog Comments</code></pre><p>to keep comments separate from other discussions.</p><hr><h3>Keep URLs stable</h3><p>If you use mapping like <code>pathname</code>, changing URLs may break comment associations.</p><hr><h3>Test before deployment</h3><p>Verify:</p><ul><li><p><br>Comment box loads correctly<br></p></li><li><p><br>GitHub login works<br></p></li><li><p><br>Comments are posted successfully<br></p></li><li><p><br>Discussions are created properly<br></p></li></ul><hr><h2>9. Conclusion</h2><p>Getting Giscus keys is straightforward:</p><blockquote><p>👉 Select your repository and category on giscus.app, then copy <code>data-repo-id</code> and <code>data-category-id</code> from the generated script.</p></blockquote><p>As long as you:</p><ul><li><p><br>Install the Giscus App<br></p></li><li><p><br>Enable Discussions<br></p></li><li><p><br>Create at least one category<br></p></li><li><p><br>Use a public repository<br></p></li></ul><p>you should be able to generate the keys without issues.</p>', 'Frontend Development / Blog Setup', 'Giscus Key Guide: How to Get repo-id and category-id (Step-by-Step)', 'Learn how to obtain Giscus keys (repo-id and category-id) with this complete step-by-step guide. Includes setup instructions, troubleshooting tips, and best practices.', 'Giscus key, repo-id, category-id, Giscus setup, GitHub Discussions, blog comments system, Giscus tutorial');

-- ----------------------------
-- Table structure for User
-- ----------------------------
DROP TABLE IF EXISTS "public"."User";
CREATE TABLE "public"."User" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default",
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "passwordHash" text COLLATE "pg_catalog"."default" NOT NULL,
  "role" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'admin'::text,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of User
-- ----------------------------
INSERT INTO "public"."User" VALUES ('cmnqdekn90000hkjuudsb6485', 'Admin', '936451609@qq.com', '$2a$10$7blXKGNQ9znQJnEC.uU4K.XujLiwNbUwYicsEZctXeAJ0xR7VWJCW', 'admin', '2026-04-08 18:17:19.365', '2026-04-08 18:17:19.365');

-- ----------------------------
-- Table structure for VisitEvent
-- ----------------------------
DROP TABLE IF EXISTS "public"."VisitEvent";
CREATE TABLE "public"."VisitEvent" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "path" text COLLATE "pg_catalog"."default" NOT NULL,
  "visitorId" text COLLATE "pg_catalog"."default" NOT NULL,
  "sessionId" text COLLATE "pg_catalog"."default",
  "ip" text COLLATE "pg_catalog"."default",
  "country" text COLLATE "pg_catalog"."default",
  "city" text COLLATE "pg_catalog"."default",
  "referer" text COLLATE "pg_catalog"."default",
  "refererHost" text COLLATE "pg_catalog"."default",
  "userAgent" text COLLATE "pg_catalog"."default",
  "deviceType" text COLLATE "pg_catalog"."default",
  "browser" text COLLATE "pg_catalog"."default",
  "os" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of VisitEvent
-- ----------------------------
INSERT INTO "public"."VisitEvent" VALUES ('cmov54wex000050ddl8d2qb8p', '/', '13102d8c-3f89-4ceb-85ae-763b315b1a37', 'ed1f5675-e2d3-4a2e-a964-f37a4f14f23d', '::1', NULL, NULL, 'http://localhost:3000/', 'direct', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'desktop', 'Chrome', 'Windows', '2026-05-07 07:04:23.242');
INSERT INTO "public"."VisitEvent" VALUES ('cmov54wg8000150dduxh3heah', '/', '13102d8c-3f89-4ceb-85ae-763b315b1a37', 'ed1f5675-e2d3-4a2e-a964-f37a4f14f23d', '::1', NULL, NULL, 'http://localhost:3000/', 'direct', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'desktop', 'Chrome', 'Windows', '2026-05-07 07:04:23.242');
INSERT INTO "public"."VisitEvent" VALUES ('cmov55itf000250ddmcedluyz', '/', '13102d8c-3f89-4ceb-85ae-763b315b1a37', '7084fab7-3d25-41e6-9962-11e9b2e69945', '::1', NULL, NULL, 'http://localhost:3000/', 'direct', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'desktop', 'Chrome', 'Windows', '2026-05-07 07:04:53.16');
INSERT INTO "public"."VisitEvent" VALUES ('cmov55itm000350ddsbghrkcn', '/', '13102d8c-3f89-4ceb-85ae-763b315b1a37', '7084fab7-3d25-41e6-9962-11e9b2e69945', '::1', NULL, NULL, 'http://localhost:3000/', 'direct', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', 'desktop', 'Chrome', 'Windows', '2026-05-07 07:04:53.16');

-- ----------------------------
-- Primary Key structure for table _prisma_migrations
-- ----------------------------
ALTER TABLE "public"."_prisma_migrations" ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ContentBlock
-- ----------------------------
CREATE INDEX "ContentBlock_key_idx" ON "public"."ContentBlock" USING btree (
  "key" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "ContentBlock_key_locale_key" ON "public"."ContentBlock" USING btree (
  "key" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "locale" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ContentBlock
-- ----------------------------
ALTER TABLE "public"."ContentBlock" ADD CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table NavCategory
-- ----------------------------
CREATE UNIQUE INDEX "NavCategory_key_key" ON "public"."NavCategory" USING btree (
  "key" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "NavCategory_sortOrder_idx" ON "public"."NavCategory" USING btree (
  "sortOrder" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table NavCategory
-- ----------------------------
ALTER TABLE "public"."NavCategory" ADD CONSTRAINT "NavCategory_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table NavSite
-- ----------------------------
CREATE INDEX "NavSite_categoryId_sortOrder_idx" ON "public"."NavSite" USING btree (
  "categoryId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "sortOrder" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "NavSite_url_idx" ON "public"."NavSite" USING btree (
  "url" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table NavSite
-- ----------------------------
ALTER TABLE "public"."NavSite" ADD CONSTRAINT "NavSite_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Post
-- ----------------------------
CREATE INDEX "Post_category_idx" ON "public"."Post" USING btree (
  "category" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "Post_slug_idx" ON "public"."Post" USING btree (
  "slug" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "Post_slug_key" ON "public"."Post" USING btree (
  "slug" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "Post_status_publishedAt_idx" ON "public"."Post" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST,
  "publishedAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Post
-- ----------------------------
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table User
-- ----------------------------
CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table User
-- ----------------------------
ALTER TABLE "public"."User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table VisitEvent
-- ----------------------------
CREATE INDEX "VisitEvent_ip_createdAt_idx" ON "public"."VisitEvent" USING btree (
  "ip" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "VisitEvent_path_createdAt_idx" ON "public"."VisitEvent" USING btree (
  "path" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "VisitEvent_refererHost_createdAt_idx" ON "public"."VisitEvent" USING btree (
  "refererHost" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "VisitEvent_visitorId_createdAt_idx" ON "public"."VisitEvent" USING btree (
  "visitorId" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table VisitEvent
-- ----------------------------
ALTER TABLE "public"."VisitEvent" ADD CONSTRAINT "VisitEvent_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table NavSite
-- ----------------------------
ALTER TABLE "public"."NavSite" ADD CONSTRAINT "NavSite_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."NavCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
