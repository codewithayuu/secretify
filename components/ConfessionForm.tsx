'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Confession } from '@/types/confession'

interface ConfessionFormProps {
  onConfessionAdded: (confession: Confession) => void
}

export default function ConfessionForm({ onConfessionAdded }: ConfessionFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length
  const charCount = content.length
  const isValid = wordCount >= 1 && wordCount <= 200 && charCount <= 5000

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    setMessage('')

    const tempConfession: Confession = {
      id: `temp-${Date.now()}`,
      content: content.trim(),
      created_at: new Date().toISOString(),
      support_count: 0,
      relate_count: 0,
      user_support: false,
      user_relate: false
    }

    onConfessionAdded(tempConfession)

    try {
      const response = await fetch('/api/confessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Confession shared successfully!')
        setMessageType('success')
        setContent('')
        setTimeout(() => {
          setMessage('')
          setMessageType('')
        }, 3000)
      } else {
        setMessage(data.error || 'Failed to save confession')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Network error. Please try again.')
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProgressColor = () => {
    if (wordCount < 1 || charCount > 5000) return 'bg-gray-500'
    if (wordCount <= 50) return 'bg-red-500'
    if (wordCount <= 100) return 'bg-yellow-500'
    if (wordCount <= 150) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getProgressWidth = () => {
    const wordProgress = (wordCount / 200) * 100
    const charProgress = (charCount / 5000) * 100
    return Math.min(Math.max(wordProgress, charProgress), 100)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    const newWordCount = newContent.trim().split(/\s+/).filter(word => word.length > 0).length
    
    if (newWordCount <= 200 && newContent.length <= 5000) {
      setContent(newContent)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-2xl">🌸</span>
          </motion.div>
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Share Your Secret
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Anonymously share what&apos;s on your mind
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="What's your confession?"
            className="w-full h-32 px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--foreground)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent backdrop-blur-md transition-all duration-300"
            disabled={isSubmitting}
            maxLength={5000}
          />
        </div>

        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-3">
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${getProgressColor()}`}
                style={{ width: `${getProgressWidth()}%` }}
              />
            </div>
            <motion.span 
              className={`text-sm font-medium transition-colors duration-300 ${
                wordCount < 1 || charCount > 5000 ? 'text-red-400' :
                wordCount <= 50 ? 'text-yellow-400' :
                wordCount <= 100 ? 'text-blue-400' :
                wordCount <= 150 ? 'text-green-400' :
                'text-[var(--accent)]'
              }`}
              animate={{ 
                scale: wordCount > 0 ? [1, 1.05, 1] : 1,
                opacity: wordCount > 0 ? [0.8, 1, 0.8] : 0.6
              }}
              transition={{ 
                duration: 0.3,
                repeat: wordCount > 0 ? 1 : 0
              }}
            >
              {wordCount}/200
            </motion.span>
          </div>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-center font-medium ${
              messageType === 'success'
                ? 'bg-green-900/30 text-green-300 border border-green-700/30'
                : 'bg-red-900/30 text-red-300 border border-red-700/30'
            } backdrop-blur-md`}
          >
            {message}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={!isValid || isSubmitting}
          whileHover={{ scale: isValid ? 1.02 : 1 }}
          whileTap={{ scale: isValid ? 0.98 : 1 }}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
            isValid && !isSubmitting
              ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Sharing...' : 'Share Confession'}
        </motion.button>
      </form>
    </motion.div>
  )
}