'use client'

import { motion } from 'framer-motion'
import { components } from '@/lib/dark-glass-theme'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] relative">
      {children}
    </div>
  )
}

// Header component
export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 80,
        damping: 25,
        mass: 0.8
      }}
      className={components.header}
    >
      <div className="max-w-md mx-auto px-4 text-center py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.6,
            delay: 0.2
          }}
          className="text-4xl mb-3"
        >
          🌸
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 90,
            damping: 22,
            mass: 0.7,
            delay: 0.3
          }}
          className="text-2xl font-bold text-[var(--foreground)] mb-2 font-serif"
        >
          Anonymous Confessions
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 90,
            damping: 22,
            mass: 0.7,
            delay: 0.4
          }}
          className="text-sm text-[var(--text-muted)] leading-relaxed font-serif"
        >
          Share your thoughts anonymously. Your voice matters.
        </motion.p>
      </div>
    </motion.header>
  )
}

// Main content wrapper
export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className={components.mainContent}>
      {children}
    </main>
  )
}

// Form container with gentle bounce
export function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 85,
        damping: 25,
        mass: 0.8,
        delay: 0.2
      }}
      className={components.formContainer}
    >
      {children}
    </motion.div>
  )
}

// Stack container for confessions with gentle bounce
export function StackContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 85,
        damping: 25,
        mass: 0.8,
        delay: 0.3
      }}
      className={components.stackContainer}
    >
      {children}
    </motion.div>
  )
}

// Footer component
export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="text-center py-8 px-4 border-t border-green-200/50"
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-green-600 mb-2">
          Built with ❤️ for creating meaningful connections
        </p>
        <p className="text-sm text-green-500">
          Remember: Be kind, be respectful, and be yourself. 
          This is a judgment-free zone. 💚
        </p>
      </div>
    </motion.footer>
  )
}

// Two-column layout for desktop
export function TwoColumnLayout({ 
  left, 
  right 
}: { 
  left: React.ReactNode
  right: React.ReactNode 
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {left}
      {right}
    </div>
  )
}
