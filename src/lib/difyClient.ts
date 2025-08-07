// Dify API客户端封装
export interface ContractReviewResult {
  success: boolean;
  data: {
    riskLevel: 'low' | 'medium' | 'high';
    suggestions: string[];
    issues: string[];
  };
  message?: string;
}

export interface TranslationResult {
  success: boolean;
  data: {
    translatedText: string;
    confidence: number;
  };
  message?: string;
}

export interface DifyResponse {
  event: string;
  task_id: string;
  id: string;
  message_id: string;
  conversation_id: string;
  answer: string;
  created_at: number;
  [key: string]: any;
}

export interface FileUploadResponse {
  id: string;
  name: string;
  size: number;
  extension: string;
  mime_type: string;
  created_by: string;
  created_at: number;
}

class DifyClient {
  private baseURL = 'http://113.45.43.33/v1';
  private contractApiKey = 'app-WFfmK3NfqwSUf87JNJ3VJGHA';
  private translationApiKey = 'app-0MyT6ZEiwiQO9KIidL6gB1EO';
  private contractWorkflowId = '17b1dba4-7442-4504-832a-dfa19774cbe5';
  
  constructor() {
    this.baseURL = 'http://113.45.43.33/v1';
    this.contractApiKey = 'app-WFfmK3NfqwSUf87JNJ3VJGHA';
    this.translationApiKey = 'app-0MyT6ZEiwiQO9KIidL6gB1EO';
  }
  
  /**
   * 上传文件到Dify
   */
  private async uploadFile(file: File, apiKey: string): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', 'ai-toolbox-user');
    formData.append('type', 'TXT');
    
    const response = await fetch(`${this.baseURL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('文件上传失败:', response.status, response.statusText, errorText);
      throw new Error(`文件上传失败: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  }

  /**
   * 通用工作流调用方法
   */
  private async callWorkflow(
    inputs: Record<string, any>, 
    apiKey: string,
    fileIds?: string[]
  ): Promise<DifyResponse> {
    const requestBody: any = {
      inputs,
      response_mode: 'blocking',
      user: 'ai-toolbox-user'
    };
    
    // 添加文件引用
    if (fileIds && fileIds.length > 0) {
      requestBody.files = fileIds.map(fileId => ({
        type: 'document',
        transfer_method: 'local_file',
        upload_file_id: fileId
      }));
    }
    
    const response = await fetch(`${this.baseURL}/workflows/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('工作流调用失败:', response.status, response.statusText, errorText);
      throw new Error(`工作流调用失败: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  }
  
  /**
   * 合同审批功能
   */
  async contractReview(file: File, contractType: string): Promise<ContractReviewResult> {
    try {
      console.log('开始合同审批流程，文件:', file.name, file.type, file.size);
      
      // 第一步：上传文件到Dify，获取文件ID
      console.log('步骤1: 上传文件到Dify...');
      const uploadResult = await this.uploadFile(file, this.contractApiKey);
      console.log('文件上传成功，文件ID:', uploadResult.id);
      
      // 第二步：调用工作流，将文件对象作为hetong参数传递
      console.log('步骤2: 调用合同审批工作流...');
      const workflowInputs = {
        hetong: [{
          type: 'document',
          transfer_method: 'local_file',
          upload_file_id: uploadResult.id
        }],
        HTtype: '服务类'
      };
      
      const result = await this.callWorkflow(
        workflowInputs,
        this.contractApiKey
      );
      
      console.log('工作流调用成功:', result);
      
      // 直接返回API的原始内容
      if (result.data && result.data.outputs && result.data.outputs.text) {
        return {
          success: true,
          data: {
            riskLevel: 'medium',
            suggestions: [result.data.outputs.text],
            issues: []
          }
        };
      }
      
      console.error('Dify响应格式错误:', result);
      throw new Error('未收到有效的审批结果');
    } catch (error) {
      console.error('合同审批失败:', error);
      
      let errorMessage = 'API调用失败，请稍后重试';
      let detailedError = '';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        detailedError = error.stack || '';
        
        // 根据错误类型提供更具体的提示
        if (error.message.includes('415')) {
          // 415错误可能有多种原因，不一定是文件格式问题
          errorMessage = `API请求格式错误 (415)。详细信息: ${error.message}`;
          console.error('415错误详情:', {
            originalError: error.message,
            fileType: file.type,
            fileName: file.name,
            fileSize: file.size
          });
        } else if (error.message.includes('413')) {
          errorMessage = '文件过大，请选择较小的文件';
        } else if (error.message.includes('401')) {
          errorMessage = 'API密钥无效，请检查配置';
        } else if (error.message.includes('400')) {
          // 400错误通常包含具体的参数错误信息
          errorMessage = `请求参数错误: ${error.message}`;
        } else if (error.message.includes('网络')) {
          errorMessage = '网络连接失败，请检查网络连接';
        }
      }
      
      console.error('详细错误信息:', {
        message: errorMessage,
        stack: detailedError,
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size
        },
        contractType,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: false,
        data: {
          riskLevel: 'high',
          suggestions: [],
          issues: [errorMessage]
        },
        message: errorMessage
      };
    }
  }
  

  
  /**
   * 翻译功能
   */
  async translate(
    text: string, 
    sourceLang: string, 
    targetLang: string
  ): Promise<TranslationResult> {
    try {
      const inputs = {
        text: text,
        source_language: sourceLang,
        target_language: targetLang
      };
      
      const response = await this.callWorkflow(
        inputs,
        this.translationApiKey
      );
      
      // 解析Dify响应
      if (response.answer) {
        try {
          // 尝试解析JSON响应
          const parsedAnswer = JSON.parse(response.answer);
          return {
            success: true,
            data: {
              translatedText: parsedAnswer.translatedText || parsedAnswer.translation || response.answer,
              confidence: parsedAnswer.confidence || 0.95
            }
          };
        } catch (parseError) {
          // 如果不是JSON格式，直接使用answer作为翻译结果
          return {
            success: true,
            data: {
              translatedText: response.answer,
              confidence: 0.90
            }
          };
        }
      }
      
      throw new Error('未收到有效的翻译结果');
    } catch (error) {
      console.error('翻译API调用失败:', error);
      return {
        success: false,
        data: {
          translatedText: '',
          confidence: 0
        },
        message: error instanceof Error ? error.message : '未知错误'
      };
    }
  }
  
  /**
   * 检查API连接状态
   */
  async checkConnection(): Promise<boolean> {
    try {
      // 发送一个简单的测试请求
      const response = await fetch(`${this.baseURL}/workflows/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.contractApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: { test: 'connection' },
          response_mode: 'blocking',
          user: 'test-user'
        })
      });
      
      return response.status !== 404; // 404表示服务不存在，其他状态码表示服务可达
    } catch (error) {
      console.error('API连接检查失败:', error);
      return false;
    }
  }
}

// 创建单例实例
export const difyClient = new DifyClient();
export default difyClient;