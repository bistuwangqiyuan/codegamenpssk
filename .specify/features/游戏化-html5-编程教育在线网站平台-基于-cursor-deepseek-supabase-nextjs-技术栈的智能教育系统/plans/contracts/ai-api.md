# AI助教 API 规格说明

所有AI API通过Supabase Edge Function代理调用，实现多供应商降级策略。

## POST /api/ai/explain {#explain-code}

AI代码讲解，解释代码的工作原理。

### Request

需要认证

```json
{
  "code": {
    "html": "<h1>Hello</h1>",
    "css": "h1 { color: blue; }",
    "js": ""
  },
  "question": "这段代码是什么意思？",
  "task_id": "uuid"  // 可选，关联关卡
}
```

### Response

```json
{
  "success": true,
  "data": {
    "explanation": "这段代码创建了一个蓝色的标题...",
    "key_concepts": ["HTML标签", "CSS样式", "颜色属性"],
    "related_docs": [
      {
        "title": "HTML h1标签",
        "url": "/docs/html-h1"
      }
    ],
    "ai_provider": "deepseek",  // 使用的AI服务商
    "cached": false  // 是否来自缓存
  },
  "message": "讲解成功"
}
```

### Rate Limit
- 每用户每小时100次
- 超限返回429错误

### Implementation Notes
- Edge Function调用AI API（DeepSeek → GLM → Moonshot等降级）
- 常见问题缓存7天
- 超时时间：10秒
- 所有AI服务失败时返回缓存或友好错误

---

## POST /api/ai/check {#check-code}

AI代码检查，诊断错误并提供修改建议。

### Request

需要认证

```json
{
  "code": {
    "html": "<h1>Hello</h1>",
    "css": "h1 { color: blu; }",  // 错误：颜色拼写错误
    "js": ""
  },
  "task_id": "uuid",  // 关联关卡
  "test_cases": [
    {
      "type": "style",
      "description": "标题颜色应为蓝色",
      "assertion": "getComputedStyle(document.querySelector('h1')).color === 'rgb(0, 0, 255)'"
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "data": {
    "has_errors": true,
    "errors": [
      {
        "type": "css",
        "line": 1,
        "message": "颜色属性值'blu'无效，可能是'blue'的拼写错误",
        "severity": "error",
        "suggestion": "将'blu'改为'blue'"
      }
    ],
    "test_results": [
      {
        "test_case": {
          "description": "标题颜色应为蓝色"
        },
        "passed": false,
        "error_message": "期望颜色为rgb(0, 0, 255)，实际为rgba(0, 0, 0, 0)"
      }
    ],
    "score": 0,  // 0-100
    "feedback": "代码中存在CSS颜色拼写错误，导致测试未通过。修正后重新提交。",
    "hints": [
      "检查CSS中的颜色属性值是否正确",
      "使用浏览器开发者工具查看元素的实际样式"
    ]
  },
  "message": "代码检查完成"
}
```

### Implementation Notes
- 先进行语法检查（HTML/CSS/JS parser）
- 再进行语义检查（AI分析）
- 运行测试用例（沙盒环境）
- 综合评分（0-100）

---

## POST /api/ai/chat {#chat}

AI智能对话，用户可用自然语言提问。

### Request

需要认证

```json
{
  "conversation_id": "uuid",  // 可选，续接已有对话
  "message": "为什么我的按钮没有居中？",
  "context": {
    "task_id": "uuid",
    "code": {
      "html": "<button>Click me</button>",
      "css": "",
      "js": ""
    }
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "conversation_id": "uuid",
    "message": {
      "role": "assistant",
      "content": "要让按钮居中，你可以使用以下几种方法：\n\n1. 使用text-align（适用于inline元素）：\n```css\nbutton { text-align: center; }\n```\n\n2. 使用flexbox（推荐）：\n```css\nbody {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n```\n\n3. 使用margin auto：\n```css\nbutton {\n  display: block;\n  margin: 0 auto;\n}\n```\n\n你想尝试哪种方法呢？",
      "timestamp": "2025-10-15T10:00:00Z"
    },
    "suggestions": [
      {
        "type": "code_snippet",
        "language": "css",
        "code": "body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}"
      }
    ],
    "ai_provider": "deepseek"
  },
  "message": "对话成功"
}
```

### Implementation Notes
- 每个对话有唯一ID，保存在`ai_conversations`表
- 对话历史限制最近20条消息
- 自动附加用户当前代码和关卡上下文
- AI提示词优化：强调教育场景、简单易懂、鼓励性语言

---

## GET /api/ai/conversations {#list-conversations}

获取用户的AI对话历史。

### Request

需要认证

Query Parameters:
- `task_id` (可选): 筛选特定关卡的对话
- `limit` (默认10): 返回数量
- `offset` (默认0): 分页偏移

### Response

```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "conversation_id": "uuid",
        "task_id": "uuid",
        "task_name": "认识HTML标签",
        "messages_count": 5,
        "last_message": {
          "role": "assistant",
          "content": "很好，现在你理解了...",
          "timestamp": "2025-10-15T10:00:00Z"
        },
        "created_at": "2025-10-15T09:00:00Z",
        "updated_at": "2025-10-15T10:00:00Z"
      }
    ],
    "total": 50,
    "limit": 10,
    "offset": 0
  }
}
```

---

## GET /api/ai/conversation/:id {#get-conversation}

获取完整的AI对话详情。

### Request

需要认证

### Response

```json
{
  "success": true,
  "data": {
    "conversation_id": "uuid",
    "task_id": "uuid",
    "messages": [
      {
        "role": "user",
        "content": "为什么我的按钮没有居中？",
        "timestamp": "2025-10-15T09:00:00Z"
      },
      {
        "role": "assistant",
        "content": "要让按钮居中...",
        "timestamp": "2025-10-15T09:00:03Z"
      }
    ],
    "created_at": "2025-10-15T09:00:00Z"
  }
}
```

---

## AI服务降级策略

### 优先级列表
1. DeepSeek (主要)
2. GLM
3. Moonshot
4. Tongyi
5. Tencent
6. Spark
7. Doubao
8. Minimax

### 降级逻辑
```
尝试 DeepSeek
  成功 → 返回结果
  失败 → 尝试 GLM
    成功 → 返回结果（附加提示"使用备用AI"）
    失败 → 尝试 Moonshot
      ...
      所有失败 → 检查缓存
        有缓存 → 返回缓存（附加提示"AI暂时不可用，这是缓存回复"）
        无缓存 → 返回友好错误（附加重试建议）
```

### 健康检查
- 每5分钟ping各AI服务
- 标记可用/不可用状态
- 自动跳过不可用服务

### 缓存策略
- 缓存常见问题（如"什么是HTML"）
- 缓存命中率目标：30%
- 缓存时间：7天
- 缓存存储：Supabase Database

---

## 错误代码

| Code | Description |
|------|-------------|
| `AI_SERVICE_UNAVAILABLE` | 所有AI服务不可用 |
| `AI_TIMEOUT` | AI响应超时（>10秒） |
| `RATE_LIMIT_EXCEEDED` | API调用频率超限 |
| `INVALID_CODE_FORMAT` | 代码格式无效 |
| `CONTEXT_TOO_LARGE` | 上下文过大（>10KB） |

