from abc import ABC, abstractmethod
from typing import Dict, Any, List

class AccountAggregatorProvider(ABC):
    @abstractmethod
    def create_consent(self, client_id: str, fip_id: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_consent_status(self, consent_handle: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def create_data_session(self, consent_id: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def fetch_financial_data(self, session_id: str) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def revoke_consent(self, consent_id: str) -> bool:
        pass

    @abstractmethod
    def handle_webhook(self, payload: Dict[str, Any], signature: str) -> bool:
        pass
