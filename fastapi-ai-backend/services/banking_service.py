import uuid
import datetime
from typing import List, Dict

class BankingService:
    def __init__(self):
        pass
        
    def mask_account_number(self, account_number: str) -> str:
        """
        Masks the account number leaving only the last 4 digits.
        """
        if len(account_number) <= 4:
            return account_number
        return f"XXXX-XXXX-{account_number[-4:]}"
        
    def get_accounts(self, client_id: str) -> List[Dict]:
        """
        Returns mock accounts, filtering by client_id for isolation.
        """
        return [
            {
                "id": str(uuid.uuid4()),
                "client_id": client_id,
                "bank_name": "HDFC Bank",
                "account_type": "Current",
                "masked_account_number": self.mask_account_number("50200012345678"),
                "balance": 150000.50,
                "currency": "INR",
                "is_active": True,
                "created_at": datetime.datetime.utcnow().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "client_id": client_id,
                "bank_name": "ICICI Bank",
                "account_type": "Savings",
                "masked_account_number": self.mask_account_number("000101555555"),
                "balance": 45000.00,
                "currency": "INR",
                "is_active": True,
                "created_at": datetime.datetime.utcnow().isoformat()
            }
        ]
        
    def get_transactions(self, client_id: str, account_id: str = None) -> List[Dict]:
        """
        Returns mock transactions, ensuring client isolation.
        """
        return [
            {
                "id": str(uuid.uuid4()),
                "account_id": account_id or str(uuid.uuid4()),
                "client_id": client_id,
                "transaction_date": datetime.datetime.utcnow().isoformat(),
                "amount": 2500.00,
                "type": "DEBIT",
                "raw_narration": "UPI-SWIGGY-12345",
                "normalized_narration": "SWIGGY",
                "category": "Meals & Entertainment",
                "reference_number": "REF123456"
            },
            {
                "id": str(uuid.uuid4()),
                "account_id": account_id or str(uuid.uuid4()),
                "client_id": client_id,
                "transaction_date": (datetime.datetime.utcnow() - datetime.timedelta(days=1)).isoformat(),
                "amount": 150000.00,
                "type": "CREDIT",
                "raw_narration": "NEFT-IN-CLIENT-PAYMENT",
                "normalized_narration": "CLIENT PAYMENT",
                "category": "Sales / Revenue",
                "reference_number": "REF987654"
            }
        ]

    def get_sync_history(self, client_id: str) -> List[Dict]:
        return [
            {
                "id": str(uuid.uuid4()),
                "client_id": client_id,
                "status": "SUCCESS",
                "records_fetched": 45,
                "started_at": (datetime.datetime.utcnow() - datetime.timedelta(minutes=10)).isoformat(),
                "completed_at": (datetime.datetime.utcnow() - datetime.timedelta(minutes=9)).isoformat()
            }
        ]
        
    def get_reconciliations(self, client_id: str) -> List[Dict]:
        return [
            {
                "id": str(uuid.uuid4()),
                "client_id": client_id,
                "transaction_id": str(uuid.uuid4()),
                "matched_entity_type": "INVOICE",
                "matched_entity_id": "INV-2026-001",
                "created_at": datetime.datetime.utcnow().isoformat()
            }
        ]
        
    def log_audit(self, client_id: str, user_id: str, action: str, entity_type: str):
        """
        Mock audit logging ensuring we track who did what.
        """
        # In a real app, this would write to the `banking_audit_logs` table.
        print(f"AUDIT LOG: User {user_id} performed {action} on {entity_type} for Client {client_id}")

banking_service = BankingService()
