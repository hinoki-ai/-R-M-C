import Image from 'next/image';
import { SVGProps } from 'react';

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

export function ChatMaxingIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}
      >
        <path d='M8 9h8M8 13h6' />
        <circle cx='12' cy='12' r='10' />
      </svg>
    )
  }
  
  export function ChatMaxingIconColoured({ className, ...props }: SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 719 726'
        className={cn('w-6 h-6', className)}
        fill='none'
        {...props}
      >
          <path d='M593 447.194V261.006C593 224.58 577.991 189.763 551.507 164.754V164.754C526.932 141.548 494.413 128.62 460.614 128.62H443.014C409.215 128.62 376.696 141.548 352.121 164.754V164.754C325.637 189.763 310.628 224.581 310.628 261.007V261.007C310.628 297.435 325.638 332.254 352.123 357.264L361.158 365.796' stroke='#FF5053' strokeWidth='77'/>
          <path d='M126 280.667V466.854C126 503.28 141.009 538.097 167.493 563.107V563.107C192.068 586.313 224.587 599.24 258.386 599.24H275.986C309.785 599.24 342.304 586.313 366.879 563.107V563.107C393.363 538.097 408.372 503.279 408.372 466.853V466.853C408.372 430.425 393.362 395.606 366.877 370.596L357.842 362.064' stroke='#FF5053' strokeWidth='77'/>
          <path d='M593 280.667V466.854C593 503.28 577.991 538.097 551.507 563.107V563.107C526.932 586.313 494.413 599.24 460.614 599.24H443.014C409.215 599.24 376.696 586.313 352.121 563.107V563.107C325.637 538.097 310.628 503.279 310.628 466.853V466.853C310.628 430.425 325.638 395.606 352.123 370.596L361.158 362.064' stroke='#2771C7' strokeWidth='77'/>
          <path d='M126 447.194V261.006C126 224.58 141.009 189.763 167.493 164.754V164.754C192.068 141.548 224.587 128.62 258.386 128.62H275.986C309.785 128.62 342.304 141.548 366.879 164.754V164.754C393.363 189.763 408.372 224.581 408.372 261.007V261.007C408.372 297.435 393.362 332.254 366.877 357.264L357.842 365.796' stroke='#2771C7' strokeWidth='77'/>
      </svg>
    );
  }
