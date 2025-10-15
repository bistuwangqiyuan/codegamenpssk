# Research Document: GameCode Lab 技术研究与决策

**Created**: 2025-10-15  
**Purpose**: 记录关键技术决策的研究过程和理由  
**Related**: [implementation-plan.md](./implementation-plan.md)

---

## 1. AI API降级策略研究

### 1.1 问题背景
GameCode Lab的AI助教是核心功能，负责代码讲解、错误诊断和智能对话。主要AI服务（DeepSeek）可能因网络、配额或服务故障不可用，需要确保服务连续性。

### 1.2 研究方法
- 分析OpenAI、Anthropic等AI服务的最佳实践
- 调研Supabase Edge Functions的容错能力
- 评估多个备用AI服务（GLM、Moonshot、Tongyi等）的兼容性

### 1.3 方案对比

| 方案 | 优势 | 劣势 | 成本 | 复杂度 |
|------|------|------|------|--------|
| A. 多AI服务商自动切换 | 最佳可用性、无缝切换 | 需集成多个API、成本较高 | 中 | 中 |
| B. 错误提示+缓存回复 | 开发简单、成本低 | 用户体验差、功能受限 | 低 | 低 |
| C. 规则引擎降级 | 可控性强 | 功能有限、开发成本高 | 中 | 高 |

### 1.4 最终决策

**选择方案A：多AI服务商自动切换**

**决策理由**:
1. 用户已提供7个AI API密钥（DeepSeek, GLM, Moonshot, Tongyi, Tencent, Spark, Doubao），具备多供应商基础
2. AI助教是核心功能，降级失败直接影响用户学习体验和留存率
3. 不同AI服务虽有差异，但基础代码讲解能力相近，切换影响小
4. Supabase Edge Functions支持优雅降级，实现复杂度可控

**实施细节**:
```typescript
// AI服务优先级列表
const AI_PROVIDERS = [
  { name: 'deepseek', key: process.env.DEEPSEEK_API_KEY, endpoint: '...' },
  { name: 'glm', key: process.env.GLM_API_KEY, endpoint: '...' },
  { name: 'moonshot', key: process.env.MOONSHOT_API_KEY, endpoint: '...' },
  { name: 'tongyi', key: process.env.TONGYI_API_KEY, endpoint: '...' },
  // ...
]

// 降级逻辑
async function callAI(prompt: string) {
  for (const provider of AI_PROVIDERS) {
    try {
      const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${provider.key}` },
        body: JSON.stringify({ prompt }),
        signal: AbortSignal.timeout(10000) // 10秒超时
      })
      
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error(`${provider.name} failed, trying next...`, error)
      continue
    }
  }
  
  // 所有服务都失败，返回缓存或友好错误
  return getCachedResponse(prompt) || {
    error: 'AI助教暂时不可用，请稍后重试',
    fallback: true
  }
}
```

**缓存策略**:
- 缓存常见问题（如"什么是HTML标签"）的AI回复
- 使用Supabase Database作为缓存存储
- 缓存时间：7天
- 缓存命中率目标：30%

### 1.5 参考资料
- [OpenAI Best Practices for Production](https://platform.openai.com/docs/guides/production-best-practices)
- [Supabase Edge Functions Error Handling](https://supabase.com/docs/guides/functions/error-handling)
- [Building Resilient AI Systems (Microsoft Azure)](https://learn.microsoft.com/azure/architecture/ai/resiliency)

---

## 2. 游客试用期数据迁移机制研究

### 2.1 问题背景
平台提供1个月免费试用，游客无需注册即可使用全部功能。试用期结束时需要合理的机制引导注册，同时保留用户数据，提高转化率。

### 2.2 研究方法
- 调研SaaS产品的免费试用最佳实践（Notion、Figma、Canva等）
- 分析用户心理：何时提醒最有效？如何避免反感？
- 评估Supabase Auth的临时账号支持能力

### 2.3 方案对比

| 方案 | 提醒时机 | 期满处理 | 转化压力 | 用户体验 |
|------|----------|----------|----------|----------|
| A. 提前7天温和提醒 | 剩余7/3/1天 | 只读模式 | 低 | 好 |
| B. 期满强制注册 | 期满当天 | 阻止使用 | 高 | 中 |
| C. 期满只读7天 | 剩余1天+期满 | 只读7天后删除 | 中 | 中 |

### 2.4 最终决策

**选择方案A：提前7天温和提醒 + 自动迁移数据**

**决策理由**:
1. 教育产品需要建立信任，强制注册可能流失用户
2. 提前7天提醒给用户充足决策时间，降低压迫感
3. 数据无缝迁移降低注册门槛，提高转化意愿
4. 符合"用户友好"的产品理念

**实施流程**:
```
Day 1-23: 正常使用，无提醒
Day 24: 仪表板顶部横幅提示"试用期剩余7天"
Day 28: 登录时弹窗提醒"试用期剩余3天，注册保留数据"（可关闭）
Day 30: 登录时强提示"今天是最后一天，注册保留所有学习成果"
Day 31: 自动切换为只读模式
  - 可查看历史数据和作品
  - 任何编辑/新增操作引导到注册页
  - 数据保留30天
Day 61: 未注册则永久删除游客数据
```

**数据迁移逻辑**:
```sql
-- 注册时关联游客数据
UPDATE users
SET 
  user_type = 'student',
  trial_end_date = NULL,
  email = :new_email,
  password_hash = :new_password
WHERE user_id = :guest_user_id;

-- 迁移完成后，游客所有数据自动归属到新账号
```

**UI设计**:
- 横幅提示：浅黄色背景，友好文案，CTA按钮"立即注册"
- 弹窗提示：简洁设计，突出价值"保留学习进度、作品和成就"
- 只读模式：所有按钮置灰，悬停提示"注册后继续使用"

### 2.5 转化率优化策略
- 展示用户已获得的成就和学习时长，强化沉没成本
- 提供"一键注册"快速通道（邮箱+密码即可）
- 支持第三方登录（Google、GitHub）降低注册摩擦
- 展示社区精选作品，激发用户发布欲望

### 2.6 参考资料
- [SaaS Free Trial Best Practices (Baremetrics)](https://www.baremetrics.com/academy/saas-free-trial-best-practices)
- [Notion's Freemium Strategy Analysis](https://www.lennysnewsletter.com/p/how-notion-built-a-500m-business)
- [Supabase Auth Patterns](https://supabase.com/docs/guides/auth/auth-helpers)

---

## 3. 代码沙盒安全隔离研究

### 3.1 问题背景
用户在浏览器中编写和运行HTML/CSS/JS代码，需要在功能性（DOM操作、事件监听）和安全性（防止XSS、恶意脚本）之间找到平衡。

### 3.2 研究方法
- 分析CodePen、JSFiddle、StackBlitz等在线编辑器的沙盒策略
- 阅读MDN关于iframe sandbox和CSP的文档
- 进行安全测试（XSS、无限循环、恶意跳转等）

### 3.3 方案对比

| 方案 | 隔离级别 | 功能性 | 性能 | 开发复杂度 | 适用场景 |
|------|----------|--------|------|------------|----------|
| A. iframe sandbox | 中 | 高 | 好 | 低 | HTML/CSS/JS教学 ✅ |
| B. Web Worker | 高 | 低 | 好 | 中 | 纯JS逻辑 ❌ |
| C. 第三方沙盒服务 | 高 | 高 | 中 | 低（依赖） | 企业级应用 ⚠️ |

### 3.4 最终决策

**选择方案A：iframe sandbox with comprehensive restrictions**

**决策理由**:
1. HTML/CSS/JS学习必须支持DOM操作，Web Worker不适用
2. iframe sandbox是浏览器原生方案，性能好，无外部依赖
3. 教育场景用户恶意攻击动机低，中等安全性可接受
4. 适当限制可满足95%的学习需求

**iframe配置**:
```html
<iframe
  sandbox="allow-scripts allow-same-origin"
  csp="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline';"
  srcdoc="{用户HTML代码}"
  style="border: none; width: 100%; height: 100%;"
/>
```

**安全限制**:
- ❌ 禁止弹窗 (`allow-popups`)
- ❌ 禁止页面跳转 (`allow-top-navigation`)
- ❌ 禁止表单提交 (`allow-forms`)
- ❌ 禁止访问外部资源（CSP: `default-src 'none'`）
- ❌ 禁止使用`eval`、`Function`（通过代码检测）
- ✅ 允许脚本执行（教学必需）
- ✅ 允许same-origin（便于DOM操作，但与主页面隔离）

**代码预检测**（Supabase Edge Function）:
```typescript
function validateCode(html: string, css: string, js: string) {
  const errors = []
  
  // 1. 检测代码大小
  const totalSize = html.length + css.length + js.length
  if (totalSize > 1024 * 1024) { // 1MB
    errors.push('代码总大小不能超过1MB')
  }
  
  // 2. 检测无限循环
  if (/while\s*\(\s*true\s*\)/.test(js) || /for\s*\(\s*;;\s*\)/.test(js)) {
    errors.push('检测到可能的无限循环，请修改代码')
  }
  
  // 3. 检测危险函数
  const dangerousFunctions = ['eval', 'Function', 'setTimeout', 'setInterval']
  for (const fn of dangerousFunctions) {
    if (new RegExp(`\\b${fn}\\s*\\(`).test(js)) {
      errors.push(`出于安全考虑，不允许使用${fn}函数`)
    }
  }
  
  // 4. 检测外部资源请求
  if (/fetch\s*\(|XMLHttpRequest|axios|ajax/i.test(js)) {
    errors.push('暂不支持网络请求，请使用本地数据')
  }
  
  return errors
}
```

**资源限制**:
- 执行超时：5秒（浏览器自动中止）
- 内存：浏览器自动管理，无需额外限制
- 控制台输出：捕获并显示在自定义控制台组件中

**用户提示**:
- 代码运行前显示"代码在安全沙盒中运行"
- 检测到限制时友好提示："为了安全，此功能暂不支持"
- 提供"安全沙盒说明"帮助文档

### 3.5 安全测试计划
- ✅ XSS攻击测试（`<script>alert('XSS')</script>`）
- ✅ 页面跳转测试（`window.location.href = '...'`）
- ✅ 弹窗测试（`alert()`, `confirm()`, `prompt()`）
- ✅ 无限循环测试（`while(true){}`）
- ✅ 外部资源加载（`<img src="...">`, `fetch(...)`）
- ✅ localStorage访问（隔离测试）

### 3.6 参考资料
- [MDN: iframe sandbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CodePen Security](https://blog.codepen.io/documentation/security/)
- [JSFiddle Architecture](https://doc.jsfiddle.net/meta/spec.html)
- [StackBlitz WebContainers](https://blog.stackblitz.com/posts/introducing-webcontainers/)

---

## 4. 代码编辑器选择研究

### 4.1 问题背景
需要选择一个适合教育场景的代码编辑器，要求：轻量、可定制、语法高亮、自动补全、TypeScript支持。

### 4.2 候选方案

| 编辑器 | 体积 | 性能 | 可定制性 | TypeScript | 社区 | 教育适用性 |
|--------|------|------|----------|------------|------|------------|
| CodeMirror 6 | ~80KB | 优秀 | 高 | ✅ | 活跃 | ✅ 推荐 |
| Monaco Editor | ~2MB | 好 | 中 | ✅ | 活跃 | ⚠️ 过重 |
| Ace Editor | ~500KB | 好 | 中 | ❌ | 较活跃 | ✅ 可选 |
| textarea | ~0KB | 最佳 | 低 | ❌ | N/A | ❌ 功能不足 |

### 4.3 最终决策

**选择：CodeMirror 6**

**决策理由**:
- 体积小（~80KB），加载快，适合移动端
- 性能优秀，支持5000+行代码不卡顿
- 高度可定制，支持自定义语法高亮、扩展
- 原生TypeScript支持，类型安全
- 活跃维护，社区支持好
- 教育场景功能足够，无需Monaco的复杂功能

**核心扩展**:
```typescript
import { EditorView, basicSetup } from 'codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'

const editor = new EditorView({
  extensions: [
    basicSetup,
    html(), // 或 css(), javascript()
    EditorView.theme({
      '&': { fontSize: '14px' },
      '.cm-gutters': { backgroundColor: '#f7f7f7' }
    })
  ],
  parent: document.getElementById('editor')
})
```

### 4.4 参考资料
- [CodeMirror 6官方文档](https://codemirror.net/)
- [Monaco Editor vs CodeMirror对比](https://blog.replit.com/code-editors)

---

## 5. 状态管理选择研究

### 5.1 候选方案

| 方案 | 学习成本 | 体积 | 性能 | TypeScript | 适用场景 |
|------|----------|------|------|------------|----------|
| Zustand | 低 | ~1KB | 优秀 | ✅ | 简单状态管理 ✅ |
| Redux Toolkit | 中 | ~10KB | 好 | ✅ | 复杂应用 |
| Recoil | 中 | ~15KB | 好 | ✅ | 原子化状态 |
| React Context | 低 | 0KB | 中 | ✅ | 简单场景 |

### 5.2 最终决策

**选择：Zustand**

**决策理由**:
- 极简API，学习成本低
- 体积极小（~1KB），性能好
- 无需Provider包裹，使用灵活
- TypeScript支持完善
- 满足GameCode Lab的状态管理需求（用户、编辑器、UI状态）

### 5.3 参考资料
- [Zustand官方文档](https://zustand-demo.pmnd.rs/)
- [State Management比较](https://leerob.io/blog/react-state-management)

---

## 6. 总结

所有关键技术决策已完成研究和评估：

| 决策项 | 最终方案 | 决策依据 |
|--------|----------|----------|
| AI降级策略 | 多AI服务商自动切换 | 最佳可用性，用户已提供多个API |
| 游客数据迁移 | 提前7天提醒+自动迁移 | 用户体验好，转化率高 |
| 代码沙盒 | iframe sandbox | 功能性和安全性平衡 |
| 代码编辑器 | CodeMirror 6 | 轻量、性能好、可定制 |
| 状态管理 | Zustand | 简单、轻量、够用 |

所有方案均基于充分研究，考虑了项目特点（教育场景、浏览器环境、游客模式），可直接进入实施阶段。

