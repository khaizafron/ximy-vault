import { createAdminClient } from "@/lib/supabase/admin"
import { GlassCard } from "@/components/glass"
import { ItemCardWithCart } from "@/components/ItemCardWithCart"

export default async function ItemsPage() {
  const supabase = createAdminClient()
  
  const { data: items } = await supabase
    .from("items")
    .select(`
      *,
      images:item_images(*)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-black/90">Collection</h1>
        <p className="mt-2 text-black/60">Browse our curated selection of vintage pieces</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((item, index) => (
          <ItemCardWithCart key={item.id} item={item} index={index} />
        ))}
      </div>

      {(!items || items.length === 0) && (
        <GlassCard className="py-20 text-center">
          <p className="text-black/60">No items available at the moment.</p>
        </GlassCard>
      )}
    </div>
  )
}