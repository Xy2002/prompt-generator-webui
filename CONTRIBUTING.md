# 贡献指南

感谢您对 Prompt Generator WebUI 项目的兴趣！我们欢迎各种形式的贡献，包括但不限于代码提交、bug 报告、功能建议、文档改进等。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发环境设置](#开发环境设置)
- [代码风格指南](#代码风格指南)
- [提交流程](#提交流程)
- [问题报告](#问题报告)
- [功能请求](#功能请求)
- [开发指南](#开发指南)

## 🤝 行为准则

参与此项目即表示您同意遵守我们的行为准则：

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 专注于对社区最有益的事情
- 对其他社区成员表现出同理心

## 🚀 如何贡献

### 1. 报告 Bug

如果您发现了 bug，请：

1. 检查 [Issues](https://github.com/Xy2002/prompt-generator-webui/issues) 确认该 bug 还未被报告
2. 创建一个新的 Issue，使用 Bug Report 模板
3. 提供详细的重现步骤、预期行为和实际行为
4. 包含您的环境信息（浏览器、操作系统等）

### 2. 建议新功能

我们欢迎功能建议！请：

1. 检查 Issues 确认该功能未被建议过
2. 创建一个 Feature Request Issue
3. 详细描述功能的用例和预期行为
4. 如果可能，提供设计草图或模拟图

### 3. 贡献代码

#### 小修改

对于小的修改（如修复拼写错误、小 bug 修复），您可以：

1. Fork 项目
2. 创建分支
3. 进行修改
4. 提交 Pull Request

#### 大修改

对于重大功能或更改：

1. 首先创建一个 Issue 讨论您的计划
2. 等待维护者的反馈
3. 获得批准后开始开发

## 🛠️ 开发环境设置

### 前置要求

- Node.js 18 或更高版本
- pnpm (推荐) 或 npm
- Git

### 设置步骤

1. **Fork 并克隆仓库**

```bash
git clone https://github.com/Xy2002/prompt-generator-webui.git
cd prompt-generator-webui
```

2. **安装依赖**

```bash
pnpm install
```

3. **启动开发服务器**

```bash
pnpm dev
```

4. **运行测试（如果有）**

```bash
pnpm test
```

5. **检查代码风格**

```bash
pnpm lint
```

## 📝 代码风格指南

### TypeScript/JavaScript

- 使用 TypeScript 进行开发
- 遵循 ESLint 配置
- 使用 Prettier 进行代码格式化
- 使用有意义的变量和函数名
- 添加 JSDoc 注释到复杂函数

### React 组件

- 使用函数式组件和 Hooks
- 遵循 React 最佳实践
- 将组件保持小而专注
- 使用 TypeScript 接口定义 props

### 样式

- 使用 Tailwind CSS 类
- 遵循 shadcn/ui 组件模式
- 保持响应式设计
- 使用语义化的 CSS 类名

### 提交信息

使用约定式提交格式：

```
type(scope): description

[optional body]

[optional footer(s)]
```

类型：
- `feat`: 新功能
- `fix`: bug 修复
- `docs`: 文档更改
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 添加测试
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat(ui): add dark mode toggle
fix(api): handle empty response from AI service
docs(readme): update installation instructions
```

## 🔄 提交流程

### 1. 准备工作

1. 确保您的分支是最新的：

```bash
git checkout main
git pull upstream main
```

2. 创建新分支：

```bash
git checkout -b feature/your-feature-name
```

### 2. 开发

1. 进行您的更改
2. 添加必要的测试
3. 确保代码通过 lint 检查：

```bash
pnpm lint
```

4. 测试您的更改：

```bash
pnpm build
```

### 3. 提交

1. 添加并提交您的更改：

```bash
git add .
git commit -m "feat: add your feature description"
```

2. 推送到您的 fork：

```bash
git push origin feature/your-feature-name
```

### 4. 创建 Pull Request

1. 访问 GitHub 上的原始仓库
2. 点击 "New Pull Request"
3. 选择您的分支
4. 填写 PR 模板
5. 等待代码审查

## 🐛 问题报告

### Bug Report 模板

```markdown
**描述**
简短描述 bug 是什么。

**重现步骤**
1. 转到 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**预期行为**
对您期望发生的情况的清晰简洁描述。

**截图**
如果适用，请添加截图来帮助解释您的问题。

**环境信息**
- 操作系统: [例如 iOS]
- 浏览器: [例如 chrome, safari]
- 版本: [例如 22]

**附加上下文**
在此处添加有关问题的任何其他上下文。
```

## 💡 功能请求

### Feature Request 模板

```markdown
**您的功能请求是否与问题相关？**
对您遇到的问题的清晰简洁描述。

**描述您想要的解决方案**
对您想要发生的事情的清晰简洁描述。

**描述您考虑过的替代方案**
对您考虑过的任何替代解决方案或功能的清晰简洁描述。

**附加上下文**
在此处添加有关功能请求的任何其他上下文或截图。
```

## 🧭 开发指南

### 项目结构

了解项目结构有助于您更好地贡献：

```
src/
├── app/                # Next.js App Router 页面
│   ├── api/           # API 路由
│   ├── history/       # 历史记录页面
│   ├── test/          # 测试页面
│   └── ...
├── components/ui/     # UI 组件
├── lib/              # 工具库
│   ├── storage.ts    # 本地存储
│   └── utils.ts      # 工具函数
└── ...
```

### 添加新功能

1. **API 路由**: 在 `src/app/api/` 中添加新的 API 端点
2. **页面**: 在 `src/app/` 中添加新页面
3. **组件**: 在 `src/components/ui/` 中添加可复用组件
4. **工具函数**: 在 `src/lib/` 中添加工具函数

### 测试

目前项目还没有正式的测试套件，但我们鼓励：

- 手动测试所有更改
- 确保构建成功
- 测试不同浏览器的兼容性

## 📞 获取帮助

如果您有任何问题：

1. 查看现有的 Issues 和 Pull Requests
2. 阅读项目文档
3. 创建一个 Discussion 或 Issue
4. 在 Issue 中标记 `@maintainers` 获取帮助

## 🙏 致谢

感谢您抽出时间为项目做出贡献！您的参与使这个项目变得更好。

---

再次感谢您的贡献！🎉