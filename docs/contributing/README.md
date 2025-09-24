# Contributing to PintoPellines

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/hinoki-ai/-R-M-C)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> Guidelines for contributing to PintoPellines - Pinto Los Pellines community platform

Thanks for helping build and maintain PintoPellines! This guide outlines our development process and contribution standards.

## 🚀 Quick Start

1. **Fork & Clone**: Fork the repository and clone your fork
2. **Setup Environment**: Follow [Getting Started Guide](docs/getting-started/README.md)
3. **Create Branch**: Use descriptive branch names (e.g., `feature/add-weather-widget`)
4. **Make Changes**: Follow our [Development Standards](docs/development/README.md)
5. **Test**: Run quality checks and test your changes
6. **Submit PR**: Create a pull request with detailed description

## 📋 Development Workflow

### 1. Local Setup

```bash
# Clone and setup
git clone https://github.com/hinoki-ai/-R-M-C.git
cd ΛRΛMΛC
npm install

# Configure environment
cp .env.example .env.local
# Add your API keys for Clerk, Convex, etc.

# Start development
npx convex dev --once
npm run dev
```

### 2. Quality Gates

All changes must pass these checks before opening a PR:

```bash
npm run quality-check  # Runs all quality gates
```

Individual checks:

```bash
npm run type-check     # TypeScript type checking
npm run lint          # ESLint code quality
npm run test          # Unit and integration tests
npm run validate-structure  # Project structure validation
npm run validate-config    # Configuration validation
```

### 3. Coding Standards

#### General Guidelines

- Follow [Development Standards](docs/development/README.md) for all code
- Use TypeScript for type safety
- Write meaningful commit messages
- Add tests for new functionality
- Update documentation as needed

#### Component Development

- Use functional components with hooks
- Follow established naming conventions
- Implement proper error boundaries
- Ensure accessibility (ARIA labels, keyboard navigation)

#### Backend Development

- Prefer Convex mutations/queries over direct database access
- Add proper error handling and logging
- Test backend functions in `lib/integration-test.ts`
- Document API changes in relevant docs

### 4. Pull Request Process

#### Before Opening PR

- [ ] Code passes all quality gates
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated if needed
- [ ] No console.log statements in production code
- [ ] Commit messages are descriptive

#### PR Description Template

```markdown
## Description

Brief description of the changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Cross-platform testing (web/mobile)

## Screenshots (if applicable)

Add screenshots for UI changes

## Additional Notes

Any additional context or considerations
```

#### Review Process

1. **Automated Checks**: CI/CD pipeline runs quality gates
2. **Code Review**: At least one maintainer review required
3. **Testing**: Demo critical user flows before merge
4. **Merge**: Squash merge with descriptive commit message

### 5. Deployment

- **Web**: Automatic Vercel deployments on main branch merge
- **Mobile**: Follow [Mobile Deployment Guide](docs/deployment/mobile-deployment.md)
- **Testing**: Always test in staging environment first

## 📦 Version Management

We follow [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH) and use conventional commits for automated changelog generation.

### Version Types

- **MAJOR** (`1.0.0` → `2.0.0`): Breaking changes
- **MINOR** (`1.0.0` → `1.1.0`): New features (backward compatible)
- **PATCH** (`1.0.0` → `1.0.1`): Bug fixes and small improvements

### Release Process

For maintainers only - creating a new release:

```bash
# For bug fixes and small changes
npm run release:patch

# For new features (backward compatible)
npm run release:minor

# For breaking changes
npm run release:major
```

This will:

1. Update `package.json` version
2. Generate changelog from conventional commits
3. Create git commit and tag
4. Push to repository
5. Trigger automated GitHub release

### Commit Conventions

Use conventional commit format for proper changelog generation:

```bash
# Features
git commit -m "feat: add new weather widget"

# Bug fixes
git commit -m "fix: resolve mobile camera issue"

# Documentation
git commit -m "docs: update API documentation"

# Code style
git commit -m "style: format component files"

# Refactoring
git commit -m "refactor: simplify auth logic"

# Performance
git commit -m "perf: optimize image loading"

# Tests
git commit -m "test: add unit tests for utils"

# CI/CD
git commit -m "ci: update GitHub workflows"

# Chores
git commit -m "chore: update dependencies"
```

**Scope is optional but encouraged:**

```bash
git commit -m "feat(auth): add password reset functionality"
```

## 🏗️ Project Structure

```bash
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── convex/             # Backend functions and schema
├── docs/               # Documentation
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── types/              # TypeScript type definitions
```

## 🐛 Issue Reporting

- **Bug Reports**: Use [GitHub Issues](https://github.com/hinoki-ai/-R-M-C/issues) with bug template
- **Feature Requests**: Use feature request template
- **Security Issues**: Email [security@pintopellines.com](mailto:security@pintopellines.com)

## 📚 Additional Resources

- [📖 Complete Documentation](docs/README.md)
- [🏗️ Architecture Overview](docs/architecture/README.md)
- [💻 Development Standards](docs/development/README.md)
- [🚀 Deployment Guide](docs/deployment/README.md)

## 🙏 Recognition

Contributors are recognized in our release notes and community acknowledgments. Thank you for helping build a better community platform for Pinto Los Pellines!

---

**¡Gracias por apoyar a Pinto Los Pellines!** - Made with ❤️ for our community.
