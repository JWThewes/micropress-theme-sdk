# API Reference

Complete reference for the MicroPress Theme SDK.

## Theme Definition

### `defineTheme(definition)`

Creates a theme definition object.

```typescript
import { defineTheme } from '@micropress/theme-sdk';

export default defineTheme({
  config: {
    id: 'my-theme',
    name: 'My Theme',
    version: '1.0.0',
    variables: {
      '--primary': '#3b82f6',
    },
  },
  renderers: {
    // Component renderers
  },
  styles: `/* Global styles */`,
  scripts: `/* Global scripts */`,
});
```

### `ThemeConfig`

```typescript
interface ThemeConfig {
  /** Theme ID (must match manifest) */
  id: string;
  /** Theme display name */
  name: string;
  /** Theme version (semver) */
  version: string;
  /** CSS variables for customization */
  variables?: Record<string, string>;
}
```

### `ThemeRenderers`

```typescript
interface ThemeRenderers {
  // Document-level
  document?: Renderer<DocumentDTO>;
  header?: Renderer<HeaderDTO>;
  navigation?: Renderer<NavigationDTO>;
  footer?: Renderer<FooterDTO>;

  // Content-level
  article?: Renderer<PageContentDTO>;
  newsArticle?: Renderer<NewsArticleDTO>;
  newsList?: Renderer<NewsListDTO>;
  newsCard?: Renderer<NewsCardDTO>;

  // Block-level (keyed by block type)
  blocks?: Partial<Record<ContentBlock['type'], Renderer<ContentBlock>>>;
}
```

## HTML Helpers

### `html`

Tagged template for safe HTML generation. Automatically escapes interpolated values.

```typescript
import { html } from '@micropress/theme-sdk';

// Values are escaped
const name = '<script>alert("xss")</script>';
html`<div>${name}</div>`.html;
// Output: <div>&lt;script&gt;alert("xss")&lt;/script&gt;</div>

// Nested HTML is preserved
const inner = html`<span>safe</span>`;
html`<div>${inner}</div>`.html;
// Output: <div><span>safe</span></div>

// Arrays are joined
const items = ['a', 'b', 'c'];
html`<ul>${items.map(i => html`<li>${i}</li>`)}</ul>`.html;
```

### `raw(htmlString)`

Mark HTML as safe (use carefully with trusted content only).

```typescript
import { raw } from '@micropress/theme-sdk';

const trusted = raw('<b>trusted content</b>');
html`<div>${trusted}</div>`.html;
// Output: <div><b>trusted content</b></div>
```

### `css`

Tagged template for CSS (useful for syntax highlighting).

```typescript
import { css } from '@micropress/theme-sdk';

const styles = css`
  .my-class {
    color: ${primaryColor};
  }
`;
```

### `when(condition, content)`

Conditional HTML rendering.

```typescript
import { when, html } from '@micropress/theme-sdk';

html`
  <div>
    ${when(showButton, html`<button>Click me</button>`)}
  </div>
`.html;
```

### `join(items, separator)`

Join multiple HTML results.

```typescript
import { join, html } from '@micropress/theme-sdk';

const items = [
  html`<span>A</span>`,
  html`<span>B</span>`,
  html`<span>C</span>`,
];
join(items, ' | ').html;
// Output: <span>A</span> | <span>B</span> | <span>C</span>
```

### `escapeHtml(string)`

Escape HTML entities.

```typescript
import { escapeHtml } from '@micropress/theme-sdk';

escapeHtml('<script>'); // &lt;script&gt;
```

## Renderer Helpers

### `render(fn)`

Create a renderer with just a render function.

```typescript
import { render } from '@micropress/theme-sdk';
import type { HeaderDTO } from '@micropress/theme-sdk';

const header = render<HeaderDTO>((data, ctx) =>
  html`<header>${data.siteName}</header>`.html
);
```

### `withStyles(fn, styles)`

Create a renderer with styles.

```typescript
import { withStyles, html, css } from '@micropress/theme-sdk';

const card = withStyles<CardDTO>(
  (data, ctx) => html`<div class="card">${ctx.renderAll(data.children)}</div>`.html,
  css`.card { padding: 1rem; }`
);
```

### `withScripts(fn, scripts)`

Create a renderer with scripts.

```typescript
import { withScripts, html } from '@micropress/theme-sdk';

const interactive = withScripts<ModalDTO>(
  (data) => html`<div class="modal">${data.content}</div>`.html,
  `document.querySelector('.modal').addEventListener('click', ...)`
);
```

### `withAssets(fn, options)`

Create a renderer with both styles and scripts.

```typescript
import { withAssets, html, css } from '@micropress/theme-sdk';

const tabs = withAssets<TabsDTO>(
  (data) => html`<div class="tabs">...</div>`.html,
  {
    styles: css`.tabs { display: flex; }`,
    scripts: `// Tab switching logic`,
  }
);
```

## Render Context

Every render function receives a context object:

```typescript
interface RenderContext {
  /** Render a single child block */
  render: (block: ContentBlock) => string;

  /** Render multiple blocks */
  renderAll: (blocks: ContentBlock[]) => string;

  /** Site configuration */
  site: {
    name: string;
    baseUrl: string;
    currentPath?: string;
  };
}
```

### Usage Example

```typescript
const container = render<ContainerDTO>((data, ctx) => html`
  <div class="container">
    ${raw(ctx.renderAll(data.children))}
  </div>
`.html);
```

## DTOs (Data Transfer Objects)

### Document-Level

- `DocumentDTO` - Full page document
- `HeaderDTO` - Site header
- `NavigationDTO` - Navigation menu
- `NavItemDTO` - Navigation item
- `FooterDTO` - Site footer

### Content-Level

- `PageContentDTO` - Regular page content
- `NewsArticleDTO` - News article content
- `NewsListDTO` - News list page
- `NewsCardDTO` - News card item

### Block Types

All content blocks available for customization:

- Text: `ParagraphBlock`, `HeadingBlock`, `TextBlock`
- Lists: `BulletListBlock`, `OrderedListBlock`, `ListItemBlock`
- Media: `ImageBlock`, `VideoBlock`, `EmbedBlock`
- Layout: `ContainerBlock`, `CardBlock`, `SectionBlock`
- Interactive: `AccordionBlock`, `TabsBlock`, `ModalBlock`, `ButtonBlock`
- Data: `TableBlock`, `BadgeBlock`, `AlertBlock`
- Forms: `InputBlock`, `TextareaBlock`, `SelectBlock`, `CheckboxBlock`

See the [full type definitions](../sdk/src/dto/) for complete details.
