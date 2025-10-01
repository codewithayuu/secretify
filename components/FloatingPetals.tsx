'use client'

import { useEffect, useState } from 'react'

interface Petal {
  id: number
  left: number
  delay: number
  duration: number
}

export default function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([])

  useEffect(() => {
    // Create floating petals
    const newPetals: Petal[] = []
    for (let i = 0; i < 8; i++) {
      newPetals.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 15 + Math.random() * 10,
      })
    }
    setPetals(newPetals)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="floating-petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `-${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
