/**
 * ARAMAC Copyright System
 *
 * Standardized copyright formatting for all ARAMAC repositories.
 * Use this system to maintain consistent branding across all projects.
 *
 * Usage:
 * - For React components: import { AramacCopyright } from '@/components/ui/copyright'
 * - For plain text: import { getAramacCopyright } from '@/lib/copyright-system'
 * - For HTML: import { getAramacCopyrightHTML } from '@/lib/copyright-system'
 */

export interface CopyrightConfig {
  year?: number;
  brand?: string;
  showPoweredBy?: boolean;
  format?: 'standard' | 'minimal' | 'full' | 'modern' | 'compact' | 'legal';
}

export function getAramacCopyright(config: CopyrightConfig = {}): string {
  const {
    year = new Date().getFullYear(),
    brand = 'ΛRΛMΛC®',
    showPoweredBy = true,
    format = 'standard',
  } = config;

  switch (format) {
    case 'minimal':
      return `${year} ${brand}`;
    case 'full':
      return `${year} Powered by ${brand} - All rights reserved`;
    case 'modern':
      return `Powered by ${brand.replace('®', '')} - All rights reserved ${year}®`;
    case 'compact':
      return `Powered by ${brand} ${year} - All rights reserved`;
    case 'legal':
      return `Copyright © ${year} ${brand.replace('®', '')}. All rights reserved.`;
    case 'standard':
    default:
      return `${year} Powered by ${brand}`;
  }
}

export function getAramacCopyrightHTML(config: CopyrightConfig = {}): string {
  const text = getAramacCopyright(config);
  const brandMatch = text.match(/(ΛRΛMΛC)/);

  if (brandMatch) {
    return text.replace(
      brandMatch[0],
      `<span class="font-mono text-lg tracking-wider">${brandMatch[0]}</span>`
    );
  }

  return text;
}

// Standard ARAMAC copyright text for use in console logs, README files, etc.
export const ARAMAC_COPYRIGHT_STANDARD = getAramacCopyright();

// HTML version for use in templates
export const ARAMAC_COPYRIGHT_HTML = getAramacCopyrightHTML();

// Plain text version for use in package.json, licenses, etc.
export const ARAMAC_COPYRIGHT_PLAIN = `${new Date().getFullYear()} ΛRΛMΛC®`;

// Function to generate copyright for different contexts
export function generateCopyright(
  context: 'web' | 'mobile' | 'desktop' | 'api' | 'readme' | 'license'
): string {
  const base = getAramacCopyright();

  switch (context) {
    case 'readme':
      return `${base}\n\nBuilt with ❤️ by ARAMAC Team`;
    case 'license':
      return `Copyright (c) ${new Date().getFullYear()} ARAMAC. All rights reserved.`;
    case 'web':
    case 'mobile':
    case 'desktop':
      return base;
    case 'api':
      return `API powered by ${getAramacCopyright({ showPoweredBy: false })}`;
    default:
      return base;
  }
}

// Predefined copyright variations for different use cases
export const COPYRIGHT_VARIATIONS = {
  modern: getAramacCopyright({ format: 'modern' }),
  compact: getAramacCopyright({ format: 'compact' }),
  legal: getAramacCopyright({ format: 'legal' }),
  standard: getAramacCopyright({ format: 'standard' }),
  minimal: getAramacCopyright({ format: 'minimal' }),
  full: getAramacCopyright({ format: 'full' }),
};

// Array of copyright formats for easy iteration
export const COPYRIGHT_FORMATS = [
  { name: 'modern', text: getAramacCopyright({ format: 'modern' }) },
  { name: 'compact', text: getAramacCopyright({ format: 'compact' }) },
  { name: 'legal', text: getAramacCopyright({ format: 'legal' }) },
  { name: 'standard', text: getAramacCopyright({ format: 'standard' }) },
  { name: 'minimal', text: getAramacCopyright({ format: 'minimal' }) },
  { name: 'full', text: getAramacCopyright({ format: 'full' }) },
];

// Validation function to ensure consistent copyright usage
export function validateCopyright(text: string): boolean {
  const aramacRegex = /ΛRΛMΛC/;
  const yearRegex = /\b20\d{2}\b/;

  return aramacRegex.test(text) && yearRegex.test(text);
}

// Export for use in other projects
export const copyright = {
  getText: getAramacCopyright,
  getHTML: getAramacCopyrightHTML,
  validate: validateCopyright,
  generate: generateCopyright,
  standard: ARAMAC_COPYRIGHT_STANDARD,
  html: ARAMAC_COPYRIGHT_HTML,
  plain: ARAMAC_COPYRIGHT_PLAIN,
  variations: COPYRIGHT_VARIATIONS,
  formats: COPYRIGHT_FORMATS,
  modern: getAramacCopyright({ format: 'modern' }),
};
