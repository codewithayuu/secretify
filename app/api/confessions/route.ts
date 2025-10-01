import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import sanitizeHtml from 'sanitize-html'

const MIN_WORDS = 1
const MAX_WORDS = 200
const RATE_LIMIT_WINDOW = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1'
  return ip
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  record.count++
  return false
}

function validateContent(content: string): { isValid: boolean; error?: string } {
  const trimmed = content.trim()
  
  if (!trimmed) {
    return { isValid: false, error: 'Content cannot be empty' }
  }

  const words = trimmed.split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length

  if (wordCount < MIN_WORDS) {
    return { isValid: false, error: `Minimum ${MIN_WORDS} word required` }
  }

  if (wordCount > MAX_WORDS) {
    return { isValid: false, error: `Maximum ${MAX_WORDS} words allowed` }
  }

  const spamWords = ['spam', 'advertisement', 'promotion', 'buy now', 'click here']
  const lowerContent = trimmed.toLowerCase()
  if (spamWords.some(word => lowerContent.includes(word))) {
    return { isValid: false, error: 'Content appears to be spam' }
  }

  return { isValid: true }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('deviceId')

    const { data: confessions, error: confessionsError } = await supabaseAdmin
      .from('confessions')
      .select('id, content, created_at')
      .order('created_at', { ascending: false })
      .limit(200)

    if (confessionsError) {
      console.error('Database error:', confessionsError)
      return NextResponse.json(
        { error: 'Failed to fetch confessions' },
        { status: 500 }
      )
    }

    const confessionsWithReactions = await Promise.all(
      confessions.map(async (confession) => {
        const { data: reactions, error: reactionsError } = await supabaseAdmin
          .from('reactions')
          .select('reaction_type, device_id')
          .eq('confession_id', confession.id)

        let supportCount = 0
        let relateCount = 0
        let userSupport = false
        let userRelate = false

        if (!reactionsError && reactions) {
          supportCount = reactions.filter(r => r.reaction_type === 'support').length
          relateCount = reactions.filter(r => r.reaction_type === 'relate').length
        }

        if (deviceId && !reactionsError && reactions) {
          const userReactionData = reactions.filter(r => r.device_id === deviceId)
          userSupport = userReactionData.some(r => r.reaction_type === 'support')
          userRelate = userReactionData.some(r => r.reaction_type === 'relate')
        }

        return {
          ...confession,
          support_count: supportCount,
          relate_count: relateCount,
          user_support: userSupport,
          user_relate: userRelate
        }
      })
    )

    return NextResponse.json({ confessions: confessionsWithReactions || [] })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request)
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { content } = body

    const validation = validateContent(content)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const sanitizedContent = sanitizeHtml(content.trim(), {
      allowedTags: [],
      allowedAttributes: {}
    })

    const { data, error } = await supabaseAdmin
      .from('confessions')
      .insert([{ content: sanitizedContent }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save confession' },
        { status: 500 }
      )
    }

    return NextResponse.json({ confession: data }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}