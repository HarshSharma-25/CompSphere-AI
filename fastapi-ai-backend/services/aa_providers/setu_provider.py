from .provider_base import AccountAggregatorProvider
from typing import Dict, Any, List
import os

class SetuAccountAggregatorProvider(AccountAggregatorProvider):
    def __init__(self):
        self.client_id = os.environ.get("SETU_CLIENT_ID")
        self.client_secret = os.environ.get("SETU_CLIENT_SECRET")
        self.base_url = os.environ.get("SETU_BASE_URL", "https://sandbox.setu.co/api")
        # Ensure credentials are present or fail fast/log warning
    
    def create_consent(self, client_id: str, fip_id: str) -> Dict[str, Any]:
        raise NotImplementedError("Setu production connectivity requires real credentials.")

    def get_consent_status(self, consent_handle: str) -> Dict[str, Any]:
        raise NotImplementedError("Setu production connectivity requires real credentials.")

    def create_data_session(self, consent_id: str) -> Dict[str, Any]:
        raise NotImplementedError("Setu production connectivity requires real credentials.")

    def fetch_financial_data(self, session_id: str) -> List[Dict[str, Any]]:
        raise NotImplementedError("Setu production connectivity requires real credentials.")

    def revoke_consent(self, consent_id: str) -> bool:
        raise NotImplementedError("Setu production connectivity requires real credentials.")

    def handle_webhook(self, payload: Dict[str, Any], signature: str) -> bool:
        raise NotImplementedError("Setu production connectivity requires real credentials.")
