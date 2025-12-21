import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const admin = createAdminClient()

    /* 1️⃣ FORM DATA */
    const form = await request.formData()

    const title = form.get("title")?.toString().trim()
    const description = form.get("description")?.toString() || null
    const price = Number(form.get("price"))
    const status = form.get("status")?.toString() || "available"
    const offline_location = form.get("offline_location")?.toString() || null

    if (!title || Number.isNaN(price)) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 })
    }

    /* 2️⃣ SLUG UNIQUE */
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

    /* 3️⃣ INSERT ITEM */
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

    /* 4️⃣ IMAGES */
    const imageRows = []

    for (let i = 0; form.has(`image${i}`); i++) {
      const file = form.get(`image${i}`) as File
      if (!file) continue

      const buffer = Buffer.from(await file.arrayBuffer())
      const ext = file.name.split(".").pop()
      const path = `${item.id}-${Date.now()}-${i}.${ext}`

      const { error } = await admin.storage
        .from("item-images")
        .upload(path, buffer, { contentType: file.type })

      if (error) continue

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

    /* 5️⃣ MEASUREMENTS */
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
      await admin.from("item_measurements").insert({
        item_id: item.id,
        ...measurements,
      })
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
