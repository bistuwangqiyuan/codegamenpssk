# 认证 API 规格说明

## POST /api/auth/guest {#create-guest}

创建游客临时账号，自动分配30天试用期。

### Request

无需认证，无需请求体。

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "uuid",
      "email": "guest_abc123@gamecode.internal",
      "username": "游客_12345",
      "user_type": "guest",
      "trial_end_date": "2025-11-14T10:00:00Z",
      "level": 1,
      "experience_points": 0,
      "coins": 0
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_at": 1634567890
    }
  },
  "message": "游客账号创建成功，享受30天免费试用"
}
```

### Implementation Notes
- 生成随机UUID作为游客标识
- 邮箱格式：`guest_{uuid}@gamecode.internal`
- 用户名格式：`游客_{random_5_digits}`
- 密码自动生成（用户不可见）
- 自动调用Supabase Auth创建账号
- `trial_end_date` 设置为30天后

---

## POST /api/auth/register {#register}

用户邮箱注册。

### Request

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "CodeMaster"
}
```

### Validation
- `email`: 有效邮箱格式
- `password`: 至少8位，包含字母和数字
- `username`: 2-20字符，字母数字下划线

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "uuid",
      "email": "user@example.com",
      "username": "CodeMaster",
      "user_type": "student",
      "level": 1,
      "experience_points": 0,
      "coins": 0
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_at": 1634567890
    }
  },
  "message": "注册成功"
}
```

### Errors
- `EMAIL_EXISTS`: 邮箱已被注册
- `USERNAME_EXISTS`: 用户名已被占用
- `WEAK_PASSWORD`: 密码强度不足

---

## POST /api/auth/login {#login}

用户登录。

### Request

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "uuid",
      "email": "user@example.com",
      "username": "CodeMaster",
      "user_type": "student",
      "level": 3,
      "experience_points": 1250,
      "coins": 350
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_at": 1634567890
    }
  },
  "message": "登录成功"
}
```

### Errors
- `INVALID_CREDENTIALS`: 邮箱或密码错误
- `ACCOUNT_DISABLED`: 账号已被禁用
- `TOO_MANY_ATTEMPTS`: 登录尝试次数过多（3次后需要验证码）

---

## POST /api/auth/upgrade-guest {#upgrade-guest}

游客账号升级为正式用户。

### Request

需要认证（游客JWT token）

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "CodeMaster"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "uuid",  // 保持原user_id
      "email": "user@example.com",
      "username": "CodeMaster",
      "user_type": "student",
      "trial_end_date": null,  // 清除试用期限制
      "level": 2,  // 保留游客期间的等级
      "experience_points": 350,  // 保留游客期间的XP
      "coins": 120  // 保留游客期间的金币
    },
    "session": {
      "access_token": "new_jwt_token",
      "refresh_token": "new_refresh_token",
      "expires_at": 1634567890
    },
    "migrated_data": {
      "completed_tasks": 15,
      "works_count": 3,
      "achievements_count": 5
    }
  },
  "message": "账号升级成功，所有数据已保留"
}
```

### Implementation Notes
- 更新现有user记录，不创建新记录
- 保留所有关联数据（进度、作品、成就）
- 更新`user_type`从`guest`到`student`
- 清除`trial_end_date`
- 更新邮箱和密码
- 重新生成JWT token

### Errors
- `EMAIL_EXISTS`: 邮箱已被其他账号注册
- `USERNAME_EXISTS`: 用户名已被占用
- `NOT_GUEST`: 当前账号不是游客账号

---

## POST /api/auth/oauth/:provider {#oauth-login}

第三方OAuth登录（Google、GitHub等）。

### Request

```
GET /api/auth/oauth/google
```

### Flow
1. 重定向到OAuth提供商登录页
2. 用户授权后回调到 `/api/auth/callback/:provider`
3. 交换access token
4. 创建或更新用户账号
5. 重定向到 `/dashboard` 并附带session token

### Response
重定向到dashboard，session保存在cookie或localStorage

---

## POST /api/auth/logout {#logout}

用户登出。

### Request

需要认证

```json
{}
```

### Response

```json
{
  "success": true,
  "message": "登出成功"
}
```

### Implementation Notes
- 撤销Supabase session
- 清除客户端token

