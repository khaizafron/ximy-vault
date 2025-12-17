import { GlassCard } from "@/components/glass"
import { Mail, MessageCircle, Instagram, Facebook, Music } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-green-200/30 via-emerald-100/20 to-transparent blur-3xl" />
        <div className="absolute right-1/4 bottom-60 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-pink-200/25 via-purple-100/15 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-24">
        <section className="mb-16 text-center pt-20 animate-fade-in-up">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-black/90 md:text-6xl">
            Get In <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-black/60 leading-relaxed">
            Have questions? Want to know more about a piece? We'd love to hear from you.
          </p>
        </section>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <GlassCard className="group flex flex-col items-center p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-scale-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <div className="mb-6 rounded-full bg-green-500/10 p-5 transition-all duration-500 group-hover:bg-green-500/20">
              <MessageCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black/90">WhatsApp</h3>
            <p className="mb-4 text-sm text-black/60">
              Chat with us directly
            </p>
            <Link
              href="https://wa.me/60149226456"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-green-600 transition-colors hover:text-green-700"
            >
              +60 14-922 6456
            </Link>
          </GlassCard>

          <GlassCard className="group flex flex-col items-center p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-scale-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <div className="mb-6 rounded-full bg-blue-500/10 p-5 transition-all duration-500 group-hover:bg-blue-500/20">
              <Mail className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black/90">Email</h3>
            <p className="mb-4 text-sm text-black/60">
              Send us an email
            </p>
            <a
              href="mailto:ximyvault@gmail.com"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              ximyvault@gmail.com
            </a>
          </GlassCard>

          <GlassCard className="group flex flex-col items-center p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-scale-in md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <div className="mb-6 rounded-full bg-pink-500/10 p-5 transition-all duration-500 group-hover:bg-pink-500/20">
              <Instagram className="h-10 w-10 text-pink-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black/90">Instagram</h3>
            <p className="mb-4 text-sm text-black/60">
              Follow our latest finds
            </p>
            <Link
              href="https://instagram.com/ximyvault"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-pink-600 transition-colors hover:text-pink-700"
            >
              @ximyvault
            </Link>
          </GlassCard>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <GlassCard className="group flex flex-col items-center p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-scale-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <div className="mb-6 rounded-full bg-blue-500/10 p-5 transition-all duration-500 group-hover:bg-blue-500/20">
              <Facebook className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black/90">Facebook</h3>
            <p className="mb-4 text-sm text-black/60">
              Like and follow us
            </p>
            <Link
              href="https://facebook.com/ximyvault"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              Ximy Vault
            </Link>
          </GlassCard>

          <GlassCard className="group flex flex-col items-center p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-scale-in" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <div className="mb-6 rounded-full bg-purple-500/10 p-5 transition-all duration-500 group-hover:bg-purple-500/20">
              <Music className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-black/90">TikTok</h3>
            <p className="mb-4 text-sm text-black/60">
              Watch styling inspiration
            </p>
            <Link
              href="https://tiktok.com/@ximysthrifted13"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-purple-600 transition-colors hover:text-purple-700"
            >
              @ximysthrifted13
            </Link>
          </GlassCard>
        </div>

        <GlassCard className="p-10 animate-fade-in" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <h3 className="mb-4 text-center text-3xl font-bold text-black/90">
            Follow Our Journey
          </h3>
          <p className="mb-8 text-center text-lg text-black/60">
            See behind-the-scenes content, styling tips, and be the first to know about new arrivals on our social media.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <Link 
              href="https://instagram.com/ximyvault" 
              target="_blank"
              className="group flex items-center justify-center gap-3 rounded-2xl border border-black/10 bg-gradient-to-br from-pink-50 to-purple-50 p-6 transition-all hover:scale-105 hover:shadow-lg"
            >
              <Instagram className="h-7 w-7 text-pink-600" />
              <span className="font-semibold text-black/90">Instagram</span>
            </Link>
            <Link 
              href="https://facebook.com/ximyvault" 
              target="_blank"
              className="group flex items-center justify-center gap-3 rounded-2xl border border-black/10 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 transition-all hover:scale-105 hover:shadow-lg"
            >
              <Facebook className="h-7 w-7 text-blue-600" />
              <span className="font-semibold text-black/90">Facebook</span>
            </Link>
            <Link 
              href="https://tiktok.com/@ximyvault" 
              target="_blank"
              className="group flex items-center justify-center gap-3 rounded-2xl border border-black/10 bg-gradient-to-br from-purple-50 to-pink-50 p-6 transition-all hover:scale-105 hover:shadow-lg"
            >
              <Music className="h-7 w-7 text-purple-600" />
              <span className="font-semibold text-black/90">TikTok</span>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
