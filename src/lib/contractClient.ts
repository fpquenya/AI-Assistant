// 合同审批API客户端封装
export interface ContractReviewResult {
  success: boolean;
  data: {
    riskLevel: 'low' | 'medium' | 'high';
    suggestions: string[];
    issues: string[];
    riskScore?: number;     // 风险评分 (0-100)
    safetyIndex?: number;   // 安全指数 (0-100)
    complianceRate?: number; // 合规率 (0-100)
  };
  message?: string;
}

export interface DifyResponse {
  event?: string;
  task_id?: string;
  id?: string;
  message_id?: string;
  conversation_id?: string;
  answer?: string;
  created_at?: number;
  data?: {
    outputs?: {
      text?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
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

class ContractClient {
  private baseURL = 'http://localhost:8000';
  
  constructor() {
    this.baseURL = 'http://localhost:8000';
  }
  
  // 移除了直接调用Dify的方法，改为调用Python后端
  
  /**
   * 合同审批功能
   */
  async contractReview(file: File, contractType: string): Promise<ContractReviewResult> {
    try {
      console.log('开始合同审批流程，文件:', file.name, file.type, file.size);
      
      // 调用Python后端API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('contract_type', contractType);
      
      const response = await fetch(`${this.baseURL}/api/contract/review`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('合同审批API调用失败:', response.status, response.statusText, errorText);
        throw new Error(`合同审批失败: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('合同审批成功:', result);
      
      return result;
    } catch (error) {
      console.error('合同审批失败:', error);
      
      let errorMessage = 'API调用失败，请稍后重试';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // 根据错误类型提供更具体的提示
        if (error.message.includes('413')) {
          errorMessage = '文件过大，请选择较小的文件';
        } else if (error.message.includes('400')) {
          errorMessage = `请求参数错误: ${error.message}`;
        } else if (error.message.includes('网络') || error.message.includes('fetch')) {
          errorMessage = '网络连接失败，请检查网络连接和后端服务状态';
        }
      }
      
      console.error('详细错误信息:', {
        message: errorMessage,
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
   * 检查API连接状态
   */
  async checkConnection(): Promise<boolean> {
    try {
      // 调用Python后端的健康检查端点
      const response = await fetch(`${this.baseURL}/health`);
      
      return response.ok;
    } catch (error) {
      console.error('API连接检查失败:', error);
      return false;
    }
  }
}

// 创建单例实例
export const contractClient = new ContractClient();
export default contractClient;