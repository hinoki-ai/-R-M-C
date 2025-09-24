/**
 * Types for the Unified Panel Background System
 * Prevents background pattern destruction by font and UI elements
 */

export type PanelVariant =
  | 'solid' // Complete background protection with solid color
  | 'glass' // Glass morphism with backdrop blur
  | 'themed' // Theme-aware with semi-transparent background
  | 'patternSafe' // Preserves background patterns with subtle overlay
  | 'content' // Enhanced contrast for content-heavy panels
  | 'gradient' // Gradient background
  | 'glassGradient' // Gradient with glass morphism
  | 'vineyard' // Vineyard theme specific
  | 'ocean' // Ocean theme specific
  | 'mountain' // Mountain theme specific
  | 'patagonia' // Patagonia theme specific
  | 'pastel'; // Pastel theme specific

export type PanelRounded =
  | 'default' // Uses theme radius
  | 'sm' // Smaller radius
  | 'lg' // Larger radius
  | 'xl' // Extra large radius
  | 'none'; // No border radius

export type PanelPadding =
  | 'default' // Standard padding (1rem)
  | 'sm' // Small padding (0.75rem)
  | 'lg' // Large padding (1.5rem)
  | 'xl' // Extra large padding (2rem)
  | 'none'; // No padding

export type PanelShadow =
  | 'default' // Small shadow
  | 'none' // No shadow
  | 'sm' // Small shadow
  | 'md' // Medium shadow
  | 'lg'; // Large shadow

export type PanelHover =
  | 'default' // No hover effect
  | 'lift'; // Lift animation on hover

export interface PanelThemeColors {
  background: string;
  foreground: string;
  border: string;
  shadow: string;
}

export interface PanelConfig {
  variant: PanelVariant;
  rounded: PanelRounded;
  padding: PanelPadding;
  shadow: PanelShadow;
  hover: PanelHover;
}
