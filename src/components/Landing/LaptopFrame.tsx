'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import desktopImg from '@/assets/app-desktop.jpeg'

export default function LaptopFrame() {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springRotX = useSpring(rotateX, { stiffness: 120, damping: 15 })
  const springRotY = useSpring(rotateY, { stiffness: 120, damping: 15 })

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    rotateX.set((y - 0.5) * -6)
    rotateY.set((x - 0.5) * 6)
  }

  const handlePointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX: springRotX, rotateY: springRotY, perspective: 1000 }}
      className="w-full max-w-[640px] mx-auto"
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.15 }}
    >
      {/* Laptop lid */}
      <div className="relative rounded-[16px] bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] p-[6px] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
        {/* Screen */}
        <div className="relative overflow-hidden rounded-[10px] bg-[#1a1a1c]" style={{ aspectRatio: '16/10' }}>
          <Image
            src={desktopImg}
            alt="ResumeForge builder desktop view"
            fill
            priority
            sizes="(max-width: 768px) 90vw, 640px"
            className="object-cover object-top"
          />
        </div>

        {/* Camera notch */}
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-[#1c1c1e] border border-[#3a3a3c]" />
      </div>

      {/* Hinge / keyboard base */}
      <div className="mx-auto -mt-[3px] w-[94%] h-[16px] rounded-b-[12px] bg-gradient-to-b from-[#2c2c2e] to-[#3a3a3c] relative overflow-hidden">
        <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[35%] h-[5px] rounded-full bg-[#4a4a4d]" />
      </div>

      {/* Shadow on surface */}
      <div className="mx-auto w-[88%] h-[18px] bg-black/25 blur-2xl rounded-full -mt-2" />
    </motion.div>
  )
}
