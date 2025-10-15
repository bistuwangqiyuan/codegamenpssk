# GameCode Lab 部署指南

## 前置准备

### 1. Supabase配置

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 创建新项目或使用现有项目
3. 获取以下信息：
   - Project URL: `https://你的项目.supabase.co`
   - Anon Key: 在 Settings > API 中找到
   - Service Role Key: 在 Settings > API 中找到

### 2. 执行数据库迁移

在Supabase SQL Editor中依次执行：

```bash
# 1. 执行架构迁移
supabase/migrations/001_initial_schema.sql

# 2. 执行数据种子
supabase/migrations/002_seed_initial_data.sql
```

或使用Supabase CLI：
```bash
supabase db push
```

### 3. 配置AI API密钥

至少需要配置一个AI服务商的API密钥：
- DeepSeek (推荐)
- GLM
- Moonshot
- 其他备用服务商

## 本地开发部署

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写：

```env
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key

DEEPSEEK_API_KEY=你的_deepseek_key
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## Netlify生产部署

### 方式一：Git自动部署（推荐）

1. **连接GitHub仓库**
   - 登录 [Netlify](https://app.netlify.com)
   - 点击 "Add new site" > "Import an existing project"
   - 选择GitHub并授权
   - 选择本仓库

2. **配置构建设置**
   - Build command: `pnpm build`
   - Publish directory: `.next`
   - Node version: 18

3. **配置环境变量**
   在Netlify Dashboard > Site settings > Environment variables 中添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DEEPSEEK_API_KEY`
   - 其他AI API密钥

4. **部署**
   - 点击 "Deploy site"
   - 等待构建完成（约2-3分钟）
   - 获取生产URL

### 方式二：CLI手动部署

1. **安装Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **登录**
```bash
netlify login
```

3. **构建项目**
```bash
pnpm build
```

4. **部署（分两步避免超时）**

**步骤1: 无构建部署**
```bash
netlify deploy --dir=.next --prod
```

5. **验证部署**
```bash
netlify open
```

## 环境变量管理

### 必需环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase项目URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase匿名密钥 | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase服务密钥 | `eyJhbGc...` |

### 可选环境变量（AI服务）

| 变量名 | 说明 |
|--------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API密钥 |
| `GLM_API_KEY` | 智谱GLM API密钥 |
| `MOONSHOT_API_KEY` | Moonshot API密钥 |
| `TONGYI_API_KEY` | 通义千问 API密钥 |

## 部署验证

部署完成后验证以下功能：

### 1. 基础功能
- [ ] 首页加载正常
- [ ] 游客自动登录
- [ ] Dashboard显示正确

### 2. 核心功能
- [ ] 代码编辑器可用
- [ ] 实时预览正常
- [ ] AI助教响应

### 3. 数据库
- [ ] 课程列表加载
- [ ] 任务数据显示
- [ ] 用户进度保存

### 4. 性能
- [ ] 首屏加载 < 3秒
- [ ] Lighthouse分数 > 80
- [ ] 移动端响应正常

## 常见问题

### 1. 构建失败

**问题**: `Module not found: Can't resolve '@/...'`

**解决**: 检查 `tsconfig.json` 中的路径配置：
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 2. Supabase连接失败

**问题**: `Invalid API key`

**解决**:
1. 确认环境变量配置正确
2. 检查Supabase项目是否暂停
3. 验证API密钥是否过期

### 3. AI服务不可用

**问题**: AI助教无响应

**解决**:
1. 检查至少一个AI API密钥已配置
2. 验证API密钥有效性
3. 查看Netlify函数日志

### 4. 部署超时

**问题**: `Error: Command execution timed out`

**解决**: 分两步部署
```bash
# 先构建
pnpm build

# 再无构建部署
netlify deploy --dir=.next --prod
```

## 监控和维护

### 日志查看

**Netlify日志**:
```bash
netlify logs --prod
```

**Supabase日志**:
- 登录Supabase Dashboard
- 查看 Logs & Metrics

### 性能监控

推荐使用：
- Vercel Analytics
- Google Analytics
- Sentry (错误追踪)

### 数据库维护

定期任务：
1. 清理过期游客账号（30天后）
2. 备份数据库
3. 优化查询性能

```sql
-- 清理过期游客（在Supabase SQL Editor中执行）
DELETE FROM users 
WHERE is_trial = true 
AND trial_ends_at < NOW() - INTERVAL '30 days';
```

## 回滚策略

如果部署出现问题：

### Netlify回滚
1. 进入 Netlify Dashboard
2. 点击 "Deploys"
3. 选择之前的成功部署
4. 点击 "Publish deploy"

### 数据库回滚
1. 使用Supabase快照恢复
2. 或重新执行迁移脚本

## 安全建议

1. **环境变量**: 永远不要提交 `.env.local` 到Git
2. **API密钥**: 定期轮换
3. **RLS策略**: 确保Supabase RLS已启用
4. **CORS**: 配置正确的域名白名单
5. **Rate Limiting**: 在Netlify中配置API速率限制

## 支持

如遇问题请查看：
- [Next.js文档](https://nextjs.org/docs)
- [Supabase文档](https://supabase.com/docs)
- [Netlify文档](https://docs.netlify.com)

---

**GameCode Lab** - 部署版本 V1.0

