import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createAdminClient } from "@/lib/supabase/admin"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    /* ================= 1️⃣ GET TOKEN (FLEXIBLE METHOD) ================= */
    let token: string | null = null

    // Method 1: Authorization header (untuk API calls dengan explicit token)
    const authHeader = request.headers.get("authorization")
    if (authHeader) {
      token = authHeader.replace("Bearer ", "")
    }

    // Method 2: Cookies (untuk browser requests - VERCEL & LOCALHOST)
    if (!token) {
      const cookieStore = await cookies()
      
      // Supabase stores session in multiple cookie formats
      const sessionCookies = [
        'sb-access-token',
        'sb-refresh-token', 
        // Check all possible Supabase cookie names
        ...Array.from(cookieStore.getAll())
          .filter(c => c.name.includes('supabase') || c.name.includes('sb-'))
          .map(c => c.name)
      ]

      for (const cookieName of sessionCookies) {
        const cookie = cookieStore.get(cookieName)
        if (cookie?.value) {
          token = cookie.value
          break
        }
      }
    }

    // Method 3: Get session from Supabase client (BEST FOR VERCEL)
    if (!token) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        token = session.access_token
      }
    }

    if (!token) {
      console.error("❌ No token found in headers or cookies")
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 })
    }

    /* ================= 2️⃣ VERIFY USER ================= */
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser(token)

    if (!user || authError) {
      console.error("❌ Auth verification failed:", authError?.message)
      return NextResponse.json({ 
        error: "Unauthorized - Invalid token",
        details: authError?.message 
      }, { status: 401 })
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