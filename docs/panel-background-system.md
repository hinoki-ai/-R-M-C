# Panel Background System & Contrast Guidelines

## Overview

The unified panel background system ensures consistent contrast ratios across all themes while preventing background pattern destruction. This system provides multiple panel variants optimized for different use cases and content types.

## Panel Variants

### Core Variants

#### `solid`
- **Background**: `hsl(var(--background))`
- **Border**: `1px solid hsl(var(--border))`
- **Use case**: Complete background protection for maximum content isolation
- **Contrast**: Full opacity background ensures maximum text readability
- **Best for**: Forms, dialogs, critical content

#### `content`
- **Background**: `hsl(var(--card))`
- **Border**: `1px solid hsl(var(--border))`
- **Use case**: Enhanced contrast for content-heavy panels
- **Contrast**: Standard card background with proper foreground contrast
- **Best for**: Cards with text content, dashboards, data displays

#### `themed`
- **Background**: `hsl(var(--card) / 0.9)`
- **Border**: `1px solid hsl(var(--border) / 0.7)`
- **Use case**: Theme-aware panels that blend with background patterns
- **Contrast**: Semi-transparent overlay preserves theme aesthetics
- **Best for**: Decorative panels, non-critical content

#### `patternSafe`
- **Background**: `transparent` with `hsl(var(--card) / 0.15)` overlay
- **Border**: `1px solid hsl(var(--border) / 0.4)`
- **Use case**: Preserves background patterns while maintaining minimal contrast
- **Contrast**: Subtle overlay for pattern visibility
- **Best for**: Hero sections, decorative elements

#### `glass`
- **Background**: `hsl(var(--background) / 0.95)` with `backdrop-filter: blur(8px)`
- **Border**: `1px solid hsl(var(--border) / 0.5)`
- **Use case**: Glass morphism effects with backdrop blur
- **Contrast**: Semi-transparent with blur for modern aesthetics
- **Best for**: Overlays, modals, modern UI elements

#### `glassGradient`
- **Background**: Gradient from `hsl(var(--background) / 0.8)` to `hsl(var(--background) / 0.6)`
- **Border**: `1px solid hsl(var(--border) / 0.3)`
- **Use case**: Gradient glass morphism with enhanced blur
- **Contrast**: Gradient provides depth while maintaining readability
- **Best for**: Premium UI elements, hero sections

### Theme-Specific Variants

#### `vineyard`, `ocean`, `mountain`, `patagonia`, `pastel`
- **Background**: Custom gradients optimized for each theme
- **Use case**: Theme-specific styling that maintains contrast
- **Contrast**: Carefully calibrated colors for each theme's palette
- **Best for**: Branded content, theme-consistent UI

## Component Usage

### Card Component

The `Card` component automatically uses the `content` variant for guaranteed contrast:

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Always provides proper contrast
<Card>
  <CardHeader>
    <CardTitle>Content Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Your content here</p>
  </CardContent>
</Card>
```

**Note**: Custom background classes (`bg-*`) are automatically filtered out to prevent contrast issues.

### Panel Component

Use the `Panel` component for more control over styling:

```tsx
import { Panel } from '@/components/ui/panel';

// For maximum contrast
<Panel variant="solid">
  <h3>Critical Content</h3>
  <p>Important information</p>
</Panel>

// For theme-aware styling
<Panel variant="themed" rounded="lg" padding="lg">
  <p>Decorative content</p>
</Panel>
```

### AutoPanel Component

The `AutoPanel` component automatically selects the appropriate theme-specific variant:

```tsx
import { AutoPanel } from '@/components/ui/panel';

// Automatically uses vineyard/ocean/mountain/etc. variant based on current theme
<AutoPanel>
  <p>Theme-aware content</p>
</AutoPanel>
```

## Contrast Guidelines

### Minimum Contrast Ratios

- **Normal text**: 4.5:1 contrast ratio
- **Large text**: 3:1 contrast ratio
- **UI components**: 3:1 contrast ratio

### Text on Panel Backgrounds

| Panel Variant | Light Mode | Dark Mode | Accessibility |
|---------------|------------|-----------|---------------|
| `solid` | ✅ Full contrast | ✅ Full contrast | WCAG AAA |
| `content` | ✅ Card contrast | ✅ Card contrast | WCAG AA |
| `themed` | ⚠️ Semi-transparent | ⚠️ Semi-transparent | Check content |
| `patternSafe` | ⚠️ Minimal overlay | ⚠️ Minimal overlay | Use sparingly |
| `glass` | ⚠️ Backdrop dependent | ⚠️ Backdrop dependent | Test per use |
| `glassGradient` | ⚠️ Gradient dependent | ⚠️ Gradient dependent | Test per use |

### Best Practices

1. **Use `Card` for content-heavy elements** - Automatic contrast guarantee
2. **Use `solid` for critical information** - Maximum readability
3. **Use `themed` for decorative elements** - Maintains theme aesthetics
4. **Avoid `patternSafe` for text content** - Insufficient contrast
5. **Test glass variants** - Contrast depends on backdrop content

### Theme-Specific Considerations

Each theme variant is calibrated for optimal contrast within its color palette:

- **Vineyard**: Warm, earthy tones with high contrast text
- **Ocean**: Cool blues with balanced contrast
- **Mountain**: Neutral grays with strong text contrast
- **Patagonia**: Nature-inspired with accessible color combinations
- **Pastel**: Soft colors with enhanced contrast for readability

## Implementation Details

### CSS Variables Used

- `--background`: Base background color
- `--foreground`: Primary text color
- `--card`: Card background color
- `--card-foreground`: Card text color
- `--border`: Border color
- `--shadow-*`: Shadow definitions

### Automatic Filtering

The `Card` component automatically filters out background-related classes:

```tsx
// ❌ This will be filtered out
<Card className="bg-muted border-0">

// ✅ This works
<Card className="hover:shadow-lg border-0">
```

### Z-Index Management

Panels automatically manage z-index to prevent background bleeding:

```css
.panel-content {
  position: relative;
  z-index: 1;
}

.panel * {
  position: relative;
  z-index: 1;
}
```

## Migration Guide

### From Custom Backgrounds

```tsx
// ❌ Old approach
<div className="bg-card border border-border rounded-lg p-4">
  Content
</div>

// ✅ New approach
<Card className="p-4">
  Content
</Card>
```

### From Manual Styling

```tsx
// ❌ Old approach
<div className="bg-muted/50 backdrop-blur-sm border rounded-xl p-6">
  Content
</div>

// ✅ New approach
<Panel variant="glass" rounded="xl" padding="lg">
  Content
</Panel>
```

## Testing

Test all panel variants across themes:

1. **Visual inspection**: Check contrast ratios in all themes
2. **Accessibility tools**: Use contrast checkers
3. **User testing**: Verify readability in different lighting conditions
4. **Theme switching**: Ensure smooth transitions between themes

## Future Enhancements

- **Dynamic contrast adjustment**: Based on content type
- **High contrast mode**: Enhanced accessibility variant
- **Animation variants**: Smooth transitions between panel states
- **Performance optimization**: Reduced repaints for glass effects</content>
