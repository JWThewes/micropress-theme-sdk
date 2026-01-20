# MicroPress Theme SDK

The official SDK for building MicroPress themes.

## Installation

```bash
npm install -g @micropress/theme-sdk
```

Or use locally in your project:

```bash
npm install --save-dev @micropress/theme-sdk
```

## Quick Start

```bash
# Create a new theme
micropress-theme init my-theme
cd my-theme

# Install dependencies
npm install

# Develop
micropress-theme validate   # Check structure
micropress-theme build      # Build to dist/
micropress-theme package    # Create ZIP

# Output: my-theme-1.0.0.zip ready for upload
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `micropress-theme init <name>` | Create a new theme project |
| `micropress-theme build` | Build the theme for distribution |
| `micropress-theme validate` | Validate theme structure |
| `micropress-theme package` | Create distributable ZIP |

## SDK Usage

```typescript
import { defineTheme, html, css } from '@micropress/theme-sdk';
import type { HeaderDTO } from '@micropress/theme-sdk';

export default defineTheme({
  config: {
    id: 'my-theme',
    name: 'My Theme',
    version: '1.0.0',
  },

  renderers: {
    header: {
      render: (data: HeaderDTO) => html`
        <header class="my-header">
          <a href="/">${data.siteName}</a>
        </header>
      `.html,

      styles: () => css`
        .my-header {
          padding: 1rem 2rem;
          border-bottom: 1px solid #eee;
        }
      `,
    },
  },
});
```

## Documentation

- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/api-reference.md)
- [Theme Structure](./docs/theme-structure.md)
- [Customization](./docs/customization.md)
- [Publishing](./docs/publishing.md)

## Theme Registry

The `registry/registry.json` file contains community themes. To add your theme:

1. Create a GitHub release with your theme ZIP
2. Fork this repository
3. Add your theme to `registry/registry.json`
4. Submit a Pull Request

See [Publishing](./docs/publishing.md) for details.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT
