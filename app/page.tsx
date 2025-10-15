import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            GameCode Lab
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-4">
            游戏化的HTML5编程教育平台
          </p>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            通过任务闯关、AI实时反馈、积分与成就机制，
            系统掌握HTML5、CSS、JavaScript等Web基础开发技能
          </p>
          
          {/* CTA按钮 */}
          <div className="flex gap-4 justify-center items-center mb-12">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                🎮 开始学习
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                🏆 查看社区
              </Button>
            </Link>
          </div>

          {/* 免费试用提示 */}
          <div className="inline-block bg-yellow-100 border-2 border-yellow-400 rounded-lg px-6 py-3">
            <p className="text-lg font-semibold text-yellow-900">
              ✨ 免费试用1个月 · 无需注册 · 立即开始
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">核心特性</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">闯关学习</h3>
              <p className="text-gray-600">
                5大Level，从HTML基础到综合实战，循序渐进掌握Web开发
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI助教</h3>
              <p className="text-gray-600">
                实时代码讲解、错误诊断、智能对话，个性化学习建议
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold mb-2">在线编辑器</h3>
              <p className="text-gray-600">
                三栏编辑器+实时预览，零安装，浏览器中即可学习编程
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">游戏化激励</h3>
              <p className="text-gray-600">
                等级、XP、金币、成就、排行榜，让学习像玩游戏一样有趣
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">社区分享</h3>
              <p className="text-gray-600">
                展示作品、点赞评论、每日精选，与其他学习者互动交流
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-semibold mb-2">教师工具</h3>
              <p className="text-gray-600">
                创建自定义课程、设计关卡、追踪学生进度、数据分析
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 GameCode Lab. 让编程学习像游戏一样有趣！</p>
        </div>
      </footer>
    </div>
  )
}

