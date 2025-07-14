# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "prompt-generator-webui" - a modern, internationalized web interface for generating AI prompt templates using metaprompt technology. The application features comprehensive prompt management, testing capabilities, and data export/import functionality, built with TypeScript, React 19, and Tailwind CSS.

## Development Commands

### Core Commands
- `pnpm dev` - Start development server with Turbopack (faster builds)
- `pnpm build` - Create production build  
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks

### Package Management
- This project uses `pnpm` as the package manager (evidenced by pnpm-lock.yaml)
- Always use `pnpm` commands when managing dependencies

## Architecture and Tech Stack

### Framework and Libraries
- **Next.js 15** with App Router and internationalized routing (`[locale]`)
- **React 19** with TypeScript 5
- **Tailwind CSS 4** for styling with CSS variables for theming
- **shadcn/ui** component library configured with "new-york" style
- **next-intl 4.3.4** for internationalization (supports English and Chinese)
- **AI SDK** (@ai-sdk/openai, @ai-sdk/react) for AI integration
- **Radix UI** primitives for accessible components
- **sonner** for toast notifications
- **zod** for data validation
- **next-themes** for dark/light theme support

### Internationalization Architecture
The app uses `next-intl` with dynamic `[locale]` routing:
- Supported locales: `en` (English), `zh-CN` (Chinese)
- Default locale: `en`
- Translation files: `messages/en.json`, `messages/zh-CN.json`
- Routing configured in `src/i18n/routing.ts`
- Middleware handles locale detection and routing

### Data Management Architecture
The application uses localStorage for client-side data persistence:

#### Core Data Types (`src/lib/storage.ts`):
- **SavedPrompt**: Generated prompt templates with metadata
- **TestResult**: Results from testing prompts with variables
- **ApiConfig**: AI service provider configuration
- **ExportData**: Complete data export structure for backup/restore

#### Storage Keys:
- `prompt-generator-api-config`: API configuration
- `prompt-generator-saved-prompts`: Generated prompt templates
- `prompt-generator-test-results`: Test execution results

### Application Structure
```
src/app/[locale]/           # Internationalized pages
├── page.tsx               # Home - Prompt generation
├── history/page.tsx       # Saved prompt templates management
├── results/page.tsx       # Test results management
├── test/page.tsx          # Prompt testing with variables
└── settings/page.tsx      # Data export/import & configuration

src/app/api/               # API routes
├── generate/route.ts      # Prompt generation endpoint
└── test/route.ts         # Prompt testing endpoint

src/components/            # React components
├── ui/                   # shadcn/ui components
├── data-export.tsx       # Data export functionality
├── data-import.tsx       # Data import functionality
├── language-switcher.tsx # Language selection component
└── navigation.tsx        # Main navigation

src/i18n/                 # Internationalization config
├── navigation.ts         # Localized navigation
├── request.ts           # Request configuration
└── routing.ts           # Locale routing setup

messages/                 # Translation files
├── en.json              # English translations
└── zh-CN.json           # Chinese translations
```

## Development Patterns

### Styling Approach
- Uses Tailwind CSS with CSS variables for consistent theming
- Components follow shadcn/ui patterns with class-variance-authority for variants
- Dark mode support through next-themes
- Use the `cn()` utility from `@/lib/utils` for conditional class merging

### Component Development
- UI components built with Radix UI primitives for accessibility
- Follow shadcn/ui patterns for component structure and variants
- TypeScript with strict mode enabled
- Use `React.ComponentProps` for extending native element props

### AI Integration Patterns
- Streaming responses using AI SDK's `useChat` hook
- Manual fetch calls for custom streaming handling in test scenarios
- Error handling with toast notifications via sonner
- API configuration stored in localStorage for session persistence

### Data Flow Architecture
1. **Prompt Generation**: User input → API call → Generated template → localStorage
2. **Prompt Testing**: Template + variables → API call → Streaming response → Test result storage
3. **Data Management**: Export/import functionality for all user data types
4. **Internationalization**: Route-based locale switching with persistent preferences

### Translation Management
- All user-facing text must be internationalized using `useTranslations()` hook
- Translation keys organized by page/component sections
- Variable interpolation supported in translation strings
- Both English and Chinese translations must be maintained

## Key Configuration
- **Path aliases**: `@/*` maps to `./src/*` (configured in tsconfig.json)
- **Component aliases**: 
  - `@/components` for components
  - `@/lib/utils` for utilities
  - `@/components/ui` for UI components
- **shadcn/ui**: Configured with CSS variables, neutral base color, and Lucide icons
- **Locales**: English (en) as default, Chinese (zh-CN) as secondary

## Code Quality
- ESLint configured with Next.js rules
- TypeScript strict mode enabled
- Modern React patterns (React 19 features available)
- Comprehensive error handling with user-friendly toast messages