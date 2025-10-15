# 关卡任务 API 规格说明

## GET /api/tasks/:id {#get-task}

获取关卡详情。

### Request

需要认证

Path Parameters:
- `id`: 关卡UUID

### Response

```json
{
  "success": true,
  "data": {
    "task": {
      "task_id": "uuid",
      "course_id": "uuid",
      "course_name": "HTML5基础",
      "task_name": "认识HTML标签",
      "description": "创建你的第一个HTML页面",
      "knowledge_content": "HTML是网页的骨架...",
      "code_template": {
        "html": "<!DOCTYPE html>\n<html>...",
        "css": "",
        "js": ""
      },
      "test_cases": [
        {
          "type": "output",
          "description": "页面应包含一个h1标题",
          "assertion": "document.querySelector('h1') !== null"
        }
      ],
      "difficulty": "easy",
      "xp_reward": 10,
      "coins_reward": 5,
      "order": 1
    },
    "user_progress": {
      "status": "in_progress",
      "attempts": 2,
      "best_score": 60,
      "last_code": {
        "html": "<h1>My Title</h1>",
        "css": "",
        "js": ""
      },
      "completion_time": null
    },
    "prerequisites": [],  // 前置关卡列表
    "next_task_id": "uuid"  // 下一关卡
  }
}
```

---

## POST /api/tasks/:id/start {#start-task}

开始关卡（标记为进行中）。

### Request

需要认证

Path Parameters:
- `id`: 关卡UUID

### Response

```json
{
  "success": true,
  "data": {
    "progress": {
      "status": "in_progress",
      "started_at": "2025-10-15T10:00:00Z"
    }
  },
  "message": "关卡已开始"
}
```

---

## POST /api/tasks/:id/submit {#submit-task}

提交关卡代码进行评判。

### Request

需要认证

```json
{
  "code": {
    "html": "<h1>Hello World</h1>",
    "css": "h1 { color: blue; }",
    "js": ""
  }
}
```

### Response - 成功通过

```json
{
  "success": true,
  "data": {
    "result": {
      "passed": true,
      "score": 100,
      "test_results": [
        {
          "description": "页面应包含一个h1标题",
          "passed": true
        },
        {
          "description": "标题颜色应为蓝色",
          "passed": true
        }
      ],
      "feedback": "太棒了！你成功完成了这个关卡。",
      "ai_comments": "代码结构清晰，完全符合要求。"
    },
    "rewards": {
      "xp_gained": 10,
      "coins_gained": 5,
      "new_level": null,  // 如果升级了则显示新等级
      "achievements_unlocked": [
        {
          "achievement_id": "uuid",
          "name": "初来乍到",
          "description": "完成第一个关卡",
          "icon_url": "/achievements/first-task.svg",
          "rarity": "common"
        }
      ]
    },
    "progress": {
      "status": "completed",
      "attempts": 3,
      "best_score": 100,
      "completion_time": "2025-10-15T10:05:00Z"
    },
    "next_task": {
      "task_id": "uuid",
      "task_name": "HTML文档结构",
      "unlocked": true
    }
  },
  "message": "恭喜！关卡完成"
}
```

### Response - 未通过

```json
{
  "success": true,
  "data": {
    "result": {
      "passed": false,
      "score": 50,
      "test_results": [
        {
          "description": "页面应包含一个h1标题",
          "passed": true
        },
        {
          "description": "标题颜色应为蓝色",
          "passed": false,
          "error": "期望颜色为rgb(0, 0, 255)，实际为rgb(0, 0, 0)"
        }
      ],
      "feedback": "还有一些问题需要修正。",
      "ai_comments": "检查CSS颜色属性的值是否正确。",
      "hints": [
        "尝试使用'blue'作为颜色值",
        "或使用RGB值：rgb(0, 0, 255)"
      ]
    },
    "progress": {
      "status": "in_progress",
      "attempts": 3,
      "best_score": 50
    }
  },
  "message": "继续努力"
}
```

### Implementation Notes
- 代码提交后触发以下流程：
  1. 安全检测（Edge Function预处理）
  2. 代码沙盒执行
  3. 测试用例验证
  4. AI评分和反馈
  5. 奖励计算（XP、金币、成就）
  6. 进度更新
- 如果通过（score >= 80），标记为completed
- 如果未通过，更新best_score并提供hints
- 每次提交计入attempts

---

## POST /api/tasks/:id/save {#save-draft}

保存代码草稿（自动保存）。

### Request

需要认证

```json
{
  "code": {
    "html": "<h1>Work in progress...</h1>",
    "css": "",
    "js": ""
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "saved_at": "2025-10-15T10:02:00Z"
  },
  "message": "草稿已保存"
}
```

### Implementation Notes
- 客户端每30秒自动保存
- 不触发AI评判
- 不计入attempts
- 仅更新`user_task_progress.last_code_*`

---

## GET /api/tasks/:id/hint {#get-hint}

获取AI提示（不计入提交次数）。

### Request

需要认证

Query Parameters:
- `code_html`: 当前HTML代码（可选）
- `code_css`: 当前CSS代码（可选）
- `code_js`: 当前JS代码（可选）

### Response

```json
{
  "success": true,
  "data": {
    "hint": {
      "type": "ai_generated",
      "content": "你已经正确创建了h1标签。现在需要添加CSS样式让标题变成蓝色。可以在<style>标签中添加：h1 { color: blue; }",
      "difficulty": "beginner",
      "progressive": true  // 提示是渐进式的，不会直接给出答案
    },
    "related_concepts": [
      {
        "name": "CSS颜色属性",
        "doc_url": "/docs/css-color"
      }
    ]
  },
  "message": "提示获取成功"
}
```

### Implementation Notes
- 基于用户当前代码和测试结果生成提示
- 渐进式提示：第1次给概念，第2次给方向，第3次给示例
- 不计入attempts
- 受AI API频率限制（每小时100次）

---

## GET /api/tasks/:id/solution {#get-solution}

查看参考答案（需要通过关卡或支付金币）。

### Request

需要认证

### Response - 已通过关卡

```json
{
  "success": true,
  "data": {
    "solution": {
      "code": {
        "html": "<!DOCTYPE html>\n<html>\n<head>\n  <title>参考答案</title>\n  <style>\n    h1 { color: blue; }\n  </style>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>",
        "css": "",
        "js": ""
      },
      "explanation": "这是一个标准的HTML文档结构...",
      "best_practices": [
        "使用语义化的标签",
        "将CSS样式放在<style>标签或外部文件中"
      ]
    }
  }
}
```

### Response - 未通过（需要金币）

```json
{
  "success": false,
  "error": {
    "code": "SOLUTION_LOCKED",
    "message": "查看答案需要花费10金币",
    "unlock_cost": 10,
    "current_coins": 5
  }
}
```

---

## POST /api/tasks/:id/reset {#reset-task}

重置关卡进度（重新开始）。

### Request

需要认证

### Response

```json
{
  "success": true,
  "data": {
    "progress": {
      "status": "in_progress",
      "attempts": 0,
      "best_score": 0,
      "last_code": {
        "html": "<!DOCTYPE html>...",  // 恢复到模板
        "css": "",
        "js": ""
      }
    }
  },
  "message": "关卡已重置"
}
```

### Implementation Notes
- 保留completion_time（如果已完成）
- 重置attempts和best_score
- 恢复代码模板
- 不影响已获得的XP和金币

---

## 错误代码

| Code | Description |
|------|-------------|
| `TASK_NOT_FOUND` | 关卡不存在 |
| `TASK_LOCKED` | 关卡未解锁（需要完成前置关卡） |
| `CODE_VALIDATION_FAILED` | 代码验证失败（安全检测） |
| `CODE_TOO_LARGE` | 代码过大（>1MB） |
| `DANGEROUS_CODE_DETECTED` | 检测到危险代码 |
| `SOLUTION_LOCKED` | 答案未解锁 |
| `INSUFFICIENT_COINS` | 金币不足 |

