'use client'

import Link from 'next/link'
import { AramacCopyright } from '@/components/ui/copyright'

const columns = [
  {
    title: 'Platform',
    items: [
      { title: 'Features', href: '/#features' },
      { title: 'Pricing', href: '/#pricing' },
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'API', href: '/api' },
    ],
  },
  {
    title: 'Services',
    items: [
      { title: 'Community', href: '/dashboard/community' },
      { title: 'Calendar', href: '/calendario' },
      { title: 'Emergency', href: '/emergencias' },
      { title: 'Documents', href: '/documentos' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { title: 'Weather', href: '/weather' },
      { title: 'Maps', href: '/mapa' },
      { title: 'Photos', href: '/fotos' },
      { title: 'Events', href: '/eventos' },
    ],
  },
  {
    title: 'Support',
    items: [
      { title: 'Help Center', href: '/dashboard/help' },
      { title: 'Contact', href: '/contactos' },
      { title: 'Donate', href: '/donate' },
      { title: 'Settings', href: '/dashboard/settings' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms of Service', href: '/terms' },
      { title: 'Cookie Policy', href: '/cookies' },
    ],
  },
]

export default function FooterSection() {
  return (
    <footer className='py-16 md:py-24'>
      <div className='mx-auto max-w-7xl px-6'>
        <div className='mb-10 flex items-center justify-end'>
          <div className='text-xs text-muted-foreground'>
            Region: <button className='underline underline-offset-2'>Global</button> /{' '}
            <button className='underline underline-offset-2'>EEA</button>
          </div>
        </div>

        <div className='grid gap-8 md:grid-cols-3 lg:grid-cols-5'>
          {columns.map((col, idx) => (
            <div key={idx}>
              <h4 className='mb-3 text-sm font-semibold'>{col.title}</h4>
              <ul className='space-y-2 text-sm'>
                {col.items.map((l, i) => (
                  <li key={i}>
                    <Link href={l.href} className='text-muted-foreground hover:text-primary'>
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='my-10 flex flex-wrap items-center justify-end gap-4 border-t pt-6'>
        </div>

        <div className='text-center'>
          <AramacCopyright />
        </div>
      </div>
    </footer>
  )
}

