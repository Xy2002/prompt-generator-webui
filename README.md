# Prompt Generator WebUI

一个基于 Next.js 15 的现代化提示模板生成器，使用元提示（Metaprompt）技术帮助用户快速生成专业的 AI 提示模板。核心功能按照 [Anthropic Prompt generator](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-generator) 进行实现的。

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC)

## ✨ 特性

- 🚀 **智能提示生成**: 基于元提示技术，只需描述任务即可生成专业的提示模板
- 🎯 **变量检测**: 自动检测并提取提示模板中的变量
- 💾 **本地存储**: 保存生成的提示模板到本地浏览器存储
- 🧪 **实时测试**: 内置测试页面，支持变量输入和实时 AI 响应
- 📚 **历史管理**: 查看、管理和删除历史生成的提示模板
- 🔧 **多 AI 供应商**: 支持 OpenAI、OpenRouter 等多种 AI 服务
- 🎨 **现代化 UI**: 基于 shadcn/ui 的精美用户界面
- 🌙 **深色模式**: 完整的深色/浅色主题支持

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **UI 库**: React 19 + TypeScript 5
- **样式**: Tailwind CSS 4 + shadcn/ui
- **AI 集成**: AI SDK (@ai-sdk/openai, @ai-sdk/react)
- **图标**: Lucide React
- **构建工具**: Turbopack (开发环境)
- **包管理**: pnpm

## 📦 安装

### 环境要求

- Node.js 18+ 
- pnpm (推荐) 或 npm

### 克隆项目

```bash
git clone https://github.com/Xy2002/prompt-generator-webui.git
cd prompt-generator-webui
```

### 安装依赖

```bash
pnpm install
# 或
npm install
```

### 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🚀 使用指南

### 1. 配置 API

首次使用需要配置 AI 服务提供商信息：

- **Base URL**: AI 服务的 API 地址
  - OpenAI: `https://api.openai.com/v1`
  - OpenRouter: `https://openrouter.ai/api/v1`
- **API 密钥**: 您的 API 密钥
- **模型名称**: 要使用的模型 (如 `gpt-4`, `claude-3-sonnet`)

### 2. 生成提示模板

1. 在"输入任务"部分描述您的任务需求
2. （可选）指定希望在模板中使用的变量
3. 点击"生成提示模板"按钮
4. 等待 AI 生成专业的提示模板

### 3. 测试提示模板

1. 在历史记录页面找到生成的模板
2. 点击"测试"按钮进入测试页面
3. 为检测到的变量输入具体值
4. 点击"开始测试"查看 AI 响应效果

### 4. 管理历史记录

- 在历史记录页面查看所有保存的提示模板
- 查看模板详情、变量信息和创建时间
- 删除不需要的模板

## 📂 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   │   ├── generate/      # 提示生成 API
│   │   └── test/          # 提示测试 API
│   ├── history/           # 历史记录页面
│   ├── test/              # 测试页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/ui/         # shadcn/ui 组件
├── lib/
│   ├── storage.ts         # 本地存储工具
│   └── utils.ts           # 工具函数
└── ...
```

## 🔧 开发命令

```bash
# 启动开发服务器 (使用 Turbopack)
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint
```

## 🤝 贡献指南

我们欢迎各种形式的贡献！

### 提交 Issue

如果您发现 bug 或有新功能建议，请创建一个 Issue。

### 提交 Pull Request

1. Fork 本项目
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 编写有意义的提交信息

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [AI SDK](https://sdk.vercel.ai/) - AI 集成工具
- [Lucide](https://lucide.dev/) - 图标库

## 📞 支持

如果您有任何问题或需要帮助，请：

1. 查看 [Issues](https://github.com/Xy2002/prompt-generator-webui/issues) 页面
2. 创建新的 Issue 描述您的问题
3. 参与社区讨论

---

⭐ 如果这个项目对您有帮助，请考虑给我们一个 Star！