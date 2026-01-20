import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface BuildOptions {
  watch: boolean;
  output: string;
}

export async function buildCommand(options: BuildOptions): Promise<void> {
  const cwd = process.cwd();
  const outputDir = path.resolve(cwd, options.output);

  console.log('Building theme...');
  console.log(`Output: ${outputDir}`);
  console.log();

  // Check for required files
  const manifestPath = path.join(cwd, 'manifest.json');
  const tsconfigPath = path.join(cwd, 'tsconfig.json');

  if (!fs.existsSync(manifestPath)) {
    console.error('Error: manifest.json not found');
    console.error('Run this command from your theme directory');
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Copy manifest.json
  fs.copyFileSync(manifestPath, path.join(outputDir, 'manifest.json'));
  console.log('  Copied: manifest.json');

  // Copy CSS files
  const srcDir = path.join(cwd, 'src');
  if (fs.existsSync(srcDir)) {
    const cssFiles = findFiles(srcDir, '.css');
    for (const cssFile of cssFiles) {
      const relativePath = path.relative(srcDir, cssFile);
      const destPath = path.join(outputDir, relativePath);
      const destDir = path.dirname(destPath);

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      fs.copyFileSync(cssFile, destPath);
      console.log(`  Copied: ${relativePath}`);
    }
  }

  // Copy assets
  const assetsDir = path.join(cwd, 'assets');
  if (fs.existsSync(assetsDir)) {
    const destAssetsDir = path.join(outputDir, 'assets');
    copyDirectory(assetsDir, destAssetsDir);
    console.log('  Copied: assets/');
  }

  // Compile TypeScript if tsconfig exists
  if (fs.existsSync(tsconfigPath)) {
    console.log('  Compiling TypeScript...');
    try {
      execSync(`npx tsc --outDir "${outputDir}"`, { cwd, stdio: 'pipe' });
      console.log('  TypeScript compiled successfully');
    } catch (error: unknown) {
      const err = error as { stderr?: Buffer };
      if (err.stderr) {
        console.error('TypeScript compilation failed:');
        console.error(err.stderr.toString());
      }
      process.exit(1);
    }
  } else {
    // Just copy JS files if no TypeScript
    const jsFiles = findFiles(srcDir, '.js');
    for (const jsFile of jsFiles) {
      const relativePath = path.relative(srcDir, jsFile);
      const destPath = path.join(outputDir, relativePath);
      const destDir = path.dirname(destPath);

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      fs.copyFileSync(jsFile, destPath);
      console.log(`  Copied: ${relativePath}`);
    }
  }

  console.log();
  console.log('Build complete!');

  if (options.watch) {
    console.log();
    console.log('Watching for changes... (press Ctrl+C to stop)');
    watchDirectory(cwd, async () => {
      console.log();
      console.log('Changes detected, rebuilding...');
      await buildCommand({ ...options, watch: false });
    });
  }
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

function copyDirectory(src: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function watchDirectory(dir: string, callback: () => void): void {
  const watchDirs = ['src', 'assets'];
  let debounceTimer: NodeJS.Timeout | null = null;

  const debouncedCallback = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(callback, 100);
  };

  for (const watchDir of watchDirs) {
    const fullPath = path.join(dir, watchDir);
    if (fs.existsSync(fullPath)) {
      fs.watch(fullPath, { recursive: true }, debouncedCallback);
    }
  }

  // Also watch manifest.json
  const manifestPath = path.join(dir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    fs.watch(manifestPath, debouncedCallback);
  }
}
