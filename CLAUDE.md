# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "prompt-generator-webui" that appears to be a web interface for generating prompts, built with TypeScript, React 19, and Tailwind CSS. The project uses modern tooling including Turbopack for fast development builds.

## Development Commands

### Core Commands
- `pnpm dev` or `npm run dev` - Start development server with Turbopack (faster builds)
- `pnpm build` or `npm run build` - Create production build  
- `pnpm start` or `npm start` - Start production server
- `pnpm lint` or `npm run lint` - Run ESLint checks

### Package Management
- This project uses `pnpm` as the package manager (evidenced by pnpm-lock.yaml)
- Always use `pnpm` commands when managing dependencies

## Architecture and Tech Stack

### Framework and Libraries
- **Next.js 15** with App Router (src/app directory structure)
- **React 19** with TypeScript 5
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library configured with "new-york" style
- **AI SDK** (@ai-sdk/openai, @ai-sdk/react) for AI integration
- **Radix UI** primitives for accessible components
- **Lucide React** for icons

### Project Structure
```
src/
├── app/                 # Next.js App Router pages and layouts
│   ├── api/generate/   # API route for prompt generation (empty currently)
│   ├── layout.tsx      # Root layout with Geist fonts
│   ├── page.tsx        # Home page (default Next.js template)
│   └── globals.css     # Global Tailwind styles
├── components/ui/       # shadcn/ui components
│   ├── button.tsx      # Button component with variants
│   ├── card.tsx        # Card components
│   ├── input.tsx       # Input component
│   ├── separator.tsx   # Separator component
│   └── textarea.tsx    # Textarea component
└── lib/
    └── utils.ts        # Utility functions (cn helper for class merging)
```

### Key Configuration
- **Path aliases**: `@/*` maps to `./src/*` (configured in tsconfig.json and components.json)
- **Component aliases**: 
  - `@/components` for components
  - `@/lib/utils` for utilities
  - `@/components/ui` for UI components
- **shadcn/ui**: Configured with CSS variables, neutral base color, and Lucide icons

## Development Patterns

### Styling Approach
- Uses Tailwind CSS with CSS variables for theming
- Components follow shadcn/ui patterns with class-variance-authority for variants
- Dark mode support configured
- Use the `cn()` utility from `@/lib/utils` for conditional class merging

### Component Development
- UI components are built with Radix UI primitives
- Follow shadcn/ui patterns for component structure and variants
- TypeScript with strict mode enabled
- Use `React.ComponentProps` for extending native element props

### AI Integration
- Project includes AI SDK packages suggesting prompt generation functionality
- API route structure exists at `/api/generate` but appears empty currently

## Code Quality
- ESLint configured with Next.js rules
- TypeScript strict mode enabled
- Modern React patterns (React 19 features available)