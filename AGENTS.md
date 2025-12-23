# Agent Guidelines for ZaneOps Documentation

## Build/Lint/Test Commands
- **Dev server**: `pnpm dev` (runs on port 3000)
- **Build**: `pnpm build` (runs `astro check` then `astro build`)
- **Preview**: `pnpm preview`
- **Type check**: `astro check` (included in build)
- **No dedicated test suite**: This is a documentation site with no test commands

## Code Style
- **Formatter**: Biome (enabled). Tabs for general files, 2 spaces for JS/JSON
- **Line width**: 80 characters
- **JavaScript**: 2-space indentation, arrow parentheses always, no trailing commas
- **TypeScript**: Strict mode (extends `astro/tsconfigs/strict`)
- **No linter**: Biome linter is disabled

## File Conventions
- **Framework**: Astro + Starlight for documentation, React for interactive components
- **Content**: MDX files in `src/content/docs/` with frontmatter (title, description)
- **Components**: Astro components in `src/components/`, use Starlight components (Card, CardGrid, Aside, Icon)
- **Styling**: Tailwind CSS + custom CSS, use CSS variables from Starlight theme
- **Images**: Store in `public/images/`, videos in `public/videos/`
