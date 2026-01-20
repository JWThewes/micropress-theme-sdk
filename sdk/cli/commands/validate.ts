import * as fs from 'fs';
import * as path from 'path';

interface ValidateOptions {
  fix: boolean;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface Manifest {
  id?: string;
  name?: string;
  version?: string;
  description?: string;
  author?: string;
  homepage?: string;
  breakpoints?: Record<string, string>;
  customizable?: Record<string, {
    type?: string;
    label?: string;
    default?: string;
    options?: string[];
  }>;
}

export async function validateCommand(options: ValidateOptions): Promise<void> {
  const cwd = process.cwd();
  console.log('Validating theme...');
  console.log();

  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // Check manifest.json
  const manifestPath = path.join(cwd, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    result.errors.push('manifest.json not found');
    result.valid = false;
  } else {
    const manifestResult = validateManifest(manifestPath, options.fix);
    result.errors.push(...manifestResult.errors);
    result.warnings.push(...manifestResult.warnings);
    if (!manifestResult.valid) {
      result.valid = false;
    }
  }

  // Check required directories
  const srcDir = path.join(cwd, 'src');
  if (!fs.existsSync(srcDir)) {
    result.errors.push('src/ directory not found');
    result.valid = false;
  }

  // Check for CSS files
  const cssFiles = findFiles(srcDir, '.css');
  if (cssFiles.length === 0) {
    result.warnings.push('No CSS files found in src/');
  }

  // Check for renderers
  const renderersTs = path.join(srcDir, 'renderers.ts');
  const renderersJs = path.join(srcDir, 'renderers.js');
  if (!fs.existsSync(renderersTs) && !fs.existsSync(renderersJs)) {
    result.warnings.push('No renderers.ts or renderers.js found in src/');
  }

  // Check package.json
  const packagePath = path.join(cwd, 'package.json');
  if (!fs.existsSync(packagePath)) {
    result.warnings.push('package.json not found');
  } else {
    const packageResult = validatePackageJson(packagePath);
    result.warnings.push(...packageResult.warnings);
  }

  // Print results
  if (result.errors.length > 0) {
    console.log('Errors:');
    for (const error of result.errors) {
      console.log(`  \x1b[31m✗\x1b[0m ${error}`);
    }
    console.log();
  }

  if (result.warnings.length > 0) {
    console.log('Warnings:');
    for (const warning of result.warnings) {
      console.log(`  \x1b[33m!\x1b[0m ${warning}`);
    }
    console.log();
  }

  if (result.valid && result.errors.length === 0) {
    console.log('\x1b[32m✓\x1b[0m Theme is valid!');
    if (result.warnings.length > 0) {
      console.log(`  (${result.warnings.length} warning${result.warnings.length === 1 ? '' : 's'})`);
    }
  } else {
    console.log('\x1b[31m✗\x1b[0m Theme validation failed');
    process.exit(1);
  }
}

function validateManifest(manifestPath: string, fix: boolean): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  let manifest: Manifest;
  try {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(content);
  } catch (error) {
    result.errors.push(`Invalid JSON in manifest.json: ${(error as Error).message}`);
    result.valid = false;
    return result;
  }

  // Required fields
  const requiredFields = ['id', 'name', 'version', 'description', 'author'] as const;
  for (const field of requiredFields) {
    if (!manifest[field]) {
      result.errors.push(`Missing required field in manifest.json: ${field}`);
      result.valid = false;
    }
  }

  // Validate ID format
  if (manifest.id && !/^[a-z][a-z0-9-]*$/.test(manifest.id)) {
    result.errors.push('Invalid theme ID: must start with a letter and contain only lowercase letters, numbers, and hyphens');
    result.valid = false;
  }

  // Validate version format
  if (manifest.version && !/^\d+\.\d+\.\d+(-[a-z0-9.]+)?$/.test(manifest.version)) {
    result.warnings.push('Version should follow semver format (e.g., 1.0.0)');
  }

  // Validate customizable fields
  if (manifest.customizable) {
    for (const [key, field] of Object.entries(manifest.customizable)) {
      if (!field.type) {
        result.errors.push(`Missing type for customizable field: ${key}`);
        result.valid = false;
      } else if (!['color', 'font', 'size', 'select'].includes(field.type)) {
        result.errors.push(`Invalid type for customizable field ${key}: ${field.type}`);
        result.valid = false;
      }

      if (!field.label) {
        result.warnings.push(`Missing label for customizable field: ${key}`);
      }

      if (field.default === undefined) {
        result.warnings.push(`Missing default value for customizable field: ${key}`);
      }

      if (field.type === 'select' && (!field.options || field.options.length === 0)) {
        result.errors.push(`Select field ${key} must have options array`);
        result.valid = false;
      }
    }
  }

  return result;
}

function validatePackageJson(packagePath: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  try {
    const content = fs.readFileSync(packagePath, 'utf-8');
    const pkg = JSON.parse(content);

    // Check for SDK dependency
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (!deps['@micropress/theme-sdk']) {
      result.warnings.push('@micropress/theme-sdk not found in dependencies');
    }
  } catch (error) {
    result.warnings.push(`Could not parse package.json: ${(error as Error).message}`);
  }

  return result;
}

function findFiles(dir: string, extension: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findFiles(fullPath, extension));
    } else if (entry.name.endsWith(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}
