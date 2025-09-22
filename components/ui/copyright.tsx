import * as React from 'react'

import { getAramacCopyright } from '@/lib/copyright-system'

interface CopyrightProps {
  className?: string
  year?: number
  showPoweredBy?: boolean
  brand?: string
  format?: 'standard' | 'minimal' | 'full'
}

export function Copyright({
  className = 'text-muted-foreground block text-center text-sm mt-4',
  year = new Date().getFullYear(),
  showPoweredBy = true,
  brand = 'ΛRΛMΛC®',
  format = 'standard'
}: CopyrightProps) {
  const copyrightText = getAramacCopyright({ year, brand, showPoweredBy, format })
  const brandMatch = copyrightText.match(/(ΛRΛMΛC®)/)

  const formattedText = brandMatch
    ? copyrightText.replace(
        brandMatch[0],
        `<span class="font-mono text-lg tracking-wider">${brandMatch[0]}</span>`
      )
    : copyrightText

  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: formattedText }} />
  )
}

// ARAMAC Standard Copyright Component
export function AramacCopyright({ className }: { className?: string }) {
  return (
    <Copyright
      className={className}
      brand='ΛRΛMΛC®'
      showPoweredBy={true}
      format='modern'
    />
  )
}