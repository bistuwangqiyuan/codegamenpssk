'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getLevelFromXP, getXPProgressForLevel } from '@/lib/utils'

export default function DashboardPage() {
  const { profile, initAuth, isLoading, isTrialWarningVisible, dismissTrialWarning } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>未登录</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">请先登录或开始试用</p>
            <Button className="w-full">开始试用</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const level = getLevelFromXP(profile.xp)
  const xpProgress = getXPProgressForLevel(profile.xp, level)

  // 计算试用剩余天数
  const trialDaysRemaining = profile.is_trial && profile.trial_ends_at
    ? Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Trial Warning Banner */}
      {isTrialWarningVisible && trialDaysRemaining !== null && (
        <div className="bg-yellow-100 border-b-2 border-yellow-400 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-yellow-900">
                  试用期还剩 {trialDaysRemaining} 天
                </p>
                <p className="text-sm text-yellow-800">
                  注册正式账号后，您的所有学习进度和作品都将自动保存！
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm">立即注册</Button>
              <Button size="sm" variant="ghost" onClick={dismissTrialWarning}>
                稍后提醒
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">GameCode Lab</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {profile.display_name || '游客'}
                {profile.is_trial && ' (试用中)'}
              </p>
              <p className="text-xs text-gray-500">Level {level}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* User Stats */}
          <Card>
            <CardHeader>
              <CardTitle>个人统计</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">等级</span>
                  <span className="text-sm font-bold">Level {level}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${xpProgress.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {xpProgress.current} / {xpProgress.required} XP
                </p>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">总经验值</span>
                <span className="font-semibold">{profile.xp} XP</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">金币</span>
                <span className="font-semibold">🪙 {profile.coins}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>快速开始</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/learn" className="block">
                <Button className="w-full" variant="default">
                  🎯 继续学习
                </Button>
              </Link>
              <Link href="/community" className="block">
                <Button className="w-full" variant="outline">
                  🏆 社区作品
                </Button>
              </Link>
              <Link href="/achievements" className="block">
                <Button className="w-full" variant="outline">
                  🎖️ 我的成就
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">暂无活动记录</p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Path */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">学习路径</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { level: 1, title: 'HTML5基础', icon: '📝', locked: false },
              { level: 2, title: 'CSS样式', icon: '🎨', locked: true },
              { level: 3, title: 'JavaScript', icon: '⚡', locked: true },
              { level: 4, title: 'DOM操作', icon: '🔧', locked: true },
              { level: 5, title: '综合实战', icon: '🚀', locked: true },
            ].map((course) => (
              <Card key={course.level} className={course.locked ? 'opacity-60' : ''}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">{course.icon}</div>
                  <h3 className="font-semibold mb-1">Level {course.level}</h3>
                  <p className="text-sm text-gray-600">{course.title}</p>
                  {course.locked && (
                    <p className="text-xs text-gray-500 mt-2">🔒 未解锁</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

