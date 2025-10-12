# create-stern-config

Interactive CLI tool to set up ESLint and Prettier configuration for your projects with best practices baked in.

## Features

- Interactive prompts for easy setup
- Auto-detects package manager (Bun, npm, pnpm, yarn)
- Strict TypeScript ESLint rules
- Prettier with import sorting
- Customizable configuration files
- Zero config required

## Usage

### Quick Start

Using npx (npm 5.2+):

```bash
npx create-stern-config
```

Using bunx (Bun):

```bash
bunx create-stern-config
```

Using pnpm:

```bash
pnpm dlx create-stern-config
```

### Interactive Setup

The CLI will guide you through:

1. Selecting configuration files to create:

   - ESLint configuration (`eslint.config.js`)
   - Prettier configuration (`prettier.config.js`)
   - Prettier ignore file (`.prettierignore`)

2. Adding lint/format scripts to your `package.json`

3. Installing all required dependencies

## What Gets Installed

The following dependencies are installed as dev dependencies:

- `@eslint/js` - ESLint core rules
- `@ianvs/prettier-plugin-sort-imports` - Import sorting
- `eslint` - JavaScript/TypeScript linter
- `eslint-config-prettier` - Disables conflicting ESLint rules
- `eslint-plugin-import` - Import/export validation
- `eslint-plugin-jsdoc` - JSDoc linting
- `eslint-plugin-n` - Node.js specific rules
- `globals` - Global variables definitions
- `prettier` - Code formatter
- `typescript-eslint` - TypeScript ESLint support

## Configuration Details

### ESLint Rules

The configuration includes:

- **Strict TypeScript checking** - No `any`, proper type safety
- **Code complexity limits** - Warns on complex functions
- **Naming conventions** - Enforced type parameter naming
- **Import organization** - Type imports separated and sorted
- **Security best practices** - Prevents common pitfalls
- **Immutability** - Encourages readonly properties
- **Test file overrides** - Relaxed rules for test files

### Prettier Configuration

- Single quotes
- 2-space indentation
- 80-character line width
- Trailing commas everywhere
- Always parentheses around arrow function parameters
- Import sorting by type and source

## Scripts Added

After setup, you can use these commands:

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without changes
npm run format:check
```

## Requirements

- Node.js 18.0.0 or higher
- A package manager (npm, pnpm, yarn, or Bun)

## Repository Structure

```
your-project/
├── eslint.config.js       # ESLint configuration
├── prettier.config.js     # Prettier configuration
├── .prettierignore        # Files to ignore from formatting
└── package.json           # Updated with scripts and dependencies
```

## Customization

All generated files can be customized after creation. The configurations are designed to be extended:

### Extending ESLint

```javascript
import { createBaseConfig } from "./eslint.config.js";

export default [
  ...createBaseConfig(import.meta.dirname),
  {
    rules: {
      // Your custom rules
      "no-console": "off",
    },
  },
];
```

### Extending Prettier

```javascript
import baseConfig from "./prettier.config.js";

export default {
  ...baseConfig,
  printWidth: 100, // Override example
};
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you encounter any issues, please report them at:
https://github.com/0xstern/create-stern-config/issues

## License

MIT © 0xstern

## Author

**0xstern**

- Email: contact@stern.bio
- GitHub: [@0xstern](https://github.com/0xstern)
