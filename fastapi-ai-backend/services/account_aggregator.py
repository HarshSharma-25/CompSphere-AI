import os
from .aa_providers import MockAccountAggregatorProvider, SetuAccountAggregatorProvider, AccountAggregatorProvider

class AccountAggregatorService:
    def __init__(self):
        self.provider = self._get_provider()

    def _get_provider(self) -> AccountAggregatorProvider:
        provider_name = os.environ.get("AA_PROVIDER", "MOCK").upper()
        if provider_name == "SETU":
            return SetuAccountAggregatorProvider()
        return MockAccountAggregatorProvider()

    def initiate_consent(self, client_id: str, fip_id: str) -> dict:
        return self.provider.create_consent(client_id, fip_id)

    def check_consent_status(self, consent_handle: str) -> dict:
        return self.provider.get_consent_status(consent_handle)

    def create_data_session(self, consent_id: str) -> dict:
        return self.provider.create_data_session(consent_id)

    def fetch_data(self, session_id: str) -> list:
        return self.provider.fetch_financial_data(session_id)

    def revoke_consent(self, consent_id: str) -> bool:
        return self.provider.revoke_consent(consent_id)

    def handle_webhook(self, payload: dict, signature: str) -> bool:
        return self.provider.handle_webhook(payload, signature)

aa_service = AccountAggregatorService()
