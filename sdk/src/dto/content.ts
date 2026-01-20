// Content DTOs
// These define the content area of pages, news articles, and lists

import type { BuildingBlock } from './blocks';

// ============================================================================
// Content Types
// ============================================================================

/** The type of content being rendered */
export type ContentType = 'page' | 'news-article' | 'news-list';

// ============================================================================
// Base Content
// ============================================================================

/** Base content interface with common fields */
export interface BaseContentDTO {
  /** Page/article title */
  title: string;
  /** Content type discriminator */
  contentType: ContentType;
}

// ============================================================================
// Page Content
// ============================================================================

/** A regular page's content */
export interface PageContentDTO extends BaseContentDTO {
  contentType: 'page';
  /** Content blocks to render */
  blocks: BuildingBlock[];
}

// ============================================================================
// News Article
// ============================================================================

/** A back navigation link */
export interface BackLinkDTO {
  label: string;
  href: string;
}

/** A news article's content */
export interface NewsArticleDTO extends BaseContentDTO {
  contentType: 'news-article';
  /** Content blocks to render */
  blocks: BuildingBlock[];
  /** Publication date (ISO string for formatting) */
  publishedAt: string;
  /** Author name */
  author?: string;
  /** Link back to news list */
  backLink: BackLinkDTO;
}

// ============================================================================
// News List
// ============================================================================

/** A news card in the news list */
export interface NewsCardDTO {
  /** Article title */
  title: string;
  /** Article excerpt/preview */
  excerpt?: string;
  /** Publication date (ISO string) */
  publishedAt: string;
  /** Link to full article */
  href: string;
  /** Whether this is a featured article */
  featured?: boolean;
  /** Cover image URL */
  image?: string;
  /** Category label (e.g., "News", "Events") */
  category?: string;
  /** Estimated reading time in minutes */
  readingTime?: number;
}

/** A news list page's content */
export interface NewsListDTO extends BaseContentDTO {
  contentType: 'news-list';
  /** The news cards to display */
  items: NewsCardDTO[];
}

// ============================================================================
// Union Type
// ============================================================================

/** All content types that can be rendered in the main content area */
export type ContentDTO = PageContentDTO | NewsArticleDTO | NewsListDTO;

// ============================================================================
// Type Guards
// ============================================================================

/** Check if content is a regular page */
export function isPageContent(content: ContentDTO): content is PageContentDTO {
  return content.contentType === 'page';
}

/** Check if content is a news article */
export function isNewsArticle(content: ContentDTO): content is NewsArticleDTO {
  return content.contentType === 'news-article';
}

/** Check if content is a news list */
export function isNewsList(content: ContentDTO): content is NewsListDTO {
  return content.contentType === 'news-list';
}
