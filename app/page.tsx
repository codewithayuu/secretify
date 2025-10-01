'use client'

import { useState } from 'react'
import ConfessionForm from '@/components/ConfessionForm'
import ConfessionsStack from '@/components/ConfessionsStack'
import {
  FormContainer,
  StackContainer
} from '@/components/Layout'
import FloatingPetals from '@/components/FloatingPetals'
import Footer from '@/components/Footer'
import { Confession } from '@/types/confession'

export default function Home() {
  const handleConfessionAdded = (confession: Confession) => {
    // Optimistic update handled in ConfessionForm
  }

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      <FloatingPetals />
      
      <div className="min-h-screen flex flex-col items-center justify-start pt-16 pb-8 px-4">
        <div className="w-full max-w-lg space-y-8">
          <FormContainer>
            <ConfessionForm onConfessionAdded={handleConfessionAdded} />
          </FormContainer>

          <StackContainer>
            <ConfessionsStack />
          </StackContainer>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}