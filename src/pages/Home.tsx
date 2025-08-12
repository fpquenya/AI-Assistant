import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Languages, ArrowRight, Sparkles } from 'lucide-react';

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
          
          {/* DingTalk AI Assistant */}
          <div className="mb-16">
            <iframe 
              src="https://agent.dingtalk.com/copilot?code=GJ8mrGlJQC&channel=" 
              style={{width: '100%', height: '100%', minHeight: '700px'}} 
              frameBorder="0" 
              allow="microphone"
            >
            </iframe>
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




    </div>
  );
};

export default Home;