from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from models_db import User

from services.account_aggregator import aa_service
from services.transaction_ai import transaction_ai
from services.reconciliation import reconciliation_service
from models_db import AAConsent
import datetime

router = APIRouter(
    prefix="/bank-sync",
    tags=["bank-sync"],
    dependencies=[Depends(get_current_user)]
)

@router.post("/initiate-consent")
def initiate_consent(client_id: str, fip_id: str, db: Session = Depends(get_db)):
    """
    Initiate Account Aggregator consent flow.
    """
    try:
        response = aa_service.initiate_consent(client_id, fip_id)
        # Store initial consent state
        new_consent = AAConsent(
            client_id=client_id,
            consent_handle=response.get("consent_handle"),
            consent_status="PENDING",
            fip_id=fip_id,
            provider="MOCK"
        )
        db.add(new_consent)
        db.commit()
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/consent-status/{consent_handle}")
def get_consent_status(consent_handle: str, db: Session = Depends(get_db)):
    """
    Check the status of an AA consent request.
    """
    try:
        response = aa_service.check_consent_status(consent_handle)
        
        # Update DB
        consent_record = db.query(AAConsent).filter(AAConsent.consent_handle == consent_handle).first()
        if consent_record:
            consent_record.consent_status = response.get("status", consent_record.consent_status)
            if "expires_at" in response:
                consent_record.expires_at = datetime.datetime.fromisoformat(response["expires_at"])
            db.commit()
            
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/fetch-data/{consent_id}")
def fetch_and_process_data(consent_id: str):
    """
    Fetch data from FIU, normalize it, and categorize it.
    """
    try:
        session_data = aa_service.create_data_session(consent_id)
        session_id = session_data.get("session_id", consent_id)
        
        # Fetch raw data
        raw_txns = aa_service.fetch_data(session_id)
        
        # Normalize and predict ledger
        processed_txns = []
        for txn in raw_txns:
            normalized = transaction_ai.normalize_transaction(txn)
            predicted = transaction_ai.predict_ledger(normalized)
            processed_txns.append(predicted)
            
        return {"status": "SUCCESS", "transactions": processed_txns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reconciliation-queue")
def get_reconciliation_queue(transactions: list, invoices: list = None):
    """
    Takes processed transactions and matches them with invoices/GST.
    """
    if invoices is None:
        invoices = []
        
    try:
        # Invoice matching
        matched_txns = reconciliation_service.reconcile_with_invoices(transactions, invoices)
        
        # GST ITC risk check
        final_txns = reconciliation_service.check_gst_itc_mismatches(matched_txns)
        
        return {"status": "SUCCESS", "reconciliation_results": final_txns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/revoke-consent/{consent_handle}")
def revoke_consent(consent_handle: str, db: Session = Depends(get_db)):
    try:
        consent_record = db.query(AAConsent).filter(AAConsent.consent_handle == consent_handle).first()
        if not consent_record:
            raise HTTPException(status_code=404, detail="Consent not found")
            
        success = aa_service.revoke_consent(consent_record.consent_handle)
        if success:
            consent_record.consent_status = "REVOKED"
            db.commit()
            return {"status": "SUCCESS", "message": "Consent revoked"}
        return {"status": "FAILED"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
def webhook_receiver(payload: dict, signature: str = None):
    try:
        is_valid = aa_service.handle_webhook(payload, signature or "")
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid signature")
        return {"status": "OK"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
