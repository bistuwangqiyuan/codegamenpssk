import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { taskId, currentCode } = await request.json()

    // 这里应该调用AI服务获取提示
    // 为了演示，返回一个通用提示
    const hints = [
      '检查HTML标签是否正确闭合',
      '注意标签的大小写',
      '确保代码符合任务要求',
      '尝试运行代码查看效果',
      '可以使用AI助教获取更多帮助'
    ]

    const randomHint = hints[Math.floor(Math.random() * hints.length)]

    return NextResponse.json({
      hint: `💡 提示：${randomHint}`
    })
  } catch (error) {
    console.error('Hint error:', error)
    return NextResponse.json(
      { error: '获取提示失败' },
      { status: 500 }
    )
  }
}

