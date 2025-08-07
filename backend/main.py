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
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
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
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{DIFY_BASE_URL}/workflows/run",
                json=workflow_data,
                headers=headers,
                timeout=60.0
            )
            
            if response.status_code != 200:
                error_text = response.text
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"工作流调用失败: {error_text}"
                )
            
            result = response.json()
            
            # 解析结果
            if result.get('data', {}).get('outputs', {}).get('text'):
                review_text = result['data']['outputs']['text']
                return ContractReviewResponse(
                    success=True,
                    data={
                        "riskLevel": "medium",
                        "suggestions": [review_text],
                        "issues": []
                    }
                )
            else:
                raise HTTPException(status_code=500, detail="未收到有效的审批结果")
                
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
        print(f"[DEBUG] - request.text: {request.text}")
        print(f"[DEBUG] - request.source_language: {request.source_language}")
        print(f"[DEBUG] - request.target_language: {request.target_language}")
        print(f"[DEBUG] - 完整request对象: {request}")
        print(f"[DEBUG] 翻译请求 - 文本: {request.text[:50]}...")
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
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{DIFY_BASE_URL}/workflows/run",
                    json=workflow_data,
                    headers=headers,
                    timeout=60.0
                )
                
                if response.status_code != 200:
                    error_text = response.text
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"翻译API调用失败: {error_text}"
                    )
                
                result = response.json()
                print(f"翻译API - Dify返回结果: {result}")
                
                # 解析翻译结果 - 优先尝试'Translation'字段
                translated_text = ""
                outputs = result.get('data', {}).get('outputs', {})
                print(f"翻译API - 输出数据结构: {outputs}")
                
                # 优先尝试'Translation'字段（根据Dify日志确认的字段名）
                if 'Translation' in outputs:
                    translated_text = outputs['Translation']
                    print(f"翻译API - 找到Translation字段: {translated_text}")
                else:
                    # 备用：尝试其他可能的输出字段名
                    possible_fields = ['text', 'translated_text', 'translation', 'result', 'output', 'content']
                    
                    for field in possible_fields:
                        if outputs.get(field):
                            translated_text = outputs[field]
                            print(f"翻译API - 从字段'{field}'提取的翻译文本: {translated_text}")
                            break
                    
                    # 如果还是没找到，尝试获取outputs中的第一个非空值
                    if not translated_text and outputs:
                        for key, value in outputs.items():
                            if value and isinstance(value, str) and value.strip():
                                translated_text = value
                                print(f"翻译API - 从字段'{key}'提取的翻译文本: {translated_text}")
                                break
                
                if not translated_text:
                    print(f"翻译API - 未找到翻译结果，完整响应: {result}")
                    print(f"翻译API - 可用的输出字段: {list(outputs.keys()) if outputs else '无'}")
                    raise HTTPException(status_code=500, detail="未收到有效的翻译结果")
                
                # 验证翻译结果
                if not translated_text or translated_text.strip() == "":
                    print(f"翻译API - 翻译结果为空")
                    raise HTTPException(status_code=500, detail="翻译结果为空")
                
                response_data = TranslationResponse(
                    success=True,
                    data={
                        "translatedText": translated_text,
                        "confidence": 0.95
                    }
                )
                print(f"翻译API - 最终返回数据: {response_data.dict()}")
                return response_data
                
            except httpx.TimeoutException as e:
                print(f"Translation timeout error: {str(e)}")
                raise HTTPException(status_code=504, detail=f"Translation request timed out after 60 seconds. Please try with shorter text.")
            except httpx.RequestError as e:
                print(f"Translation request error: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Translation request failed: {str(e)}")
            except HTTPException:
                raise
            
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
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host=host, port=port)