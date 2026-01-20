# Theme Structure

This document explains the structure of a MicroPress theme.

## Directory Layout

```
my-theme/
├── manifest.json       # Required: Theme metadata
├── src/
│   ├── theme.css       # Main stylesheet
│   ├── renderers.ts    # Custom component renderers
│   └── components/     # Optional: Organized renderers
│       ├── header.ts
│       ├── footer.ts
│       └── blocks/
│           ├── heading.ts
│           └── paragraph.ts
├── assets/             # Static assets
│   ├── fonts/
│   └── images/
├── dist/               # Built output (generated)
├── package.json
└── tsconfig.json
```

## manifest.json

The manifest file is required and defines your theme's metadata and configuration options.

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "version": "1.0.0",
  "description": "A beautiful theme for MicroPress",
  "author": "Your Name",
  "homepage": "https://example.com/my-theme",
  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px"
  },
  "customizable": {
    "primaryColor": {
      "type": "color",
      "label": "Primary Color",
      "default": "#3b82f6"
    },
    "fontFamily": {
      "type": "select",
      "label": "Font Family",
      "default": "system-ui",
      "options": ["system-ui", "Georgia", "Helvetica"]
    },
    "headerSize": {
      "type": "size",
      "label": "Header Size",
      "default": "64px"
    }
  }
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique theme identifier (lowercase, hyphens allowed) |
| `name` | string | Display name |
| `version` | string | Semantic version (e.g., "1.0.0") |
| `description` | string | Brief description |
| `author` | string | Author name |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `homepage` | string | Theme homepage URL |
| `breakpoints` | object | Responsive breakpoints |
| `customizable` | object | Customization options |

### Customizable Field Types

| Type | Description | Options |
|------|-------------|---------|
| `color` | Color picker | - |
| `font` | Font family picker | - |
| `size` | Size value (px, rem, em) | - |
| `select` | Dropdown selection | `options: string[]` |

## Stylesheets

### Main Stylesheet (`src/theme.css`)

Your primary CSS file. Use CSS custom properties for customization:

```css
:root {
  /* Map customizable fields to CSS variables */
  --primary: var(--theme-primaryColor, #3b82f6);
  --font-family: var(--theme-fontFamily, system-ui);
  --header-height: var(--theme-headerSize, 64px);
}

.theme-header {
  height: var(--header-height);
  background: var(--primary);
}
```

### CSS Variable Naming Convention

MicroPress injects customizable values as CSS custom properties:

- Manifest field `primaryColor` → CSS variable `--theme-primaryColor`
- Always provide fallback values using `var(--theme-X, fallback)`

### Responsive Design

Use the breakpoints defined in your manifest:

```css
/* Mobile first */
.theme-nav {
  flex-direction: column;
}

/* md breakpoint (768px by default) */
@media (min-width: 768px) {
  .theme-nav {
    flex-direction: row;
  }
}
```

## Renderers

### Basic Structure

```typescript
// src/renderers.ts
import { defineTheme, html, css } from '@micropress/theme-sdk';
import type { HeaderDTO, FooterDTO } from '@micropress/theme-sdk';

export default defineTheme({
  config: {
    id: 'my-theme',
    name: 'My Theme',
    version: '1.0.0',
  },

  // Global styles (injected once)
  styles: css`
    .my-theme { /* ... */ }
  `,

  renderers: {
    header: {
      render: (data: HeaderDTO) => html`
        <header class="my-theme-header">
          ${data.siteName}
        </header>
      `.html,

      // Component-specific styles
      styles: () => css`
        .my-theme-header { padding: 1rem; }
      `,
    },

    footer: {
      render: (data: FooterDTO) => html`
        <footer class="my-theme-footer">
          © ${data.year} ${data.copyright}
        </footer>
      `.html,
    },
  },
});
```

### Organizing Renderers

For larger themes, split renderers into separate files:

```typescript
// src/components/header.ts
import { html, css, type HeaderDTO, type Renderer } from '@micropress/theme-sdk';

export const headerRenderer: Renderer<HeaderDTO> = {
  render: (data) => html`
    <header class="my-header">${data.siteName}</header>
  `.html,
  styles: () => css`.my-header { /* ... */ }`,
};

// src/renderers.ts
import { defineTheme } from '@micropress/theme-sdk';
import { headerRenderer } from './components/header';

export default defineTheme({
  config: { /* ... */ },
  renderers: {
    header: headerRenderer,
  },
});
```

## Assets

### Static Files

Place static assets in the `assets/` directory:

```
assets/
├── fonts/
│   ├── custom-font.woff2
│   └── custom-font.woff
└── images/
    └── logo.svg
```

### Referencing Assets

In CSS, reference assets relative to the theme root:

```css
@font-face {
  font-family: 'CustomFont';
  src: url('./assets/fonts/custom-font.woff2') format('woff2');
}
```

In renderers, use relative paths:

```typescript
html`<img src="./assets/images/logo.svg" alt="Logo" />`
```

## Build Output

When you run `micropress-theme build`, the output goes to `dist/`:

```
dist/
├── manifest.json       # Copied from root
├── theme.css           # Copied from src/
├── renderers.js        # Compiled from TypeScript
├── renderers.d.ts      # Type declarations
└── assets/             # Copied from assets/
```

## Package Structure

The final ZIP created by `micropress-theme package`:

```
my-theme-1.0.0.zip
├── manifest.json
├── theme.css
├── renderers.js
└── assets/
    └── ...
```

This ZIP can be uploaded directly to MicroPress for installation.
