'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { usePanelTheme } from '@/hooks/use-panel-theme';

/**
 * Unified Panel Background System
 * Prevents background pattern destruction by font and UI elements
 *
 * Features:
 * - Solid panels for complete background protection
 * - Glass morphism effects with backdrop blur
 * - Theme-aware panels that blend with background patterns
 * - Pattern-preserving panels for subtle overlays
 * - Theme-specific variants for each background theme
 */

const panelVariants = cva('panel', {
  variants: {
    variant: {
      solid: 'panel-solid',
      glass: 'panel-solid-glass',
      themed: 'panel-themed',
      patternSafe: 'panel-pattern-safe',
      content: 'panel-content',
      gradient: 'panel-gradient',
      glassGradient: 'panel-gradient-glass',
      vineyard: 'panel-vineyard',
      ocean: 'panel-ocean',
      mountain: 'panel-mountain',
      patagonia: 'panel-patagonia',
      pastel: 'panel-pastel',
    },
    rounded: {
      default: 'panel-rounded',
      sm: 'panel-rounded-sm',
      lg: 'panel-rounded-lg',
      xl: 'panel-rounded-xl',
      none: 'panel-rounded-none',
    },
    padding: {
      default: 'panel-padding',
      sm: 'panel-padding-sm',
      lg: 'panel-padding-lg',
      xl: 'panel-padding-xl',
      none: '',
    },
    shadow: {
      default: 'panel-shadow-sm',
      none: 'panel-shadow-none',
      sm: 'panel-shadow-sm',
      md: 'panel-shadow',
      lg: 'panel-shadow-lg',
    },
    hover: {
      default: '',
      lift: 'panel-hover-lift',
    },
  },
  defaultVariants: {
    variant: 'solid',
    rounded: 'default',
    padding: 'default',
    shadow: 'default',
    hover: 'default',
  },
});

export interface PanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {
  asChild?: boolean;
  children: React.ReactNode;
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      className,
      variant,
      rounded,
      padding,
      shadow,
      hover,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    return (
      <div
        className={cn(
          panelVariants({ variant, rounded, padding, shadow, hover }),
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="panel-content">{children}</div>
      </div>
    );
  }
);
Panel.displayName = 'Panel';

/**
 * Auto-detects the current theme and applies the appropriate theme-specific panel
 */
export interface AutoPanelProps extends Omit<PanelProps, 'variant'> {
  fallback?: PanelProps['variant'];
}

const AutoPanel = React.forwardRef<HTMLDivElement, AutoPanelProps>(
  ({ className, fallback = 'solid', ...props }, ref) => {
    const currentTheme = usePanelTheme();

    const themeVariant = React.useMemo(() => {
      switch (currentTheme) {
        case 'vineyard':
          return 'vineyard';
        case 'ocean':
          return 'ocean';
        case 'mountain':
          return 'mountain';
        case 'patagonia':
          return 'patagonia';
        case 'pastel':
          return 'pastel';
        default:
          return fallback;
      }
    }, [currentTheme, fallback]);

    return (
      <Panel
        ref={ref}
        variant={themeVariant}
        className={className}
        {...props}
      />
    );
  }
);
AutoPanel.displayName = 'AutoPanel';

/**
 * Text-safe wrapper for content that needs extra protection within panels
 */
export interface PanelTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const PanelText = React.forwardRef<HTMLSpanElement, PanelTextProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn('panel-text-safe', className)} {...props}>
        {children}
      </span>
    );
  }
);
PanelText.displayName = 'PanelText';

/**
 * Panel Section - A semantic section wrapper with panel styling
 */
export interface PanelSectionProps extends Omit<PanelProps, 'title'> {
  title?: React.ReactNode;
  description?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const PanelSection = React.forwardRef<HTMLDivElement, PanelSectionProps>(
  (
    {
      className,
      title,
      description,
      headerClassName,
      contentClassName,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Panel ref={ref} className={cn('space-y-4', className)} {...props}>
        {(title || description) && (
          <div className={cn('space-y-1', headerClassName)}>
            {title && (
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div className={contentClassName}>{children}</div>
      </Panel>
    );
  }
);
PanelSection.displayName = 'PanelSection';

/**
 * Panel Card - Enhanced card component with panel background protection
 */
export interface PanelCardProps extends PanelProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  headerClassName?: string;
  footerClassName?: string;
}

const PanelCard = React.forwardRef<HTMLDivElement, PanelCardProps>(
  (
    {
      className,
      header,
      footer,
      headerClassName,
      footerClassName,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Panel ref={ref} className={cn('space-y-4', className)} {...props}>
        {header && (
          <div className={cn('border-b pb-4', headerClassName)}>{header}</div>
        )}
        <div className="flex-1">{children}</div>
        {footer && (
          <div className={cn('border-t pt-4', footerClassName)}>{footer}</div>
        )}
      </Panel>
    );
  }
);
PanelCard.displayName = 'PanelCard';

/**
 * Panel Overlay - Full-screen overlay with panel background
 */
export interface PanelOverlayProps extends PanelProps {
  onClose?: () => void;
  closeOnBackdrop?: boolean;
}

const PanelOverlay = React.forwardRef<HTMLDivElement, PanelOverlayProps>(
  ({ className, onClose, closeOnBackdrop = true, children, ...props }, ref) => {
    const handleBackdropClick = React.useCallback(
      (event: React.MouseEvent) => {
        if (
          event.target === event.currentTarget &&
          closeOnBackdrop &&
          onClose
        ) {
          onClose();
        }
      },
      [closeOnBackdrop, onClose]
    );

    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <Panel
          className={cn('w-full max-w-lg max-h-full overflow-auto', className)}
          {...props}
        >
          {children}
        </Panel>
      </div>
    );
  }
);
PanelOverlay.displayName = 'PanelOverlay';

export {
  Panel,
  AutoPanel,
  PanelText,
  PanelSection,
  PanelCard,
  PanelOverlay,
  panelVariants,
};
