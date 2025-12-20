import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  /**
   * ======================================
   * 1. SKIP SEMUA BUKAN PAGE RENDER
   * ======================================
   * Middleware hanya untuk protect PAGE.
   * Jangan ganggu POST / upload / API.
   */
  if (request.method !== 'GET') {
    return NextResponse.next()
  }

  /**
   * ======================================
   * 2. SKIP SEMUA API ROUTES
   * ======================================
   */
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  /**
   * ======================================
   * 3. PROTECT ADMIN PAGE SAHAJA
   * ======================================
   */
  if (pathname.startsWith('/admin')) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    /**
     * ❌ TAK LOGIN → REDIRECT
     */
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    /**
     * ✅ LOGIN → ALLOW PAGE RENDER
     */
    return response
  }

  /**
   * ======================================
   * 4. PUBLIC ROUTES
   * ======================================
   */
  return NextResponse.next()
}

/**
 * ======================================
 * 5. MATCHER (PAGE SAHAJA)
 * ======================================
 */
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
