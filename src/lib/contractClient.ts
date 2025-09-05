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
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
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
  
  /**
   * 网络诊断工具
   */
  async diagnoseConnection(): Promise<{
    canReachServer: boolean;
    serverStatus: string;
    networkError?: string;
    suggestions: string[];
  }> {
    const suggestions: string[] = [];
    let canReachServer = false;
    let serverStatus = 'unknown';
    let networkError: string | undefined;
    
    try {
      console.log('=== 开始网络诊断 ===');
      
      // 测试基本连接
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      canReachServer = true;
      serverStatus = `${response.status} ${response.statusText}`;
      
      if (response.ok) {
        suggestions.push('✅ 后端服务连接正常');
      } else {
        suggestions.push(`❌ 后端服务响应异常: ${response.status}`);
        suggestions.push('建议检查后端服务日志');
      }
      
    } catch (error) {
      canReachServer = false;
      
      if (error instanceof TypeError) {
        if (error.message.includes('fetch')) {
          networkError = '网络连接失败';
          suggestions.push('❌ 无法连接到后端服务');
          suggestions.push('🔧 请检查后端服务是否在端口5173上运行');
          suggestions.push('🔧 运行命令: python -m uvicorn main:app --reload --host 0.0.0.0 --port 5173');
          suggestions.push('🔧 检查防火墙是否阻止了端口5173');
        } else {
          networkError = error.message;
          suggestions.push(`❌ 网络错误: ${error.message}`);
        }
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        networkError = '连接超时';
        suggestions.push('❌ 连接超时');
        suggestions.push('🔧 后端服务可能启动缓慢，请稍等片刻后重试');
      } else {
        networkError = String(error);
        suggestions.push(`❌ 未知错误: ${error}`);
      }
      
      serverStatus = 'unreachable';
    }
    
    console.log('=== 诊断结果 ===');
    console.log('服务器可达:', canReachServer);
    console.log('服务器状态:', serverStatus);
    console.log('网络错误:', networkError);
    console.log('建议:', suggestions);
    
    return {
      canReachServer,
      serverStatus,
      networkError,
      suggestions
    };
  }
  
  // 移除了直接调用Dify的方法，改为调用Python后端
  
  /**
   * 合同审批功能
   */
  async contractReview(file: File, contractType: string): Promise<ContractReviewResult> {
    try {
      console.log('=== 开始合同审批流程 ===');
      console.log('文件信息:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString()
      });
      console.log('合同类型:', contractType);
      console.log('API基础URL:', this.baseURL);
      
      // 首先检查网络连接
      console.log('检查API连接状态...');
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error('无法连接到后端服务，请检查服务器是否正在运行');
      }
      console.log('API连接正常');
      
      // 调用Python后端API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('contract_type', contractType);
      
      console.log('发送请求到:', `${this.baseURL}/api/contract/review`);
      console.log('请求方法: POST');
      console.log('FormData内容:', {
        file: `${file.name} (${file.size} bytes)`,
        contract_type: contractType
      });
      
      const startTime = Date.now();
      const response = await fetch(`${this.baseURL}/api/contract/review`, {
        method: 'POST',
        body: formData,
        // 添加超时控制
        signal: AbortSignal.timeout(120000) // 120秒超时
      });
      
      const endTime = Date.now();
      console.log(`请求耗时: ${endTime - startTime}ms`);
      console.log('响应状态:', response.status, response.statusText);
      console.log('响应头:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('=== API调用失败 ===');
        console.error('状态码:', response.status);
        console.error('状态文本:', response.statusText);
        console.error('错误响应:', errorText);
        throw new Error(`合同审批失败: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('=== 合同审批成功 ===');
      console.log('响应结果:', result);
      
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
        
        // 处理特定HTTP状态码
        if (error.message.includes('422')) {
          errorMessage = '请求参数错误，请检查文件格式和合同类型';
        } else if (error.message.includes('500')) {
          errorMessage = '服务器内部错误，请稍后重试';
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
      console.log('=== 检查API连接 ===');
      console.log('健康检查URL:', `${this.baseURL}/health`);
      
      const startTime = Date.now();
      
      // 创建一个更短的超时控制器
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
      
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        mode: 'cors', // 明确指定CORS模式
        cache: 'no-cache', // 禁用缓存
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const endTime = Date.now();
      console.log(`健康检查耗时: ${endTime - startTime}ms`);
      console.log('健康检查响应状态:', response.status, response.statusText);
      
      if (response.ok) {
        const healthData = await response.json();
        console.log('健康检查响应数据:', healthData);
        console.log('=== API连接成功 ===');
        return true;
      } else {
        console.error('健康检查失败 - 状态码:', response.status);
        return false;
      }
    } catch (error) {
      console.error('=== API连接检查失败 ===');
      console.error('错误类型:', error?.constructor?.name);
      console.error('错误信息:', error);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.error('连接超时: 5秒内无法连接到后端服务');
      } else if (error instanceof TypeError) {
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          console.error('网络错误: 无法连接到服务器，可能的原因:');
          console.error('1. 后端服务未启动或已停止');
          console.error('2. 端口5173被防火墙阻止');
          console.error('3. CORS配置问题');
          console.error('4. 网络连接问题');
        } else {
          console.error('类型错误:', error.message);
        }
      } else {
        console.error('未知错误:', error);
      }
      
      return false;
    }
  }
}

// 创建单例实例
export const contractClient = new ContractClient();
export default contractClient;