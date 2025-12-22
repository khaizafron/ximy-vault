export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createAdminClient } from "@/lib/supabase/admin"
import { GlassCard, GlassButton } from "@/components/glass"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

export default async function HomePage() {
  const supabase = createAdminClient()

  // ✅ SAME AS COLLECTION + FILTER SOLD
  const { data: latestItems } = await supabase
    .from("items")
    .select(`
      *,
      images:item_images(*)
    `)
    .not("status", "in", '("sold","offline_sold")')
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="relative">
      {/* ===== BACKGROUND ===== */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-200/30 via-pink-100/20 to-transparent blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-200/20 via-cyan-100/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-200/25 via-orange-100/15 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24">
        {/* ===== HERO ===== */}
        <section className="relative flex min-h-[85vh] flex-col items-center justify-center text-center pt-32 pb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/40 backdrop-blur-md px-5 py-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-black/70">
              Curated Vintage Collection
            </span>
          </div>

          <h1 className="mb-8 text-6xl font-bold tracking-tight text-black/90 md:text-8xl">
            Ximy{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
              Vault
            </span>
          </h1>

          <p className="mb-12 max-w-2xl text-xl leading-relaxed text-black/60">
            Rare vintage treasures, handpicked with care. Every piece tells a
            story, every detail matters.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/collection">
              <GlassButton size="lg" className="gap-2">
                Explore Collection
                <ArrowRight className="h-5 w-5" />
              </GlassButton>
            </Link>
            <Link href="/about">
              <GlassButton size="lg" variant="outline">
                Our Story
              </GlassButton>
            </Link>
          </div>
        </section>

        {/* ===== LATEST ARRIVALS ===== */}
        <section className="relative mt-32">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-black/90 mb-3">
              Latest Arrivals
            </h2>
            <p className="text-lg text-black/60">
              Fresh finds from our latest curation
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestItems?.map((item) => {
              const primaryImage =
                item.images?.find(
                  (img: { is_primary: boolean }) => img.is_primary
                ) || item.images?.[0]

              return (
                <Link
                  key={item.id}
                  href={`/collection/${item.slug}`} // ✅ FIX 404
                >
                  <GlassCard className="group relative overflow-hidden p-0">
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-3xl">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.image_url}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black/5">
                          <span className="text-black/30">No image</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-medium text-black/90">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-lg font-semibold text-black">
                        RM {Number(item.price).toFixed(0)}
                      </p>
                    </div>
                  </GlassCard>
                </Link>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/collection">
              <GlassButton size="lg" variant="outline" className="gap-2">
                View Full Collection
                <ArrowRight className="h-4 w-4" />
              </GlassButton>
            </Link>
          </div>
        </section>

        {/* ===== WHY CHOOSE ===== */}
        <section className="mt-40 grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-black/90">
              Why Choose Ximy Vault?
            </h2>
            <p className="text-black/70">
              Every item is carefully curated, authenticated, and presented with
              care.
            </p>
            <Link href="/about">
              <GlassButton className="gap-2">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </GlassButton>
            </Link>
          </div>

          <GlassCard className="relative overflow-hidden p-8">
            <h3 className="text-2xl font-bold text-black/90 mb-4">
              Visit Us
            </h3>
            <p className="text-black/70 mb-6">
              Find us at local markets and pop-up events.
            </p>
            <Link href="/visit-us">
              <GlassButton variant="outline" className="gap-2">
                View Locations
                <ArrowRight className="h-4 w-4" />
              </GlassButton>
            </Link>
          </GlassCard>
        </section>
      </div>
    </div>
  )
}
