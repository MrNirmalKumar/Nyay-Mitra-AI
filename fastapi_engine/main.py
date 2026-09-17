from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pytesseract
from pdf2image import convert_from_bytes
import io
import os
import json
import traceback
from openai import OpenAI
from dotenv import load_dotenv

# Load from the root directory so the Next.js .env is shared
load_dotenv(dotenv_path="../.env")

app = FastAPI(title="Nyay Mitra AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Spacy has been removed to speed up startup time.
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class TextRequest(BaseModel):
    text: str
    history: Optional[List[ChatMessage]] = []

@app.get("/")
def read_root():
    return {"status": "AI Engine is running", "models_loaded": {"openai": bool(os.getenv("OPENAI_API_KEY"))}}

@app.post("/api/ocr")
async def perform_ocr(file: UploadFile = File(...)):
    """Extract text from uploaded image or PDF."""
    try:
        contents = await file.read()
        text = ""
        
        if file.content_type == "application/pdf":
            images = convert_from_bytes(contents)
            for img in images:
                text += pytesseract.image_to_string(img) + "\n"
        elif file.content_type.startswith("image/"):
            from PIL import Image
            image = Image.open(io.BytesIO(contents))
            text = pytesseract.image_to_string(image)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
            
        return {"extracted_text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": "OCR Failed", "message": str(e)})

from pydantic import BaseModel, Field

class RelevantLaw(BaseModel):
    act: str = ""
    provision: str = ""
    details: str = ""
    sourceUrl: Optional[str] = None

class AIAnalysisResponse(BaseModel):
    isLegalIssue: bool = False
    intent: str = "non-legal"
    understanding: str = ""
    legalArea: str = ""
    jurisdictionNote: Optional[str] = None
    possibleRights: List[str] = Field(default_factory=list)
    relevantLaws: List[RelevantLaw] = Field(default_factory=list)
    nextSteps: List[str] = Field(default_factory=list)
    documentsEvidence: List[str] = Field(default_factory=list)
    professionalHelp: str = ""
    followupQuestions: List[str] = Field(default_factory=list)
    nonLegalResponse: str = ""
    clarificationQuestion: Optional[str] = None

@app.post("/api/analyze", response_model=AIAnalysisResponse)
async def analyze_text(request: TextRequest):
    """Universal AI endpoint for Document Scan and Chat (using LLM)."""
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            # Fallback mock for demo if no API key is provided
            return {
                "isLegalIssue": True,
                "intent": "legal",
                "understanding": "You have described a situation that requires legal attention. Since GROQ_API_KEY is missing, this is a mock fallback response.",
                "legalArea": "General Law",
                "possibleRights": ["Right to seek legal remedy"],
                "relevantLaws": [{"act": "General Legal Principles", "provision": "N/A", "details": "Please configure GROQ_API_KEY in the backend for accurate advice."}],
                "nextSteps": ["Add your Groq API key to the backend .env file.", "Restart the backend server."],
                "documentsEvidence": [],
                "professionalHelp": "Consult a local legal professional for accurate advice.",
                "nonLegalResponse": ""
            }

        client = OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1"
        )
        
        system_prompt = """
You are "Nyay Mitra AI", an expert legal assistant for Indian citizens.
CRITICAL RULES:
1. You must explicitly understand and respond accurately to "Hinglish" (Hindi written in English alphabet), e.g., "mere sath ragging ho raha hai".
2. If the user query is a legal issue, identify the category, laws, and next steps. 
3. If it is NOT a legal issue (e.g. general chat), set "isLegalIssue" to false.
4. Output strict JSON matching this schema:
{
  "isLegalIssue": boolean,
  "intent": "legal" | "non-legal" | "ambiguous",
  "understanding": "Empathic summary of the facts (in English)",
  "legalArea": "e.g. Consumer Law, Criminal Law, Tenancy",
  "possibleRights": ["Right 1", "Right 2"],
  "relevantLaws": [{"act": "Name of Act", "provision": "Section", "details": "Explanation"}],
  "nextSteps": ["Step 1", "Step 2"],
  "documentsEvidence": ["Evidence 1", "Evidence 2"],
  "professionalHelp": "Who they should contact for professional help",
  "nonLegalResponse": "Friendly response if not a legal issue"
}
"""
        messages = [{"role": "system", "content": system_prompt}]
        if request.history:
            for msg in request.history:
                messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": request.text[:3000]})

        response = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.2
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        print("====== AI ENGINE ERROR ======")
        traceback.print_exc()
        print("=============================")
        raise HTTPException(status_code=500, detail={"error": "Inference failed", "message": str(e)})
