-- 初始课程和任务数据

-- 插入课程
INSERT INTO courses (id, title, description, level_number, order_index, icon) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'HTML5基础', '学习HTML标签和网页结构', 1, 1, '📝'),
  ('c2222222-2222-2222-2222-222222222222', 'CSS样式设计', '掌握CSS样式和布局技巧', 2, 2, '🎨'),
  ('c3333333-3333-3333-3333-333333333333', 'JavaScript编程', '学习JavaScript基础语法', 3, 3, '⚡'),
  ('c4444444-4444-4444-4444-444444444444', 'DOM操作', '掌握DOM操作和事件处理', 4, 4, '🔧'),
  ('c5555555-5555-5555-5555-555555555555', '综合实战项目', '完成完整的Web应用开发', 5, 5, '🚀');

-- 插入Level 1: HTML5基础 任务
INSERT INTO tasks (course_id, title, description, instructions, starter_html, xp_reward, coins_reward, order_index, difficulty) VALUES
  ('c1111111-1111-1111-1111-111111111111', '第一个网页', '创建你的第一个HTML页面', 
   E'1. 在HTML编辑器中输入：<h1>Hello World</h1>\n2. 点击"运行"查看效果\n3. 尝试修改文字内容',
   '', 10, 5, 1, 'easy'),
  
  ('c1111111-1111-1111-1111-111111111111', '段落和换行', '学习使用<p>标签', 
   E'使用<p>标签创建3个段落，每个段落介绍你自己',
   '<h1>关于我</h1>\n<!-- 在这里添加3个段落 -->', 15, 8, 2, 'easy'),
  
  ('c1111111-1111-1111-1111-111111111111', '无序列表', '创建购物清单', 
   E'使用<ul>和<li>标签创建一个包含5个物品的购物清单',
   '<h2>购物清单</h2>\n<!-- 在这里添加无序列表 -->', 20, 10, 3, 'easy'),
  
  ('c1111111-1111-1111-1111-111111111111', '有序列表', '制作学习计划', 
   E'使用<ol>和<li>标签创建今天的学习计划',
   '<h2>今日计划</h2>\n<!-- 在这里添加有序列表 -->', 20, 10, 4, 'easy'),
  
  ('c1111111-1111-1111-1111-111111111111', '图片插入', '添加你喜欢的图片', 
   E'使用<img>标签插入一张图片（可以使用网络图片URL）',
   '<h2>我的相册</h2>\n<!-- 在这里添加img标签 -->', 25, 12, 5, 'medium');

-- 插入Level 2: CSS样式 任务
INSERT INTO tasks (course_id, title, description, instructions, starter_html, starter_css, xp_reward, coins_reward, order_index, difficulty) VALUES
  ('c2222222-2222-2222-2222-222222222222', '文字颜色', '改变标题颜色', 
   E'使用CSS将h1标题改为蓝色',
   '<h1>彩色标题</h1>',
   '/* 在这里添加CSS */\nh1 {\n  \n}', 15, 8, 1, 'easy'),
  
  ('c2222222-2222-2222-2222-222222222222', '背景颜色', '设置页面背景', 
   E'为body设置一个浅色背景',
   '<h1>欢迎来到我的网站</h1>\n<p>这是一个漂亮的页面</p>',
   'body {\n  /* 添加背景颜色 */\n}', 20, 10, 2, 'easy'),
  
  ('c2222222-2222-2222-2222-222222222222', '边框样式', '创建卡片效果', 
   E'为div添加边框、内边距和圆角',
   '<div class="card">\n  <h3>卡片标题</h3>\n  <p>卡片内容</p>\n</div>',
   '.card {\n  /* 添加边框、padding、border-radius */\n}', 25, 12, 3, 'medium');

-- 插入Level 3: JavaScript 任务
INSERT INTO tasks (course_id, title, description, instructions, starter_html, starter_js, xp_reward, coins_reward, order_index, difficulty) VALUES
  ('c3333333-3333-3333-3333-333333333333', '第一个程序', '在控制台输出文字', 
   E'使用console.log()输出"Hello JavaScript"',
   '<h1>打开浏览器控制台查看输出</h1>',
   '// 在这里编写代码\n', 15, 8, 1, 'easy'),
  
  ('c3333333-3333-3333-3333-333333333333', '变量声明', '创建和使用变量', 
   E'声明name变量并在页面中显示',
   '<div id="output"></div>',
   'let name = "你的名字";\n// 将name显示在页面中\n', 20, 10, 2, 'easy'),
  
  ('c3333333-3333-3333-3333-333333333333', '简单计算', '制作计算器', 
   E'计算两个数字的和并显示结果',
   '<div id="result"></div>',
   'let a = 10;\nlet b = 20;\n// 计算a+b并显示\n', 25, 12, 3, 'medium');

-- 插入成就数据
INSERT INTO achievements (title, description, icon, criteria_type, criteria_value, xp_reward, coins_reward) VALUES
  ('初来乍到', '完成第一个任务', '🎯', 'tasks_completed', 1, 10, 5),
  ('勤奋学习', '完成10个任务', '📚', 'tasks_completed', 10, 50, 25),
  ('编程大师', '完成50个任务', '🏆', 'tasks_completed', 50, 200, 100),
  ('社交达人', '发布第一个作品', '🌟', 'projects_created', 1, 20, 10),
  ('人气王', '获得100个点赞', '❤️', 'likes_received', 100, 100, 50),
  ('探索者', '连续7天学习', '🔥', 'streak_days', 7, 150, 75),
  ('升级达人', '达到Level 5', '⚡', 'level_reached', 5, 100, 50),
  ('富有', '累计获得1000金币', '💰', 'coins_earned', 1000, 200, 100);

