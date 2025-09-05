// 翻译API客户端封装
export interface TranslationResult {
  success: boolean;
  data: {
    translatedText: string;
    confidence: number;
  };
  message?: string;
  errorDetails?: {
    httpStatus?: number;
    httpStatusText?: string;
    responseBody?: string;
    requestUrl?: string;
    requestMethod?: string;
    requestHeaders?: Record<string, string>;
    requestBody?: string;
    timestamp?: string;
  };
}

// 翻译API响应接口

export class TranslationClient {
  private baseURL: string;

  constructor() {
    this.baseURL = 'http://localhost:8000';
  }


  
  /**
   * 翻译功能
   */
  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<TranslationResult> {
    try {
      console.log('开始翻译，文本:', text, '源语言:', sourceLanguage, '目标语言:', targetLanguage);
      
      const response = await fetch(`${this.baseURL}/api/translation/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          source_language: sourceLanguage,
          target_language: targetLanguage
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        const errorDetails = {
          httpStatus: response.status,
          httpStatusText: response.statusText,
          responseBody: errorText,
          requestUrl: `${this.baseURL}/api/translation/translate`,
          requestMethod: 'POST',
          requestHeaders: {
            'Content-Type': 'application/json'
          },
          requestBody: JSON.stringify({
            text: text,
            source_language: sourceLanguage,
            target_language: targetLanguage
          }),
          timestamp: new Date().toISOString()
        };
        
        console.error('翻译API调用失败:', errorDetails);
        
        const error = new Error(`翻译失败: ${response.status} ${response.statusText} - ${errorText}`);
        (error as any).errorDetails = errorDetails;
        throw error;
      }
      
      const result = await response.json();
      console.log('翻译成功:', result);
      
      return result;
    } catch (error) {
      console.error('翻译失败:', error);
      
      let errorMessage = 'API调用失败，请稍后重试';
      let errorDetails: any = {
        timestamp: new Date().toISOString(),
        requestUrl: `${this.baseURL}/api/translation/translate`,
        requestMethod: 'POST'
      };
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // 检查是否有详细的HTTP错误信息
        if ((error as any).errorDetails) {
          errorDetails = { ...errorDetails, ...(error as any).errorDetails };
        }
        
        if (error.message.includes('400')) {
          errorMessage = `请求参数错误: ${error.message}`;
        } else if (error.message.includes('401')) {
          errorMessage = `认证失败: ${error.message}`;
        } else if (error.message.includes('403')) {
          errorMessage = `权限不足: ${error.message}`;
        } else if (error.message.includes('404')) {
          errorMessage = `API接口不存在: ${error.message}`;
        } else if (error.message.includes('500')) {
          errorMessage = `服务器内部错误: ${error.message}`;
        } else if (error.message.includes('502') || error.message.includes('503') || error.message.includes('504')) {
          errorMessage = `服务器暂时不可用: ${error.message}`;
        } else if (error.message.includes('网络') || error.message.includes('fetch') || error.name === 'TypeError') {
          errorMessage = '网络连接失败，请检查网络连接和后端服务状态';
          errorDetails.networkError = true;
        }
      }
      
      return {
        success: false,
        data: {
          translatedText: '',
          confidence: 0
        },
        message: errorMessage,
        errorDetails: errorDetails
      };
    }
  }
  
  /**
   * 检查连接状态
   */
  async checkConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/translation/check`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`连接检查失败: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      return {
        success: true,
        message: result.message || '翻译API连接正常'
      };
    } catch (error) {
      console.error('连接检查失败:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '连接检查失败'
      };
    }
  }
}

// 创建单例实例
export const translationClient = new TranslationClient();
export default translationClient;