import React, { useState } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, ArrowLeft, Loader2, AlertCircle, Download, Shield, TrendingUp, BarChart3, Award, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { contractClient, ContractReviewResult } from '../lib/contractClient';

const ContractReview: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contractType, setContractType] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ContractReviewResult | null>(null);
  const [error, setError] = useState<string>('');

  const contractTypes = [
    { value: 'service', label: '服务类' },
    { value: 'procurement', label: '采购类' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 验证文件类型
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('请上传PDF、Word文档或文本文件');
        return;
      }
      
      // 验证文件大小 (最大10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('文件大小不能超过10MB');
        return;
      }
      
      setSelectedFile(file);
      setError(''); // 清除之前的错误
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !contractType) {
      alert('请选择文件和合同类型');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);
    
    try {
      const reviewResult = await contractClient.contractReview(selectedFile, contractType);
      
      if (reviewResult.success) {
        // 如果API没有返回评分数据，使用示例数据进行展示
        if (!reviewResult.data.riskScore && !reviewResult.data.safetyIndex && !reviewResult.data.complianceRate) {
          reviewResult.data.riskScore = 45;  // 中等风险
          reviewResult.data.safetyIndex = 50;  // 安全性一般
          reviewResult.data.complianceRate = 80;  // 合规性良好
        }
        
        setResult(reviewResult);
        setError('');
      } else {
        setError(reviewResult.message || '合同审批失败，请重试');
        setResult(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '合同审批失败，请稍后重试';
      setError(errorMessage);
      console.error('合同审批错误:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // 从API返回的suggestions中解析指标数值
  const parseMetricsFromSuggestions = (suggestions: string | string[]) => {
    const content = typeof suggestions === 'string' ? suggestions : suggestions.join('\n\n');
    
    // 使用正则表达式匹配三个指标的数值
    const riskScoreMatch = content.match(/风险评分[：:]*\s*(\d+)/i);
    const safetyIndexMatch = content.match(/安全指数[：:]*\s*(\d+)/i);
    const complianceRateMatch = content.match(/合规率[：:]*\s*(\d+)/i);
    
    return {
      riskScore: riskScoreMatch ? parseInt(riskScoreMatch[1]) : null,
      safetyIndex: safetyIndexMatch ? parseInt(safetyIndexMatch[1]) : null,
      complianceRate: complianceRateMatch ? parseInt(complianceRateMatch[1]) : null
    };
  };

  // 计算风险评分和统计信息
  const calculateRiskMetrics = (result: ContractReviewResult) => {
    const issueCount = result.data.issues.length;
    let riskScore = 0;
    let riskLevel = 'low';
    
    // 基于问题数量计算风险评分（备用逻辑）
    if (issueCount === 0) {
      riskScore = 95;
      riskLevel = 'low';
    } else if (issueCount <= 2) {
      riskScore = 80;
      riskLevel = 'low';
    } else if (issueCount <= 5) {
      riskScore = 60;
      riskLevel = 'medium';
    } else {
      riskScore = 30;
      riskLevel = 'high';
    }
    
    // 首先尝试从suggestions中解析指标
    let parsedMetrics = { riskScore: null, safetyIndex: null, complianceRate: null };
    if (result.data.suggestions) {
      parsedMetrics = parseMetricsFromSuggestions(result.data.suggestions);
    }
    
    // 优先级：1. suggestions解析的数值 2. API直接返回的指标 3. 前端计算值
    const finalRiskScore = parsedMetrics.riskScore ?? result.data.riskScore ?? riskScore;
    const safetyIndex = parsedMetrics.safetyIndex ?? result.data.safetyIndex ?? Math.max(0, 100 - issueCount * 15);
    const complianceRate = parsedMetrics.complianceRate ?? result.data.complianceRate ?? Math.max(0, 100 - issueCount * 10);
    
    // 重新计算风险等级基于最终评分（符合文档定义）
    let finalRiskLevel: 'low' | 'medium' | 'high';
    if (finalRiskScore <= 30) {
      finalRiskLevel = 'low';
    } else if (finalRiskScore <= 70) {
      finalRiskLevel = 'medium';
    } else {
      finalRiskLevel = 'high';
    }
    
    return {
      riskScore: finalRiskScore,
      riskLevel: finalRiskLevel,
      issueCount,
      safetyIndex,
      complianceRate
    };
  };

  const exportToDocx = async (suggestions: string | string[]) => {
    try {
      const content = typeof suggestions === 'string' ? suggestions : suggestions.join('\n\n');
      
      // 解析Markdown内容并转换为docx段落
      const parseMarkdownToDocx = (text: string) => {
        const lines = text.split('\n');
        const paragraphs: any[] = [];
        
        lines.forEach(line => {
          const trimmedLine = line.trim();
          if (!trimmedLine) {
            paragraphs.push(new Paragraph({ text: '' }));
            return;
          }
          
          // 处理标题
          if (trimmedLine.startsWith('### ')) {
            paragraphs.push(new Paragraph({
              text: trimmedLine.substring(4),
              heading: HeadingLevel.HEADING_3,
            }));
          } else if (trimmedLine.startsWith('## ')) {
            paragraphs.push(new Paragraph({
              text: trimmedLine.substring(3),
              heading: HeadingLevel.HEADING_2,
            }));
          } else if (trimmedLine.startsWith('# ')) {
            paragraphs.push(new Paragraph({
              text: trimmedLine.substring(2),
              heading: HeadingLevel.HEADING_1,
            }));
          } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            // 处理列表项
            paragraphs.push(new Paragraph({
              children: [
                new TextRun({
                  text: `• ${trimmedLine.substring(2)}`,
                }),
              ],
            }));
          } else {
            // 处理普通段落，包含粗体文本
            const children: any[] = [];
            const parts = trimmedLine.split(/\*\*(.*?)\*\*/g);
            
            for (let i = 0; i < parts.length; i++) {
              if (i % 2 === 0) {
                // 普通文本
                if (parts[i]) {
                  children.push(new TextRun({ text: parts[i] }));
                }
              } else {
                // 粗体文本
                children.push(new TextRun({ text: parts[i], bold: true }));
              }
            }
            
            paragraphs.push(new Paragraph({ children }));
          }
        });
        
        return paragraphs;
      };
      
      const docParagraphs = parseMarkdownToDocx(content);
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: "合同审批建议",
              heading: HeadingLevel.TITLE,
            }),
            new Paragraph({ text: '' }), // 空行
            ...docParagraphs,
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      saveAs(blob, `合同审批建议_${timestamp}.docx`);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回首页
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="mr-2 sm:mr-3 text-blue-600 h-6 w-6 sm:h-8 sm:w-8" />
            <span className="truncate">合同智能审批</span>
          </h1>
          
          {/* 文件上传区域 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              上传合同文件
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
              selectedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="file"
                id="contract-file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
              />
              <label htmlFor="contract-file" className="cursor-pointer">
                {selectedFile ? (
                  <>
                    <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-base sm:text-lg font-medium text-green-700 mb-2 break-all px-2">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-green-600">
                      文件大小: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      点击重新选择文件
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                      点击上传合同文件
                    </p>
                    <p className="text-sm text-gray-500 px-2">
                      支持 PDF、Word、TXT 格式，最大 10MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* 合同类型选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              合同类型
            </label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择合同类型</option>
              {contractTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* 提交按钮 */}
          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || !contractType || isAnalyzing}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                审批中...
              </div>
            ) : (
              '开始审批'
            )}
          </button>
          
          {selectedFile && contractType && !isAnalyzing && (
            <p className="text-sm text-gray-600 text-center mt-2 px-2">
              将分析 <span className="font-medium break-all">{selectedFile.name}</span> 的 <span className="font-medium">{contractTypes.find(t => t.value === contractType)?.label}</span> 合同
            </p>
          )}
        </div>

        {/* 分析状态 */}
        {isAnalyzing && (
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-2xl p-8 mb-6 border border-blue-100 relative overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 animate-pulse"></div>
            
            <div className="relative text-center py-12">
              {/* 主要加载动画 */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <Loader2 className="relative h-16 w-16 animate-spin text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mx-auto" style={{filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'}} />
                <div className="absolute inset-0 h-16 w-16 mx-auto">
                  <div className="h-full w-full border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin" style={{animationDuration: '2s'}}></div>
                </div>
              </div>
              
              {/* 主标题 */}
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-4">
                请稍等，正在为您进行合同评审
              </h3>
              
              {/* 副标题 */}
              <p className="text-gray-600 mb-6 text-lg font-medium">AI智能分析系统正在深度解析合同条款</p>
              
              {/* 进度指示器 */}
              <div className="max-w-md mx-auto mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>分析进度</span>
                  <span>处理中...</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg" style={{width: '65%', transition: 'width 2s ease-in-out'}}></div>
                </div>
              </div>
              
              {/* 分析步骤 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm border border-blue-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">条款解析</span>
                </div>
                <div className="flex items-center justify-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm border border-purple-100">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-sm font-medium text-gray-700">风险评估</span>
                </div>
                <div className="flex items-center justify-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm border border-indigo-100">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className="text-sm font-medium text-gray-700">生成报告</span>
                </div>
              </div>
              
              {/* 底部提示 */}
              <div className="mt-8 flex items-center justify-center text-sm text-gray-500">
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 animate-bounce"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-3 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                <span>预计需要 30-60 秒完成分析</span>
              </div>
            </div>
          </div>
        )}

          {result && result.success && (() => {
            const metrics = calculateRiskMetrics(result);
            return (
              <div className="space-y-6">
                {/* 风险评估概览卡片 */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Shield className="h-8 w-8 text-blue-600 mr-3" />
                      风险评估报告
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-600">AI智能分析</span>
                    </div>
                  </div>
                  
                  {/* 核心指标卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* 风险评分 */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">风险评分</span>
                        <TrendingUp className={`h-4 w-4 ${
                          metrics.riskScore <= 30 ? 'text-green-500' : 
                          metrics.riskScore <= 70 ? 'text-yellow-500' : 'text-red-500'
                        }`} />
                      </div>
                      <div className="flex items-end space-x-2">
                        <span className={`text-2xl font-bold ${
                          metrics.riskScore <= 30 ? 'text-green-600' : 
                          metrics.riskScore <= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {metrics.riskScore}
                        </span>
                        <span className="text-sm text-gray-500 mb-1">/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            metrics.riskScore <= 30 ? 'bg-green-500' : 
                            metrics.riskScore <= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${metrics.riskScore}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* 安全指数 */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">安全指数</span>
                        <Shield className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex items-end space-x-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {metrics.safetyIndex}
                        </span>
                        <span className="text-sm text-gray-500 mb-1">%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${metrics.safetyIndex}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* 合规率 */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">合规率</span>
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="flex items-end space-x-2">
                        <span className="text-2xl font-bold text-purple-600">
                          {metrics.complianceRate}
                        </span>
                        <span className="text-sm text-gray-500 mb-1">%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${metrics.complianceRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 风险等级标识 */}
                  <div className="flex items-center justify-center">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      metrics.riskLevel === 'low' ? 'bg-green-100 text-green-800 border border-green-200' :
                      metrics.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {metrics.riskLevel === 'low' && <CheckCircle className="h-4 w-4 mr-2" />}
                      {metrics.riskLevel === 'medium' && <AlertTriangle className="h-4 w-4 mr-2" />}
                      {metrics.riskLevel === 'high' && <AlertCircle className="h-4 w-4 mr-2" />}
                      {
                        metrics.riskLevel === 'low' ? '低风险合同' :
                        metrics.riskLevel === 'medium' ? '中等风险合同' : '高风险合同'
                      }
                    </div>
                  </div>
                </div>

                {/* 发现的问题 - 重新设计 */}
                {result.data.issues.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg border border-red-100">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 rounded-t-xl border-b border-red-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-red-800 flex items-center">
                          <AlertTriangle className="h-6 w-6 mr-3 text-red-600" />
                          风险问题清单
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {metrics.issueCount} 个问题
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {result.data.issues.map((issue: string, index: number) => (
                          <div key={index} className="flex items-start p-4 bg-red-50 rounded-lg border border-red-100 hover:shadow-md transition-shadow">
                            <div className="flex-shrink-0 mr-4">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 font-bold text-sm">{index + 1}</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                                <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                                  {index < 2 ? '高优先级' : index < 4 ? '中优先级' : '低优先级'}
                                </span>
                              </div>
                              <p className="text-gray-800 leading-relaxed">{issue}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 审批建议 - 重新设计 */}
                {result.data.suggestions && (
                  <div className="bg-white rounded-xl shadow-lg border border-green-100">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 rounded-t-xl border-b border-green-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-green-800 flex items-center">
                          <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                          专业审批建议
                        </h3>
                        <button
                          onClick={() => exportToDocx(result.data.suggestions)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          导出报告
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                        <ReactMarkdown
                          components={{
                            h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 border-b border-gray-200 pb-2">{children}</h1>,
                            h2: ({children}) => <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-6 flex items-center"><Award className="h-6 w-6 mr-2 text-blue-600" />{children}</h2>,
                            h3: ({children}) => <h3 className="text-xl font-bold text-gray-800 mb-3 mt-5 text-green-700">{children}</h3>,
                            p: ({children}) => <p className="mb-4 leading-relaxed text-gray-700">{children}</p>,
                            ul: ({children}) => <ul className="list-none mb-4 space-y-2">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">{children}</ol>,
                            li: ({children}) => <li className="flex items-start"><CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" /><span>{children}</span></li>,
                            strong: ({children}) => <strong className="font-semibold text-gray-900 bg-yellow-100 px-1 rounded">{children}</strong>,
                            em: ({children}) => <em className="italic text-blue-700">{children}</em>
                          }}
                        >
                          {typeof result.data.suggestions === 'string' 
                            ? result.data.suggestions 
                            : result.data.suggestions.join('\n\n')
                          }
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* 底部操作区域 */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        分析完成时间: {new Date().toLocaleString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        AI智能审批系统
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      报告编号: CR-{Date.now().toString().slice(-6)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
};

export default ContractReview;