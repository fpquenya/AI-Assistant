# AI工具箱

一个基于AI的多功能工具箱，包含智能翻译和合同审批功能。

## 🌟 功能特性

### 🌐 智能翻译
- **多语言支持**：支持中文、英语、日语、韩语、法语、德语、西班牙语等多种语言互译
- **置信度显示**：实时显示翻译结果的置信度评分
- **长文本支持**：支持长篇文档和文章的翻译处理
- **实时翻译**：快速响应的翻译服务，60秒超时保障
- **专业术语**：基于Dify工作流提供准确的翻译结果
- **语音功能**：支持翻译结果的语音朗读
- **一键复制**：支持翻译结果的快速复制
- **语言切换**：支持源语言和目标语言的快速切换

### 📋 合同审批
- **智能合同分析**：支持多种合同类型的智能识别和分析
- **风险评估可视化**：自动识别合同中的潜在风险点，提供风险等级颜色标识
- **审批建议**：基于AI分析提供专业的审批建议
- **指标数值解析**：自动解析并显示合同关键指标（风险等级、合规性、建议等级）
- **Markdown格式**：审批结果支持Markdown格式显示，层次清晰
- **DOCX导出**：支持将审批建议导出为Word文档
- **文件上传**：支持拖拽上传或点击选择合同文件
- **文件类型验证**：支持PDF、DOC、DOCX、TXT等多种文件格式
- **文件大小限制**：最大支持10MB文件上传

## 🛠️ 技术栈

### 前端技术
- **React 18** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具和开发服务器
- **Tailwind CSS** - 实用优先的CSS框架
- **Lucide React** - 美观的图标库
- **React Router** - 客户端路由管理

### 后端技术
- **FastAPI** - 现代Python Web框架
- **Python 3.8+** - 开发语言
- **Pydantic** - 数据验证和序列化
- **HTTPX** - 异步HTTP客户端
- **python-multipart** - 文件上传处理
- **aiofiles** - 异步文件操作
- **CORS中间件** - 跨域请求支持

### AI服务
- **Dify AI平台** - 提供翻译和合同审批AI能力
- **工作流API** - 智能处理和分析

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- Python 3.8+
- npm 或 yarn

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd AI工具箱
```

### 2. 环境变量配置

创建 `.env` 文件并配置以下变量：

```env
# Dify AI配置
DIFY_API_KEY=your_dify_api_key_here
DIFY_BASE_URL=https://api.dify.ai/v1
DIFY_TRANSLATION_APP_ID=your_translation_app_id_here
DIFY_CONTRACT_APP_ID=your_contract_app_id_here

# 服务器配置
HOST=127.0.0.1
PORT=5173
```

### 3. 安装依赖

#### 前端依赖
```bash
npm install
```

#### 后端依赖
```bash
cd backend
pip install -r requirements.txt
```

### 4. 启动服务

#### 启动后端服务
```bash
cd backend
python main.py
# 或使用uvicorn
uvicorn main:app --host 127.0.0.1 --port 5173 --reload
```

#### 启动前端服务
```bash
npm run dev -- --host 127.0.0.1 --port 3000
```

### 5. 访问应用
- 前端应用：http://127.0.0.1:3000
- 后端API：http://127.0.0.1:5173
- API文档：http://127.0.0.1:5173/docs

## 📁 项目结构

```
AI工具箱/
├── src/                    # 前端源码
│   ├── components/          # 可复用组件
│   │   ├── ui/             # UI基础组件
│   │   └── layout/         # 布局组件
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx            # 首页
│   │   ├── ContractReview.tsx  # 合同审批页面
│   │   └── Translator.tsx      # 翻译页面
│   ├── hooks/              # 自定义Hooks
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript类型定义
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 应用入口文件
│   └── index.css           # 全局样式
├── backend/                # 后端源码
│   ├── main.py             # FastAPI主应用
│   ├── requirements.txt    # Python依赖列表
│   └── .env.example        # 后端环境变量模板
├── public/                 # 静态资源
├── package.json            # 前端依赖配置
├── vite.config.ts          # Vite构建配置
├── tailwind.config.js      # Tailwind CSS配置
├── tsconfig.json           # TypeScript配置
├── .gitignore              # Git忽略文件
└── README.md               # 项目说明
```

## 📖 使用指南

### 合同审批功能
1. 访问合同审批页面
2. 选择合同类型（采购合同、销售合同、服务合同等）
3. 上传合同文件（支持拖拽或点击上传）
   - 支持格式：PDF、DOC、DOCX、TXT
   - 文件大小：最大10MB
4. 点击"开始审批"按钮
5. 查看AI生成的审批建议：
   - 🔴 高风险、🟡 中风险、🟢 低风险标识
   - 合规性分析
   - 具体建议和改进意见
6. 可选择导出审批结果为DOCX文档

### 翻译功能
1. 访问翻译页面
2. 选择源语言和目标语言
3. 输入需要翻译的文本
4. 点击翻译按钮获取结果
5. 查看翻译结果：
   - 翻译文本
   - 置信度评分
   - 语音朗读功能
   - 一键复制功能

## 🔌 API接口文档

### 合同审批API
```http
POST /api/contract/review
Content-Type: multipart/form-data

参数：
- file: 合同文件（必需）
- contract_type: 合同类型（必需）

响应：
{
  "success": true,
  "data": {
    "review_result": "审批建议内容",
    "risk_level": "medium",
    "compliance_score": 85,
    "recommendation_level": "approve_with_conditions"
  }
}
```

### 翻译API
```http
POST /api/translation/translate
Content-Type: application/json

参数：
{
  "text": "要翻译的文本",
  "source_language": "zh",
  "target_language": "en"
}

响应：
{
  "success": true,
  "data": {
    "translated_text": "翻译结果",
    "confidence_score": 0.95,
    "source_language": "zh",
    "target_language": "en"
  }
}
```

### 健康检查API
```http
GET /health
GET /api/health

响应：
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

## 🔧 开发指南

### 前端开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

### 后端开发
```bash
# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
python main.py

# 或使用uvicorn（推荐）
uvicorn main:app --reload --host 127.0.0.1 --port 5173
```

### 代理配置

前端开发时，Vite会自动将 `/api` 请求代理到后端服务器：

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## 🚀 部署指南

### 生产环境部署

1. **构建前端**
```bash
npm run build
```

2. **配置环境变量**
```bash
# 生产环境配置
DIFY_API_KEY=your_production_api_key
DIFY_BASE_URL=https://api.dify.ai/v1
HOST=0.0.0.0
PORT=5173
```

3. **启动后端服务**
```bash
uvicorn main:app --host 0.0.0.0 --port 5173
```

4. **配置反向代理**（推荐使用Nginx）

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 故障排除

### 常见问题

1. **CORS错误**
   - 确保后端CORS配置正确
   - 检查前端请求URL是否正确

2. **API连接失败**
   - 确认后端服务正在运行
   - 检查环境变量配置
   - 验证Dify API密钥是否有效

3. **文件上传失败**
   - 检查文件大小是否超过10MB
   - 确认文件格式是否支持
   - 验证后端文件处理配置

4. **翻译服务超时**
   - 检查网络连接
   - 确认Dify服务状态
   - 减少翻译文本长度

### 日志查看

- 前端日志：浏览器开发者工具控制台
- 后端日志：终端输出或日志文件

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 创建 Discussion

---

**感谢使用AI工具箱！** 🎉