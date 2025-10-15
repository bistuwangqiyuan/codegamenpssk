'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

export function Header() {
  const { profile, signOut } = useAuthStore()

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            GameCode Lab
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/learn" className="text-gray-700 hover:text-blue-600">
              学习
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-blue-600">
              社区
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              我的
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {profile && (
              <>
                <div className="text-sm text-right hidden md:block">
                  <p className="font-medium">{profile.display_name || '游客'}</p>
                  <p className="text-xs text-gray-500">
                    Level {profile.level} · 🪙 {profile.coins}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={signOut}>
                  退出
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

