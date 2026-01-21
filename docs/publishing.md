# Publishing Your Theme

Learn how to share your theme with the MicroPress community.

## Distribution Methods

There are two ways to distribute your theme:

1. **Direct Upload**: Create a ZIP and upload to MicroPress
2. **Theme Registry**: List your theme in the official registry

## Direct Upload

### 1. Build and Package

```bash
# Navigate to your theme directory
cd my-theme

# Validate the theme
micropress-theme validate

# Build for distribution
micropress-theme build

# Create the ZIP package
micropress-theme package
```

This creates `my-theme-1.0.0.zip` ready for distribution.

### 2. Upload to MicroPress

1. Log into your MicroPress admin panel
2. Go to **Settings** → **Themes**
3. Click **Upload Theme**
4. Select your ZIP file
5. Click **Install**

## Theme Registry

The theme registry allows users to discover and install your theme directly from MicroPress.

### Prerequisites

1. Your theme must be hosted on GitHub
2. You must create GitHub releases with the theme ZIP attached
3. Your theme must pass validation

### Submission Process

#### 1. Prepare Your Theme

Ensure your theme:
- Passes `micropress-theme validate`
- Has a complete `manifest.json`
- Includes a README with screenshots
- Has a proper license

#### 2. Create a GitHub Release

1. Push your theme to GitHub
2. Create a new release (e.g., `v1.0.0`)
3. Attach your theme ZIP to the release

```bash
# Tag and push
git tag v1.0.0
git push origin v1.0.0

# Create release on GitHub
gh release create v1.0.0 ./my-theme-1.0.0.zip \
  --title "My Theme v1.0.0" \
  --notes "Initial release"
```

#### 3. Submit to Registry

1. Fork the [micropress-theme-sdk](https://github.com/micropress/theme-sdk) repository
2. Edit `registry/registry.json`
3. Add your theme entry:

```json
{
  "themes": [
    {
      "id": "my-theme",
      "name": "My Theme",
      "description": "A beautiful theme for MicroPress",
      "latestVersion": "1.0.0",
      "author": "Your Name",
      "githubRepo": "your-username/my-theme",
      "previewUrl": "https://your-demo-site.com"
    }
  ]
}
```

**Note**: The `releaseUrl` is automatically constructed from `githubRepo` and `latestVersion`. Make sure your GitHub release follows the naming convention:
- Release tag: `v{version}` (e.g., `v1.0.0`)
- Asset filename: `{id}-{version}.zip` (e.g., `my-theme-1.0.0.zip`)

4. Submit a Pull Request

### Registry Entry Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique theme identifier (lowercase, hyphens only) |
| `name` | Yes | Display name |
| `description` | Yes | Brief description |
| `latestVersion` | Yes | Current version (semver format) |
| `author` | Yes | Author name |
| `githubRepo` | Yes | GitHub repo (owner/repo format) |
| `previewUrl` | No | Demo site URL (optional) |

### Updating Your Theme

When releasing a new version:

1. Create a new GitHub release with the updated ZIP (following the naming convention above)
2. Submit a PR updating `registry.json` with only the new `latestVersion`

That's it! The `releaseUrl` will be automatically constructed from your `githubRepo` and new `latestVersion`.

## Best Practices

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features, backwards compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes

### README Content

Include in your README:

1. **Screenshots** - Show off your theme
2. **Features** - List key features
3. **Installation** - How to install
4. **Customization** - Available options
5. **Changelog** - Version history
6. **License** - Usage terms

### Example README

```markdown
# My Awesome Theme

A beautiful, customizable theme for MicroPress.

![Screenshot](./screenshots/preview.png)

## Features

- Responsive design
- Dark mode support
- 10+ customization options
- Optimized for performance

## Installation

1. Download the latest release
2. Upload to MicroPress admin panel
3. Activate the theme

## Customization

| Option | Description |
|--------|-------------|
| Primary Color | Main brand color |
| Font Family | Choose from 5 fonts |
| Border Radius | Rounded or square |

## Changelog

### v1.0.0
- Initial release

## License

MIT License
```

### Screenshots

Include quality screenshots:

```
my-theme/
├── screenshots/
│   ├── preview.png       # Main preview (1200x800)
│   ├── mobile.png        # Mobile view
│   ├── customization.png # Options panel
│   └── dark-mode.png     # Dark mode (if supported)
```

## Support

For help with publishing:

- Open an issue on [GitHub](https://github.com/micropress/theme-sdk/issues)
- Join our community discussions
- Check the [FAQ](./faq.md)
