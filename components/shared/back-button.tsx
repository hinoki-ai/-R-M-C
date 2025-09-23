'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
  href?: string
  onClick?: () => void
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg'
  showIcon?: boolean
}

export function BackButton({
  href,
  onClick,
  children = 'Volver',
  className = '',
  variant = 'outline',
  size = 'sm',
  showIcon = true
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      // Use Link for navigation
      return
    } else {
      // Default to router.back()
      router.back()
    }
  }

  const buttonContent = (
    <>
      {showIcon && <ChevronLeft className='w-4 h-4 mr-2' />}
      {children}
    </>
  )

  if (href) {
    return (
      <Button variant={variant} size={size} className={className} asChild>
        <Link href={href}>
          {buttonContent}
        </Link>
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {buttonContent}
    </Button>
  )
}

// Pre-configured variants for common use cases
export function BackToHomeButton({ className = '', variant = 'ghost', size = 'sm' }: { className?: string, variant?: 'default' | 'outline' | 'ghost' | 'link', size?: 'default' | 'sm' | 'lg' }) {
  return (
    <BackButton href='/' variant={variant} size={size} className={className}>
      Volver al Inicio
    </BackButton>
  )
}

export function BackToPreviousButton({ className = '', variant = 'outline', size = 'sm', children }: { className?: string, variant?: 'default' | 'outline' | 'ghost' | 'link', size?: 'default' | 'sm' | 'lg', children?: React.ReactNode }) {
  return (
    <BackButton variant={variant} size={size} className={className}>
      {children || 'Volver'}
    </BackButton>
  )
}