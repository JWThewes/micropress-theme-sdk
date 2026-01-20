# Contributing to MicroPress Theme SDK

Thank you for your interest in contributing!

## Ways to Contribute

### 1. Report Bugs

Open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS)

### 2. Suggest Features

Open an issue describing:
- The feature you'd like
- Use cases
- Possible implementation approaches

### 3. Submit Pull Requests

#### For SDK Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes in `sdk/`
4. Add tests if applicable
5. Run `npm test` and `npm run build` in `sdk/`
6. Submit a PR

#### For Registry Additions

1. Fork the repository
2. Add your theme to `registry/registry.json`
3. Ensure your entry includes all required fields
4. Submit a PR

### Registry Entry Requirements

```json
{
  "id": "your-theme-id",
  "name": "Your Theme Name",
  "description": "Brief description",
  "latestVersion": "1.0.0",
  "author": "Your Name",
  "githubRepo": "username/repo",
  "releaseUrl": "https://github.com/username/repo/releases/download/v1.0.0/theme.zip",
  "previewUrl": "https://optional-preview-site.com"
}
```

Required fields:
- `id` - Lowercase, hyphens allowed
- `name` - Display name
- `description` - Brief description
- `latestVersion` - Semver format
- `author` - Your name
- `githubRepo` - GitHub repo path
- `releaseUrl` - Direct download URL (HTTPS)

Optional:
- `previewUrl` - Demo site URL

## Development Setup

```bash
# Clone the repo
git clone https://github.com/JWThewes/micropress-theme-sdk.git
cd theme-sdk

# Install SDK dependencies
cd sdk
npm install

# Build
npm run build

# Run tests
npm test

# Link for local testing
npm link
```

## Code Style

- Use TypeScript
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Keep functions focused and simple

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add new validation for manifest fields
fix: correct CSS variable injection
docs: update API reference
chore: update dependencies
```

## Questions?

Open an issue or start a discussion. We're happy to help!
