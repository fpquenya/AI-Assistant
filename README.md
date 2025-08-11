# AI工具箱

一个基于AI的多功能工具箱，包含翻译和合同审批功能。

## 功能特性

### 🌐 智能翻译
- 支持多种语言互译
- 基于Dify AI平台的高质量翻译
- 简洁直观的用户界面

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

### 🌐 翻译功能
- **多语言支持**：支持中文、英语、日语、韩语、法语、德语、西班牙语等多种语言互译
- **置信度显示**：实时显示翻译结果的置信度评分
- **长文本支持**：支持长篇文档和文章的翻译处理
- **实时翻译**：快速响应的翻译服务，60秒超时保障
- **专业术语**：基于Dify工作流提供准确的翻译结果
- **语音功能**：支持翻译结果的语音朗读
- **一键复制**：支持翻译结果的快速复制
- **语言切换**：支持源语言和目标语言的快速切换
- **常用翻译建议**：提供常用翻译场景的快捷选项

## 技术栈

### 前端
- **React 18** + **TypeScript**
- **Vite** - 快速构建工具
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

### 后端
- **FastAPI** - 现代Python Web框架
- **Pydantic** - 数据验证
- **HTTPX** - 异步HTTP客户端

<<<<<<< HEAD
### 后端技术
- **后端框架**：FastAPI
- **开发语言**：Python 3.8+
- **异步HTTP客户端**：httpx
- **CORS支持**：FastAPI CORS中间件
- **文件处理**：python-multipart (multipart/form-data)
- **AI服务集成**：Dify工作流API
- **环境变量管理**：python-dotenv
- **异步文件操作**：aiofiles
- **数据验证**：Pydantic
- **HTTP请求处理**：requests
=======
### AI服务
- **Dify AI平台** - 提供翻译和合同审批AI能力
>>>>>>> 8d686c0d8f93d2d039037c10757b0693daae2f4e

## 快速开始

### 使用Docker部署（推荐）

1. **克隆项目**
```bash
git clone https://github.com/fpquenya/AI-Assistant.git
cd AI-Assistant
```

2. **配置环境变量**
```bash
cp .env.docker .env
# 编辑.env文件，填入你的Dify API密钥和应用ID
```

3. **启动服务**
```bash
# Windows
docker-start.bat

# Linux/Mac
./docker-start.sh
```

4. **访问应用**
- 前端：http://localhost:3000
- 后端API：http://localhost:8000

### 本地开发

#### 前端开发
```bash
npm install
npm run dev
```

#### 后端开发
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 环境变量配置

创建`.env`文件并配置以下变量：

```env
# Dify AI配置
DIFY_API_KEY=your_dify_api_key_here
DIFY_BASE_URL=https://api.dify.ai/v1
DIFY_TRANSLATION_APP_ID=your_translation_app_id_here
DIFY_CONTRACT_APP_ID=your_contract_app_id_here

# 前端配置
VITE_API_BASE_URL=http://localhost:8000
VITE_DIFY_API_KEY=your_dify_api_key_here
VITE_DIFY_BASE_URL=https://api.dify.ai/v1
```

## API文档

启动后端服务后，访问 http://localhost:8000/docs 查看自动生成的API文档。

## 项目结构

```
AI工具箱/
├── src/                    # 前端源码
│   ├── components/          # 可复用组件
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
├── docker/                 # Docker配置文件
│   ├── Dockerfile.frontend # 前端Docker文件
│   ├── Dockerfile.backend  # 后端Docker文件
│   └── nginx.conf          # Nginx配置
├── package.json            # 前端依赖配置
├── vite.config.ts          # Vite构建配置
├── tailwind.config.js      # Tailwind CSS配置
├── tsconfig.json           # TypeScript配置
├── docker-compose.yml      # Docker Compose配置
├── .env.docker             # Docker环境变量
├── .gitignore              # Git忽略文件
└── README.md               # 项目说明
```

## 使用指南

### 合同审批功能
1. 进入合同审批页面
2. 选择合同类型（采购合同、销售合同、服务合同等）
3. 上传合同文件（支持拖拽或点击上传）
4. 点击"开始审批"按钮
5. 查看AI生成的审批建议，包括：
   - 风险等级评估（高、中、低风险颜色标识）
   - 合规性分析
   - 具体建议和改进意见
6. 可选择导出审批结果为DOCX文档

### 翻译功能
1. 进入翻译页面
2. 选择源语言和目标语言（支持多种语言互译）
3. 输入需要翻译的文本（支持长文本）
4. 点击翻译按钮获取结果
5. 查看AI生成的翻译结果，包括：
   - 翻译文本
   - 置信度评分
   - 语音朗读功能
   - 一键复制功能

## 📈 API接口文档

### 合同审批API
```
POST /api/contract-review
Content-Type: multipart/form-data

参数：
- file: 合同文件（必需）
- contract_type: 合同类型（必需）

响应：
{
  "suggestions": "审批建议内容",
  "risk_level": "风险等级",
  "compliance_score": "合规性评分"
}
```

### 翻译API
```
POST /api/translate
Content-Type: application/json

参数：
{
  "text": "待翻译文本",
  "source_language": "源语言",
  "target_language": "目标语言"
}

响应：
{
  "translation": "翻译结果",
  "confidence": "置信度评分"
}
```

## 📝 更新日志

### v1.2.0 (2024-01-XX)
**新功能**
- ✨ 添加风险评估可视化，支持风险等级颜色标识
- ✨ 新增翻译置信度显示功能
- ✨ 支持多语言翻译（中文、英语、日语、韩语、法语、德语、西班牙语）
- ✨ 添加翻译结果语音朗读功能
- ✨ 新增一键复制翻译结果功能
- ✨ 支持源语言和目标语言快速切换
- ✨ 添加常用翻译场景快捷选项
- ✨ 新增合同关键指标自动解析和显示
- ✨ 支持更多文件格式上传（PDF、DOC、DOCX、TXT）
- ✨ 添加文件大小限制（最大10MB）

**问题修复**
- 🐛 修复翻译API响应字段解析错误
- 🐛 修复语言参数映射问题
- 🐛 修复Dify API参数字段名称不匹配问题
- 🐛 优化前端语言名称映射逻辑
- 🐛 修复翻译功能在特定语言组合下的错误

**性能优化**
- ⚡ 优化翻译请求处理逻辑
- ⚡ 改进错误处理和用户反馈
- ⚡ 优化文件上传验证机制
- ⚡ 提升合同审批结果解析准确性

### v1.1.0 (2024-01-XX)
**新功能**
- ✨ 添加Docker容器化部署支持
- ✨ 新增DOCX文档导出功能
- ✨ 支持拖拽文件上传
- ✨ 添加Markdown格式审批结果显示

### v1.0.0 (2024-01-XX)
**初始版本**
- 🎉 基础合同审批功能
- 🎉 基础翻译功能
- 🎉 React + TypeScript + Vite前端架构
- 🎉 FastAPI后端服务
- 🎉 Dify AI服务集成

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues：[GitHub Issues](https://github.com/fpquenya/AI-Assistant/issues)
- 邮箱：your-email@example.com

---

⭐ 如果这个项目对你有帮助，请给它一个星标！