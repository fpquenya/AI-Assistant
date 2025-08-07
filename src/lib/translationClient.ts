// 翻译API客户端封装
export interface TranslationResult {
  success: boolean;
  data: {
    translatedText: string;
    confidence: number;
  };
  message?: string;
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
        console.error('翻译API调用失败:', response.status, response.statusText, errorText);
        throw new Error(`翻译失败: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('翻译成功:', result);
      
      return result;
    } catch (error) {
      console.error('翻译失败:', error);
      
      let errorMessage = 'API调用失败，请稍后重试';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (error.message.includes('400')) {
          errorMessage = `请求参数错误: ${error.message}`;
        } else if (error.message.includes('网络') || error.message.includes('fetch')) {
          errorMessage = '网络连接失败，请检查网络连接和后端服务状态';
        }
      }
      
      return {
        success: false,
        data: {
          translatedText: '',
          confidence: 0
        },
        message: errorMessage
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