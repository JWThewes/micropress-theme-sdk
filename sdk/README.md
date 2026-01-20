# @micropress/theme-sdk

The official SDK for building MicroPress themes.

## Installation

```bash
npm install @micropress/theme-sdk
```

## Quick Start

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
        <header>${data.siteName}</header>
      `.html,
    },
  },
});
```

## CLI

```bash
micropress-theme init my-theme    # Create new theme
micropress-theme build            # Build theme
micropress-theme validate         # Validate structure
micropress-theme package          # Create ZIP
```

## Documentation

See the [full documentation](https://github.com/micropress/theme-sdk#readme).

## License

MIT
