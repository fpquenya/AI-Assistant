from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import httpx
import aiofiles
from typing import Optional, Dict, Any
from dotenv import load_dotenv
import json

# 加载环境变量
load_dotenv()

app = FastAPI(title="AI工具箱后端API", version="1.0.0")

# CORS配置
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173", 
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# 配置常量
DIFY_BASE_URL = os.getenv("DIFY_BASE_URL", "http://113.45.43.33/v1")
DIFY_CONTRACT_API_KEY = os.getenv("DIFY_CONTRACT_API_KEY")
DIFY_TRANSLATION_API_KEY = os.getenv("DIFY_TRANSLATION_API_KEY")

# 数据模型
class TranslationRequest(BaseModel):
    text: str
    source_language: str
    target_language: str

class TranslationResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None

class ContractReviewResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "AI工具箱后端API服务正在运行"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-toolbox-backend"}

@app.get("/api/health")
async def api_health_check():
    return {"status": "healthy", "service": "ai-toolbox-backend"}

# 添加OPTIONS请求处理器以支持CORS预检请求
@app.options("/api/translation/translate")
async def options_translation_translate():
    return {"message": "OK"}

@app.options("/api/contract/review")
async def options_contract_review():
    return {"message": "OK"}

@app.options("/api/contract/upload")
async def options_contract_upload():
    return {"message": "OK"}

# 合同审批相关API
@app.post("/api/contract/upload", response_model=Dict[str, Any])
async def upload_contract_file(file: UploadFile = File(...)):
    """上传合同文件到Dify"""
    try:
        # 读取文件内容
        file_content = await file.read()
        
        # 准备上传到Dify的表单数据
        files = {
            'file': (file.filename, file_content, file.content_type)
        }
        data = {
            'user': 'ai-toolbox-user',
            'type': 'TXT'
        }
        headers = {
            'Authorization': f'Bearer {DIFY_CONTRACT_API_KEY}'
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{DIFY_BASE_URL}/files/upload",
                files=files,
                data=data,
                headers=headers,
                timeout=30.0
            )
            
            if response.status_code not in [200, 201]:
                error_text = response.text
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"文件上传失败: {error_text}"
                )
            
            return response.json()
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"文件上传失败: {str(e)}")

@app.post("/api/contract/review", response_model=ContractReviewResponse)
async def review_contract(
    file: UploadFile = File(...),
    contract_type: str = Form(default="service")
):
    """合同审批API"""
    try:
        # 参数映射：将前端传递的英文值转换为后端工作流期望的中文值
        contract_type_mapping = {
            "service": "服务类",
            "procurement": "采购类"
        }
        
        # 验证并转换参数
        if contract_type not in contract_type_mapping:
            raise HTTPException(
                status_code=400, 
                detail=f"无效的合同类型: {contract_type}。支持的类型: {list(contract_type_mapping.keys())}"
            )
        
        ht_type = contract_type_mapping[contract_type]
        
        # 第一步：上传文件
        upload_result = await upload_contract_file(file)
        file_id = upload_result.get('id')
        
        if not file_id:
            raise HTTPException(status_code=400, detail="文件上传失败，未获取到文件ID")
        
        # 第二步：调用工作流
        workflow_data = {
            "inputs": {
                "hetong": [{
                    "type": "document",
                    "transfer_method": "local_file",
                    "upload_file_id": file_id
                }],
                "HTtype": ht_type
            },
            "response_mode": "blocking",
            "user": "ai-toolbox-user"
        }
        
        headers = {
            'Authorization': f'Bearer {DIFY_CONTRACT_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        print(f"[DEBUG] 合同审批 - 开始调用工作流")
        print(f"[DEBUG] 合同审批 - 文件ID: {file_id}")
        print(f"[DEBUG] 合同审批 - 合同类型: {ht_type}")
        
        # 重试机制
        max_retries = 2
        for attempt in range(max_retries + 1):
            try:
                print(f"[DEBUG] 合同审批请求尝试 {attempt + 1}/{max_retries + 1}")
                
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        f"{DIFY_BASE_URL}/workflows/run",
                        json=workflow_data,
                        headers=headers,
                        timeout=120.0  # 增加超时时间到120秒
                    )
                
                print(f"[DEBUG] 合同审批 - 响应状态码: {response.status_code}")
                
                if response.status_code != 200:
                    error_text = response.text
                    print(f"[ERROR] 合同审批API调用失败 - 状态码: {response.status_code}")
                    print(f"[ERROR] 合同审批API调用失败 - 错误详情: {error_text}")
                    
                    # 如果是最后一次尝试，抛出异常
                    if attempt == max_retries:
                        raise HTTPException(
                            status_code=response.status_code,
                            detail=f"合同审批工作流调用失败 (尝试{max_retries + 1}次): 状态码{response.status_code}, 错误: {error_text}"
                        )
                    else:
                        print(f"[INFO] 第{attempt + 1}次尝试失败，准备重试...")
                        continue
                
                # 如果请求成功，跳出重试循环
                break
                
            except httpx.TimeoutException as e:
                print(f"[ERROR] 合同审批超时错误 (尝试{attempt + 1}): {str(e)}")
                if attempt == max_retries:
                    raise HTTPException(
                        status_code=504, 
                        detail=f"合同审批请求超时 (尝试{max_retries + 1}次，每次120秒)。请稍后重试或联系管理员。"
                    )
                else:
                    print(f"[INFO] 合同审批超时重试中... ({attempt + 1}/{max_retries + 1})")
                    continue
                    
            except httpx.RequestError as e:
                print(f"[ERROR] 合同审批请求错误 (尝试{attempt + 1}): {str(e)}")
                if attempt == max_retries:
                    raise HTTPException(
                        status_code=500, 
                        detail=f"合同审批请求失败 (尝试{max_retries + 1}次): {str(e)}"
                    )
                else:
                    print(f"[INFO] 合同审批请求错误重试中... ({attempt + 1}/{max_retries + 1})")
                    continue
        
        # 处理成功的响应
        try:
            result = response.json()
            print(f"[DEBUG] 合同审批 - 响应结构: {type(result)}")
            print(f"[DEBUG] 合同审批 - 响应数据字段: {list(result.keys()) if isinstance(result, dict) else '非字典类型'}")
            
            # 解析结果
            outputs = result.get('data', {}).get('outputs', {})
            print(f"[DEBUG] 合同审批 - 输出字段: {list(outputs.keys()) if outputs else '无'}")
            
            review_text = ""
            if outputs.get('text'):
                review_text = outputs['text']
                print(f"[DEBUG] 合同审批 - 找到text字段")
            else:
                # 尝试其他可能的字段名
                possible_fields = ['result', 'output', 'content', 'review', 'analysis']
                for field in possible_fields:
                    if outputs.get(field):
                        review_text = outputs[field]
                        print(f"[DEBUG] 合同审批 - 从字段'{field}'提取结果")
                        break
            
            if not review_text:
                print(f"[ERROR] 合同审批 - 未找到有效结果")
                print(f"[ERROR] 合同审批 - 完整响应: {result}")
                raise HTTPException(
                    status_code=500, 
                    detail=f"未收到有效的合同审批结果。可用字段: {list(outputs.keys()) if outputs else '无'}"
                )
            
            print(f"[DEBUG] 合同审批 - 审批成功，结果长度: {len(review_text)}")
            
            return ContractReviewResponse(
                success=True,
                data={
                    "riskLevel": "medium",
                    "suggestions": [review_text],
                    "issues": []
                }
            )
            
        except Exception as parse_error:
            print(f"[ERROR] 合同审批结果解析失败: {str(parse_error)}")
            raise HTTPException(
                status_code=500, 
                detail=f"合同审批结果解析失败: {str(parse_error)}"
            )
                
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"合同审批失败: {str(e)}")

# 翻译相关API
@app.post("/api/translation/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    """翻译API"""
    try:
        print(f"[DEBUG] 翻译请求参数详情:")
        print(f"[DEBUG] - request.text: {request.text[:100]}...")
        print(f"[DEBUG] - request.source_language: {request.source_language}")
        print(f"[DEBUG] - request.target_language: {request.target_language}")
        
        # 检查文本长度，如果太长则分段处理
        text_length = len(request.text)
        if text_length > 5000:
            print(f"[WARNING] 文本长度过长 ({text_length} 字符)，可能导致超时")
            # 对于超长文本，可以考虑分段处理或直接返回错误
            raise HTTPException(
                status_code=413, 
                detail=f"文本长度过长 ({text_length} 字符)，请分段翻译。建议单次翻译不超过5000字符。"
            )
        
        # 准备工作流输入数据
        workflow_data = {
            "inputs": {
                "source_text": request.text,
                "source_lang": request.source_language,
                "target_lang": request.target_language
            },
            "response_mode": "blocking",
            "user": "ai-toolbox-user"
        }
        
        headers = {
            'Authorization': f'Bearer {DIFY_TRANSLATION_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        # 根据文本长度动态调整超时时间
        timeout_seconds = min(120.0, max(30.0, text_length / 50))  # 30-120秒之间
        print(f"[DEBUG] 设置超时时间: {timeout_seconds}秒")
        
        # 重试机制
        max_retries = 2
        for attempt in range(max_retries + 1):
            try:
                print(f"[DEBUG] 翻译请求尝试 {attempt + 1}/{max_retries + 1}")
                
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        f"{DIFY_BASE_URL}/workflows/run",
                        json=workflow_data,
                        headers=headers,
                        timeout=timeout_seconds
                    )
                
                    if response.status_code != 200:
                        error_text = response.text
                        print(f"[ERROR] 翻译API调用失败 - 状态码: {response.status_code}, 错误: {error_text}")
                        
                        # 如果是最后一次尝试，抛出异常
                        if attempt == max_retries:
                            raise HTTPException(
                                status_code=response.status_code,
                                detail=f"翻译API调用失败 (尝试{max_retries + 1}次): {error_text}"
                            )
                        else:
                            print(f"[INFO] 第{attempt + 1}次尝试失败，准备重试...")
                            continue
                
                # 如果请求成功，跳出重试循环
                break
                
            except httpx.TimeoutException as e:
                print(f"[ERROR] 翻译超时错误 (尝试{attempt + 1}): {str(e)}")
                if attempt == max_retries:
                    raise HTTPException(
                        status_code=504, 
                        detail=f"翻译请求超时 (尝试{max_retries + 1}次，每次{timeout_seconds}秒)。请尝试缩短文本长度或稍后重试。"
                    )
                else:
                    print(f"[INFO] 超时重试中... ({attempt + 1}/{max_retries + 1})")
                    continue
                    
            except httpx.RequestError as e:
                print(f"[ERROR] 翻译请求错误 (尝试{attempt + 1}): {str(e)}")
                if attempt == max_retries:
                    raise HTTPException(
                        status_code=500, 
                        detail=f"翻译请求失败 (尝试{max_retries + 1}次): {str(e)}"
                    )
                else:
                    print(f"[INFO] 请求错误重试中... ({attempt + 1}/{max_retries + 1})")
                    continue
        
        # 处理成功的响应
        try:
            result = response.json()
            print(f"[DEBUG] 翻译API - Dify返回结果结构: {type(result)}")
            
            # 解析翻译结果 - 优先尝试'Translation'字段
            translated_text = ""
            outputs = result.get('data', {}).get('outputs', {})
            print(f"[DEBUG] 翻译API - 输出数据字段: {list(outputs.keys()) if outputs else '无'}")
            
            # 优先尝试'Translation'字段（根据Dify日志确认的字段名）
            if 'Translation' in outputs:
                translated_text = outputs['Translation']
                print(f"[DEBUG] 翻译API - 找到Translation字段")
            else:
                # 备用：尝试其他可能的输出字段名
                possible_fields = ['text', 'translated_text', 'translation', 'result', 'output', 'content']
                
                for field in possible_fields:
                    if outputs.get(field):
                        translated_text = outputs[field]
                        print(f"[DEBUG] 翻译API - 从字段'{field}'提取翻译文本")
                        break
                
                # 如果还是没找到，尝试获取outputs中的第一个非空值
                if not translated_text and outputs:
                    for key, value in outputs.items():
                        if value and isinstance(value, str) and value.strip():
                            translated_text = value
                            print(f"[DEBUG] 翻译API - 从字段'{key}'提取翻译文本")
                            break
            
            if not translated_text:
                print(f"[ERROR] 翻译API - 未找到翻译结果")
                print(f"[ERROR] 翻译API - 完整响应结构: {result}")
                print(f"[ERROR] 翻译API - 可用的输出字段: {list(outputs.keys()) if outputs else '无'}")
                raise HTTPException(
                    status_code=500, 
                    detail=f"未收到有效的翻译结果。可用字段: {list(outputs.keys()) if outputs else '无'}"
                )
            
            # 验证翻译结果
            if not translated_text or translated_text.strip() == "":
                print(f"[ERROR] 翻译API - 翻译结果为空")
                raise HTTPException(status_code=500, detail="翻译结果为空")
            
            response_data = TranslationResponse(
                success=True,
                data={
                    "translatedText": translated_text,
                    "confidence": 0.95
                }
            )
            print(f"[DEBUG] 翻译API - 翻译成功，文本长度: {len(translated_text)}")
            return response_data
            
        except Exception as parse_error:
            print(f"[ERROR] 翻译结果解析失败: {str(parse_error)}")
            raise HTTPException(
                status_code=500, 
                detail=f"翻译结果解析失败: {str(parse_error)}"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        return TranslationResponse(
            success=False,
            data={
                "translatedText": "",
                "confidence": 0
            },
            message=str(e)
        )

@app.get("/api/translation/check")
async def check_translation_connection():
    """检查翻译API连接状态"""
    try:
        # 发送测试请求
        test_data = {
            "inputs": {"test": "connection"},
            "response_mode": "blocking",
            "user": "test-user"
        }
        
        headers = {
            'Authorization': f'Bearer {DIFY_TRANSLATION_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{DIFY_BASE_URL}/workflows/run",
                json=test_data,
                headers=headers,
                timeout=10.0
            )
            
            return {
                "connected": response.status_code != 404,
                "status_code": response.status_code
            }
            
    except Exception as e:
        return {
            "connected": False,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 5173))
    uvicorn.run(app, host=host, port=port)