'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import Link from 'next/link'
import * as React from 'react'

import { Logo } from '@/components/logo'

// Magnetic hover wrapper using Framer Motion
interface MagneticIconProps {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}

function MagneticIcon({ href, ariaLabel, children }: MagneticIconProps) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.3 })

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = e.clientX - (rect.left + rect.width / 2)
    const my = e.clientY - (rect.top + rect.height / 2)
    const max = 10
    x.set(Math.max(-max, Math.min(max, mx * 0.25)))
    y.set(Math.max(-max, Math.min(max, my * 0.25)))
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <Link href={href} aria-label={ariaLabel} className='text-muted-foreground hover:text-primary block'>
      <motion.span
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ x: sx, y: sy }}
        whileHover={reduce ? undefined : { scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className='inline-flex'
      >
        {children}
      </motion.span>
    </Link>
  )
}

function IconSet({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className='flex items-center gap-8' {...(ariaHidden && { 'aria-hidden': 'true' })}>
      <Link href='/' aria-label='Home' className='block'>
        <Logo className='size-6' />
      </Link>
      <MagneticIcon href='#' ariaLabel='X/Twitter'>
        <svg className='size-6' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z'/></svg>
      </MagneticIcon>
      <MagneticIcon href='#' ariaLabel='LinkedIn'>
        <svg className='size-6' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z'/></svg>
      </MagneticIcon>
      <MagneticIcon href='#' ariaLabel='Instagram'>
        <svg className='size-6' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3'/></svg>
      </MagneticIcon>
      <MagneticIcon href='#' ariaLabel='GitHub'>
        <svg className='size-6' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path fill='currentColor' d='M12 2a10 10 0 0 0-3.162 19.49c.5.092.687-.217.687-.483 0-.237-.009-.866-.013-1.7-2.8.607-3.392-1.35-3.392-1.35-.455-1.156-1.11-1.465-1.11-1.465-.907-.62.069-.607.069-.607 1.003.07 1.53 1.03 1.53 1.03.892 1.528 2.341 1.087 2.91.832.091-.647.35-1.087.636-1.338-2.237-.254-4.588-1.118-4.588-4.976 0-1.1.393-1.998 1.036-2.702-.104-.254-.45-1.276.098-2.66 0 0 .844-.27 2.764 1.03A9.63 9.63 0 0 1 12 6.844a9.6 9.6 0 0 1 2.516.34c1.92-1.3 2.763-1.03 2.763-1.03.549 1.384.203 2.406.1 2.66.644.704 1.036 1.602 1.036 2.702 0 3.867-2.355 4.72-4.6 4.97.359.309.678.92.678 1.855 0 1.338-.012 2.416-.012 2.745 0 .268.185.579.693.48A10 10 0 0 0 12 2Z'/></svg>
      </MagneticIcon>
      <MagneticIcon href='#' ariaLabel='YouTube'>
        <svg className='size-6' viewBox='0 0 24 24'><path fill='currentColor' d='M21.8 8.001a3 3 0 0 0-2.11-2.12C18 5.5 12 5.5 12 5.5s-6 0-7.69.38A3 3 0 0 0 2.2 8C1.82 9.7 1.82 12 1.82 12s0 2.3.38 4a3 3 0 0 0 2.11 2.12C6 18.5 12 18.5 12 18.5s6 0 7.69-.38A3 3 0 0 0 21.8 16c.38-1.7.38-4 .38-4s0-2.3-.38-4M10 15.5v-7l6 3.5z'/></svg>
      </MagneticIcon>
      <MagneticIcon href='#' ariaLabel='Facebook'>
        <svg className='size-6' viewBox='0 0 24 24'><path fill='currentColor' d='M13 3h4a1 1 0 0 1 1 1v3h-3a1 1 0 0 0-1 1v3h4l-1 4h-3v6h-4v-6H8v-4h2V8a5 5 0 0 1 5-5Z'/></svg>
      </MagneticIcon>
    </div>
  )
}

export function SocialConveyor() {
  return (
    <div className='relative w-full'>
      <div className='overflow-hidden motion-reduce:overflow-x-auto'>
        <div className='flex gap-8 items-center conveyor-track'>
          <IconSet />
          <div aria-hidden className='flex gap-8'><IconSet ariaHidden /></div>
        </div>
      </div>
    </div>
  )
}

export function ConveyorStyles() {
  return null
}