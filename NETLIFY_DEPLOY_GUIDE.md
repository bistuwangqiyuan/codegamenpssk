# GameCode Lab - Netlify 部署指南

## 🚀 快速部署（推荐）

### 方式一：通过Netlify Web UI（最稳定）

#### 步骤1：登录Netlify
访问 https://app.netlify.com 并登录

#### 步骤2：连接GitHub仓库
1. 点击 "Add new site" > "Import an existing project"
2. 选择 "Deploy with GitHub"
3. 授权Netlify访问你的GitHub账户
4. 选择仓库：`bistuwangqiyuan/codegamenpssk`
5. 选择分支：`main`

#### 步骤3：配置构建设置
```
Build command: npm run build
Publish directory: .next
Branch to deploy: main
```

#### 步骤4：配置环境变量
在 Site settings > Build & deploy > Environment 中添加：

**必需环境变量**：
```
NEXT_PUBLIC_SUPABASE_URL=https://zzyueuweeoakopuuwfau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eXVldXdlZW9ha29wdXV3ZmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODEzMDEsImV4cCI6MjA1OTk1NzMwMX0.y8V3EXK9QVd3txSWdE3gZrSs96Ao0nvpnd0ntZw_dQ4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eXVldXdlZW9ha29wdXV3ZmF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDM4MTMwMSwiZXhwIjoyMDU5OTU3MzAxfQ.5OwKY1I5w8lG1NWyVNAbEgdS3tARyHHwbAuvU0H_Tdc
```

**AI API密钥（可选，建议至少配置一个）**：
```
DEEPSEEK_API_KEY=sk-6d326d3e272045868de050be8ddd698f
GLM_API_KEY=1cf8de9e31b94d6ba77786f706de2ce7.uQB9GXSVrj8ykogF
MOONSHOT_API_KEY=sk-M2vL6A8EY9QhhdzdUodSi6jRZHp01fOFxhETQu3T1zTjuHyp
```

#### 步骤5：部署
1. 点击 "Deploy site"
2. 等待构建完成（约2-3分钟）
3. 获取生产URL（格式：`https://your-site.netlify.app`）

---

### 方式二：命令行部署（需网络连接）

当网络连接恢复后，执行：

```bash
# 1. 推送到GitHub
git push origin main

# 2. Netlify会自动检测并部署
```

或者手动触发：

```bash
# 1. 确保已构建
$env:NEXT_PUBLIC_SUPABASE_URL="https://zzyueuweeoakopuuwfau.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="你的_anon_key"
$env:SUPABASE_SERVICE_ROLE_KEY="你的_service_key"
pnpm run build

# 2. 部署
netlify deploy --prod --dir=.next
```

---

## 📋 部署前检查清单

### ✅ 代码准备
- [x] 构建成功
- [x] 所有核心文件已创建
- [x] netlify.toml 配置完成
- [x] package.json 依赖完整

### ✅ Supabase准备
- [ ] 执行数据库迁移
  ```sql
  -- 在Supabase SQL Editor中执行：
  supabase/migrations/001_initial_schema.sql
  supabase/migrations/002_seed_initial_data.sql
  ```

### ✅ 环境变量准备
- [ ] Supabase URL 和密钥
- [ ] AI API密钥（至少一个）

---

## 🔧 部署后配置

### 1. 配置自定义域名（可选）
在 Site settings > Domain management 中：
1. 添加自定义域名
2. 配置DNS记录
3. 启用HTTPS

### 2. 配置Supabase Auth Redirect
在Supabase Dashboard > Authentication > URL Configuration 中添加：
```
Site URL: https://your-site.netlify.app
Redirect URLs: https://your-site.netlify.app/**
```

### 3. 验证部署
访问以下页面确认功能正常：
- 首页：`/`
- 仪表板：`/dashboard`
- 学习页面：`/learn`
- 社区：`/community`

---

## ⚠️ 常见问题

### 问题1：构建失败 - 环境变量缺失
**解决**：确保在Netlify中配置了所有必需的环境变量

### 问题2：Supabase连接失败
**解决**：
1. 检查Supabase项目是否active
2. 确认API密钥正确
3. 检查数据库是否已初始化

### 问题3：AI功能不可用
**解决**：至少配置一个AI API密钥（DeepSeek/GLM/Moonshot）

### 问题4：页面404
**解决**：
1. 确认 `netlify.toml` 中的重定向规则
2. 检查 `.next` 目录是否正确生成

---

## 📊 部署状态

### 当前项目信息
- **项目名称**：GameCode Lab
- **仓库**：https://github.com/bistuwangqiyuan/codegamenpssk
- **分支**：main
- **Netlify站点ID**：已连接（通过CLI link）
- **域名**：https://afree.icu

### 已完成
- ✅ 代码完成并提交
- ✅ 构建验证通过
- ✅ Netlify配置完成
- ✅ 项目已link到Netlify

### 待完成
- ⏳ 推送代码到GitHub（需要网络连接）
- ⏳ 配置Netlify环境变量
- ⏳ 执行Supabase数据库迁移
- ⏳ 验证部署

---

## 🎯 下一步操作

### 立即可做
1. **通过Web UI部署**（推荐）
   - 访问 https://app.netlify.com
   - 按照上述步骤1-5操作
   
2. **配置环境变量**
   - 在Netlify UI中添加所有必需的环境变量
   
3. **初始化Supabase数据库**
   - 登录 Supabase Dashboard
   - 执行两个迁移SQL文件

### 稍后可做（当网络恢复时）
1. 推送代码：`git push origin main`
2. 让Netlify自动部署

---

## 📞 支持

- **Netlify文档**：https://docs.netlify.com
- **Supabase文档**：https://supabase.com/docs
- **项目README**：查看 `README.md`
- **部署文档**：查看 `DEPLOYMENT.md`

---

**GameCode Lab** - 让编程学习像游戏一样有趣！🎮💻

*部署指南生成于: 2025-01-15*

