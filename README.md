# AI工具箱

一个基于AI的多功能工具箱，包含翻译和合同审批功能。

## 功能特性

### 🌐 智能翻译
- 支持多种语言互译
- 基于Dify AI平台的高质量翻译
- 简洁直观的用户界面

### 📋 合同审批
- 智能合同风险评估
- 多维度评分系统：
  - 风险评分 (0-100分)
  - 安全指数 (0-100分)
  - 合规率 (0-100%)
- 详细的审批建议和风险提示

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

### AI服务
- **Dify AI平台** - 提供翻译和合同审批AI能力

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
├── frontend/                 # 前端代码
│   ├── src/
│   │   ├── components/      # 组件
│   │   ├── pages/          # 页面
│   │   ├── lib/            # 工具库
│   │   └── types/          # 类型定义
│   └── public/             # 静态资源
├── backend/                 # 后端代码
│   ├── main.py             # 主应用文件
│   └── requirements.txt    # Python依赖
├── docs/                   # 文档
├── docker-compose.yml      # Docker编排
├── Dockerfile.frontend     # 前端Docker文件
├── Dockerfile.backend      # 后端Docker文件
└── nginx.conf             # Nginx配置
```

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