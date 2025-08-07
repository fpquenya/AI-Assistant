import React, { useState } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, ArrowLeft, Loader2, AlertCircle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { difyClient, ContractReviewResult } from '../lib/difyClient';

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
      const reviewResult = await difyClient.contractReview(selectedFile, contractType);
      
      if (reviewResult.success) {
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
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">正在分析合同内容...</p>
              <p className="text-sm text-gray-500 mt-2">这可能需要几秒钟时间...</p>
            </div>
          </div>
        )}

          {result && result.success && (
            <div className="space-y-6">
              {/* 审批建议 */}
              {result.data.suggestions && (
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-green-700">审批建议</h3>
                    <button
                      onClick={() => exportToDocx(result.data.suggestions)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      导出DOCX
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-6">{children}</h1>,
                        h2: ({children}) => <h2 className="text-2xl font-bold text-gray-800 mb-3 mt-5">{children}</h2>,
                        h3: ({children}) => <h3 className="text-xl font-bold text-gray-800 mb-2 mt-4">{children}</h3>,
                        p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                        li: ({children}) => <li className="ml-2">{children}</li>,
                        strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                        em: ({children}) => <em className="italic">{children}</em>
                      }}
                    >
                      {typeof result.data.suggestions === 'string' 
                        ? result.data.suggestions 
                        : result.data.suggestions.join('\n\n')
                      }
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* 发现的问题 */}
              {result.data.issues.length > 0 && (
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4 text-red-700">发现的问题</h3>
                  <ul className="space-y-2">
                    {result.data.issues.map((issue: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default ContractReview;