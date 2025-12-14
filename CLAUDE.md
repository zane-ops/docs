# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the documentation site for ZaneOps, built with Astro and Starlight. It's a documentation website that provides guides, tutorials, API reference, and knowledge base for the ZaneOps platform.

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server on port 3000 (configurable via PORT env var) |
| `pnpm build` | Run type checking and build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm start` | Alias for `pnpm dev` |

## Code Quality

- **Formatter**: Biome is configured for code formatting
- **Type checking**: TypeScript with `astro check` before builds
- **Package manager**: Use `pnpm` (v10.14.0+)

## Architecture

### Framework Stack
- **Astro 5.x**: Static site generator with partial hydration
- **Starlight**: Astro integration for documentation sites
- **React 18**: Used for interactive components
- **Tailwind CSS 4.x**: Styling framework
- **TypeScript**: Type safety

### Directory Structure
```
src/
├── assets/           # Images, fonts, global CSS
├── components/       # Astro and React components
├── content/
│   └── docs/        # MDX documentation files
├── pages/           # API routes and special pages
└── styles/          # Additional stylesheets
```

### Content Management
- Documentation content is in `src/content/docs/` as MDX files
- Starlight automatically generates routes from file structure
- Content collections are configured in `src/content.config.ts`
- Sidebar navigation is defined in `astro.config.mjs`

### Key Components
- `LandingPage.astro`: Main homepage with testimonials and features
- `BrowserScreenshot.astro`: Component for displaying browser mockups
- `Head.astro` & `Footer.astro`: Custom Starlight component overrides
- `opengraph.tsx`: OpenGraph image generation

### Special Pages
- `/llms.txt` & `/llms-full.txt`: AI-readable site maps
- `/ping`: Health check endpoint
- `/api-reference/openapi`: OpenAPI documentation
- Dynamic OpenGraph images at `/[...route]/og.png`

## Environment Configuration

The site supports dynamic domain configuration:
- `ZANE_DOMAINS`: Comma-separated list of domains (first used as primary)
- `ASSETS_SERVER_DOMAIN`: Asset server domain (defaults to assets.zaneops.dev)

## Content Guidelines

- Documentation uses MDX format for rich content
- Images should be optimized and placed in `src/assets/`
- Use Starlight components where possible for consistency
- Follow existing sidebar structure in `astro.config.mjs`