"use client"

import { GlassButton } from "@/components/glass"
import { ImageUpload } from "@/components/ImageUpload"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface UploadedImage {
  id: string
  url: string
  file?: File
}

interface ItemFormProps {
  item?: {
    id: string
    title: string
    slug: string
    description: string | null
    price: number
    status: string
    offline_location: string | null
  }
  measurements?: {
    pit_to_pit: number | null
    body_length: number | null
    shoulder_width: number | null
    sleeve_length: number | null
    armhole: number | null
    bottom_hem: number | null
  }
}

export function ItemForm({ item, measurements }: ItemFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])

  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    price: item?.price?.toString() || "",
    status: item?.status || "available",
    offline_location: item?.offline_location || "",
    pit_to_pit: measurements?.pit_to_pit?.toString() || "",
    body_length: measurements?.body_length?.toString() || "",
    shoulder_width: measurements?.shoulder_width?.toString() || "",
    sleeve_length: measurements?.sleeve_length?.toString() || "",
    armhole: measurements?.armhole?.toString() || "",
    bottom_hem: measurements?.bottom_hem?.toString() || "",
  })

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const slug = generateSlug(formData.title)

    try {
      if (item) {
        // UPDATE existing item
        const supabase = createClient()
        const { error: updateError } = await supabase
          .from("items")
          .update({
            title: formData.title,
            slug,
            description: formData.description || null,
            price: parseFloat(formData.price),
            status: formData.status,
            offline_location: formData.offline_location || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)

        if (updateError) {
          alert(`Update failed: ${updateError.message}`)
          return
        }

        const measurementData = {
          item_id: item.id,
          pit_to_pit: formData.pit_to_pit ? parseFloat(formData.pit_to_pit) : null,
          body_length: formData.body_length ? parseFloat(formData.body_length) : null,
          shoulder_width: formData.shoulder_width ? parseFloat(formData.shoulder_width) : null,
          sleeve_length: formData.sleeve_length ? parseFloat(formData.sleeve_length) : null,
          armhole: formData.armhole ? parseFloat(formData.armhole) : null,
          bottom_hem: formData.bottom_hem ? parseFloat(formData.bottom_hem) : null,
        }

        await supabase.from("item_measurements").upsert(measurementData, { onConflict: "item_id" })
      } else {
        // CREATE new item with images via FormData
        const fd = new FormData()
        Object.entries(formData).forEach(([k, v]) => fd.append(k, v as string))
        images.forEach((im, idx) => im.file && fd.append(`image${idx}`, im.file))

        const res = await fetch("/api/admin/items", {
        method: "POST",
        body: fd,
        credentials: "include", // ✅ INI WAJIB
        })

        const json = await res.json()
        if (!json.success) throw new Error(json.error || "Create failed")
      }

      alert(`Item "${formData.title}" ${item ? "updated" : "created"} successfully!`)
      router.push("/admin/items")
      router.refresh()
    } catch (err: any) {
      console.error(err)
      alert(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-black/10 bg-white/50 px-4 py-3 text-black/90 placeholder-black/40 backdrop-blur-sm transition-all focus:border-black/30 focus:outline-none focus:ring-0"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-black/70">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-black/70">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`${inputClass} min-h-24 resize-none`}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-black/70">Price (RM) *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-black/70">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className={inputClass}
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="offline_sold">Offline Sold</option>
          </select>
        </div>
      </div>

      {!item && (
        <div>
          <label className="mb-2 block text-sm font-medium text-black/70">Images</label>
          <ImageUpload images={images} onImagesChange={setImages} maxImages={10} />
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-black/70">Offline Location</label>
        <input
          type="text"
          value={formData.offline_location}
          onChange={(e) => setFormData({ ...formData, offline_location: e.target.value })}
          className={inputClass}
          placeholder="e.g., Kuala Lumpur Store"
        />
      </div>

      <div className="border-t border-black/10 pt-6">
        <h3 className="mb-4 font-semibold text-black/80">Measurements (cm)</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { key: "pit_to_pit", label: "Pit to Pit" },
            { key: "body_length", label: "Body Length" },
            { key: "shoulder_width", label: "Shoulder Width" },
            { key: "sleeve_length", label: "Sleeve Length" },
            { key: "armhole", label: "Armhole" },
            { key: "bottom_hem", label: "Bottom Hem" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="mb-2 block text-sm font-medium text-black/70">{label}</label>
              <input
                type="number"
                step="0.1"
                value={formData[key as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <GlassButton type="submit" disabled={loading} className="flex-1">
          {loading ? "Saving..." : item ? "Update Item" : "Create Item"}
        </GlassButton>
        <GlassButton type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </GlassButton>
      </div>
    </form>
  )
}