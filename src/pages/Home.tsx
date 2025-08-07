import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Languages, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const tools = [
    {
      id: 'contract-review',
      title: '合同智能审批',
      description: '上传合同文件，AI智能分析风险等级，提供专业审批建议',
      icon: FileText,
      path: '/contract-review',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      features: ['风险评估', '条款分析', '合规检查']
    },
    {
      id: 'translator',
      title: '智能翻译工具',
      description: '支持多语言互译，高精度翻译，实时语音朗读',
      icon: Languages,
      path: '/translator',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      features: ['多语言支持', '高精度翻译', '语音朗读']
    }
  ];

  const stats = [
    { label: '累计处理文档', value: '10,000+', icon: FileText },
    { label: '翻译准确率', value: '99.5%', icon: Shield },
    { label: '处理速度', value: '< 3秒', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI工具箱</h1>
                <p className="text-sm text-gray-600">智能办公，高效便捷</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Powered by Dify AI
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            智能AI工具，让工作更
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              高效
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            集成先进的人工智能技术，为您提供合同审批、文档翻译等专业服务，
            让复杂的工作变得简单高效。
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">选择您需要的工具</h3>
            <p className="text-lg text-gray-600">点击下方工具卡片，开始您的智能办公之旅</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="group block"
                >
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className={`${tool.color} p-4 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {tool.title}
                        </h4>
                        <p className="text-gray-600 mb-4">{tool.description}</p>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tool.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                          立即使用
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们</h3>
            <p className="text-lg text-gray-600">先进的AI技术，为您提供专业可靠的服务</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">安全可靠</h4>
              <p className="text-gray-600">企业级安全保障，数据加密传输，保护您的隐私</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">高效快速</h4>
              <p className="text-gray-600">AI智能处理，秒级响应，大幅提升工作效率</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">智能精准</h4>
              <p className="text-gray-600">基于先进算法，提供精准分析和专业建议</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <span className="text-xl font-bold">AI工具箱</span>
          </div>
          <p className="text-gray-400">
            © 2024 AI工具箱. 让智能AI为您的工作赋能.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;