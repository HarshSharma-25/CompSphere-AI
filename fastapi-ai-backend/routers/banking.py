from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict
from auth import get_current_user
from models_db import User

from services.banking_service import banking_service

router = APIRouter(
    prefix="/banking",
    tags=["banking"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/accounts")
def get_banking_accounts(current_user: User = Depends(get_current_user)):
    """
    Get connected banking accounts for the current user's client.
    Enforces client isolation.
    """
    try:
        # Mock client ID extraction from user
        client_id = f"client_of_{current_user.email}"
        banking_service.log_audit(client_id, str(current_user.id), "FETCH_ACCOUNTS", "BankAccount")
        return {"status": "SUCCESS", "accounts": banking_service.get_accounts(client_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions")
def get_banking_transactions(account_id: str = None, current_user: User = Depends(get_current_user)):
    """
    Get bank transactions, optionally filtered by account.
    """
    try:
        client_id = f"client_of_{current_user.email}"
        banking_service.log_audit(client_id, str(current_user.id), "FETCH_TRANSACTIONS", "BankTransaction")
        return {"status": "SUCCESS", "transactions": banking_service.get_transactions(client_id, account_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions/{transaction_id}")
def get_banking_transaction(transaction_id: str, current_user: User = Depends(get_current_user)):
    """
    Get a specific bank transaction.
    """
    try:
        client_id = f"client_of_{current_user.email}"
        banking_service.log_audit(client_id, str(current_user.id), "FETCH_TRANSACTION_DETAIL", "BankTransaction")
        # Just return a mock from the list
        txns = banking_service.get_transactions(client_id)
        txn = next((t for t in txns if t["id"] == transaction_id), txns[0])
        return {"status": "SUCCESS", "transaction": txn}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sync-history")
def get_sync_history(current_user: User = Depends(get_current_user)):
    """
    Get the history of bank sync jobs.
    """
    try:
        client_id = f"client_of_{current_user.email}"
        return {"status": "SUCCESS", "sync_history": banking_service.get_sync_history(client_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reconciliation")
def get_reconciliation_records(current_user: User = Depends(get_current_user)):
    """
    Get records of matched transactions and invoices/journals.
    """
    try:
        client_id = f"client_of_{current_user.email}"
        return {"status": "SUCCESS", "reconciliations": banking_service.get_reconciliations(client_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
