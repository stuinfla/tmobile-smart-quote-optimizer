#!/usr/bin/env node

/**
 * Deployment Verification Script for T-Mobile Sales Edge
 * Verifies that the deployment was successful and versions are correct
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';

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

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verifyDeployment() {
  log('\n🔍 T-Mobile Sales Edge - Deployment Verification\n', 'magenta');
  
  // Read local version info
  const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
  const versionJson = JSON.parse(readFileSync(join(rootDir, 'src', 'version.json'), 'utf-8'));
  const swContent = readFileSync(join(rootDir, 'public', 'sw.js'), 'utf-8');
  
  const localVersion = packageJson.version;
  const displayVersion = versionJson.version;
  const swVersionMatch = swContent.match(/const CACHE_NAME = 'tmobile-sales-edge-v([\d.]+)';/);
  const swVersion = swVersionMatch ? swVersionMatch[1] : 'unknown';
  
  log('📦 Local Version Information:', 'blue');
  log(`   Package.json:    v${localVersion}`);
  log(`   Version.json:    v${displayVersion}`);
  log(`   Service Worker:  v${swVersion}`);
  
  // Check version consistency
  let hasErrors = false;
  
  if (localVersion !== displayVersion) {
    log(`\n❌ Version mismatch: package.json (${localVersion}) != version.json (${displayVersion})`, 'red');
    hasErrors = true;
  }
  
  if (localVersion !== swVersion) {
    log(`❌ Version mismatch: package.json (${localVersion}) != service worker (${swVersion})`, 'red');
    hasErrors = true;
  }
  
  if (!hasErrors) {
    log('\n✅ All local versions match!', 'green');
  }
  
  // Check production deployment
  log('\n🌐 Checking Production Deployment...', 'blue');
  
  const urls = [
    'https://tmobile-optimizer.vercel.app',
    'https://tmobile-sales-edge.vercel.app'
  ];
  
  for (const url of urls) {
    try {
      log(`\n   Checking ${url}...`, 'yellow');
      const response = await checkUrl(url);
      
      if (response.status === 200) {
        // Try to extract version from HTML
        const versionMatch = response.data.match(/v([\d.]+)/);
        const deployedVersion = versionMatch ? versionMatch[1] : 'unknown';
        
        if (deployedVersion === localVersion) {
          log(`   ✅ Deployed version matches: v${deployedVersion}`, 'green');
        } else if (deployedVersion === 'unknown') {
          log(`   ⚠️  Could not detect version on production`, 'yellow');
          log(`      Run the app and check the footer for version info`, 'yellow');
        } else {
          log(`   ⚠️  Version mismatch: deployed (v${deployedVersion}) != local (v${localVersion})`, 'yellow');
          log(`      The deployment may still be propagating...`, 'yellow');
        }
        
        // Check service worker
        const swUrl = `${url}/sw.js`;
        const swResponse = await checkUrl(swUrl);
        if (swResponse.status === 200) {
          const swMatch = swResponse.data.match(/const CACHE_NAME = 'tmobile-sales-edge-v([\d.]+)';/);
          const deployedSwVersion = swMatch ? swMatch[1] : 'unknown';
          
          if (deployedSwVersion === localVersion) {
            log(`   ✅ Service worker version matches: v${deployedSwVersion}`, 'green');
          } else {
            log(`   ⚠️  Service worker mismatch: deployed (v${deployedSwVersion}) != local (v${localVersion})`, 'yellow');
          }
        }
      } else {
        log(`   ❌ Failed to reach ${url} (Status: ${response.status})`, 'red');
      }
    } catch (error) {
      log(`   ❌ Error checking ${url}: ${error.message}`, 'red');
    }
  }
  
  // PWA Update Instructions
  log('\n📱 PWA Update Instructions:', 'magenta');
  log('   1. Open the app on your iPhone', 'blue');
  log('   2. If version is old, pull down to refresh', 'blue');
  log('   3. You should see "Update available!" message', 'blue');
  log('   4. App will auto-refresh in 3 seconds', 'blue');
  log('   5. Check footer for version: should show v' + localVersion, 'green');
  
  // Clear cache instructions
  log('\n🔄 If version still doesn\'t update:', 'yellow');
  log('   1. Close the PWA completely (swipe up)', 'blue');
  log('   2. Open Settings → Safari → Clear History and Website Data', 'blue');
  log('   3. Re-open the PWA', 'blue');
  log('   4. Version should now show v' + localVersion, 'green');
  
  if (!hasErrors) {
    log('\n✅ Verification Complete - All systems go!', 'green');
  } else {
    log('\n⚠️  Verification Complete - Some issues detected', 'yellow');
    process.exit(1);
  }
}

// Run verification
verifyDeployment().catch(error => {
  log(`\n❌ Verification failed: ${error.message}`, 'red');
  process.exit(1);
});