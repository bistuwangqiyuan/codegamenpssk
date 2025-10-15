export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">GameCode Lab</h3>
            <p className="text-gray-400 text-sm">
              游戏化的HTML5编程教育平台
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">学习路径</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>HTML5基础</li>
              <li>CSS样式</li>
              <li>JavaScript</li>
              <li>DOM操作</li>
              <li>综合实战</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">社区</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>作品展示</li>
              <li>学习排行</li>
              <li>讨论区</li>
              <li>帮助中心</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">关于</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>关于我们</li>
              <li>联系方式</li>
              <li>隐私政策</li>
              <li>使用条款</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 GameCode Lab. All rights reserved.</p>
          <p className="mt-2">让编程学习像游戏一样有趣！🎮💻</p>
        </div>
      </div>
    </footer>
  )
}

