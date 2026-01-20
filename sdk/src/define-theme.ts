// Theme Definition - The simplest way to create a theme

import type { Renderer, RenderFn } from './types';
import type {
  DocumentDTO,
  HeaderDTO,
  NavigationDTO,
  FooterDTO,
  PageContentDTO,
  NewsArticleDTO,
  NewsListDTO,
  NewsCardDTO,
  ContentBlock,
} from './dto';

/**
 * All the components a theme can customize.
 * Every component is optional - defaults are used for missing ones.
 */
export interface ThemeRenderers {
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

  // Block-level (key is block type)
  blocks?: Partial<Record<ContentBlock['type'], Renderer<ContentBlock>>>;
}

/**
 * Theme configuration.
 */
export interface ThemeConfig {
  /** Theme ID (must match manifest) */
  id: string;
  /** Theme display name */
  name: string;
  /** Theme version */
  version: string;
  /** CSS variables for customization */
  variables?: Record<string, string>;
}

/**
 * Complete theme definition.
 */
export interface ThemeDefinition {
  config: ThemeConfig;
  renderers: ThemeRenderers;
  /** Global styles for the theme */
  styles?: string;
  /** Global scripts for the theme */
  scripts?: string;
}

/**
 * Define a theme with custom renderers.
 *
 * @example
 * ```ts
 * import { defineTheme, html } from '@micropress/theme-sdk';
 *
 * export default defineTheme({
 *   config: {
 *     id: 'my-theme',
 *     name: 'My Theme',
 *     version: '1.0.0',
 *   },
 *   renderers: {
 *     header: {
 *       render: (data, ctx) => html`
 *         <header class="my-header">
 *           <h1>${data.siteName}</h1>
 *         </header>
 *       `.html,
 *     },
 *   },
 * });
 * ```
 */
export function defineTheme(definition: ThemeDefinition): ThemeDefinition {
  return definition;
}

/**
 * Quick helper to define just a render function.
 *
 * @example
 * ```ts
 * const header = render<HeaderDTO>((data, ctx) => html`
 *   <header>${data.siteName}</header>
 * `.html);
 * ```
 */
export function render<T>(fn: RenderFn<T>): Renderer<T> {
  return { render: fn };
}

/**
 * Quick helper to define a renderer with styles.
 *
 * @example
 * ```ts
 * const card = withStyles<CardDTO>(
 *   (data, ctx) => html`<div class="card">${ctx.renderAll(data.children)}</div>`.html,
 *   css`.card { padding: 1rem; }`
 * );
 * ```
 */
export function withStyles<T>(fn: RenderFn<T>, styles: string): Renderer<T> {
  return {
    render: fn,
    styles: () => styles,
  };
}

/**
 * Quick helper to define a renderer with scripts.
 */
export function withScripts<T>(fn: RenderFn<T>, scripts: string): Renderer<T> {
  return {
    render: fn,
    scripts: () => scripts,
  };
}

/**
 * Define a renderer with both styles and scripts.
 */
export function withAssets<T>(
  fn: RenderFn<T>,
  options: { styles?: string; scripts?: string }
): Renderer<T> {
  return {
    render: fn,
    styles: options.styles ? () => options.styles! : undefined,
    scripts: options.scripts ? () => options.scripts! : undefined,
  };
}
