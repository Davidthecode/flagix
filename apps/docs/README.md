# Flagix Documentation

This is the documentation site for Flagix, built with Next.js and Fumadocs.

## Development

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Building

```bash
pnpm build
```

## Technology Stack

- **Framework**: Next.js 15
- **Documentation**: Fumadocs
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## Content Structure

Documentation is organized in the `content/docs/` directory:

```
content/docs/
├── index.mdx              # Getting started
├── introduction.mdx       # Product overview
├── installation.mdx       # Setup guide
├── sdk/                   # SDK documentation
│   ├── javascript.mdx
│   └── react.mdx
├── features/              # Feature management
│   └── creating.mdx
├── targeting.mdx          # User targeting
├── analytics.mdx          # Analytics guide
├── api/                   # API reference
│   └── overview.mdx
└── meta.json             # Navigation configuration
```

## Adding New Documentation

1. Create a new `.mdx` file in `content/docs/`
2. Add the page to `meta.json` for navigation
3. Follow the existing documentation style and structure

## Deployment

The documentation is automatically deployed when changes are pushed to the main branch.