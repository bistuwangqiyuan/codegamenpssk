# GameCode Lab - 游戏化HTML5编程教育平台

GameCode Lab 是一个基于浏览器的游戏化在线编程学习平台，让零基础用户通过任务闯关、AI实时反馈、积分与成就机制，系统掌握 HTML5、CSS、JavaScript 等 Web 基础开发技能。

## 🎯 核心特性

- **游客试用**: 无需注册，1个月免费试用全部功能
- **闯关学习**: 5大Level（HTML5→CSS→JS→DOM→实战），循序渐进
- **AI助教**: DeepSeek驱动的智能编程指导和错误诊断
- **代码沙盒**: 浏览器内三栏编辑器+实时预览
- **游戏化**: 等级、XP、金币、成就、排行榜
- **社区分享**: 作品展示、点赞、评论、每日精选
- **教师工具**: 自定义课程、关卡设计、学生进度追踪

## 🛠️ 技术栈

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI Engine**: DeepSeek (主要) + GLM/Moonshot/Tongyi (降级)
- **Code Editor**: CodeMirror 6
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Deployment**: Netlify

## 📦 环境配置

### 前置要求

- Node.js >= 18.0.0
- npm 或 pnpm
- Supabase账号
- AI API密钥（DeepSeek等）

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/your-username/gamecode-lab.git
cd gamecode-lab
```

2. **安装依赖**
```bash
npm install
# 或
pnpm install
```

3. **配置环境变量**

复制 `.env.example` 为 `.env.local` 并填写：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key

# AI API密钥
DEEPSEEK_API_KEY=你的_deepseek_key
GLM_API_KEY=你的_glm_key
# ... 其他AI密钥
```

4. **初始化Supabase数据库**

参考 `.specify/features/*/plans/data-model.md` 中的SQL脚本，在Supabase控制台执行：
- 创建12个数据表
- 配置RLS策略
- 插入初始课程和成就数据

5. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3000

## 🚀 部署到Netlify

### 自动部署（推荐）

1. 连接GitHub仓库到Netlify
2. 配置环境变量（与 `.env.local` 相同）
3. 部署命令: `npm run build`
4. 发布目录: `.next`

### 手动部署

```bash
# 构建
npm run build

# 使用Netlify CLI部署
netlify deploy --prod
```

## 📚 项目结构

```
gamecode-lab/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主页
│   ├── dashboard/         # 学习仪表板
│   ├── learn/             # 学习页面
│   ├── community/         # 社区作品
│   └── api/               # API路由
├── components/            # React组件
│   ├── ui/               # shadcn/ui组件
│   ├── CodeEditor.tsx    # 代码编辑器
│   ├── AIChat.tsx        # AI助教
│   └── ...
├── lib/                   # 工具函数
│   ├── supabase.ts       # Supabase客户端
│   └── utils.ts          # 通用工具
├── stores/               # Zustand状态管理
│   ├── authStore.ts      # 认证状态
│   ├── editorStore.ts    # 编辑器状态
│   └── uiStore.ts        # UI状态
├── types/                # TypeScript类型定义
├── styles/               # 全局样式
├── public/               # 静态资源
└── .specify/             # 规格文档
    └── features/         # 功能规格
```

## 🧪 测试

```bash
# 类型检查
npm run type-check

# Lint检查
npm run lint

# 运行测试
npm test
```

## 📖 文档

完整的项目文档位于 `.specify/features/` 目录：

- **spec.md**: 功能规格说明
- **plans/implementation-plan.md**: 实施计划（14周，9个Phase）
- **plans/data-model.md**: 数据库设计（12个表）
- **plans/contracts/**: API接口规格
- **tasks.md**: 任务分解（147个任务）

## 🎮 核心功能

### 1. 游客试用体验（MVP）
- 自动创建30天临时账号
- 完整访问所有课程和关卡
- 代码编辑器+实时预览
- AI助教反馈
- 成就系统

### 2. 学生闯关学习
- 5个Level，每个10-20个关卡
- XP和金币系统
- 学习统计和曲线图
- 成就墙

### 3. AI助教辅导
- 代码讲解
- 错误诊断
- 聊天式指导
- 个性化建议

### 4. 社区作品分享
- 作品展示墙
- 点赞、收藏、评论
- 每日精选
- 个人主页

### 5. 教师课程管理
- 创建自定义课程
- 关卡编辑器
- 学生进度追踪
- 数据分析

## 🔐 安全

- Supabase Row Level Security (RLS)
- iframe沙盒代码隔离
- API密钥环境变量存储
- JWT认证
- API调用频率限制（100次/小时）
- XSS防护

## 🌐 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 许可证

MIT License

## 👥 贡献

欢迎贡献！请查看贡献指南。

## 📧 联系

- 项目主页: https://gamecode-lab.netlify.app
- 问题反馈: GitHub Issues
- 邮箱: support@gamecode-lab.com

---

**GameCode Lab** - 让编程学习像游戏一样有趣！🎮💻
