'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { supabase } from '@/lib/supabaseClient'
import { Confession } from '@/types/confession'
import { getDeviceId } from '@/utils/device'
import ReactionButton from './ReactionButton'

export default function ConfessionsStack() {
  const [confessions, setConfessions] = useState<Confession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchConfessions()

    const channel = supabase
      .channel('confessions-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'confessions' }, (payload) => {
        const newConfession = payload.new as Confession
        setConfessions(prev => {
          const existingIndex = prev.findIndex(c => c.id === newConfession.id || c.content === newConfession.content)
          if (existingIndex !== -1) {
            const updatedConfessions = [...prev]
            updatedConfessions[existingIndex] = newConfession
            return updatedConfessions.slice(0, 200)
          } else {
            return [newConfession, ...prev].slice(0, 200)
          }
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchConfessions = async () => {
    try {
      setLoading(true)
      const deviceId = getDeviceId()
      const response = await fetch(`/api/confessions?deviceId=${deviceId}`)
      const data: { confessions: Confession[]; error?: string } = await response.json()

      if (response.ok) {
        setConfessions(data.confessions || [])
      } else {
        console.error('Error fetching confessions:', data.error)
        setError(data.error || 'Failed to load confessions')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to load confessions')
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const createdAt = new Date(dateString)
    return formatDistanceToNow(createdAt, { addSuffix: true })
  }

  const isOptimisticConfession = (confession: Confession) => {
    return confession.id.startsWith('temp-')
  }

  const handleReactionChange = (confessionId: string, type: 'support' | 'relate', count: number, active: boolean) => {
    setConfessions(prev => prev.map(confession => {
      if (confession.id === confessionId) {
        return {
          ...confession,
          [`${type}_count`]: count,
          [`user_${type}`]: active
        }
      }
      return confession
    }))
  }

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-6 text-center py-8">
        <div className="animate-pulse text-[var(--accent)]">Loading confessions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-effect rounded-2xl p-6 text-center py-8">
        <div className="bg-red-900/30 text-red-300 p-3 rounded-lg text-center font-medium border border-red-700/30 backdrop-blur-md mb-4">
          {error}
        </div>
        <button
          onClick={fetchConfessions}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] font-serif mb-2">
          Recent Confessions
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          {confessions.length} secret{confessions.length !== 1 ? 's' : ''} shared
        </p>
        <div className="flex items-center justify-center mt-3">
          <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse mr-2"></div>
          <span className="text-xs text-[var(--text-muted)]">Live updates</span>
        </div>
      </div>

      <AnimatePresence>
        {confessions.map((confession, index) => (
          <motion.div
            key={confession.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 25,
              mass: 0.7,
              delay: index * 0.03
            }}
            className={isOptimisticConfession(confession)
              ? "bg-orange-900/20 backdrop-blur-lg rounded-2xl shadow-lg border border-orange-500/30 p-6 hover:shadow-xl transition-all duration-300"
              : "glass-effect rounded-2xl p-6 hover-lift transition-all duration-300"
            }
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isOptimisticConfession(confession)
                    ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                    : 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)]'
                }`}>
                  <span className="text-white font-bold text-xs">?</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[var(--text-muted)] font-medium">Anonymous</span>
                  {isOptimisticConfession(confession) && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      Sending...
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                {formatTimeAgo(confession.created_at)}
              </span>
            </div>

            <p className="text-base text-[var(--foreground)] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'var(--confession-font)' }}>
              "{confession.content}"
            </p>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--border)]">
              <div className="flex items-center space-x-2">
                {!isOptimisticConfession(confession) && (
                  <>
                    <ReactionButton
                      confessionId={confession.id}
                      reactionType="support"
                      initialCount={confession.support_count || 0}
                      initialActive={confession.user_support || false}
                      onReactionChange={(type, count, active) =>
                        handleReactionChange(confession.id, type, count, active)
                      }
                    />
                    <ReactionButton
                      confessionId={confession.id}
                      reactionType="relate"
                      initialCount={confession.relate_count || 0}
                      initialActive={confession.user_relate || false}
                      onReactionChange={(type, count, active) =>
                        handleReactionChange(confession.id, type, count, active)
                      }
                    />
                  </>
                )}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {isOptimisticConfession(confession) && (
                  <span className="text-orange-500">Pending...</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {confessions.length === 0 && !loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6 text-center py-8 text-[var(--text-muted)]"
        >
          <p className="text-lg font-semibold mb-2">No confessions yet!</p>
          <p>
            Be the first to share something meaningful!
          </p>
        </motion.div>
      )}
    </div>
  )
}