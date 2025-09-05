import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Copy, Volume2, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translationClient, TranslationResult as DifyTranslationResult } from '../lib/translationClient';

// 使用从 translationClient 导入的 TranslationResult 类型

const Translator: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<string>('en');
  const [targetLang, setTargetLang] = useState<string>('zh');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DifyTranslationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [, setConfidence] = useState(0);

  // 源语言选项：英语和中文
  const sourceLanguages = [
    { code: 'en', name: '英语', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  // 目标语言选项：中文和英语
  const targetLanguages = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: '英语', flag: '🇺🇸' }
  ];

  // 保留完整语言列表用于其他功能
  const allLanguages = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: '英语', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ];

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (result) {
      setSourceText(result.data.translatedText);
      setResult(null);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('请输入要翻译的文本');
      return;
    }

    if (sourceLang === targetLang) {
      setError('源语言和目标语言不能相同');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);
    setConfidence(0);
    
    try {
      // 将语言代码转换为语言名称
      const sourceLanguageName = getLanguageName(sourceLang);
      const targetLanguageName = getLanguageName(targetLang);
      
      console.log('Translator.tsx - 语言代码转换:');
      console.log('- sourceLang代码:', sourceLang, '-> 名称:', sourceLanguageName);
      console.log('- targetLang代码:', targetLang, '-> 名称:', targetLanguageName);
      
      const apiResult = await translationClient.translate(sourceText, sourceLanguageName, targetLanguageName);
      
      console.log('Translator.tsx - API返回结果:', apiResult);
      console.log('Translator.tsx - 翻译文本:', apiResult?.data?.translatedText);
      console.log('Translator.tsx - API成功状态:', apiResult?.success);
      console.log('Translator.tsx - 完整数据结构:', JSON.stringify(apiResult, null, 2));
      
      if (apiResult.success) {
        console.log('Translator.tsx - 准备设置result状态');
        setResult(apiResult);
        setConfidence(apiResult.data.confidence || 0);
        setError('');
        console.log('Translator.tsx - 设置result成功:', apiResult);
        console.log('Translator.tsx - 翻译结果文本:', apiResult.data.translatedText);
        
        // 验证状态是否正确设置
        setTimeout(() => {
          console.log('Translator.tsx - 状态设置后验证 - result:', result);
        }, 100);
      } else {
        console.log('Translator.tsx - API返回失败，错误信息:', apiResult.message);
        setError(apiResult.message || '翻译失败，请重试');
        
        // 设置详细错误信息
        if (apiResult.errorDetails) {
          const errorInfo = {
            timestamp: new Date().toISOString(),
            apiUrl: apiResult.errorDetails.requestUrl || `http://127.0.0.1:8000/api/translation/translate`,
            requestParams: {
              text: sourceText,
              source_language: getLanguageName(sourceLang),
              target_language: getLanguageName(targetLang)
            },
            httpDetails: {
              status: apiResult.errorDetails.httpStatus,
              statusText: apiResult.errorDetails.httpStatusText,
              responseBody: apiResult.errorDetails.responseBody,
              requestMethod: apiResult.errorDetails.requestMethod,
              requestHeaders: apiResult.errorDetails.requestHeaders,
              requestBody: apiResult.errorDetails.requestBody
            },
            error: {
              message: apiResult.message || '未知错误',
              name: 'APIError'
            },
            userAgent: navigator.userAgent,
            currentUrl: window.location.href
          };
          setErrorDetails(errorInfo);
        }
        
        setResult(null);
        setConfidence(0);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '翻译服务暂时不可用，请稍后重试';
      setError(errorMessage);
      
      // 收集详细错误信息
      const errorInfo = {
        timestamp: new Date().toISOString(),
        apiUrl: `http://127.0.0.1:8000/api/translation/translate`,
        requestParams: {
          text: sourceText,
          source_language: getLanguageName(sourceLang),
          target_language: getLanguageName(targetLang)
        },
        error: {
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
          name: err instanceof Error ? err.name : 'UnknownError'
        },
        userAgent: navigator.userAgent,
        currentUrl: window.location.href
      };
      
      setErrorDetails(errorInfo);
      console.error('翻译错误详情:', errorInfo);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // 使用更友好的提示
      const button = event?.target as HTMLElement;
      const originalText = button.title;
      button.title = '已复制!';
      setTimeout(() => {
        button.title = originalText;
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制');
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      // 停止当前播放
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'zh' ? 'zh-CN' : 
                      lang === 'en' ? 'en-US' : 
                      lang === 'ja' ? 'ja-JP' :
                      lang === 'ko' ? 'ko-KR' :
                      lang === 'fr' ? 'fr-FR' :
                      lang === 'de' ? 'de-DE' :
                      lang === 'es' ? 'es-ES' : lang;
      utterance.rate = 0.8; // 稍慢的语速
      speechSynthesis.speak(utterance);
    } else {
      alert('您的浏览器不支持语音播放功能');
    }
  };

  const getLanguageName = (code: string) => {
    return allLanguages.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return allLanguages.find(lang => lang.code === code)?.flag || '🌐';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
            <Languages className="mr-2 sm:mr-3 text-blue-600 h-6 w-6 sm:h-8 sm:w-8" />
            <span className="truncate">智能翻译工具</span>
          </h1>
          
          {/* 语言选择器 */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                源语言
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sourceLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleSwapLanguages}
              className="sm:mt-6 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors order-last sm:order-none"
              title="交换语言"
            >
              <ArrowRightLeft className="h-5 w-5 transform sm:transform-none rotate-90 sm:rotate-0" />
            </button>
            
            <div className="w-full sm:flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目标语言
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {targetLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 翻译区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {getLanguageFlag(sourceLang)} {getLanguageName(sourceLang)}
                </label>
                <span className="text-xs text-gray-500">
                  {sourceText.length}/5000
                </span>
              </div>
              <div className="relative">
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value.slice(0, 5000))}
                  placeholder="请输入要翻译的文本..."
                  className="w-full h-32 sm:h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
                />
                <div className="absolute bottom-2 right-2 flex space-x-1">
                  {sourceText && (
                    <>
                      <button
                        onClick={() => speakText(sourceText, sourceLang)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="朗读"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(sourceText)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="复制"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 输出区域 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {getLanguageFlag(targetLang)} {getLanguageName(targetLang)}
                </label>
                {result && (
                  <span className="text-xs text-green-600">
                    置信度: {(result.data.confidence * 100).toFixed(1)}%
                  </span>
                )}
              </div>
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-md z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                    <span className="text-gray-600">翻译中...</span>
                  </div>
                )}
                <textarea
                  value={result?.data.translatedText || ''}
                  readOnly
                  placeholder={isLoading ? '翻译中...' : '翻译结果将显示在这里'}
                  className="w-full h-32 sm:h-40 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 resize-none text-sm sm:text-base"
                />
                <div className="absolute bottom-2 right-2 flex space-x-1">
                  {result?.data.translatedText && (
                    <>
                      <button
                        onClick={() => speakText(result.data.translatedText, targetLang)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="朗读"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(result.data.translatedText)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="复制"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="text-red-600 mr-2">⚠️</div>
                  <span className="text-red-700 font-medium">翻译失败</span>
                </div>
                <button
                  onClick={() => {
                    setError('');
                    setErrorDetails(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  关闭
                </button>
              </div>
              
              {/* 基本错误信息 */}
              <div className="mb-3">
                <p className="text-red-700 font-medium">错误信息：</p>
                <p className="text-red-600 text-sm bg-red-100 p-2 rounded mt-1">{error}</p>
              </div>
              
              {/* 详细错误信息 */}
              {errorDetails && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-red-700 font-medium hover:text-red-800">
                    查看详细错误信息 (用于调试)
                  </summary>
                  <div className="mt-2 p-3 bg-red-100 rounded text-xs font-mono">
                     <div className="mb-2">
                       <strong>时间：</strong> {errorDetails.timestamp}
                     </div>
                     <div className="mb-2">
                       <strong>API地址：</strong> {errorDetails.apiUrl}
                     </div>
                     
                     {/* HTTP状态信息 */}
                     {errorDetails.httpDetails && (
                       <div className="mb-2">
                         <strong>HTTP状态：</strong> 
                         <span className={`ml-1 px-2 py-1 rounded ${
                           errorDetails.httpDetails.status >= 500 ? 'bg-red-200 text-red-800' :
                           errorDetails.httpDetails.status >= 400 ? 'bg-orange-200 text-orange-800' :
                           'bg-gray-200 text-gray-800'
                         }`}>
                           {errorDetails.httpDetails.status} {errorDetails.httpDetails.statusText}
                         </span>
                       </div>
                     )}
                     
                     <div className="mb-2">
                       <strong>请求参数：</strong>
                       <pre className="mt-1 text-xs overflow-x-auto bg-white p-2 rounded border">
{JSON.stringify(errorDetails.requestParams, null, 2)}
                       </pre>
                     </div>
                     
                     {/* HTTP请求详情 */}
                     {errorDetails.httpDetails && (
                       <div className="mb-2">
                         <strong>HTTP请求详情：</strong>
                         <div className="mt-1 bg-white p-2 rounded border">
                           <div><strong>方法：</strong> {errorDetails.httpDetails.requestMethod}</div>
                           {errorDetails.httpDetails.requestHeaders && (
                             <div className="mt-1">
                               <strong>请求头：</strong>
                               <pre className="text-xs mt-1">
{JSON.stringify(errorDetails.httpDetails.requestHeaders, null, 2)}
                               </pre>
                             </div>
                           )}
                           {errorDetails.httpDetails.requestBody && (
                             <div className="mt-1">
                               <strong>请求体：</strong>
                               <pre className="text-xs mt-1 max-h-20 overflow-y-auto">
{errorDetails.httpDetails.requestBody}
                               </pre>
                             </div>
                           )}
                         </div>
                       </div>
                     )}
                     
                     {/* 服务器响应 */}
                     {errorDetails.httpDetails?.responseBody && (
                       <div className="mb-2">
                         <strong>服务器响应：</strong>
                         <pre className="mt-1 text-xs overflow-x-auto bg-white p-2 rounded border max-h-32 overflow-y-auto">
{errorDetails.httpDetails.responseBody}
                         </pre>
                       </div>
                     )}
                     
                     <div className="mb-2">
                       <strong>错误类型：</strong> {errorDetails.error.name}
                     </div>
                     <div className="mb-2">
                       <strong>错误消息：</strong> {errorDetails.error.message}
                     </div>
                     {errorDetails.error.stack && (
                       <div className="mb-2">
                         <strong>错误堆栈：</strong>
                         <pre className="mt-1 text-xs overflow-x-auto max-h-32 overflow-y-auto bg-white p-2 rounded border">
{errorDetails.error.stack}
                         </pre>
                       </div>
                     )}
                     <div className="mb-2">
                       <strong>浏览器：</strong> {errorDetails.userAgent}
                     </div>
                     <div>
                       <strong>当前页面：</strong> {errorDetails.currentUrl}
                     </div>
                   </div>
                </details>
              )}
              
              {/* 解决建议 */}
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 font-medium text-sm">💡 解决建议：</p>
                <ul className="text-yellow-700 text-sm mt-1 list-disc list-inside space-y-1">
                  <li>检查后端服务是否正常运行 (http://127.0.0.1:8000)</li>
                  <li>确认网络连接是否正常</li>
                  <li>检查浏览器控制台是否有CORS错误</li>
                  <li>验证API密钥配置是否正确</li>
                  <li>如果是部署环境，检查服务器配置和防火墙设置</li>
                </ul>
              </div>
            </div>
          )}

          {/* 翻译按钮 */}
          <div className="mt-6 text-center">
            <div className="space-y-3">
              <button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isLoading || sourceLang === targetLang}
                className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    翻译中...
                  </div>
                ) : (
                  '开始翻译'
                )}
              </button>
              
              {sourceText.trim() && !isLoading && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => {
                      setSourceText('');
                      setResult(null);
                      setError('');
                      setConfidence(0);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-sm sm:text-base"
                  >
                    清空
                  </button>
                  <button
                    onClick={() => {
                      const tempText = sourceText;
                       setSourceText(result?.data.translatedText || '');
                       setResult(null);
                       // Store original text for potential undo functionality
                       console.log('Original text stored:', tempText);
                      const tempLang = sourceLang;
                      setSourceLang(targetLang);
                      setTargetLang(tempLang);
                    }}
                    disabled={!result?.data.translatedText}
                    className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-md hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  >
                    反向翻译
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 快捷翻译建议 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">常用翻译</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { text: '你好，很高兴见到你', desc: '问候语' },
              { text: '请问这个多少钱？', desc: '购物用语' },
              { text: '我需要帮助', desc: '求助用语' },
              { text: '谢谢你的帮助', desc: '感谢用语' },
              { text: '对不起，我不明白', desc: '道歉用语' },
              { text: '请再说一遍', desc: '请求重复' },
              { text: 'Hello', desc: 'Greeting' },
              { text: 'Thank you', desc: 'Thanks' },
              { text: 'Goodbye', desc: 'Farewell' },
              { text: 'Excuse me', desc: 'Polite phrase' },
              { text: 'Sorry', desc: 'Apology' },
              { text: 'No problem', desc: 'Response' }
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setSourceText(item.text);
                  // 自动检测语言
                  if (/[\u4e00-\u9fa5]/.test(item.text)) {
                    setSourceLang('zh');
                    setTargetLang('en');
                  } else {
                    setSourceLang('en');
                    setTargetLang('zh');
                  }
                }}
                className="text-left p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="font-medium text-gray-800">{item.text}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;