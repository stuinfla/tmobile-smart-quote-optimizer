#!/usr/bin/env node

/**
 * Intelligent Deployment Script for T-Mobile Sales Edge
 * Automatically increments version, updates all version files, commits, and deploys
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, silent = false) {
  try {
    const output = execSync(command, { 
      cwd: rootDir, 
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return output;
  } catch (error) {
    log(`Error executing: ${command}`, 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

function incrementVersion(version, type = 'patch') {
  const parts = version.split('.');
  
  switch (type) {
    case 'major':
      parts[0] = (parseInt(parts[0]) + 1).toString();
      parts[1] = '0';
      parts[2] = '0';
      break;
    case 'minor':
      parts[1] = (parseInt(parts[1]) + 1).toString();
      parts[2] = '0';
      break;
    case 'patch':
    default:
      // Handle both 2.1 and 2.1.0 formats
      if (parts.length === 2) {
        parts.push('1');
      } else {
        parts[2] = (parseInt(parts[2] || 0) + 1).toString();
      }
      break;
  }
  
  return parts.join('.');
}

function getVersionType() {
  const args = process.argv.slice(2);
  
  if (args.includes('--major')) return 'major';
  if (args.includes('--minor')) return 'minor';
  if (args.includes('--patch')) return 'patch';
  
  // Default to patch
  return 'patch';
}

function updatePackageJson(newVersion) {
  const packagePath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  
  const oldVersion = packageJson.version;
  packageJson.version = newVersion;
  
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  
  return oldVersion;
}

function updateVersionJson(newVersion, features = []) {
  const versionPath = join(rootDir, 'src', 'version.json');
  const today = new Date().toISOString().split('T')[0];
  
  const versionData = {
    version: newVersion.replace(/\.\d+$/, ''), // Remove patch number for display (2.2.0 -> 2.2)
    releaseDate: today,
    features: features.length > 0 ? features : [
      `Version ${newVersion} Release`,
      'Bug fixes and performance improvements',
      'Updated dependencies'
    ]
  };
  
  writeFileSync(versionPath, JSON.stringify(versionData, null, 2) + '\n');
}

function getGitStatus() {
  try {
    const status = execCommand('git status --porcelain', true);
    return status.trim();
  } catch {
    return '';
  }
}

function getChangesSummary() {
  try {
    // Get list of changed files
    const changes = execCommand('git diff --name-only', true);
    const staged = execCommand('git diff --cached --name-only', true);
    
    const allChanges = [...new Set([...changes.split('\n'), ...staged.split('\n')])].filter(Boolean);
    
    const summary = [];
    
    // Categorize changes
    if (allChanges.some(f => f.includes('components/'))) {
      summary.push('Component updates and improvements');
    }
    if (allChanges.some(f => f.includes('data/'))) {
      summary.push('Data and pricing updates');
    }
    if (allChanges.some(f => f.includes('styles/'))) {
      summary.push('UI/UX enhancements');
    }
    if (allChanges.some(f => f.includes('utils/'))) {
      summary.push('Utility and optimization improvements');
    }
    if (allChanges.some(f => f.includes('fix') || f.includes('Fix'))) {
      summary.push('Bug fixes');
    }
    
    return summary;
  } catch {
    return [];
  }
}

async function main() {
  log('\n🚀 T-Mobile Sales Edge - Intelligent Deployment Script\n', 'magenta');
  
  // Check for uncommitted changes
  const gitStatus = getGitStatus();
  if (gitStatus && !process.argv.includes('--force')) {
    log('⚠️  Uncommitted changes detected:', 'yellow');
    console.log(gitStatus);
    log('\nCommit your changes first or use --force to override', 'yellow');
    process.exit(1);
  }
  
  // Determine version increment type
  const versionType = getVersionType();
  log(`📦 Version increment type: ${versionType}`, 'blue');
  
  // Read current version from package.json
  const packagePath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  const currentVersion = packageJson.version;
  
  // Calculate new version
  const newVersion = incrementVersion(currentVersion, versionType);
  
  log(`\n📊 Version Update:`, 'green');
  log(`   Current: v${currentVersion}`, 'yellow');
  log(`   New:     v${newVersion}`, 'green');
  
  // Get changes summary for version.json
  const features = getChangesSummary();
  
  // Add custom features if provided
  const customFeature = process.argv.find(arg => arg.startsWith('--feature='));
  if (customFeature) {
    features.unshift(customFeature.replace('--feature=', ''));
  }
  
  // Update version files
  log('\n📝 Updating version files...', 'blue');
  updatePackageJson(newVersion);
  updateVersionJson(newVersion, features);
  
  // Git operations
  log('\n🔄 Committing version changes...', 'blue');
  execCommand('git add package.json src/version.json');
  execCommand(`git commit -m "Release v${newVersion}

${features.join('\n')}

🤖 Auto-generated by deploy script"`);
  
  // Push to GitHub
  log('\n📤 Pushing to GitHub...', 'blue');
  execCommand('git push origin main');
  
  // Deploy to Vercel
  log('\n🌐 Deploying to Vercel...', 'green');
  const deployOutput = execCommand('vercel --prod', true);
  
  // Extract production URL
  const urlMatch = deployOutput.match(/Production: (https:\/\/[^\s]+)/);
  const productionUrl = urlMatch ? urlMatch[1] : 'https://tmobile-optimizer.vercel.app';
  
  // Success message
  log('\n✅ Deployment Complete!', 'green');
  log(`\n📱 Version ${newVersion} is now live!`, 'bright');
  log(`🔗 ${productionUrl}`, 'blue');
  
  // Update PWA cache
  log('\n💾 PWA will auto-update on next visit', 'yellow');
  log('   Service worker will fetch new version automatically\n', 'yellow');
}

// Run the script
main().catch(error => {
  log(`\n❌ Deployment failed: ${error.message}`, 'red');
  process.exit(1);
});