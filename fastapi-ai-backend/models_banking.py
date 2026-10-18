import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base

class BankAccount(Base):
    __tablename__ = "bank_accounts_new"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, index=True, nullable=False) # Client isolation
    bank_name = Column(String, nullable=False)
    account_type = Column(String, nullable=False)
    masked_account_number = Column(String, nullable=False) # Only store masked, e.g., "XXXX-XXXX-1234"
    balance = Column(Float, default=0.0)
    currency = Column(String, default="INR")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class BankConnection(Base):
    __tablename__ = "bank_connections"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, index=True, nullable=False)
    provider = Column(String, nullable=False) # e.g., "HDFC_API", "ACCOUNT_AGGREGATOR"
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BankConsent(Base):
    __tablename__ = "bank_consents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, index=True, nullable=False)
    connection_id = Column(String, ForeignKey("bank_connections.id"))
    consent_handle = Column(String, nullable=False)
    status = Column(String, default="PENDING")
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BankTransaction(Base):
    __tablename__ = "bank_transactions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    account_id = Column(String, ForeignKey("bank_accounts_new.id"), nullable=False)
    client_id = Column(String, index=True, nullable=False)
    transaction_date = Column(DateTime, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False) # "CREDIT" or "DEBIT"
    raw_narration = Column(Text, nullable=False)
    normalized_narration = Column(String)
    category_id = Column(String, ForeignKey("transaction_categories.id"))
    reference_number = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BankSyncJob(Base):
    __tablename__ = "bank_sync_jobs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    account_id = Column(String, ForeignKey("bank_accounts_new.id"))
    client_id = Column(String, index=True, nullable=False)
    status = Column(String, default="IN_PROGRESS") # SUCCESS, FAILED
    records_fetched = Column(Integer, default=0)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime)
    error_message = Column(Text)

class TransactionCategory(Base):
    __tablename__ = "transaction_categories"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, index=True) # If null, system-wide category
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # INCOME, EXPENSE, ASSET, LIABILITY

class TransactionRule(Base):
    __tablename__ = "transaction_rules"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, index=True, nullable=False)
    condition_keyword = Column(String, nullable=False)
    assign_category_id = Column(String, ForeignKey("transaction_categories.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ReconciliationRecord(Base):
    __tablename__ = "reconciliation_records"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, index=True, nullable=False)
    transaction_id = Column(String, ForeignKey("bank_transactions.id"), nullable=False, unique=True)
    matched_entity_type = Column(String, nullable=False) # "INVOICE", "JOURNAL"
    matched_entity_id = Column(String, nullable=False)
    reconciled_by = Column(String) # user ID
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "banking_audit_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, index=True, nullable=False)
    user_id = Column(String, nullable=False)
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String)
    ip_address = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
