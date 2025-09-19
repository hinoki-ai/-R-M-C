#!/usr/bin/env node

/**
 * JuntaDeVecinos Quality Check
 *
 * Runs all quality assurance checks in sequence
 * Use this before commits and deployments
 */

import { execSync } from 'child_process';

console.log('🔍 Running JuntaDeVecinos Quality Checks...\n');

const checks = [
  {
    name: 'TypeScript',
    command: 'npm run type-check',
    description: 'Type checking',
  },
  {
    name: 'ESLint',
    command: 'npm run lint',
    description: 'Code linting',
  },
  {
    name: 'Naming',
    command: 'npm run check-naming',
    description: 'Naming conventions',
  },
  {
    name: 'Structure',
    command: 'npm run validate-structure',
    description: 'File structure',
  },
  {
    name: 'Config',
    command: 'npm run validate-config',
    description: 'Configuration files',
  },
];

let passed = 0;
let failed = 0;

for (const check of checks) {
  console.log(`📋 Running ${check.name} check...`);

  try {
    execSync(check.command, {
      stdio: 'inherit',
      timeout: 30000,
    });
    console.log(`✅ ${check.name} passed\n`);
    passed++;
  } catch (error) {
    console.log(`❌ ${check.name} failed\n`);
    failed++;
  }
}

console.log('📊 Quality Check Results:');
console.log(`   Passed: ${passed}`);
console.log(`   Failed: ${failed}`);
console.log(`   Total: ${passed + failed}`);

if (failed > 0) {
  console.log('\n❌ Some checks failed. Please fix the issues before proceeding.');
  process.exit(1);
} else {
  console.log('\n✅ All quality checks passed! 🎉');
}