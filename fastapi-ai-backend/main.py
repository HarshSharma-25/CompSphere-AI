from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import logging

from schemas import (
    PredictionRequest, 
    PredictionResponse, 
    UserRegister, 
    UserLogin, 
    TokenResponse, 
    UserResponse
)
from model_loader import load_model
from database import get_db, engine
from models_db import Base, AIPredictionLog, User
from auth import (
    get_api_key_or_user, 
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_user
)
from routers import bank_sync, banking

Base.metadata.create_all(bind=engine)



logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing application resources...")
    ml_models["model"] = load_model()[0]
    yield
    logger.info("Cleaning up application resources...")
    ml_models.clear()

app = FastAPI(title="Compliance API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bank_sync.router, prefix="/api/v1")
app.include_router(banking.router, prefix="/api")

@app.get("/health")

def health_check():
    return {"status": "ok"}

# --- AUTH ENDPOINTS ---

@app.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(request: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and save user
    hashed_password = get_password_hash(request.password)
    new_user = User(
        email=request.email,
        hashed_password=hashed_password,
        role=request.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login", response_model=TokenResponse)
def login(request: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create JWT Access Token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- PREDICTION ENDPOINT ---

@app.post("/predict", response_model=PredictionResponse)
def predict(
    request: PredictionRequest, 
    db: Session = Depends(get_db), 
    auth_data: dict = Depends(get_api_key_or_user)
):
    model = ml_models.get("model")
    if not model:
        raise HTTPException(status_code=503, detail="Model unavailable")
    
    try:
        result = model.predict(request.invoice_text)
        
        log_entry = AIPredictionLog(
            invoice_text=request.invoice_text,
            risk_score=result.get("risk", "Unknown"),
            confidence=result.get("confidence", 0.0),
            recommendation_text=result.get("recommendation", "")
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        
        return PredictionResponse(
            risk=result["risk"],
            confidence=result["confidence"],
            recommendation=result["recommendation"]
        )
    except Exception as e:
        logger.error(f"Prediction failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
