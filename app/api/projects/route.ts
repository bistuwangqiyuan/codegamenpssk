import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase()

    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        likes_count,
        views_count,
        created_at,
        users:user_id (
          display_name
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    const formattedProjects = projects?.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      thumbnail: p.thumbnail_url,
      likes: p.likes_count,
      views: p.views_count,
      author: (p.users as any)?.display_name || '匿名用户',
      createdAt: p.created_at
    })) || []

    return NextResponse.json({
      projects: formattedProjects
    })
  } catch (error) {
    console.error('Failed to load projects:', error)
    return NextResponse.json(
      { error: '加载失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, code } = await request.json()
    const supabase = getServiceSupabase()

    const userId = request.headers.get('x-user-id') || 'temp-user'

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        title,
        description,
        code_html: code.html,
        code_css: code.css,
        code_js: code.js,
        is_public: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json(
      { error: '创建失败' },
      { status: 500 }
    )
  }
}

