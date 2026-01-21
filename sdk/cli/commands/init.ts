import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface InitOptions {
  directory: string;
  git: boolean;
}

// Version injected at build time from package.json
const SDK_VERSION = process.env.PKG_VERSION || '0.1.0';

const MANIFEST_TEMPLATE = `{
  "id": "{{name}}",
  "name": "{{displayName}}",
  "version": "1.0.0",
  "description": "A custom MicroPress theme",
  "author": "Your Name",
  "homepage": "",
  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px"
  },
  "customizable": {
    "primaryColor": {
      "type": "color",
      "label": "Primary Color",
      "default": "#3b82f6"
    },
    "fontFamily": {
      "type": "select",
      "label": "Font Family",
      "default": "system-ui",
      "options": ["system-ui", "Georgia", "Helvetica"]
    }
  }
}`;

const THEME_CSS_TEMPLATE = `/* {{displayName}} - Main Styles */

:root {
  --primary: var(--theme-primaryColor, #3b82f6);
  --font-family: var(--theme-fontFamily, system-ui);
}

/* Base styles */
body {
  font-family: var(--font-family), sans-serif;
  line-height: 1.6;
  color: #1f2937;
}

/* Header */
.theme-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.theme-header__brand {
  font-weight: 600;
  font-size: 1.25rem;
  text-decoration: none;
  color: inherit;
}

/* Navigation */
.theme-nav {
  padding: 0.5rem 2rem;
}

.theme-nav__list {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.theme-nav__link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.theme-nav__link:hover,
.theme-nav__link.is-active {
  color: var(--primary);
}

/* Main content */
.theme-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

/* Footer */
.theme-footer {
  padding: 2rem;
  background: #f9fafb;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .theme-nav__list {
    flex-direction: column;
    gap: 0.5rem;
  }
}
`;

const RENDERERS_TEMPLATE = `import { defineTheme, html, css, raw, when } from '@micropress/theme-sdk';
import type { HeaderDTO, NavigationDTO, FooterDTO } from '@micropress/theme-sdk';

export default defineTheme({
  config: {
    id: '{{name}}',
    name: '{{displayName}}',
    version: '1.0.0',
  },

  renderers: {
    // Custom header renderer
    header: {
      render: (data: HeaderDTO) => html\`
        <header class="theme-header">
          <a href="/" class="theme-header__brand">
            \${data.logo
              ? html\`<img src="\${data.logo.src}" alt="\${data.logo.alt}" />\`
              : html\`<span>\${data.siteName}</span>\`
            }
          </a>
          \${when(data.showMenuToggle, html\`
            <button class="theme-header__toggle" aria-label="Toggle menu">
              <span></span>
            </button>
          \`)}
        </header>
      \`.html,
    },

    // Custom navigation renderer
    navigation: {
      render: (data: NavigationDTO) => html\`
        <nav class="theme-nav">
          <ul class="theme-nav__list">
            \${raw(data.items.map(item => html\`
              <li class="theme-nav__item">
                <a
                  href="\${item.href}"
                  class="theme-nav__link \${item.active ? 'is-active' : ''}"
                >
                  \${item.label}
                </a>
              </li>
            \`.html).join(''))}
          </ul>
        </nav>
      \`.html,
    },

    // Custom footer renderer
    footer: {
      render: (data: FooterDTO) => html\`
        <footer class="theme-footer">
          <p>&copy; \${data.year} \${data.copyright}</p>
          \${when(data.links.length > 0, html\`
            <nav>
              \${raw(data.links.map(link => html\`
                <a href="\${link.href}">\${link.label}</a>
              \`.html).join(' · '))}
            </nav>
          \`)}
        </footer>
      \`.html,
    },
  },
});
`;

const PACKAGE_JSON_TEMPLATE = `{
  "name": "{{name}}",
  "version": "1.0.0",
  "description": "A custom MicroPress theme",
  "main": "dist/renderers.js",
  "types": "dist/renderers.d.ts",
  "scripts": {
    "build": "micropress-theme build",
    "validate": "micropress-theme validate",
    "package": "micropress-theme package"
  },
  "devDependencies": {
    "@micropress/theme-sdk": "^{{sdkVersion}}",
    "typescript": "^5.0.0"
  },
  "keywords": ["micropress", "theme"],
  "license": "MIT"
}`;

const TSCONFIG_TEMPLATE = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`;

const GITIGNORE_TEMPLATE = `node_modules/
dist/
*.zip
.DS_Store
`;

const GITHUB_WORKFLOW_TEMPLATE = `name: Build Theme

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Validate theme
        run: npm run validate

      - name: Build theme
        run: npm run build

      - name: Package theme
        run: npm run package

      - name: Upload theme artifact
        uses: actions/upload-artifact@v4
        with:
          name: theme-package
          path: "*.zip"
`;

function toDisplayName(name: string): string {
  return name
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function replaceTemplateVars(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || '');
}

export async function initCommand(name: string, options: InitOptions): Promise<void> {
  const targetDir = path.resolve(options.directory === '.' ? name : path.join(options.directory, name));

  console.log(`Creating theme: ${name}`);
  console.log(`Location: ${targetDir}`);
  console.log();

  // Check if directory exists
  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory already exists: ${targetDir}`);
    process.exit(1);
  }

  // Create directories
  fs.mkdirSync(targetDir, { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'src'));
  fs.mkdirSync(path.join(targetDir, 'assets'));

  const vars = {
    name,
    displayName: toDisplayName(name),
    sdkVersion: SDK_VERSION,
  };

  // Write files
  const files = [
    { path: 'manifest.json', content: replaceTemplateVars(MANIFEST_TEMPLATE, vars) },
    { path: 'src/theme.css', content: replaceTemplateVars(THEME_CSS_TEMPLATE, vars) },
    { path: 'src/renderers.ts', content: replaceTemplateVars(RENDERERS_TEMPLATE, vars) },
    { path: 'package.json', content: replaceTemplateVars(PACKAGE_JSON_TEMPLATE, vars) },
    { path: 'tsconfig.json', content: TSCONFIG_TEMPLATE },
    { path: '.gitignore', content: GITIGNORE_TEMPLATE },
    { path: '.github/workflows/build.yml', content: GITHUB_WORKFLOW_TEMPLATE },
  ];

  for (const file of files) {
    const filePath = path.join(targetDir, file.path);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, file.content);
    console.log(`  Created: ${file.path}`);
  }

  // Initialize git
  if (options.git) {
    try {
      execSync('git init', { cwd: targetDir, stdio: 'ignore' });
      console.log('  Initialized git repository');
    } catch {
      console.log('  Warning: Could not initialize git repository');
    }
  }

  console.log();
  console.log('Theme created successfully!');
  console.log();
  console.log('Next steps:');
  console.log(`  cd ${name}`);
  console.log('  npm install');
  console.log('  npm run build');
  console.log();
}
