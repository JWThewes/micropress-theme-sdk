// HTML Tagged Template - Safe, easy HTML generation

/**
 * Result of html`` tagged template.
 */
export interface HtmlResult {
  html: string;
  toString(): string;
}

/**
 * Escape HTML entities for safe insertion.
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Tagged template for HTML.
 * Automatically escapes interpolated values unless they're HtmlResult.
 *
 * @example
 * ```ts
 * const name = '<script>alert("xss")</script>';
 * html`<div>${name}</div>` // Safe: <div>&lt;script&gt;...</div>
 *
 * const inner = html`<span>safe</span>`;
 * html`<div>${inner}</div>` // Nested HTML preserved
 * ```
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): HtmlResult {
  let result = '';

  for (let i = 0; i < strings.length; i++) {
    result += strings[i];

    if (i < values.length) {
      const value = values[i];

      if (value === null || value === undefined) {
        // Skip null/undefined
        continue;
      }

      if (typeof value === 'object' && 'html' in value) {
        // HtmlResult - already safe
        result += (value as HtmlResult).html;
      } else if (Array.isArray(value)) {
        // Array of values - join them
        result += value
          .map(v => {
            if (v && typeof v === 'object' && 'html' in v) {
              return (v as HtmlResult).html;
            }
            return escapeHtml(String(v));
          })
          .join('');
      } else {
        // Escape everything else
        result += escapeHtml(String(value));
      }
    }
  }

  return {
    html: result,
    toString() {
      return this.html;
    },
  };
}

/**
 * Mark raw HTML as safe (use carefully!).
 *
 * @example
 * ```ts
 * const trusted = raw('<b>trusted content</b>');
 * html`<div>${trusted}</div>`
 * ```
 */
export function raw(htmlString: string): HtmlResult {
  return {
    html: htmlString,
    toString() {
      return this.html;
    },
  };
}

/**
 * Join multiple HTML results.
 */
export function join(items: HtmlResult[], separator = ''): HtmlResult {
  return raw(items.map(i => i.html).join(separator));
}

/**
 * Conditional HTML - returns empty if condition is false.
 */
export function when(condition: boolean, content: HtmlResult | string): HtmlResult {
  if (!condition) {
    return raw('');
  }
  return typeof content === 'string' ? raw(content) : content;
}

/**
 * CSS tagged template - just returns the string.
 * Useful for syntax highlighting in editors.
 */
export function css(strings: TemplateStringsArray, ...values: unknown[]): string {
  let result = '';
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += String(values[i]);
    }
  }
  return result;
}
