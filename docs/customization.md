# Theme Customization

Learn how to make your theme customizable by end users.

## Overview

MicroPress themes can expose customization options that users can modify without editing code. These options are defined in `manifest.json` and automatically appear in the MicroPress admin panel.

## Defining Customizable Fields

Add a `customizable` object to your `manifest.json`:

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "version": "1.0.0",
  "customizable": {
    "primaryColor": {
      "type": "color",
      "label": "Primary Color",
      "default": "#3b82f6"
    },
    "accentColor": {
      "type": "color",
      "label": "Accent Color",
      "default": "#10b981"
    },
    "fontFamily": {
      "type": "select",
      "label": "Font Family",
      "default": "system-ui",
      "options": ["system-ui", "Georgia", "Inter", "Roboto"]
    },
    "borderRadius": {
      "type": "size",
      "label": "Border Radius",
      "default": "8px"
    }
  }
}
```

## Field Types

### Color

A color picker for selecting colors.

```json
{
  "primaryColor": {
    "type": "color",
    "label": "Primary Color",
    "default": "#3b82f6"
  }
}
```

### Select

A dropdown for predefined options.

```json
{
  "fontFamily": {
    "type": "select",
    "label": "Font Family",
    "default": "system-ui",
    "options": ["system-ui", "Georgia", "Inter", "Roboto"]
  }
}
```

### Size

A size value with units (px, rem, em, %).

```json
{
  "spacing": {
    "type": "size",
    "label": "Content Spacing",
    "default": "1rem"
  }
}
```

### Font

A font family selector (may include web fonts in future).

```json
{
  "headingFont": {
    "type": "font",
    "label": "Heading Font",
    "default": "Georgia"
  }
}
```

## Using Customization Values

### In CSS

Customization values are injected as CSS custom properties with the `--theme-` prefix:

```css
:root {
  /* Map theme variables with fallbacks */
  --primary: var(--theme-primaryColor, #3b82f6);
  --accent: var(--theme-accentColor, #10b981);
  --font: var(--theme-fontFamily, system-ui);
  --radius: var(--theme-borderRadius, 8px);
}

/* Use the variables */
.button {
  background: var(--primary);
  border-radius: var(--radius);
  font-family: var(--font), sans-serif;
}

.button:hover {
  background: var(--accent);
}
```

### In Renderers

Access customization values via CSS variables in your HTML:

```typescript
import { defineTheme, html } from '@micropress/theme-sdk';

export default defineTheme({
  config: {
    id: 'my-theme',
    name: 'My Theme',
    version: '1.0.0',
    // Define default variables
    variables: {
      '--primary': '#3b82f6',
      '--accent': '#10b981',
    },
  },
  renderers: {
    header: {
      render: (data) => html`
        <header style="background: var(--primary)">
          ${data.siteName}
        </header>
      `.html,
    },
  },
});
```

## Best Practices

### 1. Provide Sensible Defaults

Always include good default values that make your theme look polished out of the box:

```json
{
  "primaryColor": {
    "type": "color",
    "label": "Primary Color",
    "default": "#3b82f6"
  }
}
```

### 2. Use Descriptive Labels

Labels appear in the admin UI. Make them clear and user-friendly:

```json
{
  "navBgColor": {
    "type": "color",
    "label": "Navigation Background",
    "default": "#ffffff"
  }
}
```

### 3. Group Related Options

Use naming conventions to group related options:

```json
{
  "headerBackground": { "type": "color", "label": "Header Background", "default": "#fff" },
  "headerText": { "type": "color", "label": "Header Text", "default": "#111" },
  "footerBackground": { "type": "color", "label": "Footer Background", "default": "#f5f5f5" },
  "footerText": { "type": "color", "label": "Footer Text", "default": "#666" }
}
```

### 4. Always Include Fallbacks

In CSS, always provide fallback values:

```css
/* Good - has fallback */
color: var(--theme-textColor, #333);

/* Bad - no fallback */
color: var(--theme-textColor);
```

### 5. Document Your Options

Include comments in your CSS explaining what each variable controls:

```css
:root {
  /* Primary brand color - used for buttons, links, accents */
  --primary: var(--theme-primaryColor, #3b82f6);

  /* Content max-width - controls main content area width */
  --content-width: var(--theme-contentWidth, 800px);
}
```

## Example: Complete Theme Customization

### manifest.json

```json
{
  "id": "modern-theme",
  "name": "Modern Theme",
  "version": "1.0.0",
  "description": "A modern, customizable theme",
  "author": "Theme Author",
  "customizable": {
    "primaryColor": {
      "type": "color",
      "label": "Primary Color",
      "default": "#3b82f6"
    },
    "secondaryColor": {
      "type": "color",
      "label": "Secondary Color",
      "default": "#64748b"
    },
    "fontFamily": {
      "type": "select",
      "label": "Font Family",
      "default": "Inter",
      "options": ["Inter", "system-ui", "Georgia", "Roboto"]
    },
    "borderRadius": {
      "type": "select",
      "label": "Border Style",
      "default": "8px",
      "options": ["0", "4px", "8px", "16px"]
    },
    "contentWidth": {
      "type": "size",
      "label": "Content Width",
      "default": "1200px"
    }
  }
}
```

### theme.css

```css
:root {
  --primary: var(--theme-primaryColor, #3b82f6);
  --secondary: var(--theme-secondaryColor, #64748b);
  --font: var(--theme-fontFamily, Inter);
  --radius: var(--theme-borderRadius, 8px);
  --max-width: var(--theme-contentWidth, 1200px);
}

body {
  font-family: var(--font), system-ui, sans-serif;
  color: var(--secondary);
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1rem;
}

.button {
  background: var(--primary);
  border-radius: var(--radius);
  color: white;
  padding: 0.5rem 1rem;
}

a {
  color: var(--primary);
}
```
