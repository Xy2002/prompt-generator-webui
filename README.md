# Prompt Generator WebUI

**[中文文档](README_zh.md) | English**

A modern prompt template generator based on Next.js 15, using metaprompt technology to help users quickly generate professional AI prompt templates. Core functionality implemented following the [Anthropic Prompt generator](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-generator).

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC)

## ✨ Features

- 🚀 **Smart Prompt Generation**: Based on metaprompt technology, generate professional prompt templates by simply describing tasks
- 🎯 **Variable Detection**: Automatically detect and extract variables from prompt templates
- 💾 **Local Storage**: Save generated prompt templates to local browser storage
- 🧪 **Real-time Testing**: Built-in testing page with variable input and real-time AI responses
- 📚 **History Management**: View, manage, and delete historically generated prompt templates
- 🔧 **Multiple AI Providers**: Support for OpenAI, OpenRouter, and other AI services
- 🌍 **Multi-language Support**: Complete internationalization support for Chinese and English
- 📤 **Data Export**: Export all user data as JSON backup files
- 📥 **Data Import**: Import backup data with selective recovery of different data types
- ⚙️ **Settings Page**: Centralized application configuration and data management
- 🎨 **Modern UI**: Beautiful user interface based on shadcn/ui
- 🌙 **Dark Mode**: Complete dark/light theme support

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **AI Integration**: AI SDK (@ai-sdk/openai, @ai-sdk/react)
- **Internationalization**: next-intl 4.3.4
- **Component Library**: Radix UI (Alert Dialog, Checkbox, Dialog, Separator, Slot)
- **Theme**: next-themes 0.4.6
- **Notifications**: sonner 2.0.6
- **Data Validation**: zod 3.25.76
- **Icons**: Lucide React
- **Build Tool**: Turbopack (development environment)
- **Package Manager**: pnpm

## 📦 Installation

### Requirements

- Node.js 18+ 
- pnpm (recommended) or npm

### Clone Repository

```bash
git clone https://github.com/Xy2002/prompt-generator-webui.git
cd prompt-generator-webui
```

### Install Dependencies

```bash
pnpm install
# or
npm install
```

### Start Development Server

```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 🌐 Multi-language Support

The application supports multi-language interface, currently supporting:

- **Chinese (zh-CN)**: Default language
- **English (en)**: English interface

### Language Switching

- Click the language switch button in the navigation bar
- Support real-time language switching without page refresh
- Language preference is automatically saved to local storage

### Localized Routing

The application uses `[locale]` dynamic routing structure:
- Chinese: `/zh-CN/` (default)
- English: `/en/`

### Adding New Languages

1. Add new locale in `src/i18n/routing.ts`
2. Add corresponding translation files in `messages/` directory
3. Add language options in `src/components/language-switcher.tsx`

## 🚀 Usage Guide

### 1. Configure API

First-time use requires configuring AI service provider information:

- **Base URL**: API address of the AI service
  - OpenAI: `https://api.openai.com/v1`
  - OpenRouter: `https://openrouter.ai/api/v1`
- **API Key**: Your API key
- **Model Name**: Model to use (e.g., `gpt-4`, `claude-3-sonnet`)

### 2. Generate Prompt Template

1. Describe your task requirements in the "Input Task" section
2. (Optional) Specify variables you want to use in the template
3. Click the "Generate Prompt Template" button
4. Wait for AI to generate professional prompt template

### 3. Test Prompt Template

1. Find the generated template in the history page
2. Click the "Test" button to enter the test page
3. Input specific values for detected variables
4. Click "Start Test" to see AI response effectiveness

### 4. Manage History

- View all saved prompt templates in the history page
- View template details, variable information, and creation time
- Delete unnecessary templates

### 5. Data Management

**Data Export**:
- Access the Settings page
- View data summary (API configuration, saved prompts, test results)
- One-click export of all data as JSON backup file

**Data Import**:
- Select import data in the settings page
- Upload previously exported JSON backup file
- Preview import data and select import options
- Choose to merge or replace existing data

### 6. Language Switching

- Click the language switch button in the navigation bar
- Support switching between Chinese and English interfaces
- Language preference is automatically saved

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Internationalization routing
│   │   ├── history/       # History page
│   │   ├── settings/      # Settings page
│   │   ├── test/          # Test page
│   │   ├── layout.tsx     # Localized layout
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Global styles
│   └── api/               # API routes
│       ├── generate/      # Prompt generation API
│       └── test/          # Prompt testing API
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── data-export.tsx    # Data export component
│   ├── data-import.tsx    # Data import component
│   ├── language-switcher.tsx # Language switcher component
│   └── navigation.tsx     # Navigation component
├── i18n/                  # Internationalization configuration
│   ├── navigation.ts      # Navigation configuration
│   ├── request.ts         # Request configuration
│   └── routing.ts         # Routing configuration
├── lib/
│   ├── storage.ts         # Local storage utilities
│   └── utils.ts           # Utility functions
├── messages/              # Translation files
│   ├── en.json            # English translations
│   └── zh-CN.json         # Chinese translations
└── middleware.ts          # Next.js middleware
```

## 🔧 Development Commands

```bash
# Start development server (with Turbopack)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## 🤝 Contributing

We welcome contributions of all kinds!

### Submit Issues

If you find bugs or have feature suggestions, please create an Issue.

### Submit Pull Requests

1. Fork this project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Use TypeScript for type checking
- Follow ESLint rules
- Use Prettier for code formatting
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [AI SDK](https://sdk.vercel.ai/) - AI integration toolkit
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/Xy2002/prompt-generator-webui/issues) page
2. Create a new Issue describing your problem
3. Participate in community discussions

---

⭐ If this project helps you, please consider giving us a Star!