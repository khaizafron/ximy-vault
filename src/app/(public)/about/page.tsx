import { GlassCard } from "@/components/glass"
import { Heart, Eye, Sparkles, Package, Award, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute right-1/4 top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-200/30 via-orange-100/20 to-transparent blur-3xl" />
        <div className="absolute left-1/3 bottom-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-200/25 via-pink-100/15 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-24">
        <section className="mb-20 text-center pt-20 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/40 backdrop-blur-md px-5 py-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-black/70">Our Story</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-black/90 md:text-6xl">
            About <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">Ximy Vault</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-black/60 leading-relaxed">
            Where vintage meets modern style. Curating timeless pieces with passion, authenticity, and a commitment to sustainable fashion.
          </p>
        </section>

        <GlassCard className="mb-12 p-10 animate-scale-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                  <Heart className="h-10 w-10 text-pink-600" />
                </div>
              </div>
            </div>
            <div className="space-y-5 text-black/70 leading-relaxed">
              <p className="text-lg">
                Ximy Vault was born from a <strong className="text-black/90">deep passion for vintage fashion</strong> and sustainable style. We believe that the best pieces aren't always new—they're the ones with history, character, and soul.
              </p>
              <p>
                Every item in our collection is hand-selected, carefully inspected, and curated with love. We scour markets, estate sales, and hidden gems to bring you truly unique vintage pieces that tell a story.
              </p>
              <p>
                Whether you're looking for a statement jacket, a rare band tee, or that perfect retro accessory, we're here to help you discover vintage treasures that elevate your wardrobe and express your individuality.
              </p>
            </div>
          </div>
        </GlassCard>

        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {[
            { icon: Heart, color: "red", title: "Hand-Selected", desc: "Every piece is personally chosen for quality, style, and uniqueness", delay: "0.1s" },
            { icon: Eye, color: "blue", title: "Authenticated", desc: "Thoroughly checked for condition and authenticity before listing", delay: "0.2s" },
            { icon: Sparkles, color: "purple", title: "One-of-a-Kind", desc: "Unique pieces you won't find anywhere else", delay: "0.3s" }
          ].map((item, i) => (
            <GlassCard 
              key={i} 
              className="group p-8 text-center transition-all duration-500 hover:scale-105 animate-scale-in" 
              style={{ animationDelay: item.delay, opacity: 0 }}
            >
              <div className={`mb-6 inline-flex rounded-full bg-${item.color}-500/10 p-5 transition-transform duration-500 group-hover:scale-110`}>
                <item.icon className={`h-9 w-9 text-${item.color}-600`} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-black/90">{item.title}</h3>
              <p className="text-black/60 leading-relaxed">
                {item.desc}
              </p>
            </GlassCard>
          ))}
        </div>

        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <h2 className="mb-8 text-center text-4xl font-bold text-black/90">Why Choose Vintage?</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <GlassCard className="p-8 transition-all hover:shadow-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-green-500/10 p-3">
                  <Package className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-black/90">Sustainable Fashion</h3>
              </div>
              <p className="text-black/70 leading-relaxed">
                Buying vintage is one of the most eco-friendly choices you can make. Each piece we sell extends the life of quality garments, reduces waste, and helps create a circular fashion economy.
              </p>
            </GlassCard>

            <GlassCard className="p-8 transition-all hover:shadow-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-amber-500/10 p-3">
                  <Award className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-black/90">Superior Craftsmanship</h3>
              </div>
              <p className="text-black/70 leading-relaxed">
                Vintage pieces were often made with premium materials and construction techniques that are rare in modern fast fashion. Quality that was built to last generations.
              </p>
            </GlassCard>

            <GlassCard className="p-8 transition-all hover:shadow-2xl md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-purple-500/10 p-3">
                  <Users className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-black/90">Express Your Individuality</h3>
              </div>
              <p className="text-black/70 leading-relaxed">
                Stand out from the crowd with pieces that have history and character. Your vintage find is a conversation starter, a style statement, and a reflection of your unique taste.
              </p>
            </GlassCard>
          </div>
        </section>

        <GlassCard className="p-10 animate-scale-in" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <h3 className="mb-6 text-center text-3xl font-bold text-black/90">
            Our Curation Process
          </h3>
          <div className="aspect-video w-full overflow-hidden rounded-3xl bg-gradient-to-br from-black/5 to-black/10 shadow-xl">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Ximy Vault Curation Process"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-3xl"
            />
          </div>
          <p className="mt-6 text-center text-base text-black/60">
            Behind the scenes: Discover how we find, authenticate, and select vintage treasures for our collection
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
