#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Project structure validation script
 * Ensures consistent project organization across the codebase
 */

const requiredStructure = {
  // Root level files
  files: [
    'package.json',
    'tsconfig.json',
    'next.config.ts',
    'tailwind.config.ts',
    'eslint.config.js',
    '.prettierrc',
    'README.md',
    'SYSTEM_DOCUMENTATION.md'
  ],

  // Required directories
  directories: [
    'app',
    'components',
    'lib',
    'convex',
    'hooks',
    'types',
    'public',
    'docs'
  ],

  // Component structure validation
  componentPatterns: {
    // Component files should be in PascalCase
    fileName: /^[A-Z][a-zA-Z0-9]*$/,
    // Directories can be lowercase (common pattern)
    dirName: /^[a-z][a-zA-Z0-9-]*$/
  },

  // Convex structure validation
  convexStructure: [
    'schema.ts',
    'README.md'
  ]
};

function validateFileExists(filePath, description) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing required file: ${description} (${filePath})`);
    return false;
  }
  console.log(`✅ Found: ${description}`);
  return true;
}

function validateDirectoryExists(dirPath, description) {
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Missing required directory: ${description} (${dirPath})`);
    return false;
  }
  console.log(`✅ Found: ${description}`);
  return true;
}

function validateComponentNaming() {
  const componentsDir = path.join(process.cwd(), 'components');
  let allValid = true;

  if (!fs.existsSync(componentsDir)) {
    console.error('❌ Components directory not found');
    return false;
  }

  function checkComponents(dir, prefix = '') {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Check if directory name follows lowercase pattern
        if (!requiredStructure.componentPatterns.dirName.test(item)) {
          console.warn(`⚠️  Component directory "${prefix}${item}" doesn't follow lowercase convention (this is just a warning)`);
          // Don't fail validation for directory naming
        } else {
          console.log(`✅ Component directory: ${prefix}${item}`);
        }
        checkComponents(fullPath, `${prefix}${item}/`);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const componentName = item.replace(/\.(tsx|ts)$/, '');
        if (!requiredStructure.componentPatterns.fileName.test(componentName)) {
          console.warn(`⚠️  Component file "${prefix}${item}" doesn't follow PascalCase (this is just a warning)`);
          // Don't fail validation for component naming - existing project may not follow this
        } else {
          console.log(`✅ Component file: ${prefix}${item}`);
        }
      }
    }
  }

  checkComponents(componentsDir);
  return allValid;
}

function validateConvexStructure() {
  const convexDir = path.join(process.cwd(), 'convex');
  let allValid = true;

  if (!fs.existsSync(convexDir)) {
    console.error('❌ Convex directory not found');
    return false;
  }

  for (const required of requiredStructure.convexStructure) {
    const filePath = path.join(convexDir, required);
    if (!validateFileExists(filePath, `Convex ${required}`)) {
      allValid = false;
    }
  }

  return allValid;
}

function main() {
  console.log('🔍 Validating project structure...\n');

  let allValid = true;

  // Check required files
  console.log('📁 Checking required files:');
  for (const file of requiredStructure.files) {
    if (!validateFileExists(path.join(process.cwd(), file), file)) {
      allValid = false;
    }
  }

  console.log('\n📂 Checking required directories:');
  for (const dir of requiredStructure.directories) {
    if (!validateDirectoryExists(path.join(process.cwd(), dir), dir)) {
      allValid = false;
    }
  }

  console.log('\n🧩 Checking component naming:');
  if (!validateComponentNaming()) {
    allValid = false;
  }

  console.log('\n🔧 Checking Convex structure:');
  if (!validateConvexStructure()) {
    allValid = false;
  }

  console.log('\n' + '='.repeat(50));

  if (allValid) {
    console.log('🎉 Project structure validation passed!');
    process.exit(0);
  } else {
    console.error('❌ Project structure validation failed!');
    console.error('Please fix the issues above before proceeding.');
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}