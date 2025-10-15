# Implementation Plan: GameCode Lab - 游戏化HTML5编程教育平台

**Created**: 2025-10-15  
**Status**: In Progress  
**Branch**: feature/游戏化-html5-编程教育在线网站平台-基于-cursor-deepseek-supabase-nex  
**Feature Spec**: [../spec.md](../spec.md)

---

## 1. Technical Context

### 1.1 Technology Stack

- **Frontend Framework**: Next.js 14 + TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Code Editor**: CodeMirror 6 或 Monaco Editor
- **Backend Service**: Supabase (PostgreSQL + Auth + Edge Functions + Storage)
- **AI Services**: 
  - Primary: DeepSeek API
  - Fallback: GLM API, Moonshot API, Tongyi API, 其他备用
- **Deployment**: Netlify
- **Animation**: Framer Motion
- **Real-time Updates**: Supabase Realtime

### 1.2 Architecture Pattern

- **架构模式**: JAMstack + Serverless
  - Next.js SSG/SSR 混合模式，静态页面 + 动态API路由
  - Supabase Edge Functions 处理AI调用和复杂业务逻辑
  - 客户端代码沙盒（iframe sandbox）隔离执行用户代码
  - 实时数据同步通过Supabase Realtime

- **数据流**:
  ```
  用户 → Next.js 前端 → Supabase Client SDK → Supabase (Auth/DB/Storage)
                      → Edge Functions → AI APIs (DeepSeek/GLM等)
  ```

### 1.3 Key Integration Points

- **Supabase Authentication**: 用户注册/登录、游客临时账号生成、JWT会话管理
- **Supabase Database**: PostgreSQL存储用户、课程、关卡、作品、成就等数据
- **Supabase Storage**: 存储用户头像、作品缩略图、教学资源
- **Supabase Edge Functions**: 
  - AI API调用代理（隐藏API密钥、实现降级策略）
  - 代码执行安全检测
  - 成就解锁触发器
- **DeepSeek AI API**: 代码讲解、错误诊断、智能对话、出题生成
- **备用AI APIs**: GLM、Moonshot、Tongyi等，实现自动降级
- **Netlify部署**: 静态资源托管、CDN加速、环境变量管理

### 1.4 Unknowns & Research Needs

- [x] AI API降级策略：**已决策 - 自动切换到备用AI服务商**
- [x] 游客试用期数据迁移机制：**已决策 - 提前7天温和提醒+自动迁移**
- [x] 代码沙盒安全隔离：**已决策 - iframe sandbox with restricted permissions**

---

## 2. Constitution Check

### 2.1 Alignment Verification

#### Code Style & Standards
- [x] 使用TypeScript确保类型安全
- [x] ES6+语法，模块化组织代码
- [x] camelCase命名变量和函数
- [x] 组件化设计，单一职责原则
- [x] 代码注释（关键步骤和复杂逻辑）

#### Security & Privacy
- [x] Supabase RLS (Row Level Security) 保护数据访问
- [x] JWT认证，安全的会话管理
- [x] 代码沙盒隔离，防止XSS和恶意脚本
- [x] API密钥存储在环境变量，不提交到代码库
- [x] 用户输入验证和清理
- [x] AI API调用频率限制（防止滥用）

#### Performance & Scalability
- [x] Next.js SSG预生成静态页面，加载快速
- [x] Supabase连接池，支持高并发
- [x] CDN加速静态资源
- [x] 代码编辑器懒加载
- [x] AI响应缓存常见问题
- [x] 数据库索引优化查询性能

#### Testing & Quality
- [x] 单元测试（关键函数和组件）
- [x] 集成测试（API端点和数据流）
- [x] E2E测试（关键用户流程）
- [x] 代码质量检查（ESLint + Prettier）
- [x] 性能监控（Vercel Analytics或类似）

### 2.2 Gate Evaluation

**Gate 1**: 数据模型完整性
- Status: ✅ PASS
- Justification: spec.md第8节定义了10个核心实体及关系，涵盖用户、课程、作品、成就、AI对话等全部功能域

**Gate 2**: AI服务可用性与成本控制
- Status: ✅ PASS  
- Justification: 
  - 提供了7个AI API密钥（DeepSeek, GLM, Moonshot, Tongyi等）
  - 实现降级策略确保服务连续性
  - 每用户每小时100次调用限制控制成本

**Gate 3**: 安全与隔离
- Status: ✅ PASS
- Justification: 
  - iframe sandbox提供基础隔离，适合教育场景
  - Supabase RLS保护数据安全
  - Edge Functions隐藏API密钥

---

## 3. Phase 0: Research & Decisions

### 3.1 Research Tasks

#### Research Task 1: AI API降级策略
**Question**: 当DeepSeek API不可用时，如何保证AI助教功能持续可用？

**Decision**: 实现多层AI服务降级机制

**Rationale**: 
- 用户已提供7个AI API密钥，可实现多供应商冗余
- 教育平台对AI响应的容错性要求高，降级优于完全失败
- 不同AI服务虽然有差异，但基础代码讲解能力相近

**Implementation Strategy**:
1. **优先级列表**: DeepSeek → GLM → Moonshot → Tongyi → 其他
2. **健康检查**: 每5分钟ping各AI服务，标记可用状态
3. **自动切换**: 主服务失败时，自动尝试下一个可用服务
4. **缓存机制**: 缓存常见问题（如"什么是HTML标签"）的AI回复，缓存时间7天
5. **降级提示**: 使用备用服务时，向用户显示轻量级提示（不影响使用）

**Alternatives Considered**:
- ❌ 仅显示错误提示：用户体验差，可能导致流失
- ❌ 规则引擎降级：开发成本高，功能有限

**References**:
- [Supabase Edge Functions文档](https://supabase.com/docs/guides/functions)
- [AI API多供应商架构最佳实践](https://platform.openai.com/docs/guides/production-best-practices)

#### Research Task 2: 游客试用期数据迁移机制
**Question**: 如何平衡游客体验和注册转化率？

**Decision**: 提前7天温和提醒 + 自动数据迁移

**Rationale**:
- 给用户充足时间考虑，降低压迫感
- 自动迁移数据保证无缝体验，提高转化意愿
- 温和提醒而非强制，符合用户友好原则

**Implementation Strategy**:
1. **试用期跟踪**: 游客账号创建时记录`trial_end_date`（30天后）
2. **提醒机制**:
   - 剩余7天：仪表板顶部横幅提示
   - 剩余3天：登录时弹窗提醒（可关闭）
   - 剩余1天：登录时强提示
3. **期满处理**:
   - 试用期结束后，自动切换为只读模式
   - 可查看历史数据和作品，但不能新增或编辑
   - 任何操作都引导到注册页面
4. **数据迁移**:
   - 注册时自动关联临时账号数据
   - 升级`user_type`从`guest`到`student`
   - 清除`trial_end_date`
   - 保留所有进度、作品、成就

**Alternatives Considered**:
- ❌ 强制注册：可能流失犹豫用户
- ❌ 只读7天后删除：用户可能损失数据，体验不佳

**References**:
- [SaaS试用期最佳实践](https://www.baremetrics.com/academy/saas-free-trial-best-practices)
- [Supabase Auth文档](https://supabase.com/docs/guides/auth)

#### Research Task 3: 代码沙盒安全隔离
**Question**: 如何在功能性和安全性之间找到平衡？

**Decision**: iframe sandbox with comprehensive restrictions

**Rationale**:
- HTML/CSS/JS学习需要DOM操作，Web Worker不适用
- iframe sandbox是浏览器原生方案，性能好，开发简单
- 教育场景风险相对可控，用户恶意攻击动机低
- 适当限制可满足95%的学习需求

**Implementation Strategy**:
1. **iframe配置**:
   ```html
   <iframe 
     sandbox="allow-scripts allow-same-origin"
     csp="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline';"
     srcdoc="用户代码"
   />
   ```
2. **限制项**:
   - ❌ 不允许弹窗 (`allow-popups`)
   - ❌ 不允许跳转 (`allow-top-navigation`)
   - ❌ 不允许表单提交 (`allow-forms`)
   - ❌ 不允许访问外部资源（CSP限制）
   - ✅ 允许脚本执行（`allow-scripts`，学习必需）
   - ✅ 允许same-origin（便于DOM操作）
3. **代码检测**:
   - Supabase Edge Function预处理用户代码
   - 检测无限循环（`while(true)`）
   - 检测危险函数调用（`eval`, `Function`, `document.write`）
   - 检测过大代码（>1MB）
   - 检测敏感词和恶意脚本模式
4. **资源限制**:
   - 代码执行超时：5秒
   - 内存限制：浏览器自动管理
   - 错误捕获：捕获运行时错误并友好显示

**Alternatives Considered**:
- ❌ Web Worker：无法操作DOM，不适合HTML/CSS学习
- ❌ 第三方沙盒服务：增加依赖和成本，overkill

**References**:
- [MDN iframe sandbox文档](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CodePen安全策略分析](https://blog.codepen.io/documentation/security/)

### 3.2 Technology Choices

#### Choice 1: 代码编辑器选择 - CodeMirror 6
- **Selected**: CodeMirror 6
- **Rationale**: 
  - 轻量级（~80KB），性能优秀
  - 高度可定制，支持自定义语法高亮和扩展
  - 原生TypeScript支持
  - 活跃维护，社区支持好
- **Trade-offs**: 
  - ✅ 性能和体积优于Monaco Editor
  - ❌ 功能不如Monaco丰富（但教育场景足够）

#### Choice 2: 状态管理 - Zustand
- **Selected**: Zustand
- **Rationale**:
  - 极简API，学习成本低
  - 无需Provider包裹，使用灵活
  - TypeScript支持完善
  - 体积小（~1KB），性能好
- **Trade-offs**:
  - ✅ 比Redux简单，比Context性能好
  - ❌ 生态不如Redux丰富（但内置功能足够）

#### Choice 3: UI组件库 - shadcn/ui + Tailwind CSS
- **Selected**: shadcn/ui + Tailwind CSS
- **Rationale**:
  - shadcn/ui组件可复制到项目，完全可控
  - Tailwind CSS utility-first，快速开发
  - 游戏化UI需要高度定制，shadcn灵活性高
  - 与Next.js集成完美
- **Trade-offs**:
  - ✅ 灵活性和定制性高
  - ❌ 需要手动管理组件代码（但可控性强）

### 3.3 Integration Patterns

#### Integration 1: Supabase Authentication
- **Pattern**: Supabase Auth SDK + JWT
- **Authentication**:
  - 邮箱密码注册/登录
  - OAuth第三方登录（Google、GitHub）
  - 游客临时账号：生成随机邮箱（`guest_[uuid]@gamecode.internal`）+ 随机密码
- **Session Management**: 
  - JWT存储在localStorage
  - Supabase Client自动刷新token
  - 全局Auth状态管理（Zustand）
- **Error Handling**:
  - 注册失败：显示友好错误（邮箱已存在、密码强度不足）
  - 登录失败：3次失败后启用验证码
  - 会话过期：自动刷新或引导重新登录
- **Rate Limits**: Supabase默认限制，无需额外配置

#### Integration 2: AI API调用
- **Pattern**: Supabase Edge Function作为代理
- **Authentication**: Edge Function Header中包含API密钥（环境变量）
- **Error Handling**:
  - 主AI服务失败 → 自动切换备用服务
  - 所有服务失败 → 返回缓存回复或友好错误
  - 超时处理：10秒超时，返回降级响应
- **Rate Limits**: 
  - 用户级限制：每小时100次（Supabase RLS + Edge Function计数）
  - API级限制：遵循各AI服务商限制
  - 超限处理：返回错误提示和重试时间

#### Integration 3: Supabase Realtime (可选功能)
- **Pattern**: WebSocket订阅
- **用途**: 
  - 实时排行榜更新
  - 社区作品新增通知
  - 多设备同步（用户在多设备登录时）
- **Authentication**: 自动使用用户JWT
- **Error Handling**:
  - 连接断开：自动重连（指数退避）
  - 订阅失败：降级为轮询（每30秒）
- **Rate Limits**: Supabase默认，每用户最多10个订阅

---

## 4. Phase 1: Design Artifacts

### 4.1 Data Model
[完整数据模型详见 data-model.md]

**Key Entities**:
- **User**: 用户账号（游客/学生/教师/管理员）
- **Course**: 课程（5大Level）
- **Task**: 任务关卡
- **UserTaskProgress**: 用户关卡进度
- **Work**: 用户作品
- **Achievement**: 成就徽章
- **AIConversation**: AI对话历史
- **Comment**: 社区评论
- **Leaderboard**: 排行榜数据

**Critical Relationships**:
- User 1:N UserTaskProgress 1:1 Task
- User 1:N Work N:1 Task (optional)
- User N:M Achievement (through UserAchievement)
- User 1:N AIConversation
- Work 1:N Comment N:1 User

**Full details**: See [data-model.md](./data-model.md)

### 4.2 API Contracts
[完整API合约详见 contracts/ 目录]

**Endpoints Overview**:

**Authentication**:
- `POST /api/auth/guest` - 创建游客账号
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/upgrade-guest` - 游客升级为正式用户

**User & Progress**:
- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息
- `GET /api/user/progress` - 获取学习进度
- `GET /api/user/achievements` - 获取成就列表

**Courses & Tasks**:
- `GET /api/courses` - 获取课程列表
- `GET /api/courses/:id/tasks` - 获取关卡列表
- `GET /api/tasks/:id` - 获取关卡详情
- `POST /api/tasks/:id/submit` - 提交关卡代码
- `GET /api/tasks/:id/hint` - 获取AI提示

**AI Assistant**:
- `POST /api/ai/explain` - AI代码讲解
- `POST /api/ai/check` - AI代码检查
- `POST /api/ai/chat` - AI对话

**Works & Community**:
- `GET /api/works` - 获取作品列表
- `POST /api/works` - 创建作品
- `GET /api/works/:id` - 获取作品详情
- `POST /api/works/:id/like` - 点赞作品
- `POST /api/works/:id/comments` - 评论作品

**Full details**: See [contracts/](./contracts/) directory

### 4.3 Component Architecture

#### Frontend Components

**页面组件 (Pages)**:
- `/` - 主页 (静态SSG)
- `/dashboard` - 学习仪表板 (SSR with auth)
- `/learn/[courseId]` - 课程页面
- `/learn/task/[taskId]` - 关卡学习页面 (核心)
- `/community` - 社区作品展示
- `/work/[workId]` - 作品详情
- `/profile` - 个人主页
- `/profile/[userId]` - 其他用户主页

**布局组件 (Layouts)**:
- `Header` - 全局头部导航
- `Footer` - 全局底部
- `Sidebar` - 侧边栏（仪表板用）
- `AuthLayout` - 认证页面布局

**功能组件 (Features)**:
- `CodeEditor` - 三栏代码编辑器
  - `HTMLEditor`, `CSSEditor`, `JSEditor`
  - `CodePreview` - iframe沙盒预览
- `AIAssistant` - AI助教对话界面
- `TaskPanel` - 任务说明面板
- `ProgressTracker` - 进度追踪组件
- `AchievementBadge` - 成就徽章展示
- `Leaderboard` - 排行榜
- `WorkCard` - 作品卡片
- `CommentSection` - 评论区

**UI组件 (shadcn/ui based)**:
- `Button`, `Input`, `Card`, `Dialog`, `Tabs`, `Avatar`, `Badge`, `Progress`, `Toast`

#### Backend Components (Supabase Edge Functions)

- `ai-proxy` - AI API调用代理和降级
- `code-validator` - 代码安全检测
- `achievement-trigger` - 成就解锁触发器
- `rate-limiter` - API调用频率限制
- `guest-cleanup` - 清理过期游客账号（定时任务）

### 4.4 State Management

- **Client State (Zustand)**:
  - `authStore` - 用户认证状态、用户信息
  - `editorStore` - 代码编辑器状态（HTML/CSS/JS代码、预览刷新）
  - `taskStore` - 当前关卡信息、提交状态
  - `uiStore` - UI状态（侧边栏展开、主题、语言）

- **Server State (SWR / React Query)**:
  - 课程列表、关卡数据、用户进度、作品列表等从Supabase获取的数据
  - 使用SWR实现自动缓存、重新验证、错误重试

- **Persistent State**:
  - **数据库 (Supabase PostgreSQL)**: 用户数据、课程、作品等
  - **Local Storage**: 
    - JWT token
    - 用户偏好（主题、语言）
    - 草稿代码（自动保存）
  - **Session Storage**: 临时会话数据

### 4.5 Authentication & Authorization

- **Authentication Method**: Supabase Auth (JWT-based)
  - 邮箱密码
  - OAuth (Google, GitHub)
  - 游客临时账号（自动生成）

- **Session Management**:
  - JWT存储在localStorage
  - 访问token + 刷新token机制
  - Token自动刷新（Supabase Client处理）
  - 多设备登录支持

- **Authorization Pattern**: Role-Based Access Control (RBAC)
  - **Guest**: 全功能访问（30天限制）
  - **Student**: 完整功能，无时间限制
  - **Teacher**: Student权限 + 课程管理
  - **Admin**: 全部权限

- **Guest/Trial Logic**:
  1. 访问`/`主页，点击"开始学习"
  2. Edge Function生成随机邮箱和密码
  3. 调用Supabase Auth创建账号，`user_type='guest'`，`trial_end_date=now()+30天`
  4. 返回JWT，前端自动登录
  5. 每次API调用检查`trial_end_date`，过期则返回提示
  6. 注册时，关联临时账号数据，升级为`student`

**Supabase RLS策略**:
```sql
-- 示例：用户只能访问自己的数据
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- 游客试用期检查
CREATE POLICY "Guest trial period check"
  ON tasks FOR SELECT
  USING (
    CASE 
      WHEN user_type = 'guest' THEN trial_end_date > now()
      ELSE true
    END
  );
```

---

## 5. Phase 2: Implementation Strategy

### 5.1 Development Phases

#### Phase 1: 基础架构与认证 (Week 1-2)
**Goal**: 搭建项目骨架，实现用户认证和基础数据模型

**Tasks**:
- [ ] 初始化Next.js + TypeScript项目
- [ ] 配置Tailwind CSS + shadcn/ui
- [ ] 配置Supabase客户端和环境变量
- [ ] 创建数据库表结构和RLS策略
- [ ] 实现用户注册/登录/游客创建
- [ ] 实现Header/Footer/基础布局
- [ ] 创建主页和仪表板页面（静态版本）

**Deliverables**:
- 可运行的Next.js应用
- Supabase数据库完整schema
- 用户认证功能
- 基础UI布局

**Success Criteria**:
- 用户可注册/登录
- 游客可自动创建临时账号
- 页面响应式布局正常

#### Phase 2: 课程与关卡系统 (Week 3-4)
**Goal**: 实现课程浏览和关卡学习的核心流程

**Tasks**:
- [ ] 创建课程列表页面
- [ ] 创建关卡学习页面（三栏布局）
- [ ] 集成CodeMirror 6代码编辑器
- [ ] 实现iframe沙盒代码预览
- [ ] 实现代码保存和提交
- [ ] 创建关卡进度追踪系统
- [ ] 导入示例课程数据（Level 1 HTML基础）

**Deliverables**:
- 完整的代码学习页面
- 可运行代码的沙盒环境
- 关卡进度保存

**Success Criteria**:
- 用户可浏览课程和关卡
- 用户可编写HTML/CSS/JS代码并实时预览
- 代码自动保存，刷新页面不丢失

#### Phase 3: AI助教集成 (Week 5-6)
**Goal**: 集成AI服务，实现智能辅导功能

**Tasks**:
- [ ] 创建Supabase Edge Function: ai-proxy
- [ ] 实现AI API多供应商降级机制
- [ ] 实现AI代码讲解功能
- [ ] 实现AI代码检查和错误诊断
- [ ] 实现AI对话界面
- [ ] 实现AI调用频率限制
- [ ] 实现常见问题缓存机制

**Deliverables**:
- AI助教功能完整可用
- 多AI服务商降级系统
- AI对话历史保存

**Success Criteria**:
- AI可准确讲解代码概念
- AI可诊断代码错误并给出建议
- 主AI服务失败时自动切换备用
- API调用频率限制生效

#### Phase 4: 游戏化系统 (Week 7-8)
**Goal**: 实现等级、积分、成就、排行榜等激励机制

**Tasks**:
- [ ] 实现经验值(XP)和等级系统
- [ ] 实现金币系统
- [ ] 创建成就系统和触发器
- [ ] 实现排行榜（按XP、速度、作品数）
- [ ] 实现每日/每周挑战
- [ ] 创建学习统计仪表板
- [ ] 实现AI Boss对战（限时挑战）

**Deliverables**:
- 完整的游戏化激励系统
- 可视化的学习进度和统计
- 排行榜和挑战系统

**Success Criteria**:
- 用户完成任务获得XP和金币
- 用户触发条件时自动解锁成就
- 排行榜实时更新
- 学习统计准确展示

#### Phase 5: 作品与社区 (Week 9-10)
**Goal**: 实现作品保存、发布和社区互动

**Tasks**:
- [ ] 实现作品保存和版本管理
- [ ] 实现作品导出功能
- [ ] 创建社区作品展示页面
- [ ] 实现作品点赞、收藏、评论
- [ ] 实现作品搜索和筛选
- [ ] 实现个人主页和作品集
- [ ] 实现"每日精选"AI推荐
- [ ] 实现作品举报和审核

**Deliverables**:
- 作品管理系统
- 社区互动功能
- 个人主页

**Success Criteria**:
- 用户可保存和管理作品
- 用户可发布作品到社区
- 社区成员可互动（点赞、评论）
- 个人主页展示用户作品集

#### Phase 6: 教师与管理功能 (Week 11-12)
**Goal**: 实现教师课程管理和管理员系统管理

**Tasks**:
- [ ] 创建教师仪表板
- [ ] 实现课程创建和编辑
- [ ] 实现关卡编辑器
- [ ] 实现学生进度查看
- [ ] 创建管理员仪表板
- [ ] 实现用户管理功能
- [ ] 实现内容审核功能
- [ ] 实现系统配置管理

**Deliverables**:
- 教师课程管理系统
- 管理员控制台
- 数据统计和分析

**Success Criteria**:
- 教师可创建自定义课程
- 教师可查看学生学习数据
- 管理员可管理用户和内容
- 系统数据统计准确

#### Phase 7: 优化与上线 (Week 13-14)
**Goal**: 性能优化、bug修复、部署上线

**Tasks**:
- [ ] 性能优化（代码分割、懒加载、图片优化）
- [ ] SEO优化（meta标签、sitemap、robots.txt）
- [ ] 全面测试（单元、集成、E2E）
- [ ] Bug修复和细节优化
- [ ] 配置Netlify部署
- [ ] 配置自定义域名
- [ ] 配置监控和错误追踪
- [ ] 编写用户文档和帮助中心

**Deliverables**:
- 生产就绪的应用
- 完整的测试覆盖
- 部署文档

**Success Criteria**:
- 页面加载时间<3秒
- Lighthouse评分>90
- 所有核心功能测试通过
- 成功部署到生产环境

### 5.2 Critical Path

**Must Complete First**:
1. 项目初始化 + Supabase配置（基础设施）
2. 用户认证系统（所有功能的前置条件）
3. 数据库schema创建（数据层基础）
4. 代码编辑器 + 沙盒环境（核心功能）

**Parallel Workstreams**:
- **Stream A - 核心学习功能**: 课程/关卡 → AI助教 → 进度追踪
- **Stream B - 游戏化系统**: 等级/积分 → 成就 → 排行榜（可与Stream A并行）
- **Stream C - 社区功能**: 作品保存 → 社区展示 → 互动（依赖核心功能完成）

**Integration Points**:
- Week 4: 代码编辑器 + AI助教集成测试
- Week 8: 游戏化系统 + 学习进度联调
- Week 10: 社区功能 + 用户系统联调
- Week 12: 教师/管理功能 + 全系统集成测试

### 5.3 Risk Mitigation

**Risk 1**: AI API不稳定或配额不足
- **Impact**: High（核心功能受影响）
- **Probability**: Medium
- **Mitigation**: 
  - 实现多供应商降级机制（已计划）
  - 监控API使用量，及时扩容
  - 缓存常见问题降低API调用
  - 准备降级文案，向用户透明说明

**Risk 2**: 代码沙盒安全风险
- **Impact**: High（用户安全和平台声誉）
- **Probability**: Low
- **Mitigation**:
  - iframe sandbox + CSP双重防护
  - Edge Function预检测恶意代码
  - 定期安全审计和渗透测试
  - 用户举报机制

**Risk 3**: 游客账号滥用（刷经验、恶意注册）
- **Impact**: Medium（数据污染、资源浪费）
- **Probability**: Medium
- **Mitigation**:
  - IP限制：每IP每天最多创建3个游客账号
  - 行为检测：异常快速完成任务标记审查
  - 验证码：可疑行为触发验证
  - 定期清理过期游客账号

**Risk 4**: Supabase免费配额不足
- **Impact**: Medium（需要付费或迁移）
- **Probability**: Medium（取决于用户量）
- **Mitigation**:
  - 监控数据库使用量
  - 优化查询减少请求数
  - 实施数据归档策略
  - 准备升级计划

**Risk 5**: 代码编辑器性能问题（大文件、卡顿）
- **Impact**: Medium（用户体验下降）
- **Probability**: Low
- **Mitigation**:
  - 限制单文件代码大小（1MB）
  - 代码编辑器虚拟滚动
  - 预览防抖（500ms）
  - Web Worker处理语法高亮

### 5.4 Testing Strategy

#### Unit Testing
- **Scope**: 
  - 工具函数（utils）
  - Zustand stores
  - 数据验证函数
  - 代码安全检测函数
- **Tools**: Jest + React Testing Library
- **Coverage Target**: 80%

#### Integration Testing
- **Scope**:
  - API端点（Edge Functions）
  - 数据库操作（CRUD）
  - AI服务降级逻辑
  - 认证流程
- **Approach**: 
  - 使用Supabase测试数据库
  - Mock AI API响应
  - 测试完整数据流

#### End-to-End Testing
- **Scope**: 
  - 用户注册/登录流程
  - 游客创建和升级流程
  - 完整的关卡学习流程（编写代码 → AI反馈 → 提交 → 获得奖励）
  - 作品发布和社区互动流程
- **Tools**: Playwright 或 Cypress
- **Test Cases**: 
  - 关键用户流程（5个主要scenario）
  - 跨浏览器测试（Chrome, Firefox, Safari）

#### Manual Testing
- **Scope**:
  - UI/UX细节
  - 响应式布局（桌面、平板、手机）
  - 游戏化体验感
  - AI回复质量
- **Test Cases**: 详见 [testing-checklist.md](./testing-checklist.md)

---

## 6. Phase 3: Deployment & Operations

### 6.1 Deployment Strategy

- **Environment Progression**: 
  - **Development**: 本地开发（localhost:3000）
  - **Staging**: Netlify预览部署（每次PR自动部署）
  - **Production**: Netlify生产环境（主域名）

- **Deployment Method**: 
  - Git-based CI/CD
  - GitHub → Netlify自动部署
  - 主分支合并触发生产部署

- **Rollout Strategy**: 
  - 一次性全量发布（初版）
  - 后续更新采用Feature Flag逐步开放

- **Rollback Plan**:
  - Netlify一键回滚到上一版本
  - 数据库迁移有down脚本
  - 关键配置版本化

### 6.2 Monitoring & Observability

- **Key Metrics**:
  - 用户注册/登录成功率
  - AI API成功率和响应时间
  - 关卡完成率
  - 页面加载时间（Core Web Vitals）
  - 错误率

- **Alerts**:
  - AI API所有服务不可用
  - 数据库连接失败
  - 页面错误率>5%
  - API响应时间>3秒

- **Logging**:
  - Supabase Logs：数据库查询、Edge Function执行
  - Netlify Logs：部署和构建日志
  - 前端错误追踪：Sentry或类似服务

- **Dashboards**:
  - Supabase Dashboard：数据库和API监控
  - Netlify Analytics：流量和性能
  - 自定义仪表板：用户行为和学习数据

### 6.3 Documentation

- [x] 用户帮助文档（网站内置帮助中心）
- [ ] API文档（contracts目录，OpenAPI格式）
- [ ] 开发者指南（README.md + docs/）
- [ ] 部署文档（DEPLOYMENT.md）
- [ ] 故障排查指南（TROUBLESHOOTING.md）

---

## 7. Open Issues & Decisions

### 7.1 Unresolved Questions

**Question 1**: 是否需要邮箱验证？
- **Impact**: 影响游客升级流程和账号安全
- **Owner**: 开发团队
- **Target Resolution**: Phase 1开始前
- **建议**: 初版跳过邮箱验证，快速上线；后续根据滥用情况决定是否添加

**Question 2**: AI生成的讲解内容是否需要人工审核？
- **Impact**: 影响内容质量和上线时间
- **Owner**: 产品团队
- **Target Resolution**: Phase 3 AI集成时
- **建议**: 初版采用"AI生成 + 抽样人工审核"模式，逐步积累高质量内容

### 7.2 Deferred Decisions

**Decision 1**: 是否支持多语言（英文、中文）
- **Rationale**: 初版聚焦中文用户，快速验证产品；多语言可后续扩展
- **Revisit Trigger**: 用户量达到10K或有明确国际化需求

**Decision 2**: 是否引入付费订阅模式
- **Rationale**: 初版免费使用，积累用户和数据；商业化可后续探索
- **Revisit Trigger**: 运营成本压力或有清晰的付费功能规划

---

## 8. Success Validation

### 8.1 Pre-Launch Checklist
- [ ] 所有功能需求（FR-1至FR-9）已实现
- [ ] 所有验收标准已满足
- [ ] 单元测试覆盖率>80%
- [ ] 集成测试全部通过
- [ ] E2E测试（5个主要scenario）全部通过
- [ ] 安全审查完成（代码沙盒、RLS策略、API密钥保护）
- [ ] 性能基准达标（页面加载<3秒，AI响应<3秒）
- [ ] 跨浏览器测试通过（Chrome, Firefox, Safari, Edge）
- [ ] 移动端响应式测试通过
- [ ] 文档完整（用户帮助、API文档、部署文档）
- [ ] 监控和日志配置完成
- [ ] 生产环境环境变量配置完成
- [ ] 域名和SSL证书配置完成

### 8.2 Post-Launch Validation

- **Week 1**: 
  - 监控错误率（目标<2%）
  - 监控AI API成功率（目标>95%）
  - 收集用户反馈
  - 修复紧急bug

- **Week 2-4**:
  - 验证用户留存率（7日留存目标40%）
  - 监控游客转化率（目标30%）
  - 分析学习完成率（Level 1目标50%）
  - 优化AI回复质量

- **Month 2-3**:
  - 评估成功标准（见spec.md第5节）
  - 用户满意度调查（目标4.2/5.0）
  - 分析排行榜参与度
  - 评估社区活跃度

### 8.3 Iteration Plan

- **Feedback Collection**:
  - 网站内置反馈表单
  - 用户满意度调查（每月）
  - 社区用户意见收集

- **Iteration Cadence**:
  - 小功能/bug修复：每周发布
  - 大功能更新：每月发布

- **Success Metrics Review**:
  - 每周回顾核心指标（注册、留存、完成率）
  - 每月回顾成功标准进展
  - 每季度战略复盘

---

## 9. Appendix

### 9.1 References
- **Feature Spec**: [../spec.md](../spec.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/](./contracts/)
- **Research Documents**: [research.md](./research.md)
- **Supabase Documentation**: https://supabase.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **CodeMirror 6**: https://codemirror.net/
- **shadcn/ui**: https://ui.shadcn.com/

### 9.2 Glossary

- **Level**: 课程等级，共5个（HTML基础、CSS样式、JS基础、DOM操作、综合实战）
- **Task / 关卡**: 单个学习任务，包含知识讲解、代码练习、测试用例
- **XP**: Experience Points，经验值，完成任务获得
- **AI Boss**: AI生成的限时编程挑战
- **沙盒 / Sandbox**: 代码隔离执行环境，确保安全
- **RLS**: Row Level Security，Supabase行级安全策略
- **Edge Function**: Supabase无服务器函数，部署在边缘节点

---

## Notes

- 本计划基于spec.md的功能需求，将在14周内完成MVP开发
- 所有技术选型已完成研究和决策，可直接开始实施
- 关键路径和风险已识别，团队需密切关注
- 部署和监控策略完整，确保生产环境稳定运行
- 成功标准清晰，便于后续验证和迭代优化

