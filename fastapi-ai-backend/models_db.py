from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class AIPredictionLog(Base):
    __tablename__ = "ai_prediction_logs"

    id = Column(Integer, primary_key=True, index=True)
    invoice_text = Column(String, index=False)
    risk_score = Column(String, index=True)
    confidence = Column(Float)
    recommendation_text = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Staff/Article")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AAConsent(Base):
    __tablename__ = "aa_consents"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, index=True)
    consent_handle = Column(String, index=True)
    consent_status = Column(String, default="CREATED") # CREATED, PENDING, APPROVED, REJECTED, EXPIRED, REVOKED
    provider = Column(String, default="MOCK")
    fip_id = Column(String)
    bank_name = Column(String, nullable=True)
    account_number = Column(String, nullable=True)
    purpose = Column(String, nullable=True)
    data_requested = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime)
