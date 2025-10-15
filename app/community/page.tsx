'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  author: string
  likes: number
  views: number
  thumbnail: string
  createdAt: string
}

export default function CommunityPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('加载失败')
      
      const data = await response.json()
      setProjects(data.projects)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (projectId: string) => {
    try {
      await fetch(`/api/projects/${projectId}/like`, { method: 'POST' })
      await loadProjects() // 刷新列表
    } catch (error) {
      console.error('Failed to like project:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">社区作品</h1>
              <p className="text-sm text-gray-600">发现其他学习者的精彩作品</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">返回首页</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button size="sm" variant="default">🔥 热门</Button>
          <Button size="sm" variant="outline">🆕 最新</Button>
          <Button size="sm" variant="outline">⭐ 精选</Button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">暂无作品</p>
              <p className="text-sm text-gray-500 mt-2">
                完成任务后可以分享你的作品到社区
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      📝 无预览图
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">by {project.author}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleLike(project.id)}
                        className="flex items-center gap-1 hover:text-red-500"
                      >
                        ❤️ {project.likes}
                      </button>
                      <span className="text-gray-500">👁️ {project.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

