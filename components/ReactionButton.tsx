'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getDeviceId } from '@/utils/device'

interface ReactionButtonProps {
  confessionId: string
  reactionType: 'support' | 'relate'
  initialCount: number
  initialActive: boolean
  onReactionChange: (type: 'support' | 'relate', count: number, active: boolean) => void
}

export default function ReactionButton({
  confessionId,
  reactionType,
  initialCount,
  initialActive,
  onReactionChange,
}: ReactionButtonProps) {
  const [count, setCount] = useState(initialCount)
  const [isActive, setIsActive] = useState(initialActive)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setCount(initialCount)
    setIsActive(initialActive)
  }, [initialCount, initialActive])

  const icon = reactionType === 'support' ? '💚' : '💬'
  const label = reactionType === 'support' ? 'Support' : 'Relate'

  const handleClick = async () => {
    if (isAnimating) return

    setIsAnimating(true)
    const deviceId = getDeviceId()

    const newActive = !isActive
    const newCount = newActive ? count + 1 : count - 1
    setCount(newCount)
    setIsActive(newActive)
    onReactionChange(reactionType, newCount, newActive)

    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confession_id: confessionId,
          device_id: deviceId,
          reaction_type: reactionType,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const serverNewActive = data.action === 'added'
        const serverNewCount = data.counts[`${reactionType}_count`] || 0

        setCount(serverNewCount)
        setIsActive(serverNewActive)
        onReactionChange(reactionType, serverNewCount, serverNewActive)
      } else {
        setCount(initialCount)
        setIsActive(initialActive)
        onReactionChange(reactionType, initialCount, initialActive)
        console.error('Reaction error:', data.error)
        alert(`Failed to ${newActive ? 'add' : 'remove'} reaction: ${data.error || 'Server error'}`)
      }
    } catch (err) {
      setCount(initialCount)
      setIsActive(initialActive)
      onReactionChange(reactionType, initialCount, initialActive)
      console.error('Network error:', err)
      alert('Network error. Please try again.')
    } finally {
      setIsAnimating(false)
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
        ${isActive
          ? 'bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/30'
          : 'bg-[var(--card-bg)] text-[var(--text-muted)] hover:bg-[var(--card-bg-hover)] border border-[var(--glass-border)]'
        }
        ${isAnimating ? 'opacity-70 cursor-wait' : ''}
      `}
      disabled={isAnimating}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold
            ${isActive ? 'bg-white text-[var(--accent)]' : 'bg-[var(--accent)]/20 text-[var(--accent)]'}
          `}
        >
          {count}
        </motion.span>
      )}
    </motion.button>
  )
}