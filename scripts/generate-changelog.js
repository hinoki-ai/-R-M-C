#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get the current version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
);
const currentVersion = packageJson.version;

// Get the previous version (from git tags)
let previousVersion = '0.0.0';
try {
  const tags = execSync('git tag --sort=-version:refname', { encoding: 'utf8' })
    .split('\n')
    .filter(tag => tag.startsWith('v'))
    .map(tag => tag.replace('v', ''))
    .filter(tag => tag !== currentVersion);

  if (tags.length > 0) {
    previousVersion = tags[0];
  }
} catch (error) {
  console.log('No previous version tags found, using 0.0.0 as baseline');
}

// Get commits since last version
const commitRange =
  previousVersion === '0.0.0' ? '' : `v${previousVersion}..HEAD`;
const gitLogCommand = `git log ${commitRange} --pretty=format:"%s" --no-merges`;

let commits;
try {
  commits = execSync(gitLogCommand, { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
} catch (error) {
  console.error('Error getting git commits:', error.message);
  process.exit(1);
}

// Parse conventional commits
const changelog = {
  feat: [],
  fix: [],
  docs: [],
  style: [],
  refactor: [],
  test: [],
  chore: [],
  perf: [],
  ci: [],
  revert: [],
};

const conventionalCommitRegex = /^(\w+)(?:\(([^)]+)\))?: (.+)$/;

commits.forEach(commit => {
  const match = commit.match(conventionalCommitRegex);
  if (match) {
    const [, type, scope, description] = match;
    if (changelog[type]) {
      const formattedDescription = scope
        ? `**${scope}**: ${description}`
        : description;
      changelog[type].push(formattedDescription);
    }
  } else {
    // Non-conventional commits go to chore
    changelog.chore.push(commit);
  }
});

// Generate changelog entry
const now = new Date();
const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format

let changelogEntry = `## [${currentVersion}] - ${dateStr}\n\n`;

const sectionTitles = {
  feat: '### Features',
  fix: '### Bug Fixes',
  docs: '### Documentation',
  style: '### Styles',
  refactor: '### Code Refactoring',
  test: '### Tests',
  chore: '### Chores',
  perf: '### Performance Improvements',
  ci: '### Continuous Integration',
  revert: '### Reverts',
};

Object.entries(sectionTitles).forEach(([type, title]) => {
  if (changelog[type].length > 0) {
    changelogEntry += `${title}\n\n`;
    changelog[type].forEach(item => {
      changelogEntry += `- ${item}\n`;
    });
    changelogEntry += '\n';
  }
});

// Read current CHANGELOG.md
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
let currentContent = fs.readFileSync(changelogPath, 'utf8');

// Check if this version already exists in the changelog (only for version releases)
if (!process.argv.includes('--unreleased')) {
  const versionExistsRegex = new RegExp(`## \\[${currentVersion}\\]`, 'g');
  if (versionExistsRegex.test(currentContent)) {
    console.log(
      `Version ${currentVersion} already exists in changelog. Skipping generation.`
    );
    process.exit(0);
  }
}

// Find the [Unreleased] section and replace it with the new version
const unreleasedRegex = /## \[Unreleased\]\n\n([\s\S]*?)(?=\n## \[|$)/;
const match = currentContent.match(unreleasedRegex);

if (match) {
  // Move unreleased content to the new version
  const unreleasedContent = match[1];
  changelogEntry += unreleasedContent;

  // Replace the unreleased section with just the header
  currentContent = currentContent.replace(
    unreleasedRegex,
    '## [Unreleased]\n\n### Added\n\n### Changed\n\n### Fixed\n\n'
  );

  // Insert the new version entry after the unreleased header
  const insertPosition =
    currentContent.indexOf('## [Unreleased]') + '## [Unreleased]'.length;
  currentContent =
    currentContent.slice(0, insertPosition) +
    '\n\n' +
    changelogEntry +
    currentContent.slice(insertPosition);
} else {
  // If no unreleased section, add it after the header
  const headerEnd = currentContent.indexOf(
    '\n\n',
    currentContent.indexOf('## [Unreleased]')
  );
  currentContent =
    currentContent.slice(0, headerEnd) +
    '\n\n' +
    changelogEntry +
    currentContent.slice(headerEnd);
}

// Write back to CHANGELOG.md
fs.writeFileSync(changelogPath, currentContent);

// Update unreleased section if this is not a version release
if (process.argv.includes('--unreleased')) {
  updateUnreleasedSection();
}

console.log(`Changelog updated for version ${currentVersion}`);

function updateUnreleasedSection() {
  console.log('Updating unreleased section...');

  // Get commits since last version tag (or all commits if no previous version)
  const commitRange = previousVersion === '0.0.0' ? '' : `v${previousVersion}..HEAD`;
  const gitLogCommand = `git log ${commitRange} --pretty=format:"%s" --no-merges`;

  try {
    const commits = execSync(gitLogCommand, { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);

    if (commits.length === 0) {
      console.log('No new commits since last version');
      return;
    }

    // Parse conventional commits for unreleased
    const unreleased = {
      feat: [],
      fix: [],
      docs: [],
      style: [],
      refactor: [],
      test: [],
      chore: [],
      perf: [],
      ci: [],
      revert: [],
    };

    commits.forEach(commit => {
      const match = commit.match(conventionalCommitRegex);
      if (match) {
        const [, type, scope, description] = match;
        if (unreleased[type]) {
          const formattedDescription = scope
            ? `**${scope}**: ${description}`
            : description;
          unreleased[type].push(formattedDescription);
        }
      } else {
        unreleased.chore.push(commit);
      }
    });

    // Update the unreleased section in CHANGELOG.md
    let currentContent = fs.readFileSync(changelogPath, 'utf8');

    // Check if unreleased section exists, if not create it
    if (!currentContent.includes('## [Unreleased]')) {
      currentContent = currentContent.replace(
        /^# Changelog/,
        '# Changelog\n\n## [Unreleased]\n\n## ['
      );
    }

    // Get existing unreleased content
    const unreleasedRegex = /## \[Unreleased\]\n\n([\s\S]*?)(?=\n## \[|$)/;
    const existingMatch = currentContent.match(unreleasedRegex);
    const existingContent = existingMatch ? existingMatch[1] : '';

    // Create new unreleased content
    let unreleasedContent = '';
    Object.entries(sectionTitles).forEach(([type, title]) => {
      if (unreleased[type].length > 0) {
        unreleasedContent += `${title}\n\n`;
        unreleased[type].forEach(item => {
          unreleasedContent += `- ${item}\n`;
        });
        unreleasedContent += '\n';
      }
    });

    // Only update if content has changed
    if (unreleasedContent.trim() !== existingContent.trim()) {
      currentContent = currentContent.replace(
        unreleasedRegex,
        `## [Unreleased]\n\n${unreleasedContent}`
      );
      console.log('Unreleased section updated');
    } else {
      console.log('No changes to unreleased section');
    }

    fs.writeFileSync(changelogPath, currentContent);
    console.log('Unreleased section updated with latest commits');

  } catch (error) {
    console.error('Error updating unreleased section:', error.message);
  }
}
