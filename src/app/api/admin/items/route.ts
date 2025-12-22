import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    console.log("🔍 API Route called - Environment:", process.env.VERCEL ? "VERCEL" : "LOCAL")
    
    /* ================= 1️⃣ GET TOKEN - VERCEL OPTIMIZED ================= */
    let token: string | null = null

    // Method 1: Authorization header
    const authHeader = request.headers.get("authorization")
    if (authHeader) {
      token = authHeader.replace("Bearer ", "")
      console.log("✅ Token from Authorization header")
    }

    // Method 2: Cookie header (VERCEL CRITICAL!)
    if (!token) {
      const cookieHeader = request.headers.get("cookie")
      console.log("🍪 Cookie header:", cookieHeader ? "EXISTS" : "MISSING")
      
      if (cookieHeader) {
        // Parse all Supabase auth cookies
        const cookies = cookieHeader.split(';').map(c => c.trim())
        
        for (const cookie of cookies) {
          // Check for various Supabase cookie formats
          if (
            cookie.startsWith('sb-') && 
            (cookie.includes('auth-token') || cookie.includes('access-token'))
          ) {
            token = cookie.split('=')[1]
            console.log("✅ Token from cookie:", cookie.split('=')[0])
            break
          }
        }
      }
    }

    // Method 3: Try to create authenticated Supabase client from request
    if (!token) {
      console.log("⚠️ No token in headers/cookies, trying Supabase session...")
      
      // Get all cookies for Supabase
      const cookieHeader = request.headers.get("cookie") || ""
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            storage: {
              getItem: (key: string) => {
                const cookies = cookieHeader.split(';').map(c => c.trim())
                const cookie = cookies.find(c => c.startsWith(key + '='))
                return cookie ? cookie.split('=')[1] : null
              },
              setItem: () => {},
              removeItem: () => {},
            },
          },
        }
      )
      
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        token = session.access_token
        console.log("✅ Token from Supabase session")
      }
    }

    if (!token) {
      console.error("❌ AUTHENTICATION FAILED - No token found")
      console.error("Headers:", Object.fromEntries(request.headers.entries()))
      return NextResponse.json({ 
        error: "Unauthorized - No authentication token found",
        hint: "Please login again" 
      }, { status: 401 })
    }

    /* ================= 2️⃣ VERIFY USER ================= */
    console.log("🔐 Verifying token...")
    
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser(token)

    if (!user || authError) {
      console.error("❌ Token verification failed:", authError?.message)
      return NextResponse.json({ 
        error: "Forbidden - Invalid or expired token",
        details: authError?.message 
      }, { status: 403 })
    }

    console.log("✅ User authenticated:", user.email)

    /* ================= 3️⃣ ADMIN CLIENT ================= */
    const admin = createAdminClient()

    /* ================= 4️⃣ FORM DATA ================= */
    const form = await request.formData()

    const title = form.get("title")?.toString().trim()
    const description = form.get("description")?.toString() || null
    const price = Number(form.get("price"))
    const status = form.get("status")?.toString() || "available"
    const offline_location = form.get("offline_location")?.toString() || null

    if (!title || Number.isNaN(price)) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 })
    }

    /* ================= 5️⃣ SLUG ================= */
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    let slug = baseSlug
    let i = 1

    while (true) {
      const { data } = await admin
        .from("items")
        .select("id")
        .eq("slug", slug)
        .maybeSingle()

      if (!data) break
      slug = `${baseSlug}-${i++}`
    }

    /* ================= 6️⃣ INSERT ITEM ================= */
    const { data: item, error: itemError } = await admin
      .from("items")
      .insert({
        title,
        slug,
        description,
        price,
        status,
        offline_location,
      })
      .select()
      .single()

    if (itemError || !item) {
      console.error("❌ Insert error:", itemError)
      return NextResponse.json(
        { error: itemError?.message || "Insert failed" },
        { status: 500 }
      )
    }

    console.log("✅ Item created:", item.id)

    /* ================= 7️⃣ IMAGES ================= */
    const imageRows = []

    for (let i = 0; form.has(`image${i}`); i++) {
      const file = form.get(`image${i}`) as File
      if (!file || file.size === 0) continue

      const buffer = Buffer.from(await file.arrayBuffer())
      const ext = file.name.split(".").pop()
      const path = `${item.id}-${Date.now()}-${i}.${ext}`

      const { error: uploadErr } = await admin.storage
        .from("item-images")
        .upload(path, buffer, { contentType: file.type })

      if (uploadErr) {
        console.error(`⚠️ Image ${i} upload failed:`, uploadErr.message)
        continue
      }

      const { data } = admin.storage
        .from("item-images")
        .getPublicUrl(path)

      imageRows.push({
        item_id: item.id,
        image_url: data.publicUrl,
        is_primary: i === 0,
        display_order: i,
      })
    }

    if (imageRows.length) {
      await admin.from("item_images").insert(imageRows)
      console.log(`✅ ${imageRows.length} images uploaded`)
    }

    /* ================= 8️⃣ MEASUREMENTS ================= */
    const keys = [
      "pit_to_pit",
      "body_length",
      "shoulder_width",
      "sleeve_length",
      "armhole",
      "bottom_hem",
    ]

    const measurements: any = {}
    keys.forEach((k) => {
      const v = form.get(k)
      if (v !== null && v !== "") measurements[k] = Number(v)
    })

    if (Object.keys(measurements).length) {
      await admin
        .from("item_measurements")
        .insert({ item_id: item.id, ...measurements })
      console.log("✅ Measurements saved")
    }

    return NextResponse.json({ success: true, item })
  } catch (err: any) {
    console.error("❌ ADMIN ITEM ERROR:", err)
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    )
  }
}