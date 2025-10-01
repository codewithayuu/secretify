'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="mt-16 py-8 px-4 text-center"
    >
      <div className="flex items-center justify-center space-x-2 text-sm text-[var(--text-muted)]">
        <span>Made with</span>
        
        <motion.span
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-red-500 text-lg"
        >
          ❤️
        </motion.span>
        
        <span>by</span>
        
        <motion.span
          whileHover={{ 
            scale: 1.05,
            color: 'var(--accent)'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)] cursor-pointer"
        >
          iambatman
        </motion.span>
        
        <motion.div
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -10, 10, 0]
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Link 
            href="https://github.com/codewithayuu/secretify"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all duration-300 group"
          >
            <motion.svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[var(--text-muted)] group-hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <path
                d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                fill="currentColor"
              />
            </motion.svg>
          </Link>
        </motion.div>
      </div>
    </motion.footer>
  )
}
