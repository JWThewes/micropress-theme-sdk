// Theme SDK Types - Keep it simple

import type { ContentBlock, BuildingBlock } from './dto';

/**
 * Context passed to every render function.
 * Contains everything you need to render content.
 */
export interface RenderContext {
  /** Render a child block */
  render: (block: ContentBlock | BuildingBlock) => string;
  /** Render multiple blocks */
  renderAll: (blocks: (ContentBlock | BuildingBlock)[]) => string;
  /** Site configuration */
  site: {
    name: string;
    baseUrl: string;
    currentPath?: string;
  };
}

/**
 * A render function takes data and context, returns HTML.
 */
export type RenderFn<T> = (data: T, ctx: RenderContext) => string;

/**
 * A renderer object with optional styles and scripts.
 */
export interface Renderer<T = unknown> {
  render: RenderFn<T>;
  styles?: () => string;
  scripts?: () => string;
}

/**
 * Shorthand type for block renderers.
 */
export type BlockRenderer<T extends ContentBlock = ContentBlock> = Renderer<T>;

/**
 * Helper to create a typed renderer.
 */
export function renderer<T>(fn: RenderFn<T>): Renderer<T>;
export function renderer<T>(options: Renderer<T>): Renderer<T>;
export function renderer<T>(fnOrOptions: RenderFn<T> | Renderer<T>): Renderer<T> {
  if (typeof fnOrOptions === 'function') {
    return { render: fnOrOptions };
  }
  return fnOrOptions;
}
