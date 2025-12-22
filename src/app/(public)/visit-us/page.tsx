import { GlassCard } from "@/components/glass"
import { MapPin, Clock, Calendar, Store, Sparkles, CheckCircle } from "lucide-react"

export default function VisitUsPage() {
  const locations = [
    {
    name: "The J @ Seri Alam",
    address: "The J @ Seri Alam, Johor Bahru",
    area: "Seri Alam, Pasir Gudang, Johor",
    schedule: "Every Thursday & Sunday",
    hours: "7:00 PM - 12:00 AM",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.4581766370734!2d103.86773147066637!3d1.4961178577762115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da6b58b4b372ad%3A0x2ce128d63eb5a17f!2sThe%20J%20%40%20Seri%20Alam!5e0!3m2!1sen!2smy!4v1765758087645!5m2!1sen!2smy"
  },
    
  ]

  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute right-1/3 top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-200/30 via-cyan-100/20 to-transparent blur-3xl" />
        <div className="absolute left-1/4 bottom-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-orange-200/25 via-amber-100/15 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <section className="mb-16 text-center pt-20 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/40 backdrop-blur-md px-5 py-2">
            <MapPin className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-black/70">Find Us</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-black/90 md:text-6xl">
            Visit <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">Our Locations</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-black/60 leading-relaxed">
            Experience our vintage collection in person at local markets and pop-up events around Kuala Lumpur.
          </p>
        </section>

        <div className="mb-12">
          <div className="mb-8 flex items-center gap-3 animate-fade-in">
            <div className="rounded-2xl bg-orange-500/10 p-3">
              <Store className="h-7 w-7 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-black/90">Regular Markets</h2>
          </div>
          
          <div className="space-y-8">
            {locations.map((location, index) => (
              <GlassCard key={index} className="overflow-hidden p-0 transition-all hover:shadow-2xl animate-scale-in" style={{ animationDelay: `${index * 0.2}s`, opacity: 0 }}>
                <div className="grid gap-0 md:grid-cols-2">
                  <div className="p-8">
                    <h3 className="mb-6 text-2xl font-bold text-black/90">
                      {location.name}
                    </h3>
                    <div className="space-y-4 text-black/70">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-orange-600" />
                        <div>
                          <p className="font-semibold text-black/90">{location.address}</p>
                          <p className="text-sm text-black/60">{location.area}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-purple-600" />
                        <p className="font-medium">{location.schedule}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <p className="font-medium">{location.hours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-[300px] md:h-auto">
                    <iframe
                      src={location.mapEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <GlassCard className="mb-12 p-10 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-purple-500/10 p-3">
              <Calendar className="h-7 w-7 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-black/90">Pop-Up Events</h2>
          </div>
          
          <div className="space-y-4 text-black/70 leading-relaxed">
            <p className="text-lg">
              We regularly participate in vintage fashion events, community markets, and pop-up shops around Kuala Lumpur and Selangor.
            </p>
            <div className="my-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6">
              <p className="mb-4 text-lg font-bold text-black/90">
                <Sparkles className="mb-1 inline h-5 w-5 text-purple-600" /> Want to know where we'll be next?
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>Follow us on <strong className="text-black/90">Tiktok @ximyvault</strong> for location updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>Join our <strong className="text-black/90">WhatsApp broadcast list</strong> for event notifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>Check back here regularly for our <strong className="text-black/90">event calendar</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-10 animate-scale-in" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <h3 className="mb-8 text-center text-3xl font-bold text-black/90">
            What to Expect When Visiting
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { emoji: "✨", title: "Browse Our Selection", desc: "See and feel the quality of our vintage pieces in person. We bring a curated selection of our best items to each market." },
              { emoji: "👕", title: "Try Before You Buy", desc: "Try on items to ensure the perfect fit. Vintage sizing can vary, so we encourage trying pieces on." },
              { emoji: "💬", title: "Ask Questions", desc: "Chat with us about styling tips, item history, or special requests. We love talking vintage fashion!" },
              { emoji: "💳", title: "Payment Options", desc: "We accept cash, cards, and online payment. Some locations may have different payment options." }
            ].map((item, i) => (
              <div key={i} className="group rounded-2xl border border-black/10 bg-gradient-to-br from-white/60 to-white/30 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg">
                <div className="mb-3 text-3xl">{item.emoji}</div>
                <h4 className="mb-2 text-lg font-bold text-black/90">{item.title}</h4>
                <p className="text-sm text-black/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="mt-12 text-center animate-fade-in">
          <p className="text-lg text-black/60">
            Can't make it to our physical locations?{" "}
            <a href="/collection" className="font-semibold text-black/90 underline decoration-purple-600/30 underline-offset-4 transition-all hover:decoration-purple-600">
              Shop our online collection
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
