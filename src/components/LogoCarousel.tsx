'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const logos = Array.from({ length: 18 }, (_, i) => `/loop-logos/${i + 1}.png`)

export function LogoCarousel() {
  return (
    <div className="relative w-full overflow-hidden py-16">
      <motion.div
        className="flex items-center gap-16"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 30
        }}
      >
        {/* duplicate for seamless loop */}
        {[...logos, ...logos].map((src, i) => (
          <div
            key={i}
            className="relative h-16 w-40 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <Image
              src={src}
              alt={`Brand logo ${i + 1}`}
              fill
              className="object-contain"
              priority={i < 6}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
