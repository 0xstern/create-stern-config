# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately:

1. **Do not** open a public issue
2. Email: mrsirstern@gmail.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

You can expect:

- Initial response within 48 hours
- Regular updates on progress
- Credit in the security advisory (if desired)

## Security Best Practices

When using this tool:

1. **Keep dependencies updated**: Regularly update to the latest version
2. **Review generated configs**: Check generated ESLint and Prettier configs before committing
3. **Review installed dependencies**: Verify the dev dependencies being installed are expected

## Known Security Considerations

- The tool copies template files to your project directory
- The tool modifies your package.json (scripts, engines, version, exports)
- The tool installs dev dependencies via your package manager
