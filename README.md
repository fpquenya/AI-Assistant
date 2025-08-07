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
- **中英文互译**：支持中文与英文之间的双向智能翻译
- **长文本支持**：支持长篇文档和文章的翻译处理
- **实时翻译**：快速响应的翻译服务，60秒超时保障
- **专业术语**：基于Dify工作流提供准确的翻译结果
- **简洁界面**：直观易用的翻译操作界面

## 🛠️ 技术栈

### 前端技术
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

### 后端技术
- **后端框架**：FastAPI
- **开发语言**：Python 3.8+
- **异步HTTP客户端**：httpx
- **CORS支持**：FastAPI CORS中间件
- **文件处理**：Multer (multipart/form-data)
- **AI服务集成**：Dify工作流API

## 📦 安装与运行

### 环境要求
- Node.js >= 18.0.0
- Python >= 3.8
- npm 或 pnpm
- pip (Python包管理器)

### 安装依赖

#### 前端依赖
```bash
# 使用npm
npm install

# 或使用pnpm
pnpm install
```

#### 后端依赖
```bash
# 进入后端目录
cd backend

# 安装Python依赖
pip install fastapi uvicorn httpx python-multipart
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

#### 启动后端服务
```bash
# 进入后端目录
cd backend

# 启动FastAPI服务器
python main.py
```
后端服务将运行在 `http://localhost:8000`

#### 启动前端服务
```bash
# 在项目根目录
# 使用npm
npm run dev

# 或使用pnpm
pnpm dev
```
前端应用将运行在 `http://localhost:5173`

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
├── src/                    # 前端源码
│   ├── components/          # 可复用组件
│   ├── pages/              # 页面组件
│   │   ├── ContractReview.tsx  # 合同审批页面
│   │   └── Translation.tsx     # 翻译页面
│   ├── hooks/              # 自定义Hooks
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript类型定义
│   └── App.tsx             # 主应用组件
├── backend/                # 后端源码
│   ├── main.py             # FastAPI主应用
│   └── requirements.txt    # Python依赖列表
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
2. 选择源语言和目标语言（支持中文⇄英语）
3. 输入需要翻译的文本（支持长文本）
4. 点击翻译按钮获取结果
5. 查看AI生成的翻译结果

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目！

## 📄 许可证

MIT License

## 🔗 相关链接

- [React官方文档](https://react.dev/)
- [TypeScript官方文档](https://www.typescriptlang.org/)
- [Vite官方文档](https://vitejs.dev/)
- [Tailwind CSS官方文档](https://tailwindcss.com/)
