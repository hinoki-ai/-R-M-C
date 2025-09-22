# ARAMAC Copyright System

## Overview

This document outlines the standardized copyright system used across all ARAMAC repositories. This ensures consistent branding and legal compliance across all projects.

## Standard Format

**Primary Format:**

```text
2025 Powered by ΛRΛMΛC®
```

**Alternative Formats:**

- Minimal: `2025 ΛRΛMΛC®`
- Full: `2025 Powered by ΛRΛMΛC® - All rights reserved`

## Usage in Code

### React Components

```tsx
import { AramacCopyright } from '@/components/ui/copyright'

// Use the standard component
<AramacCopyright />

// Or customize it
<AramacCopyright className="custom-class" />
```

### TypeScript/JavaScript

```ts
import { getAramacCopyright, getAramacCopyrightHTML, generateCopyright } from '@/lib/copyright-system'

// Get standard copyright text
const copyright = getAramacCopyright()

// Get HTML formatted copyright
const htmlCopyright = getAramacCopyrightHTML()

// Generate context-specific copyright
const readmeCopyright = generateCopyright('readme')
const licenseCopyright = generateCopyright('license')
```

### HTML Templates

```html
<footer>
  <div class="copyright">
    <!-- Using the standard format -->
    2025 Powered by <span class="font-mono text-lg tracking-wider">ΛRΛMΛC®</span>
  </div>
</footer>
```

## Implementation in New Projects

### 1. Copy the Copyright System

Copy these files to your new project:

- `lib/copyright-system.ts`
- `components/ui/copyright.tsx` (for React projects)

### 2. Install Dependencies

Ensure you have the necessary dependencies:

```bash
npm install framer-motion  # For React components (if using magnetic effects)
```

### 3. Configure in Layout

```tsx
// In your main layout
import { AramacCopyright } from '@/components/ui/copyright'

export default function Layout({ children }) {
  return (
    <div>
      {children}
      <footer>
        <AramacCopyright />
      </footer>
    </div>
  )
}
```

### 4. Update Package.json

```json
{
  "name": "your-project",
  "author": "ARAMAC",
  "license": "Proprietary",
  "copyright": "2025 ΛRΛMΛC®"
}
```

## Validation

Use the validation function to ensure correct copyright usage:

```ts
import { validateCopyright } from '@/lib/copyright-system'

if (validateCopyright(someCopyrightText)) {
  console.log('Copyright format is correct')
} else {
  console.error('Copyright format is incorrect')
}
```

## Branding Guidelines

- **Font**: Use monospace font (`font-mono`) for the ΛRΛMΛC® text
- **Size**: Use `text-lg` for the brand name
- **Spacing**: Use `tracking-wider` for proper letter spacing
- **Color**: Use appropriate contrast for accessibility
- **Position**: Place at the bottom of pages/layouts

## Legal Notes

- Always include the registered trademark symbol (®)
- Keep the year current (automatically updated via `new Date().getFullYear()`)
- Use "Powered by" prefix for web applications
- Include "All rights reserved" in legal documents only

## Contact

For copyright-related questions, contact: [`agustinaramac@gmail.com`](mailto:agustinaramac@gmail.com)
