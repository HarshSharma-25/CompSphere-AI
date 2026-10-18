from .provider_base import AccountAggregatorProvider
from typing import Dict, Any, List
import uuid
import datetime

class MockAccountAggregatorProvider(AccountAggregatorProvider):
    def create_consent(self, client_id: str, fip_id: str) -> Dict[str, Any]:
        consent_handle = str(uuid.uuid4())
        return {
            "consent_handle": consent_handle,
            "redirect_url": f"https://mock-aa-portal.com/consent/{consent_handle}",
            "status": "PENDING"
        }

    def get_consent_status(self, consent_handle: str) -> Dict[str, Any]:
        # In a real scenario, this would query the AA provider.
        # Here we mock it transitioning to APPROVED.
        return {
            "consent_handle": consent_handle,
            "consent_id": str(uuid.uuid4()),
            "status": "APPROVED",
            "expires_at": (datetime.datetime.utcnow() + datetime.timedelta(days=90)).isoformat()
        }

    def create_data_session(self, consent_id: str) -> Dict[str, Any]:
        session_id = str(uuid.uuid4())
        return {
            "session_id": session_id,
            "status": "READY"
        }

    def fetch_financial_data(self, session_id: str) -> List[Dict[str, Any]]:
        return [
            {
                "txnId": str(uuid.uuid4()),
                "date": datetime.datetime.utcnow().isoformat(),
                "narration": "UPI/Zomato/1234567890/Order",
                "amount": 450.00,
                "type": "DEBIT",
                "balance": 15000.50
            },
            {
                "txnId": str(uuid.uuid4()),
                "date": (datetime.datetime.utcnow() - datetime.timedelta(days=1)).isoformat(),
                "narration": "NEFT-IN-HDFC-SALARY-OCT",
                "amount": 75000.00,
                "type": "CREDIT",
                "balance": 15450.50
            }
        ]

    def revoke_consent(self, consent_id: str) -> bool:
        return True

    def handle_webhook(self, payload: Dict[str, Any], signature: str) -> bool:
        # Mock webhook signature validation
        return True
