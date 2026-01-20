// Document-Level DTOs
// These define the full page structure and shell components

import type { ContentDTO } from './content';

// ============================================================================
// Meta & SEO
// ============================================================================

/** SEO and social metadata for a page */
export interface MetaDTO {
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  jsonLd: object[];
}

// ============================================================================
// Header
// ============================================================================

/** Logo configuration */
export interface LogoDTO {
  src: string;
  alt: string;
}

/** Site header configuration */
export interface HeaderDTO {
  siteName: string;
  tagline?: string;
  logo?: LogoDTO;
  showMenuToggle: boolean;
}

// ============================================================================
// Navigation
// ============================================================================

/** A navigation item */
export interface NavItemDTO {
  label: string;
  href: string;
  active: boolean;
  children?: NavItemDTO[];
}

/** Navigation configuration */
export interface NavigationDTO {
  items: NavItemDTO[];
}

// ============================================================================
// Breadcrumbs
// ============================================================================

/** A single breadcrumb item */
export interface BreadcrumbDTO {
  /** Display label */
  label: string;
  /** Link URL (undefined = current page, no link) */
  href?: string;
}

/** Breadcrumb trail configuration */
export interface BreadcrumbsDTO {
  /** Breadcrumb items from root to current */
  items: BreadcrumbDTO[];
}

// ============================================================================
// Footer
// ============================================================================

/** A footer link */
export interface FooterLinkDTO {
  label: string;
  href: string;
}

/** Site footer configuration */
export interface FooterDTO {
  copyright: string;
  year: number;
  links: FooterLinkDTO[];
}

// ============================================================================
// Favicon & Icons
// ============================================================================

/** A favicon or icon link */
export interface FaviconDTO {
  rel: 'icon' | 'apple-touch-icon';
  type?: string;
  sizes?: string;
  href: string;
}

// ============================================================================
// Site Configuration
// ============================================================================

/** Site-level configuration for theming */
export interface SiteConfigDTO {
  siteName: string;
  shortName: string;
  description?: string;
  themeColor?: string;
  backgroundColor?: string;
  language: string;
}

// ============================================================================
// Document Shell
// ============================================================================

/** Full page document DTO */
export interface DocumentDTO {
  /** HTML lang attribute */
  lang: string;
  /** Page title for <title> tag */
  title: string;
  /** Active theme identifier */
  themeId: string;
  /** SEO and social metadata */
  meta: MetaDTO;
  /** Header configuration */
  header: HeaderDTO;
  /** Navigation configuration */
  navigation: NavigationDTO;
  /** Main page content */
  content: ContentDTO;
  /** Footer configuration */
  footer: FooterDTO;
  /** Favicon and icon links */
  favicons: FaviconDTO[];
  /** External stylesheets to include */
  styles: string[];
  /** CSS custom properties to inject */
  cssVariables: Record<string, string>;
}
