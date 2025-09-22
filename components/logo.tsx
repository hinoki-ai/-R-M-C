import Image from 'next/image'

import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <Image
            src='/icons/favicon.png'
            alt='Logo'
            width={32}
            height={32}
            className={cn('h-8 w-8', className)}
        />
    )
}

export const LogoIcon = ({ className }: { className?: string }) => {
    return (
        <Image
            src='/icons/favicon.png'
            alt='Logo Icon'
            width={18}
            height={18}
            className={cn('size-5', className)}
        />
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <Image
            src='/icons/favicon.png'
            alt='Logo Stroke'
            width={28}
            height={28}
            className={cn('size-7 w-7', className)}
        />
    )
}
