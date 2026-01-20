// Building Block DTOs
// These are the curated data transfer objects for rendering blocks

// ============================================================================
// Text & Formatting
// ============================================================================

/** Mark types for inline text formatting */
export type MarkType = 'bold' | 'italic' | 'code' | 'strike' | 'link';

/** A formatting mark applied to text */
export interface TextMark {
  type: MarkType;
  attrs?: {
    href?: string;
    target?: string;
  };
}

/** Inline text content with optional formatting */
export interface TextBlock {
  type: 'text';
  content: string;
  marks?: TextMark[];
}

/** A paragraph containing text */
export interface ParagraphBlock {
  type: 'paragraph';
  children: TextBlock[];
}

/** A heading (h1-h6) */
export interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: TextBlock[];
}

/** A blockquote containing nested blocks */
export interface BlockquoteBlock {
  type: 'blockquote';
  children: ContentBlock[];
}

/** A code block with optional language */
export interface CodeBlock {
  type: 'codeBlock';
  code: string;
  language?: string;
}

/** A horizontal rule divider */
export interface HorizontalRuleBlock {
  type: 'horizontalRule';
}

/** A hard line break */
export interface HardBreakBlock {
  type: 'hardBreak';
}

// ============================================================================
// Lists
// ============================================================================

/** An unordered list */
export interface BulletListBlock {
  type: 'bulletList';
  items: ListItemBlock[];
}

/** An ordered list */
export interface OrderedListBlock {
  type: 'orderedList';
  items: ListItemBlock[];
  start?: number;
}

/** A list item containing blocks */
export interface ListItemBlock {
  type: 'listItem';
  children: ContentBlock[];
}

// ============================================================================
// Media
// ============================================================================

/** An image */
export interface ImageBlock {
  type: 'image';
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
}

/** A video embed */
export interface VideoBlock {
  type: 'video';
  src: string;
  poster?: string;
  controls?: boolean;
}

/** An external embed (YouTube, Vimeo, etc.) */
export interface EmbedBlock {
  type: 'embed';
  url: string;
  embedType: 'youtube' | 'vimeo' | 'twitter' | 'generic';
}

// ============================================================================
// Layout
// ============================================================================

/** A container for layout purposes */
export interface ContainerBlock {
  type: 'container';
  children: ContentBlock[];
  layout?: 'stack' | 'row' | 'grid';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/** A card container */
export interface CardBlock {
  type: 'card';
  children: ContentBlock[];
  variant?: 'default' | 'outlined' | 'elevated';
}

/** A page section */
export interface SectionBlock {
  type: 'section';
  children: ContentBlock[];
  id?: string;
}

// ============================================================================
// Interactive
// ============================================================================

/** An accordion/expandable section */
export interface AccordionBlock {
  type: 'accordion';
  title: string;
  children: ContentBlock[];
  defaultOpen?: boolean;
}

/** A tab item for tabbed content */
export interface TabItem {
  label: string;
  content: ContentBlock[];
}

/** Tabbed content container */
export interface TabsBlock {
  type: 'tabs';
  items: TabItem[];
}

/** A modal dialog */
export interface ModalBlock {
  type: 'modal';
  trigger: string;
  title?: string;
  content: ContentBlock[];
}

/** A button */
export interface ButtonBlock {
  type: 'button';
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  action?: string;
}

/** A hyperlink */
export interface LinkBlock {
  type: 'link';
  href: string;
  children: TextBlock[];
  target?: '_blank' | '_self';
}

// ============================================================================
// Data Display
// ============================================================================

/** A data table */
export interface TableBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
  caption?: string;
}

/** A status badge */
export interface BadgeBlock {
  type: 'badge';
  text: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

/** An alert box */
export interface AlertBlock {
  type: 'alert';
  message: string;
  alertType: 'info' | 'warning' | 'error' | 'success';
}

/** An icon */
export interface IconBlock {
  type: 'icon';
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// Form Blocks (Future)
// ============================================================================

/** A form input */
export interface InputBlock {
  type: 'input';
  inputType: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}

/** A textarea */
export interface TextareaBlock {
  type: 'textarea';
  label: string;
  name: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}

/** A select dropdown */
export interface SelectBlock {
  type: 'select';
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
}

/** A checkbox */
export interface CheckboxBlock {
  type: 'checkbox';
  label: string;
  name: string;
  checked?: boolean;
}

// ============================================================================
// Unknown/Custom Blocks
// ============================================================================

/** A custom or unknown block type (for plugin extensibility) */
export interface CustomBlock {
  type: 'custom';
  customType: string;
  attrs?: Record<string, unknown>;
  children?: ContentBlock[];
  content?: string;
}

// ============================================================================
// Union Types
// ============================================================================

/** All content blocks that can appear in the document body */
export type ContentBlock =
  | TextBlock
  | ParagraphBlock
  | HeadingBlock
  | BlockquoteBlock
  | CodeBlock
  | HorizontalRuleBlock
  | HardBreakBlock
  | BulletListBlock
  | OrderedListBlock
  | ListItemBlock
  | ImageBlock
  | VideoBlock
  | EmbedBlock
  | ContainerBlock
  | CardBlock
  | SectionBlock
  | AccordionBlock
  | TabsBlock
  | ModalBlock
  | ButtonBlock
  | LinkBlock
  | TableBlock
  | BadgeBlock
  | AlertBlock
  | IconBlock
  | InputBlock
  | TextareaBlock
  | SelectBlock
  | CheckboxBlock
  | CustomBlock;

/** Building block - alias for ContentBlock for clarity in API */
export type BuildingBlock = ContentBlock;

/** Helper type to extract block by type */
export type BlockOfType<T extends ContentBlock['type']> = Extract<ContentBlock, { type: T }>;
