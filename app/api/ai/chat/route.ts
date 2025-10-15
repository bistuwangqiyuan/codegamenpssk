import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// AI服务提供商配置
const AI_PROVIDERS = [
  {
    name: 'DeepSeek',
    apiKey: process.env.DEEPSEEK_API_KEY,
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat'
  },
  {
    name: 'GLM',
    apiKey: process.env.GLM_API_KEY,
    endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    model: 'glm-4'
  },
  {
    name: 'Moonshot',
    apiKey: process.env.MOONSHOT_API_KEY,
    endpoint: 'https://api.moonshot.cn/v1/chat/completions',
    model: 'moonshot-v1-8k'
  },
]

async function callAI(message: string, providerIndex = 0): Promise<string> {
  if (providerIndex >= AI_PROVIDERS.length) {
    throw new Error('All AI providers failed')
  }

  const provider = AI_PROVIDERS[providerIndex]

  if (!provider.apiKey) {
    console.warn(`${provider.name} API key not configured, trying next provider`)
    return callAI(message, providerIndex + 1)
  }

  try {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          {
            role: 'system',
            content: '你是CodeMentor DS，一个友好的编程助教。你的任务是帮助初学者学习HTML/CSS/JavaScript。请用简单易懂的语言回答问题，并提供实用的代码示例。'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      console.warn(`${provider.name} request failed: ${response.status}`)
      return callAI(message, providerIndex + 1)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error(`${provider.name} error:`, error)
    return callAI(message, providerIndex + 1)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '无效的消息' },
        { status: 400 }
      )
    }

    const response = await callAI(message)

    return NextResponse.json({
      response,
      provider: 'AI Assistant'
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'AI服务暂时不可用，请稍后再试' },
      { status: 500 }
    )
  }
}

