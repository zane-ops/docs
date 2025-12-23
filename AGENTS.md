# Agent Guide for ZaneOps Docs

## Build/Test Commands
- `pnpm dev` - Start dev server on port 3000
- `pnpm build` - Type check with `astro check` then build
- `pnpm preview` - Preview production build
- No test suite configured

## Code Style
- **Formatter**: Biome with tabs (indent width 2), line width 80
- **TypeScript**: Strict mode enabled, extends `astro/tsconfigs/strict`
- **Imports**: Use framework imports first, then components, then utilities
- **React/TSX**: Use functional components with TypeScript interfaces for props
- **Types**: Always define interfaces for component props and API shapes
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Error Handling**: Use try-catch blocks, log errors to console, return user-friendly messages
- **Async**: Use async/await, handle stream responses with ReadableStream
- **Content**: MDX files in `src/content/docs/`, use Starlight components (Card, CardGrid, Aside)
- **API Routes**: Export named functions (POST, GET) typed as `APIRoute` from `astro`
- **File Structure**: Components in `src/components/`, API routes in `src/pages/api/`
- **No Comments**: Code should be self-documenting unless explicitly needed
