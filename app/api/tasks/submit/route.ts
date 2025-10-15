import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { taskId, code } = await request.json()
    const supabase = getServiceSupabase()

    // 获取用户ID（从session或临时cookie）
    const userId = request.headers.get('x-user-id') || 'temp-user'

    // 简单的评分逻辑（实际应该调用AI服务）
    const score = Math.floor(Math.random() * 30) + 70 // 70-100分

    // 更新用户进度
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        task_id: taskId,
        status: 'completed',
        code_html: code.html,
        code_css: code.css,
        code_js: code.js,
        score,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (progressError) throw progressError

    // 获取任务奖励
    const { data: task } = await supabase
      .from('tasks')
      .select('xp_reward, coins_reward')
      .eq('id', taskId)
      .single()

    const xpEarned = task?.xp_reward || 10
    const coinsEarned = task?.coins_reward || 5

    // 更新用户经验和金币
    const { error: userError } = await supabase.rpc('add_user_rewards', {
      p_user_id: userId,
      p_xp: xpEarned,
      p_coins: coinsEarned
    })

    if (userError) console.error('Failed to update user rewards:', userError)

    return NextResponse.json({
      success: true,
      score,
      xpEarned,
      coinsEarned
    })
  } catch (error) {
    console.error('Submit task error:', error)
    return NextResponse.json(
      { error: '提交失败' },
      { status: 500 }
    )
  }
}

