# Getting Started with MicroPress Themes

This guide will walk you through creating your first MicroPress theme.

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Basic knowledge of HTML, CSS, and TypeScript

## Installation

Install the MicroPress Theme SDK globally:

```bash
npm install -g @micropress/theme-sdk
```

Or use it locally in your project:

```bash
npm install --save-dev @micropress/theme-sdk
```

## Creating Your First Theme

### 1. Initialize a New Theme

```bash
micropress-theme init my-awesome-theme
cd my-awesome-theme
npm install
```

This creates a new theme project with the following structure:

```
my-awesome-theme/
├── manifest.json       # Theme metadata and configuration
├── src/
│   ├── theme.css       # Main stylesheet
│   └── renderers.ts    # Custom component renderers
├── assets/             # Static assets (images, fonts)
├── package.json
└── tsconfig.json
```

### 2. Customize Your Theme

#### Edit `manifest.json`

Update the theme metadata:

```json
{
  "id": "my-awesome-theme",
  "name": "My Awesome Theme",
  "version": "1.0.0",
  "description": "A beautiful theme for MicroPress",
  "author": "Your Name",
  "customizable": {
    "primaryColor": {
      "type": "color",
      "label": "Primary Color",
      "default": "#3b82f6"
    }
  }
}
```

#### Edit `src/theme.css`

Add your custom styles:

```css
:root {
  --primary: var(--theme-primaryColor, #3b82f6);
}

.theme-header {
  background: var(--primary);
  color: white;
  padding: 1rem 2rem;
}
```

#### Edit `src/renderers.ts`

Customize component rendering:

```typescript
import { defineTheme, html, css } from '@micropress/theme-sdk';
import type { HeaderDTO } from '@micropress/theme-sdk';

export default defineTheme({
  config: {
    id: 'my-awesome-theme',
    name: 'My Awesome Theme',
    version: '1.0.0',
  },

  renderers: {
    header: {
      render: (data: HeaderDTO) => html`
        <header class="theme-header">
          <a href="/">${data.siteName}</a>
        </header>
      `.html,
    },
  },
});
```

### 3. Build and Validate

```bash
# Validate your theme structure
npm run validate

# Build for distribution
npm run build
```

### 4. Package for Distribution

```bash
npm run package
```

This creates a ZIP file ready for upload to MicroPress.

## Next Steps

- Read the [API Reference](./api-reference.md) for all available exports
- Learn about [Theme Structure](./theme-structure.md) in detail
- Explore [Customization Options](./customization.md)
- Learn how to [Publish Your Theme](./publishing.md) to the registry

## CLI Commands

| Command | Description |
|---------|-------------|
| `micropress-theme init <name>` | Create a new theme |
| `micropress-theme build` | Build the theme |
| `micropress-theme validate` | Validate theme structure |
| `micropress-theme package` | Create distributable ZIP |

## Example Themes

Check out the [examples](../examples/) directory for complete theme examples:

- **minimal-theme**: A simple theme with basic customization
- **advanced-theme**: A full-featured theme with custom renderers
