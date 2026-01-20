import { describe, it, expect } from 'vitest';
import { html, css, raw, when, escapeHtml, defineTheme } from './index';

describe('html', () => {
  it('escapes interpolated strings', () => {
    const unsafe = '<script>alert("xss")</script>';
    const result = html`<div>${unsafe}</div>`;
    expect(result.html).toBe('<div>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</div>');
  });

  it('preserves nested HtmlResult', () => {
    const inner = html`<span>safe</span>`;
    const result = html`<div>${inner}</div>`;
    expect(result.html).toBe('<div><span>safe</span></div>');
  });

  it('handles arrays', () => {
    const items = ['a', 'b'];
    const result = html`<ul>${items.map(i => html`<li>${i}</li>`)}</ul>`;
    expect(result.html).toBe('<ul><li>a</li><li>b</li></ul>');
  });

  it('skips null and undefined', () => {
    const result = html`<div>${null}${undefined}</div>`;
    expect(result.html).toBe('<div></div>');
  });
});

describe('css', () => {
  it('returns the template string', () => {
    const color = 'red';
    const result = css`.test { color: ${color}; }`;
    expect(result).toBe('.test { color: red; }');
  });
});

describe('raw', () => {
  it('marks HTML as safe', () => {
    const trusted = raw('<b>bold</b>');
    const result = html`<div>${trusted}</div>`;
    expect(result.html).toBe('<div><b>bold</b></div>');
  });
});

describe('when', () => {
  it('returns content when condition is true', () => {
    const result = when(true, html`<span>yes</span>`);
    expect(result.html).toBe('<span>yes</span>');
  });

  it('returns empty when condition is false', () => {
    const result = when(false, html`<span>no</span>`);
    expect(result.html).toBe('');
  });
});

describe('escapeHtml', () => {
  it('escapes all dangerous characters', () => {
    expect(escapeHtml('<>"\'&')).toBe('&lt;&gt;&quot;&#039;&amp;');
  });
});

describe('defineTheme', () => {
  it('returns the theme definition unchanged', () => {
    const theme = defineTheme({
      config: { id: 'test', name: 'Test', version: '1.0.0' },
      renderers: {},
    });
    expect(theme.config.id).toBe('test');
  });
});
