# Tasks: GameCode Lab - 游戏化HTML5编程教育平台

**Created**: 2025-10-15  
**Feature Spec**: [spec.md](./spec.md)  
**Implementation Plan**: [plans/implementation-plan.md](./plans/implementation-plan.md)

---

## Task Overview

**Total Tasks**: 147  
**Phases**: 10 (Setup + Foundational + 5 User Stories + 2 Polish)  
**Estimated Duration**: 14 weeks  
**MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1)

### Task Distribution by Phase

| Phase | User Story | Task Count | Parallelizable | Duration |
|-------|------------|------------|----------------|----------|
| Phase 1 | Setup | 12 | 8 | Week 1-2 |
| Phase 2 | Foundational | 18 | 10 | Week 1-2 |
| Phase 3 | US1: 游客试用体验 | 25 | 15 | Week 3-4 |
| Phase 4 | US2: 学生用户闯关学习 | 22 | 12 | Week 5-6 |
| Phase 5 | US3: AI助教智能辅导 | 18 | 8 | Week 5-6 |
| Phase 6 | US4: 完成项目并分享作品 | 20 | 12 | Week 7-8 |
| Phase 7 | US5: 教师创建自定义课程 | 16 | 8 | Week 9-10 |
| Phase 8 | Polish & Integration | 10 | 5 | Week 11-12 |
| Phase 9 | Testing & QA | 6 | 3 | Week 13 |

---

## Dependencies & Execution Order

### Story Completion Order

```
Setup (Phase 1)
    ↓
Foundational (Phase 2)
    ↓
US1: 游客试用体验 (Phase 3) ← MVP Milestone
    ↓
US2: 学生闯关学习 (Phase 4) ┐
US3: AI助教辅导 (Phase 5)    ├─ Can run in parallel
    ↓
US4: 项目分享 (Phase 6)      │
US5: 教师课程 (Phase 7)      ┘
    ↓
Polish & Integration (Phase 8)
    ↓
Testing & QA (Phase 9)
```

### Critical Path
1. Setup → Foundational → US1 (Core Learning Experience)
2. US1 → US2 (Enhanced Learning)
3. US2 → US3 (AI Integration)
4. US3 → US4 (Community Features)
5. US2 → US5 (Teacher Tools, can parallel with US3/US4)

---

## Phase 1: Setup (Week 1-2)

**Goal**: Initialize Next.js project with Supabase and configure development environment

**Independent Test Criteria**:
- ✅ Next.js app runs successfully on localhost:3000
- ✅ Supabase connection established and verified
- ✅ Environment variables loaded correctly
- ✅ Basic routing works (/, /dashboard)
- ✅ Tailwind CSS styles apply correctly

### Tasks

- [ ] T001 Initialize Next.js 14 project with TypeScript in root directory
- [ ] T002 [P] Install and configure Tailwind CSS + shadcn/ui in next.config.js
- [ ] T003 [P] Install Zustand for state management in package.json
- [ ] T004 [P] Install CodeMirror 6 for code editor in package.json
- [ ] T005 [P] Install Framer Motion for animations in package.json
- [ ] T006 Create .env.local with Supabase credentials (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- [ ] T007 Create .env.example template file with all required environment variables
- [ ] T008 [P] Initialize Supabase client in lib/supabase.ts
- [ ] T009 [P] Create basic app layout structure in app/layout.tsx
- [ ] T010 [P] Create global styles in styles/globals.css
- [ ] T011 [P] Configure Next.js for Netlify deployment in netlify.toml
- [ ] T012 Create README.md with setup instructions and environment variable documentation

---

## Phase 2: Foundational (Week 1-2)

**Goal**: Implement core infrastructure that all user stories depend on

**Independent Test Criteria**:
- ✅ Supabase database schema created successfully
- ✅ RLS policies protect data access
- ✅ Authentication works (guest creation, register, login)
- ✅ Basic UI components render correctly
- ✅ State management stores work
- ✅ Edge Function for AI proxy deployed

### Database Setup

- [ ] T013 Create users table in Supabase with schema from data-model.md
- [ ] T014 [P] Create courses table in Supabase
- [ ] T015 [P] Create tasks table in Supabase
- [ ] T016 [P] Create user_task_progress table in Supabase
- [ ] T017 [P] Create works table in Supabase
- [ ] T018 [P] Create achievements table in Supabase
- [ ] T019 [P] Create user_achievements table in Supabase
- [ ] T020 [P] Create ai_conversations table in Supabase
- [ ] T021 [P] Create comments table in Supabase
- [ ] T022 [P] Create leaderboard table in Supabase
- [ ] T023 [P] Create work_likes table in Supabase
- [ ] T024 [P] Create work_favorites table in Supabase
- [ ] T025 Implement RLS policies for all tables per data-model.md
- [ ] T026 Create database triggers for updated_at and stats in Supabase
- [ ] T027 Seed initial data: official courses (Level 1-5) and achievements in Supabase

### Core Infrastructure

- [ ] T028 Create Supabase Edge Function: ai-proxy.ts for multi-provider AI API calls
- [ ] T029 Implement AI service降级mechanism in ai-proxy Edge Function
- [ ] T030 [P] Create shadcn/ui components: Button, Input, Card, Dialog, Tabs in components/ui/
- [ ] T031 [P] Create Header component with navigation in components/Header.tsx
- [ ] T032 [P] Create Footer component in components/Footer.tsx
- [ ] T033 [P] Create authStore with Zustand in stores/authStore.ts
- [ ] T034 [P] Create uiStore with Zustand in stores/uiStore.ts
- [ ] T035 Create utility functions in lib/utils.ts
- [ ] T036 Configure environment variables for all AI API keys in Supabase Edge Function settings

---

## Phase 3: US1 - 游客试用体验 (Week 3-4)

**User Story**: 首次访问的游客用户能够了解平台功能并开始学习编程基础

**Goal**: Enable guest users to auto-create temporary accounts, access first learning task, use code editor, get AI feedback, and earn achievements

**Independent Test Criteria**:
- ✅ 访问主页自动创建游客账号（30天试用）
- ✅ 游客可以浏览课程和选择第一个关卡
- ✅ 代码编辑器正常工作（HTML/CSS/JS三栏+实时预览）
- ✅ 提交代码后获得AI反馈
- ✅ 完成关卡后获得XP和成就徽章
- ✅ 关闭浏览器后重新访问能继续进度

### Authentication & User Management (US1)

- [ ] T037 [US1] Implement guest account auto-creation API in app/api/auth/guest/route.ts
- [ ] T038 [US1] Implement user registration API in app/api/auth/register/route.ts
- [ ] T039 [US1] Implement user login API in app/api/auth/login/route.ts
- [ ] T040 [US1] Implement guest upgrade API in app/api/auth/upgrade-guest/route.ts
- [ ] T041 [US1] Create auth hooks: useAuth(), useUser() in hooks/useAuth.ts
- [ ] T042 [US1] Implement JWT session management in authStore
- [ ] T043 [US1] Create trial period check middleware in middleware/trialCheck.ts

### Homepage & Onboarding (US1)

- [ ] T044 [P] [US1] Create homepage with "免费试用1个月" CTA in app/page.tsx
- [ ] T045 [P] [US1] Create hero section with platform introduction in components/Hero.tsx
- [ ] T046 [P] [US1] Create features showcase section in components/Features.tsx
- [ ] T047 [US1] Implement "开始学习" button that triggers guest creation
- [ ] T048 [P] [US1] Create新手引导modal component in components/OnboardingModal.tsx
- [ ] T049 [US1] Implement onboarding tutorial flow (3-step guide)

### Learning Dashboard (US1)

- [ ] T050 [US1] Create dashboard page layout in app/dashboard/page.tsx
- [ ] T051 [P] [US1] Create user info card component in components/UserCard.tsx
- [ ] T052 [P] [US1] Create learning path visualization in components/LearningPath.tsx
- [ ] T053 [P] [US1] Create "continue learning" quick access in components/ContinueLearning.tsx
- [ ] T054 [US1] Fetch and display user progress data via API

### Course & Task System (US1)

- [ ] T055 [US1] Create courses list page in app/courses/page.tsx
- [ ] T056 [US1] Implement GET /api/courses API endpoint
- [ ] T057 [US1] Create course detail page in app/courses/[id]/page.tsx
- [ ] T058 [US1] Implement GET /api/courses/:id/tasks API endpoint
- [ ] T059 [US1] Create task learning page (core) in app/learn/task/[id]/page.tsx
- [ ] T060 [US1] Implement GET /api/tasks/:id API endpoint

### Code Editor & Sandbox (US1)

- [ ] T061 [US1] Create CodeEditor component with CodeMirror 6 in components/CodeEditor.tsx
- [ ] T062 [P] [US1] Implement HTML editor pane with syntax highlighting
- [ ] T063 [P] [US1] Implement CSS editor pane with syntax highlighting
- [ ] T064 [P] [US1] Implement JavaScript editor pane with syntax highlighting
- [ ] T065 [US1] Create CodePreview component with iframe sandbox in components/CodePreview.tsx
- [ ] T066 [US1] Implement iframe sandbox security (sandbox attributes + CSP)
- [ ] T067 [US1] Implement real-time preview update (debounced 500ms)
- [ ] T068 [US1] Create editorStore with Zustand in stores/editorStore.ts
- [ ] T069 [US1] Implement code auto-save (every 30s) via POST /api/tasks/:id/save

### AI Feedback & Task Submission (US1)

- [ ] T070 [US1] Implement POST /api/tasks/:id/submit API endpoint
- [ ] T071 [US1] Create Supabase Edge Function: code-validator.ts for security checks
- [ ] T072 [US1] Integrate AI code checking via ai-proxy Edge Function
- [ ] T073 [US1] Create feedback display component in components/FeedbackPanel.tsx
- [ ] T074 [US1] Implement XP and coins reward calculation
- [ ] T075 [US1] Update user level and progress after task completion

### Achievements System (US1)

- [ ] T076 [US1] Create Supabase Edge Function: achievement-trigger.ts for unlocking achievements
- [ ] T077 [US1] Implement achievement unlocking logic (first task, streak days, etc.)
- [ ] T078 [P] [US1] Create achievement badge component in components/AchievementBadge.tsx
- [ ] T079 [P] [US1] Create achievement unlock animation with Framer Motion
- [ ] T080 [US1] Display unlocked achievements in dashboard

### Session Persistence (US1)

- [ ] T081 [US1] Implement session restoration from localStorage
- [ ] T082 [US1] Implement automatic session refresh before expiry
- [ ] T083 [US1] Handle browser close and reopen scenario
- [ ] T084 [US1] Sync draft code to server before session ends

---

## Phase 4: US2 - 学生用户闯关学习 (Week 5-6)

**User Story**: 注册学生用户系统学习HTML/CSS/JavaScript，从入门到实战

**Goal**: Enable registered students to progress through all 5 levels, track learning statistics, unlock features, and view learning curves

**Independent Test Criteria**:
- ✅ 学生可以完成所有5个Level的关卡
- ✅ 学习进度正确追踪和保存
- ✅ XP和金币系统正常工作
- ✅ 关卡解锁机制正确（完成前置关卡）
- ✅ 学习曲线图和统计数据准确显示
- ✅ 成就墙展示所有已获得成就

### Level System & Progression (US2)

- [ ] T085 [P] [US2] Seed Level 1 (HTML5基础) tasks (15 tasks) in Supabase
- [ ] T086 [P] [US2] Seed Level 2 (CSS样式) tasks (15 tasks) in Supabase
- [ ] T087 [P] [US2] Seed Level 3 (JS基础) tasks (15 tasks) in Supabase
- [ ] T088 [P] [US2] Seed Level 4 (DOM操作) tasks (15 tasks) in Supabase
- [ ] T089 [P] [US2] Seed Level 5 (综合实战) tasks (10 tasks) in Supabase
- [ ] T090 [US2] Implement task unlocking logic based on prerequisites
- [ ] T091 [US2] Implement level completion detection
- [ ] T092 [US2] Create level progress indicator component in components/LevelProgress.tsx

### XP & Coins System (US2)

- [ ] T093 [US2] Implement XP gain calculation on task completion
- [ ] T094 [US2] Implement level-up trigger when XP threshold reached
- [ ] T095 [US2] Create level-up animation component in components/LevelUpModal.tsx
- [ ] T096 [US2] Implement coins gain on task completion
- [ ] T097 [US2] Create XP and coins display component in components/XPCoinsDisplay.tsx

### Learning Statistics & Analytics (US2)

- [ ] T098 [US2] Implement GET /api/user/stats API endpoint
- [ ] T099 [US2] Create learning statistics dashboard page in app/dashboard/stats/page.tsx
- [ ] T100 [P] [US2] Create learning time tracker component in components/LearningTimeChart.tsx
- [ ] T101 [P] [US2] Create completed tasks chart component in components/CompletedTasksChart.tsx
- [ ] T102 [P] [US2] Create skills radar chart component in components/SkillsRadar.tsx
- [ ] T103 [US2] Calculate and display learning streak (consecutive days)

### Achievement Wall (US2)

- [ ] T104 [US2] Create achievement wall page in app/achievements/page.tsx
- [ ] T105 [P] [US2] Display all available achievements (earned + locked)
- [ ] T106 [P] [US2] Create achievement detail modal in components/AchievementDetailModal.tsx
- [ ] T107 [US2] Implement achievement filter and sort functionality

### Difficulty & Retry System (US2)

- [ ] T108 [US2] Implement task difficulty indicator display
- [ ] T109 [US2] Implement task retry functionality with attempt counter
- [ ] T110 [US2] Display best score for completed tasks
- [ ] T111 [US2] Implement hint system via GET /api/tasks/:id/hint

### Knowledge Gap Detection (US2)

- [ ] T112 [US2] Implement algorithm to detect skipped prerequisite tasks
- [ ] T113 [US2] Create recommendation engine for补充learning
- [ ] T114 [US2] Display knowledge gap warnings and suggestions

---

## Phase 5: US3 - AI助教智能辅导 (Week 5-6)

**User Story**: 学习过程中遇到困难的用户获得个性化的编程指导和错误解释

**Goal**: Integrate AI assistant for code explanation, error diagnosis, and natural language chat

**Independent Test Criteria**:
- ✅ 用户可以询问AI关于代码的问题
- ✅ AI能够分析用户代码并给出反馈
- ✅ AI响应时间在3秒内
- ✅ AI降级机制工作（DeepSeek失败时切换到GLM等）
- ✅ 对话历史正确保存和显示
- ✅ AI建议有实际帮助价值

### AI API Integration (US3)

- [ ] T115 [US3] Configure all AI API keys in Supabase Edge Function environment
- [ ] T116 [US3] Implement health check for AI providers in ai-proxy
- [ ] T117 [US3] Implement automatic failover logic (DeepSeek → GLM → Moonshot)
- [ ] T118 [US3] Implement AI response caching in Supabase database
- [ ] T119 [US3] Create API rate limiter (100 calls/hour per user)

### AI Code Explanation (US3)

- [ ] T120 [US3] Implement POST /api/ai/explain API endpoint
- [ ] T121 [US3] Create code explanation panel component in components/AIExplanation.tsx
- [ ] T122 [US3] Implement "解释这段代码" button in code editor
- [ ] T123 [US3] Display explanation with syntax highlighting

### AI Code Checking & Error Diagnosis (US3)

- [ ] T124 [US3] Implement POST /api/ai/check API endpoint
- [ ] T125 [US3] Integrate with code-validator Edge Function
- [ ] T126 [US3] Create error diagnosis panel in components/ErrorDiagnosis.tsx
- [ ] T127 [US3] Display AI suggestions for fixing errors
- [ ] T128 [US3] Implement one-click code fix suggestions

### AI Chat Interface (US3)

- [ ] T129 [US3] Implement POST /api/ai/chat API endpoint
- [ ] T130 [US3] Create AI chat modal component in components/AIChat.tsx
- [ ] T131 [US3] Implement chat message history display
- [ ] T132 [US3] Implement "询问AI助教" button globally
- [ ] T133 [US3] Save conversation history to ai_conversations table
- [ ] T134 [US3] Implement conversation context (include current code and task)

### Personalized Learning Recommendations (US3)

- [ ] T135 [US3] Implement learning trajectory tracking
- [ ] T136 [US3] Analyze user's common mistakes patterns
- [ ] T137 [US3] Generate personalized review suggestions
- [ ] T138 [US3] Create recommendation panel in dashboard

---

## Phase 6: US4 - 完成项目并分享作品 (Week 7-8)

**User Story**: 已有一定基础的学生用户完成完整网页项目并分享给社区

**Goal**: Enable users to save works, publish to community, and interact with others' works

**Independent Test Criteria**:
- ✅ 用户可以保存作品到个人作品集
- ✅ 用户可以发布作品到社区
- ✅ 社区作品墙正常展示所有公开作品
- ✅ 用户可以点赞、收藏、评论作品
- ✅ "每日精选"功能正常工作
- ✅ AI点评精选作品功能正常

### Work Management (US4)

- [ ] T139 [US4] Implement POST /api/works API endpoint for creating works
- [ ] T140 [US4] Implement GET /api/works/:id API endpoint
- [ ] T141 [US4] Implement PUT /api/works/:id API endpoint for updating works
- [ ] T142 [US4] Implement DELETE /api/works/:id API endpoint
- [ ] T143 [US4] Create "保存作品" button in code editor
- [ ] T144 [US4] Create work save/publish modal in components/WorkSaveModal.tsx
- [ ] T145 [US4] Implement work version history (store last 10 versions)

### Community Works Gallery (US4)

- [ ] T146 [US4] Implement GET /api/works API endpoint with filters
- [ ] T147 [US4] Create community works page in app/community/page.tsx
- [ ] T148 [P] [US4] Create work card component in components/WorkCard.tsx
- [ ] T149 [P] [US4] Implement infinite scroll for works list
- [ ] T150 [US4] Implement work filtering (by tag, difficulty, date)
- [ ] T151 [US4] Implement work sorting (hot, new, likes)
- [ ] T152 [US4] Create work search functionality

### Work Interaction (US4)

- [ ] T153 [US4] Implement POST /api/works/:id/like API endpoint
- [ ] T154 [US4] Implement POST /api/works/:id/favorite API endpoint
- [ ] T155 [US4] Implement POST /api/works/:id/comments API endpoint
- [ ] T156 [US4] Implement GET /api/works/:id/comments API endpoint
- [ ] T157 [US4] Create comment section component in components/CommentSection.tsx
- [ ] T158 [US4] Implement like button with animation
- [ ] T159 [US4] Implement favorite button functionality

### Featured Works (US4)

- [ ] T160 [US4] Implement GET /api/community/featured API endpoint
- [ ] T161 [US4] Create AI-powered work scoring algorithm
- [ ] T162 [US4] Implement daily featured works selection
- [ ] T163 [US4] Create featured works carousel in components/FeaturedWorks.tsx
- [ ] T164 [US4] Display "每日精选" badge on featured works

### User Profile & Portfolio (US4)

- [ ] T165 [US4] Create user profile page in app/profile/[userId]/page.tsx
- [ ] T166 [P] [US4] Display user information and achievements
- [ ] T167 [P] [US4] Display user's public works portfolio
- [ ] T168 [P] [US4] Display user's learning statistics
- [ ] T169 [US4] Implement profile edit functionality

---

## Phase 7: US5 - 教师创建自定义课程 (Week 9-10)

**User Story**: 教师用户为学生创建定制化的学习内容和考核任务

**Goal**: Enable teachers to create courses, design tasks, and view student progress

**Independent Test Criteria**:
- ✅ 教师可以创建新课程
- ✅ 教师可以设计关卡和测试用例
- ✅ 教师可以邀请AI生成讲解内容
- ✅ 学生可以通过链接加入课程
- ✅ 教师可以查看学生进度
- ✅ 课程数据分析正常显示

### Teacher Dashboard (US5)

- [ ] T170 [US5] Create teacher dashboard page in app/teacher/page.tsx
- [ ] T171 [P] [US5] Display teacher's courses list
- [ ] T172 [P] [US5] Display student enrollment statistics
- [ ] T173 [US5] Create "创建新课程" button and flow

### Course Creation & Management (US5)

- [ ] T174 [US5] Implement POST /api/teacher/courses API endpoint
- [ ] T175 [US5] Create course creation form in app/teacher/courses/new/page.tsx
- [ ] T176 [US5] Implement course metadata editor (name, description, cover)
- [ ] T177 [US5] Create task editor component in components/TaskEditor.tsx
- [ ] T178 [US5] Implement code template editor in task editor
- [ ] T179 [US5] Implement test case editor with validation
- [ ] T180 [US5] Create AI助手button to generate task explanations
- [ ] T181 [US5] Implement course publish/unpublish functionality
- [ ] T182 [US5] Generate course invitation link/code

### Student Progress Tracking (US5)

- [ ] T183 [US5] Implement GET /api/teacher/courses/:id/students API endpoint
- [ ] T184 [US5] Create student progress dashboard in app/teacher/courses/[id]/students/page.tsx
- [ ] T185 [P] [US5] Display student completion rates
- [ ] T186 [P] [US5] Display average scores per task
- [ ] T187 [US5] Create student detail view with full learning history
- [ ] T188 [US5] Export student data as CSV/Excel

### Course Analytics (US5)

- [ ] T189 [US5] Implement course-level analytics in Supabase
- [ ] T190 [P] [US5] Display task difficulty distribution
- [ ] T191 [P] [US5] Display student engagement metrics
- [ ] T192 [P] [US5] Identify challenging tasks (low completion rate)
- [ ] T193 [US5] Generate insights and recommendations

---

## Phase 8: Polish & Cross-Cutting Concerns (Week 11-12)

**Goal**: Implement remaining features and polish the user experience

### Gamification Features

- [ ] T194 [P] Create排行榜page in app/leaderboard/page.tsx
- [ ] T195 [P] Implement GET /api/leaderboard/:type API endpoint
- [ ] T196 [P] Display leaderboard by XP, speed, works count
- [ ] T197 [P] Implement daily/weekly/monthly leaderboard periods
- [ ] T198 Create AI Boss challenge system in app/challenge/page.tsx
- [ ] T199 Implement random coding challenge generation via AI

### Trial Period Management

- [ ] T200 Implement trial period reminder system (7/3/1 days before expiry)
- [ ] T201 Create trial expiry notification component in components/TrialExpiry.tsx
- [ ] T202 Implement read-only mode after trial expiry
- [ ] T203 Create Supabase Edge Function for guest account cleanup (runs daily)

### Internationalization

- [ ] T204 Install and configure next-intl for i18n
- [ ] T205 [P] Create translation files for Chinese (zh)
- [ ] T206 [P] Create translation files for English (en)
- [ ] T207 Implement language switcher component in Header

### Performance Optimization

- [ ] T208 Implement code splitting and lazy loading
- [ ] T209 Optimize images with Next.js Image component
- [ ] T210 Implement API response caching
- [ ] T211 Add loading skeletons for async components

---

## Phase 9: Testing & QA (Week 13)

**Goal**: Ensure all features work correctly and meet quality standards

### End-to-End Testing

- [ ] T212 Write E2E test for guest account creation and first task completion
- [ ] T213 Write E2E test for complete user registration and upgrade flow
- [ ] T214 Write E2E test for code editor and AI feedback
- [ ] T215 Write E2E test for work publish and community interaction
- [ ] T216 Write E2E test for teacher course creation workflow

### Final QA & Bug Fixes

- [ ] T217 Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] T218 Mobile responsiveness testing
- [ ] T219 Performance audit with Lighthouse (target score >90)
- [ ] T220 Security audit (RLS policies, XSS prevention, code sandbox)
- [ ] T221 Accessibility audit (WCAG 2.1 AA compliance)

---

## Parallel Execution Examples

### Phase 3 (US1) - Week 3
**Team A (Frontend)**:
- T044-T049 (Homepage & Onboarding)
- T050-T054 (Dashboard)

**Team B (Editor)**:
- T061-T069 (Code Editor & Sandbox)

**Team C (Backend)**:
- T037-T043 (Authentication APIs)
- T055-T060 (Course/Task APIs)

### Phase 5 (US3) - Week 5-6
**Team A**:
- T120-T128 (AI Code features)

**Team B**:
- T129-T134 (AI Chat)

**Team C**:
- T115-T119 (AI Infrastructure)

---

## Implementation Strategy

### MVP First Approach

**MVP = Phase 1 + Phase 2 + Phase 3 (US1)**

Focus on delivering core value first:
1. **Week 1-2**: Setup + Foundational (12 + 18 = 30 tasks)
2. **Week 3-4**: US1 - Guest trial experience (25 tasks)

**MVP Delivers**:
- Guest users can try the platform
- Complete first learning task
- Use code editor with real-time preview
- Get AI feedback
- Earn first achievement

**Post-MVP Increments**:
- **Week 5-6**: US2 (Enhanced learning) + US3 (AI assistant) - 40 tasks
- **Week 7-8**: US4 (Community) - 20 tasks
- **Week 9-10**: US5 (Teacher tools) - 16 tasks
- **Week 11-13**: Polish + Testing - 16 tasks

### Incremental Delivery

Each phase delivers independently testable value:
- ✅ US1: Guest can complete first task
- ✅ US2: Students can progress through all levels
- ✅ US3: AI assistant provides help
- ✅ US4: Users share and interact with works
- ✅ US5: Teachers create custom courses

---

## Notes

- All tasks include specific file paths for implementation
- [P] marker indicates parallelizable tasks
- [USX] marker indicates which user story the task serves
- Tasks are ordered by logical dependency
- Estimated 147 total tasks over 14 weeks
- MVP can be delivered in 4 weeks (Setup + Foundational + US1)

