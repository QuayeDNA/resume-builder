'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import mobileImg from '@/assets/app-mobile.png'

export default function PhoneFrame() {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springRotX = useSpring(rotateX, { stiffness: 100, damping: 12 })
  const springRotY = useSpring(rotateY, { stiffness: 100, damping: 12 })

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    rotateX.set((y - 0.5) * -8)
    rotateY.set((x - 0.5) * 8)
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
      className="w-full max-w-[220px] mx-auto"
      initial={{ opacity: 0, y: 30, scale: 0.9, rotate: -3 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1], delay: 0.45 }}
      whileHover={{ rotate: -1, scale: 1.03 }}
    >
      {/* Phone body */}
      <div className="relative rounded-[36px] bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] p-[4px] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
        {/* Screen */}
          <div className="relative overflow-hidden rounded-[32px] bg-white" style={{ aspectRatio: '428/697' }}>
            <Image
              src={mobileImg}
              alt="ResumeForge builder mobile view"
              fill
              sizes="220px"
              className="object-cover object-top"
            />

          {/* Dynamic Island notch */}
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[80px] h-[20px] rounded-full bg-[#1c1c1e]" />

          {/* Home indicator */}
          <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[120px] h-[4px] rounded-full bg-white/30" />
        </div>

        {/* Side buttons */}
        <div className="absolute right-[-3px] top-[90px] w-[3px] h-[28px] rounded-r-[2px] bg-[#3a3a3c]" />
        <div className="absolute right-[-3px] top-[126px] w-[3px] h-[50px] rounded-r-[2px] bg-[#3a3a3c]" />
        <div className="absolute left-[-3px] top-[110px] w-[3px] h-[36px] rounded-l-[2px] bg-[#3a3a3c]" />
      </div>

      {/* Shadow under phone */}
      <div className="mx-auto w-[80%] h-[12px] bg-black/20 blur-xl rounded-full -mt-1" />
    </motion.div>
  )
}
