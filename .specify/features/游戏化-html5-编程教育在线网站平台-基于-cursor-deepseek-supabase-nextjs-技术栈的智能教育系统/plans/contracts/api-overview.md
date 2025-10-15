# API Contracts Overview: GameCode Lab

**Created**: 2025-10-15  
**API Type**: REST + Supabase Client SDK  
**Base URL**: `https://[your-domain].com/api`  
**Authentication**: JWT Bearer Token (Supabase Auth)

---

## 认证方式

所有需要认证的API请求都需要在Header中包含JWT token：

```http
Authorization: Bearer {supabase_jwt_token}
```

## 响应格式

### 成功响应
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": { ... }
  }
}
```

## API分类

### 1. 认证 API (`/api/auth/`)
- [POST /api/auth/guest](./auth-api.md#create-guest) - 创建游客账号
- [POST /api/auth/register](./auth-api.md#register) - 用户注册
- [POST /api/auth/login](./auth-api.md#login) - 用户登录
- [POST /api/auth/upgrade-guest](./auth-api.md#upgrade-guest) - 游客升级

### 2. 用户 API (`/api/user/`)
- [GET /api/user/profile](./user-api.md#get-profile) - 获取用户信息
- [PUT /api/user/profile](./user-api.md#update-profile) - 更新用户信息
- [GET /api/user/progress](./user-api.md#get-progress) - 获取学习进度
- [GET /api/user/achievements](./user-api.md#get-achievements) - 获取成就列表
- [GET /api/user/stats](./user-api.md#get-stats) - 获取学习统计

### 3. 课程与关卡 API (`/api/courses/`, `/api/tasks/`)
- [GET /api/courses](./course-api.md#list-courses) - 获取课程列表
- [GET /api/courses/:id](./course-api.md#get-course) - 获取课程详情
- [GET /api/courses/:id/tasks](./course-api.md#list-tasks) - 获取关卡列表
- [GET /api/tasks/:id](./task-api.md#get-task) - 获取关卡详情
- [POST /api/tasks/:id/submit](./task-api.md#submit-task) - 提交关卡代码
- [GET /api/tasks/:id/hint](./task-api.md#get-hint) - 获取AI提示

### 4. AI助教 API (`/api/ai/`)
- [POST /api/ai/explain](./ai-api.md#explain-code) - AI代码讲解
- [POST /api/ai/check](./ai-api.md#check-code) - AI代码检查
- [POST /api/ai/chat](./ai-api.md#chat) - AI对话

### 5. 作品 API (`/api/works/`)
- [GET /api/works](./work-api.md#list-works) - 获取作品列表
- [POST /api/works](./work-api.md#create-work) - 创建作品
- [GET /api/works/:id](./work-api.md#get-work) - 获取作品详情
- [PUT /api/works/:id](./work-api.md#update-work) - 更新作品
- [DELETE /api/works/:id](./work-api.md#delete-work) - 删除作品
- [POST /api/works/:id/like](./work-api.md#like-work) - 点赞作品
- [POST /api/works/:id/favorite](./work-api.md#favorite-work) - 收藏作品

### 6. 社区 API (`/api/community/`)
- [GET /api/community/featured](./community-api.md#get-featured) - 获取精选作品
- [POST /api/works/:id/comments](./community-api.md#create-comment) - 评论作品
- [GET /api/works/:id/comments](./community-api.md#list-comments) - 获取评论列表

### 7. 排行榜 API (`/api/leaderboard/`)
- [GET /api/leaderboard/:type](./leaderboard-api.md#get-leaderboard) - 获取排行榜

---

## 通用错误代码

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_REQUIRED` | 401 | 需要登录 |
| `AUTH_INVALID` | 401 | 无效的认证token |
| `PERMISSION_DENIED` | 403 | 权限不足 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 |
| `RATE_LIMIT_EXCEEDED` | 429 | API调用频率超限 |
| `SERVER_ERROR` | 500 | 服务器内部错误 |
| `TRIAL_EXPIRED` | 403 | 试用期已结束 |

---

## 速率限制

| API Category | Limit | Window |
|--------------|-------|--------|
| AI APIs | 100 requests | per hour per user |
| 其他APIs | 1000 requests | per hour per user |

超过限制时返回 `429 Too Many Requests`，响应头包含：
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1634567890
```

---

## 完整API文档

详细的API规格说明请查看各模块文档：

- [认证 API](./auth-api.md)
- [用户 API](./user-api.md)
- [课程 API](./course-api.md)
- [关卡 API](./task-api.md)
- [AI助教 API](./ai-api.md)
- [作品 API](./work-api.md)
- [社区 API](./community-api.md)
- [排行榜 API](./leaderboard-api.md)

