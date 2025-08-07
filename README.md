# AI工具箱

一个基于React + TypeScript + Vite构建的智能AI工具集合平台，集成了多种实用的AI功能，为用户提供便捷的智能化服务。

## 🚀 功能特性

### 📋 合同审批
- **智能合同分析**：支持多种合同类型的智能识别和分析
- **风险评估**：自动识别合同中的潜在风险点
- **审批建议**：基于AI分析提供专业的审批建议
- **Markdown格式**：审批结果支持Markdown格式显示，层次清晰
- **DOCX导出**：支持将审批建议导出为Word文档
- **文件上传**：支持拖拽上传或点击选择合同文件

### 🌐 翻译功能
- **多语言翻译**：支持多种语言之间的智能翻译
- **实时翻译**：快速响应的翻译服务
- **专业术语**：针对不同领域提供专业的翻译结果

## 🛠️ 技术栈

- **前端框架**：React 18
- **开发语言**：TypeScript
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **UI组件**：自定义组件 + Lucide React图标
- **路由管理**：React Router DOM
- **状态管理**：Zustand
- **Markdown渲染**：React Markdown
- **文档导出**：docx库
- **HTTP客户端**：Axios
- **AI服务**：Dify API集成

## 📦 安装与运行

### 环境要求
- Node.js >= 18.0.0
- npm 或 pnpm

### 安装依赖
```bash
# 使用npm
npm install

# 或使用pnpm
pnpm install
```

### 环境配置
1. 复制环境变量模板文件：
```bash
cp .env.example .env
```

2. 配置环境变量：
```env
# Dify API配置
VITE_DIFY_API_KEY=your_dify_api_key
VITE_DIFY_BASE_URL=your_dify_base_url
```

### 启动开发服务器
```bash
# 使用npm
npm run dev

# 或使用pnpm
pnpm dev
```

访问 `http://localhost:5173` 查看应用

### 构建生产版本
```bash
# 使用npm
npm run build

# 或使用pnpm
pnpm build
```

### 代码检查
```bash
# 类型检查
npm run check

# ESLint检查
npm run lint
```

## 📁 项目结构

```
AI工具箱/
├── src/
│   ├── components/          # 可复用组件
│   ├── pages/              # 页面组件
│   │   ├── ContractReview.tsx  # 合同审批页面
│   │   └── Translation.tsx     # 翻译页面
│   ├── hooks/              # 自定义Hooks
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript类型定义
│   └── App.tsx             # 主应用组件
├── public/                 # 静态资源
├── .env.example           # 环境变量模板
└── README.md              # 项目说明
```

## 🎯 使用指南

### 合同审批功能
1. 进入合同审批页面
2. 选择合同类型（采购合同、销售合同、服务合同等）
3. 上传合同文件（支持拖拽或点击上传）
4. 点击"开始审批"按钮
5. 查看AI生成的审批建议
6. 可选择导出审批结果为DOCX文档

### 翻译功能
1. 进入翻译页面
2. 选择源语言和目标语言
3. 输入需要翻译的文本
4. 获取翻译结果

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目！

## 📄 许可证

MIT License

## 🔗 相关链接

- [React官方文档](https://react.dev/)
- [TypeScript官方文档](https://www.typescriptlang.org/)
- [Vite官方文档](https://vitejs.dev/)
- [Tailwind CSS官方文档](https://tailwindcss.com/)
