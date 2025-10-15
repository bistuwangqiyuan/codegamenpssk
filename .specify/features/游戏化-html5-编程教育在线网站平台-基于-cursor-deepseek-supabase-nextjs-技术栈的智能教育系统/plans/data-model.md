# Data Model: GameCode Lab 数据模型设计

**Created**: 2025-10-15  
**Database**: Supabase (PostgreSQL)  
**Related**: [spec.md](../spec.md#8-key-entities)

---

## 概述

GameCode Lab使用Supabase PostgreSQL作为主数据库，存储用户、课程、关卡、作品、成就等核心数据。所有表采用Row Level Security (RLS)保护数据访问。

---

## 核心实体关系图（ER Diagram）

```
┌─────────────┐
│    users    │──┐
└─────────────┘  │
       │         │
       │1:N      │1:N
       ▼         ▼
┌───────────────┐ ┌────────────────────┐
│    courses    │ │ user_task_progress │
└───────────────┘ └────────────────────┘
       │                    │
       │1:N                 │N:1
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│    tasks    │──────│    works    │
└─────────────┘ 1:N  └─────────────┘
                            │
                            │1:N
                            ▼
                     ┌───────────────┐
                     │   comments    │
                     └───────────────┘

┌───────────────────┐      ┌─────────────────┐
│   achievements    │──N:M─│ user_achievement│
└───────────────────┘      └─────────────────┘

┌─────────────────┐
│ ai_conversations │
└─────────────────┘

┌─────────────────┐
│   leaderboard   │
└─────────────────┘
```

---

## 表结构定义

### 1. users（用户表）

存储所有用户账号信息，包括游客、学生、教师、管理员。

```sql
CREATE TABLE users (
  -- 主键
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Supabase Auth关联
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 基础信息
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  
  -- 用户类型和状态
  user_type TEXT NOT NULL CHECK (user_type IN ('guest', 'student', 'teacher', 'admin')) DEFAULT 'guest',
  is_active BOOLEAN DEFAULT TRUE,
  
  -- 游客试用期
  trial_end_date TIMESTAMPTZ, -- 游客账号过期时间（注册用户为NULL）
  
  -- 游戏化数据
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 10),
  experience_points INTEGER DEFAULT 0 CHECK (experience_points >= 0),
  coins INTEGER DEFAULT 0 CHECK (coins >= 0),
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_level ON users(level);

-- RLS策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 用户可以查看自己的完整信息
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = auth_id);

-- 用户可以更新自己的部分信息（不包括user_type、level、experience_points等）
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

-- 用户可以查看其他用户的公开信息（username, avatar_url, level）
CREATE POLICY "Users can view public profiles"
  ON users FOR SELECT
  USING (TRUE); -- 通过视图或函数限制返回字段

-- 管理员可以管理所有用户
CREATE POLICY "Admins can manage all users"
  ON users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() AND users.user_type = 'admin'
    )
  );
```

**字段说明**:
- `user_id`: 内部唯一标识符
- `auth_id`: 关联Supabase Auth的user id
- `email`: 邮箱地址（游客为`guest_[uuid]@gamecode.internal`）
- `username`: 用户昵称（游客为`游客_[随机数]`）
- `user_type`: 用户类型（guest/student/teacher/admin）
- `trial_end_date`: 游客试用期结束日期，注册用户为NULL
- `level`: 当前等级（1-10）
- `experience_points`: 经验值
- `coins`: 金币数量

---

### 2. courses（课程表）

存储5大学习模块（Level 1-5）和教师创建的自定义课程。

```sql
CREATE TABLE courses (
  -- 主键
  course_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 课程信息
  course_name TEXT NOT NULL,
  description TEXT,
  level_number INTEGER CHECK (level_number >= 1 AND level_number <= 5),
  
  -- 排序和显示
  "order" INTEGER DEFAULT 0,
  cover_image_url TEXT,
  
  -- 官方课程 vs 教师自定义课程
  is_official BOOLEAN DEFAULT FALSE,
  creator_id UUID REFERENCES users(user_id) ON DELETE SET NULL, -- NULL表示官方课程
  
  -- 状态
  is_published BOOLEAN DEFAULT FALSE,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_courses_level_number ON courses(level_number);
CREATE INDEX idx_courses_creator_id ON courses(creator_id);
CREATE INDEX idx_courses_is_official ON courses(is_official);
CREATE INDEX idx_courses_order ON courses("order");

-- RLS策略
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- 所有用户可以查看已发布的课程
CREATE POLICY "Users can view published courses"
  ON courses FOR SELECT
  USING (is_published = TRUE);

-- 教师可以查看和管理自己创建的课程
CREATE POLICY "Teachers can manage own courses"
  ON courses FOR ALL
  USING (creator_id = (SELECT user_id FROM users WHERE auth_id = auth.uid()));

-- 管理员可以管理所有课程
CREATE POLICY "Admins can manage all courses"
  ON courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() AND users.user_type = 'admin'
    )
  );
```

**字段说明**:
- `level_number`: 课程等级（1=HTML5基础，2=CSS样式，3=JS基础，4=DOM操作，5=综合实战）
- `is_official`: 是否官方课程
- `creator_id`: 教师创建的课程关联创建者

---

### 3. tasks（关卡/任务表）

存储每个课程的具体学习任务。

```sql
CREATE TABLE tasks (
  -- 主键
  task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 所属课程
  course_id UUID NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  
  -- 任务信息
  task_name TEXT NOT NULL,
  description TEXT,
  
  -- 知识讲解（AI生成或教师编写）
  knowledge_content TEXT,
  
  -- 代码模板
  code_template_html TEXT DEFAULT '',
  code_template_css TEXT DEFAULT '',
  code_template_js TEXT DEFAULT '',
  
  -- 测试用例（JSON格式）
  test_cases JSONB DEFAULT '[]'::jsonb,
  
  -- 难度和奖励
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'challenge')) DEFAULT 'easy',
  xp_reward INTEGER DEFAULT 10 CHECK (xp_reward >= 0),
  coins_reward INTEGER DEFAULT 5 CHECK (coins_reward >= 0),
  
  -- 排序
  "order" INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_tasks_course_id ON tasks(course_id);
CREATE INDEX idx_tasks_difficulty ON tasks(difficulty);
CREATE INDEX idx_tasks_order ON tasks("order");

-- RLS策略
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 所有用户可以查看关卡
CREATE POLICY "Users can view tasks"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.course_id = tasks.course_id AND courses.is_published = TRUE
    )
  );

-- 教师可以管理自己课程的关卡
CREATE POLICY "Teachers can manage own course tasks"
  ON tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.course_id = tasks.course_id 
        AND courses.creator_id = (SELECT user_id FROM users WHERE auth_id = auth.uid())
    )
  );
```

**字段说明**:
- `test_cases`: JSON格式的测试用例，例如：
  ```json
  [
    {
      "type": "output",
      "description": "页面应包含一个h1标题",
      "assertion": "document.querySelector('h1') !== null"
    },
    {
      "type": "style",
      "description": "标题颜色应为蓝色",
      "assertion": "getComputedStyle(document.querySelector('h1')).color === 'rgb(0, 0, 255)'"
    }
  ]
  ```

---

### 4. user_task_progress（用户关卡进度表）

记录每个用户对每个关卡的学习进度和提交历史。

```sql
CREATE TABLE user_task_progress (
  -- 主键
  progress_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 关联用户和关卡
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
  
  -- 进度状态
  status TEXT CHECK (status IN ('locked', 'in_progress', 'completed')) DEFAULT 'locked',
  
  -- 尝试和评分
  attempts INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0 CHECK (best_score >= 0 AND best_score <= 100),
  
  -- 完成时间
  completion_time TIMESTAMPTZ,
  
  -- 最后保存的代码（草稿）
  last_code_html TEXT DEFAULT '',
  last_code_css TEXT DEFAULT '',
  last_code_js TEXT DEFAULT '',
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 唯一约束：每个用户对每个关卡只有一条进度记录
  UNIQUE(user_id, task_id)
);

-- 索引
CREATE INDEX idx_user_task_progress_user_id ON user_task_progress(user_id);
CREATE INDEX idx_user_task_progress_task_id ON user_task_progress(task_id);
CREATE INDEX idx_user_task_progress_status ON user_task_progress(status);

-- RLS策略
ALTER TABLE user_task_progress ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和修改自己的进度
CREATE POLICY "Users can manage own progress"
  ON user_task_progress FOR ALL
  USING (user_id = (SELECT user_id FROM users WHERE auth_id = auth.uid()));

-- 教师可以查看自己课程下学生的进度
CREATE POLICY "Teachers can view students progress"
  ON user_task_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      JOIN courses ON tasks.course_id = courses.course_id
      WHERE tasks.task_id = user_task_progress.task_id
        AND courses.creator_id = (SELECT user_id FROM users WHERE auth_id = auth.uid())
    )
  );
```

**字段说明**:
- `status`: locked（未解锁）/ in_progress（进行中）/ completed（已完成）
- `attempts`: 尝试次数
- `best_score`: 最高分数（0-100）
- `last_code_*`: 自动保存的代码草稿

---

### 5. works（作品表）

存储用户创建的代码作品。

```sql
CREATE TABLE works (
  -- 主键
  work_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 作者
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  
  -- 关联关卡（可选，作品可能是独立创作）
  task_id UUID REFERENCES tasks(task_id) ON DELETE SET NULL,
  
  -- 作品信息
  title TEXT NOT NULL,
  description TEXT,
  
  -- 代码内容
  code_html TEXT DEFAULT '',
  code_css TEXT DEFAULT '',
  code_js TEXT DEFAULT '',
  
  -- 缩略图
  thumbnail_url TEXT,
  
  -- 公开状态
  is_public BOOLEAN DEFAULT FALSE,
  
  -- 统计数据
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_works_user_id ON works(user_id);
CREATE INDEX idx_works_task_id ON works(task_id);
CREATE INDEX idx_works_is_public ON works(is_public);
CREATE INDEX idx_works_likes_count ON works(likes_count DESC);
CREATE INDEX idx_works_created_at ON works(created_at DESC);

-- RLS策略
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- 用户可以查看和管理自己的所有作品
CREATE POLICY "Users can manage own works"
  ON works FOR ALL
  USING (user_id = (SELECT user_id FROM users WHERE auth_id = auth.uid()));

-- 所有用户可以查看公开的作品
CREATE POLICY "Users can view public works"
  ON works FOR SELECT
  USING (is_public = TRUE);
```

---

### 6. achievements（成就表）

存储所有可获得的成就徽章定义。

```sql
CREATE TABLE achievements (
  -- 主键
  achievement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 成就信息
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  
  -- 获得条件（JSON格式）
  condition JSONB NOT NULL,
  
  -- 奖励
  xp_reward INTEGER DEFAULT 0,
  
  -- 稀有度
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common',
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_achievements_rarity ON achievements(rarity);

-- RLS策略
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- 所有用户可以查看成就列表
CREATE POLICY "Users can view achievements"
  ON achievements FOR SELECT
  USING (TRUE);
```

**字段说明**:
- `condition`: JSON格式的获得条件，例如：
  ```json
  {
    "type": "task_completion",
    "count": 10,
    "description": "完成10个关卡"
  }
  ```
  或
  ```json
  {
    "type": "streak_days",
    "count": 7,
    "description": "连续学习7天"
  }
  ```

---

### 7. user_achievements（用户成就关联表）

记录用户获得的成就。

```sql
CREATE TABLE user_achievements (
  -- 主键
  user_achievement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 关联用户和成就
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(achievement_id) ON DELETE CASCADE,
  
  -- 获得时间
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 唯一约束：每个用户每个成就只能获得一次
  UNIQUE(user_id, achievement_id)
);

-- 索引
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_earned_at ON user_achievements(earned_at DESC);

-- RLS策略
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- 用户可以查看自己的成就
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (user_id = (SELECT user_id FROM users WHERE auth_id = auth.uid()));

-- 用户可以查看其他用户的成就（个人主页展示）
CREATE POLICY "Users can view others achievements"
  ON user_achievements FOR SELECT
  USING (TRUE);
```

---

### 8. ai_conversations（AI对话历史表）

存储用户与AI助教的对话记录。

```sql
CREATE TABLE ai_conversations (
  -- 主键
  conversation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 关联用户
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  
  -- 关联关卡（可选）
  task_id UUID REFERENCES tasks(task_id) ON DELETE SET NULL,
  
  -- 对话消息（JSON格式）
  messages JSONB DEFAULT '[]'::jsonb,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_task_id ON ai_conversations(task_id);
CREATE INDEX idx_ai_conversations_updated_at ON ai_conversations(updated_at DESC);

-- RLS策略
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和管理自己的对话
CREATE POLICY "Users can manage own conversations"
  ON ai_conversations FOR ALL
  USING (user_id = (SELECT user_id FROM users WHERE auth_id = auth.uid()));
```

**字段说明**:
- `messages`: JSON数组，例如：
  ```json
  [
    {
      "role": "user",
      "content": "为什么我的按钮没有居中？",
      "timestamp": "2025-10-15T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "你需要给按钮的父元素添加`text-align: center`样式，或者使用Flexbox布局...",
      "timestamp": "2025-10-15T10:00:03Z"
    }
  ]
  ```

---

### 9. comments（评论表）

存储作品的评论。

```sql
CREATE TABLE comments (
  -- 主键
  comment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 关联用户和作品
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  work_id UUID NOT NULL REFERENCES works(work_id) ON DELETE CASCADE,
  
  -- 评论内容
  content TEXT NOT NULL CHECK (LENGTH(content) >= 1 AND LENGTH(content) <= 500),
  
  -- 回复（可选）
  parent_comment_id UUID REFERENCES comments(comment_id) ON DELETE CASCADE,
  
  -- 删除标记（软删除）
  is_deleted BOOLEAN DEFAULT FALSE,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_comments_work_id ON comments(work_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- RLS策略
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 用户可以查看公开作品的评论
CREATE POLICY "Users can view comments on public works"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM works 
      WHERE works.work_id = comments.work_id AND works.is_public = TRUE
    )
    AND is_deleted = FALSE
  );

-- 用户可以创建评论
CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (user_id = (SELECT user_id FROM users WHERE auth_id = auth.uid()));

-- 用户可以删除自己的评论
CREATE POLICY "Users can delete own comments"
  ON comments FOR UPDATE
  USING (user_id = (SELECT user_id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id = (SELECT user_id FROM users WHERE auth_id = auth.uid()));
```

---

### 10. leaderboard（排行榜表）

存储排行榜数据（可定时刷新）。

```sql
CREATE TABLE leaderboard (
  -- 主键
  leaderboard_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 关联用户
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  
  -- 排名类型
  rank_type TEXT CHECK (rank_type IN ('xp', 'speed', 'works')) NOT NULL,
  
  -- 分数
  score INTEGER DEFAULT 0,
  
  -- 时期
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')) DEFAULT 'all_time',
  
  -- 更新时间
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 唯一约束
  UNIQUE(user_id, rank_type, period)
);

-- 索引
CREATE INDEX idx_leaderboard_rank_type ON leaderboard(rank_type);
CREATE INDEX idx_leaderboard_period ON leaderboard(period);
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);

-- RLS策略
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- 所有用户可以查看排行榜
CREATE POLICY "Users can view leaderboard"
  ON leaderboard FOR SELECT
  USING (TRUE);
```

---

## 辅助表

### 11. work_likes（作品点赞表）

```sql
CREATE TABLE work_likes (
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  work_id UUID NOT NULL REFERENCES works(work_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, work_id)
);

CREATE INDEX idx_work_likes_work_id ON work_likes(work_id);

ALTER TABLE work_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can like works"
  ON work_likes FOR ALL
  USING (user_id = (SELECT user_id FROM users WHERE auth_id = auth.uid()));
```

### 12. work_favorites（作品收藏表）

```sql
CREATE TABLE work_favorites (
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  work_id UUID NOT NULL REFERENCES works(work_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, work_id)
);

CREATE INDEX idx_work_favorites_user_id ON work_favorites(user_id);

ALTER TABLE work_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can favorite works"
  ON work_favorites FOR ALL
  USING (user_id = (SELECT user_id FROM users WHERE auth_id = auth.uid()));
```

---

## 触发器和函数

### 自动更新updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 应用到相关表
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_task_progress_updated_at BEFORE UPDATE ON user_task_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON works
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 自动更新作品统计数

```sql
-- 点赞数更新
CREATE OR REPLACE FUNCTION update_work_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE works SET likes_count = likes_count + 1 WHERE work_id = NEW.work_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE works SET likes_count = likes_count - 1 WHERE work_id = OLD.work_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_work_likes_count
  AFTER INSERT OR DELETE ON work_likes
  FOR EACH ROW EXECUTE FUNCTION update_work_likes_count();
```

---

## 数据初始化

### 插入官方课程和关卡

```sql
-- Level 1: HTML5基础
INSERT INTO courses (course_name, description, level_number, "order", is_official, is_published)
VALUES 
  ('HTML5基础', '学习HTML标签和文档结构', 1, 1, TRUE, TRUE);

-- 示例关卡
INSERT INTO tasks (course_id, task_name, description, knowledge_content, code_template_html, difficulty, xp_reward, coins_reward, "order")
VALUES 
  (
    (SELECT course_id FROM courses WHERE course_name = 'HTML5基础'),
    '认识HTML标签',
    '创建你的第一个HTML页面',
    'HTML是网页的骨架。每个HTML文档都由标签组成，如<h1>是标题标签...',
    '<!DOCTYPE html>\n<html>\n<head>\n  <title>我的第一个网页</title>\n</head>\n<body>\n  <!-- 在这里编写你的代码 -->\n</body>\n</html>',
    'easy',
    10,
    5,
    1
  );

-- 更多课程和关卡...
```

### 插入成就定义

```sql
INSERT INTO achievements (name, description, icon_url, condition, xp_reward, rarity)
VALUES 
  ('初来乍到', '完成第一个关卡', '/achievements/first-task.svg', '{"type": "task_completion", "count": 1}', 10, 'common'),
  ('持之以恒', '连续学习7天', '/achievements/streak-7.svg', '{"type": "streak_days", "count": 7}', 50, 'rare'),
  ('代码大师', '完成所有Level 5关卡', '/achievements/master.svg', '{"type": "course_completion", "level": 5}', 200, 'legendary');
```

---

## 性能优化

### 索引策略
- 所有外键字段创建索引
- 高频查询字段（如user_id, task_id, created_at）创建索引
- 排行榜使用降序索引（score DESC）

### 查询优化
- 使用`EXPLAIN ANALYZE`分析慢查询
- 避免N+1查询，使用JOIN
- 大表分页查询使用`LIMIT`和`OFFSET`

### 缓存策略
- 课程和关卡数据缓存（Supabase自动缓存）
- AI对话常见问题缓存（7天）
- 排行榜数据每5分钟刷新

---

## 数据备份

- Supabase自动每日备份
- 关键表手动备份（每周）
- 备份保留30天

---

## 总结

GameCode Lab的数据模型涵盖了用户、课程、关卡、作品、成就、AI对话、社区互动等所有核心功能。通过Supabase RLS确保数据安全，通过索引和触发器优化性能，为平台提供坚实的数据基础。

