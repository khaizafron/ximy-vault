// app/api/admin/items/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    /* ---------- 1. auth & admin check (unchanged) ---------- */
    const supabase = await createClient()
    const admin = createAdminClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user || authError) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    let { data: dbUser } = await admin.from("users").select("id, role").eq("id", user.id).single()
    if (!dbUser) {
      await admin.from("users").insert({ id: user.id, email: user.email, role: "admin" })
      dbUser = { id: user.id, role: "admin" }
    }
    if (dbUser.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    /* ---------- 2. read FormData ---------- */
    const form = await request.formData()

    const title = form.get("title") as string
    const slug = form.get("title")!.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const description = form.get("description") as string
    const price = Number(form.get("price"))
    const status = (form.get("status") as string) || "available"
    const offline_location = form.get("offline_location") as string

    if (!title || !slug || Number.isNaN(price)) {
      return NextResponse.json({ error: "Missing/invalid fields" }, { status: 400 })
    }

    /* ---------- 3. create item ---------- */
    const { data: item, error: itemError } = await admin
      .from("items")
      .insert({ title, slug, description: description || null, price, status, offline_location: offline_location || null })
      .select()
      .single()

    if (itemError || !item) return NextResponse.json({ error: "Item insert failed" }, { status: 500 })

    /* ---------- 4. upload & insert images ---------- */
    const imageRows = []
    for (let i = 0; form.has(`image${i}`); i++) {
      const file = form.get(`image${i}`) as File
      const buf = Buffer.from(await file.arrayBuffer())
      const ext = file.name.split('.').pop()
      const filePath = `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: upErr } = await admin.storage
        .from("item-images")
        .upload(filePath, buf, { contentType: file.type })
      if (upErr) { console.error("Upload error", upErr); continue }

      const { data: { publicUrl } } = admin.storage.from("item-images").getPublicUrl(filePath)
      imageRows.push({ item_id: item.id, image_url: publicUrl, is_primary: i === 0, display_order: i })
    }
    if (imageRows.length) await admin.from("item_images").insert(imageRows)

    /* ---------- 5. measurements ---------- */
    const measurements: any = {}
    const mKeys = ["pit_to_pit", "body_length", "shoulder_width", "sleeve_length", "armhole", "bottom_hem"]
    mKeys.forEach((k) => {
      const v = form.get(k)
      if (v) measurements[k] = parseFloat(v as string)
    })
    if (Object.keys(measurements).length) {
      await admin.from("item_measurements").insert({ item_id: item.id, ...measurements })
    }

    return NextResponse.json({ success: true, item })
  } catch (err) {
    console.error("POST /api/admin/items error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}