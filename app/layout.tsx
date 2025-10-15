import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GameCode Lab - 游戏化HTML5编程教育平台',
  description: '通过游戏化闯关学习HTML/CSS/JavaScript，AI助教实时指导，零基础入门Web开发',
  keywords: ['编程教育', 'HTML5', 'CSS', 'JavaScript', 'AI助教', '在线学习', '游戏化学习'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

