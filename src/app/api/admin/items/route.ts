import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const admin = createAdminClient()

    /* 1️⃣ AUTH: guna session cookie */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    /* 2️⃣ ADMIN CHECK */
    let { data: dbUser } = await admin
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .single()

    if (!dbUser) {
      await admin.from("users").insert({
        id: user.id,
        email: user.email,
        role: "admin",
      })
      dbUser = { id: user.id, role: "admin" }
    }

    if (dbUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    /* 3️⃣ FORM DATA */
    const form = await request.formData()

    const title = form.get("title")?.toString().trim()
    const description = form.get("description")?.toString() || null
    const price = Number(form.get("price"))
    const status = form.get("status")?.toString() || "available"
    const offline_location = form.get("offline_location")?.toString() || null

    if (!title || Number.isNaN(price)) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 })
    }

    /* 4️⃣ SLUG (UNIQUE SAFE) */
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    let slug = baseSlug
    let i = 1

    while (true) {
      const { data: existing } = await admin
        .from("items")
        .select("id")
        .eq("slug", slug)
        .single()

      if (!existing) break
      slug = `${baseSlug}-${i++}`
    }

    /* 5️⃣ INSERT ITEM */
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
      return NextResponse.json(
        { error: itemError?.message || "Item insert failed" },
        { status: 500 }
      )
    }

    /* 6️⃣ IMAGES */
    const imageRows = []

    for (let i = 0; form.has(`image${i}`); i++) {
      const file = form.get(`image${i}`) as File
      if (!file) continue

      const buffer = Buffer.from(await file.arrayBuffer())
      const ext = file.name.split(".").pop()
      const path = `${item.id}-${Date.now()}-${i}.${ext}`

      const { error: uploadErr } = await admin.storage
        .from("item-images")
        .upload(path, buffer, { contentType: file.type })

      if (uploadErr) continue

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
    }

    /* 7️⃣ MEASUREMENTS */
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
      if (v) measurements[k] = Number(v)
    })

    if (Object.keys(measurements).length) {
      await admin
        .from("item_measurements")
        .insert({ item_id: item.id, ...measurements })
    }

    return NextResponse.json({ success: true, item })
  } catch (err) {
    console.error("ADMIN ITEM ERROR:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
