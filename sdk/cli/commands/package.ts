import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface PackageOptions {
  output?: string;
}

export async function packageCommand(options: PackageOptions): Promise<void> {
  const cwd = process.cwd();
  console.log('Packaging theme...');
  console.log();

  // Check for manifest.json
  const manifestPath = path.join(cwd, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('Error: manifest.json not found');
    console.error('Run this command from your theme directory');
    process.exit(1);
  }

  // Read manifest for name and version
  let manifest: { id: string; version: string };
  try {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(content);
  } catch (error) {
    console.error('Error: Invalid manifest.json');
    process.exit(1);
  }

  if (!manifest.id || !manifest.version) {
    console.error('Error: manifest.json must have id and version fields');
    process.exit(1);
  }

  // Check for dist directory
  const distDir = path.join(cwd, 'dist');
  if (!fs.existsSync(distDir)) {
    console.log('Build directory not found. Running build first...');
    console.log();

    try {
      // Import and run build command
      const { buildCommand } = await import('./build');
      await buildCommand({ watch: false, output: 'dist' });
      console.log();
    } catch (error) {
      console.error('Build failed');
      process.exit(1);
    }
  }

  // Verify dist has required files
  const requiredFiles = ['manifest.json'];
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(distDir, file))) {
      console.error(`Error: ${file} not found in dist/`);
      console.error('Please run build first');
      process.exit(1);
    }
  }

  // Determine output filename
  const outputFile = options.output || `${manifest.id}-${manifest.version}.zip`;
  const outputPath = path.resolve(cwd, outputFile);

  console.log(`Creating: ${outputFile}`);

  // Create ZIP using native zip command or archiver
  try {
    // Try using native zip command first (available on most systems)
    const files = getAllFiles(distDir);
    const fileList = files
      .map(f => path.relative(distDir, f))
      .join(' ');

    execSync(`zip -r "${outputPath}" ${fileList}`, {
      cwd: distDir,
      stdio: 'pipe',
    });
  } catch {
    // Fallback: create a simple tar.gz or manual process
    console.log('Native zip not available, creating package manually...');
    createZipManually(distDir, outputPath);
  }

  // Get file size
  const stats = fs.statSync(outputPath);
  const sizeKB = (stats.size / 1024).toFixed(1);

  console.log();
  console.log(`\x1b[32m✓\x1b[0m Package created: ${outputFile} (${sizeKB} KB)`);
  console.log();
  console.log('Upload this file to MicroPress to install your theme.');
}

function getAllFiles(dir: string): string[] {
  const files: string[] = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function createZipManually(sourceDir: string, outputPath: string): void {
  // Simple fallback: create a minimal zip-like archive
  // In practice, you'd want to use a library like archiver
  // For now, we'll just create a tarball if zip isn't available

  try {
    execSync(`tar -czf "${outputPath.replace('.zip', '.tar.gz')}" -C "${sourceDir}" .`, {
      stdio: 'pipe',
    });
    console.log('Note: Created tar.gz instead of zip (zip command not available)');

    // Rename to .zip for compatibility
    fs.renameSync(outputPath.replace('.zip', '.tar.gz'), outputPath);
  } catch (error) {
    // Last resort: create a directory listing file
    const files = getAllFiles(sourceDir);
    const listing = files.map(f => path.relative(sourceDir, f)).join('\n');
    fs.writeFileSync(outputPath.replace('.zip', '.txt'), listing);
    console.error('Warning: Could not create archive. Created file listing instead.');
    console.error('Please install zip or tar to create proper packages.');
  }
}
