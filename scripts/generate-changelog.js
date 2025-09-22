#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the current version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
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
const commitRange = previousVersion === '0.0.0' ? '' : `v${previousVersion}..HEAD`;
const gitLogCommand = `git log ${commitRange} --pretty=format:"%s" --no-merges`;

let commits;
try {
  commits = execSync(gitLogCommand, { encoding: 'utf8' }).split('\n').filter(Boolean);
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
  revert: []
};

const conventionalCommitRegex = /^(\w+)(?:\(([^)]+)\))?: (.+)$/;

commits.forEach(commit => {
  const match = commit.match(conventionalCommitRegex);
  if (match) {
    const [, type, scope, description] = match;
    if (changelog[type]) {
      const formattedDescription = scope ? `**${scope}**: ${description}` : description;
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
  revert: '### Reverts'
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

// Find the [Unreleased] section and replace it with the new version
const unreleasedRegex = /## \[Unreleased\]\n\n([\s\S]*?)(?=\n## \[|$)/;
const match = currentContent.match(unreleasedRegex);

if (match) {
  // Move unreleased content to the new version
  const unreleasedContent = match[1];
  changelogEntry += unreleasedContent;

  // Replace the unreleased section with just the header
  currentContent = currentContent.replace(unreleasedRegex, '## [Unreleased]\n\n### Added\n\n### Changed\n\n### Fixed\n\n');

  // Insert the new version entry after the unreleased header
  const insertPosition = currentContent.indexOf('## [Unreleased]') + '## [Unreleased]'.length;
  currentContent = currentContent.slice(0, insertPosition) + '\n\n' + changelogEntry + currentContent.slice(insertPosition);
} else {
  // If no unreleased section, add it after the header
  const headerEnd = currentContent.indexOf('\n\n', currentContent.indexOf('## [Unreleased]'));
  currentContent = currentContent.slice(0, headerEnd) + '\n\n' + changelogEntry + currentContent.slice(headerEnd);
}

// Write back to CHANGELOG.md
fs.writeFileSync(changelogPath, currentContent);

console.log(`Changelog updated for version ${currentVersion}`);