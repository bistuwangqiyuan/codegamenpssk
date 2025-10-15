'use client'

import { useState } from 'react'
import { CodeEditor } from '@/components/CodeEditor'
import { CodePreview } from '@/components/CodePreview'
import { AIChat } from '@/components/AIChat'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useEditorStore } from '@/stores/editorStore'
import { useUIStore } from '@/stores/uiStore'

export default function LearnPage() {
  const { html, css, js } = useEditorStore()
  const { isAIChatOpen, toggleAIChat } = useUIStore()
  const [currentTask] = useState({
    id: '1',
    title: '第一个网页：Hello World',
    description: '创建你的第一个HTML页面',
    instructions: `
1. 在HTML编辑器中输入：<h1>Hello World</h1>
2. 点击"运行"按钮查看效果
3. 尝试修改文字内容
    `,
    xpReward: 10,
    coinsReward: 5,
  })

  const handleRun = async () => {
    // 触发预览更新（通过store自动处理）
    console.log('Running code...', { html, css, js })
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: currentTask.id,
          code: { html, css, js }
        }),
      })

      if (!response.ok) throw new Error('提交失败')

      const data = await response.json()
      alert(`任务完成！获得 ${data.xpEarned} XP 和 ${data.coinsEarned} 金币`)
    } catch (error) {
      console.error('Submit error:', error)
      alert('提交失败，请稍后重试')
    }
  }

  const handleHint = async () => {
    // 请求AI提示
    try {
      const response = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: currentTask.id,
          currentCode: { html, css, js }
        }),
      })

      if (!response.ok) throw new Error('获取提示失败')

      const data = await response.json()
      alert(data.hint)
    } catch (error) {
      console.error('Hint error:', error)
      alert('获取提示失败，请稍后重试')
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold">{currentTask.title}</h1>
            <p className="text-sm text-gray-600">{currentTask.description}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleHint} variant="outline" size="sm">
              💡 提示
            </Button>
            <Button onClick={toggleAIChat} variant="outline" size="sm">
              🤖 AI助教
            </Button>
            <Button onClick={handleRun} variant="default" size="sm">
              ▶️ 运行
            </Button>
            <Button onClick={handleSubmit} variant="default" size="sm">
              ✅ 提交
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Task Instructions */}
        <div className="w-64 border-r bg-white p-4 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">任务说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm whitespace-pre-line">
                {currentTask.instructions}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-600">奖励</p>
                <p className="text-sm font-semibold">
                  {currentTask.xpReward} XP · 🪙 {currentTask.coinsReward}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center - Code Editor */}
        <div className="flex-1 flex flex-col">
          <CodeEditor />
        </div>

        {/* Right - Preview or AI Chat */}
        <div className="w-1/3 border-l">
          {isAIChatOpen ? (
            <AIChat />
          ) : (
            <div className="h-full flex flex-col">
              <div className="bg-gray-100 px-4 py-2 border-b">
                <h3 className="font-semibold text-sm">实时预览</h3>
              </div>
              <div className="flex-1">
                <CodePreview />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

