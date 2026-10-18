import re

class TransactionAIService:
    def __init__(self):
        # In a real scenario, this would load the LangGraph/Transformers model
        # from `model_loader.py` to predict the ledger mappings.
        pass

    def normalize_transaction(self, raw_txn: dict) -> dict:
        """
        Cleans merchant names, normalizes strings and categorizes initially.
        """
        narration = raw_txn.get("narration", "").upper()
        
        # Simple rule-based extraction
        merchant = narration
        if "UPI/" in narration:
            parts = narration.split("/")
            if len(parts) > 1:
                merchant = parts[1]
        elif "NEFT" in narration or "IMPS" in narration or "RTGS" in narration:
            parts = narration.split("-")
            if len(parts) > 2:
                merchant = parts[2]
                
        # Clean merchant string
        merchant = re.sub(r'[^A-Z0-9 ]', '', merchant).strip()

        return {
            **raw_txn,
            "normalized_merchant": merchant
        }

    def predict_ledger(self, normalized_txn: dict) -> dict:
        """
        Predicts the accounting ledger.
        """
        merchant = normalized_txn.get("normalized_merchant", "")
        txn_type = normalized_txn.get("type", "DEBIT")
        
        # Mock ML prediction logic
        suggested_ledger = "Suspense Account"
        confidence = 0.50
        
        if txn_type == "DEBIT":
            if "ZOMATO" in merchant or "SWIGGY" in merchant:
                suggested_ledger = "Meals & Entertainment"
                confidence = 0.95
            elif "AMAZON" in merchant or "FLIPKART" in merchant:
                suggested_ledger = "Office Supplies"
                confidence = 0.85
        else: # CREDIT
            if "SALARY" in merchant:
                suggested_ledger = "Capital Account - Salary"
                confidence = 0.99
            elif "INT" in merchant and "BANK" in merchant:
                suggested_ledger = "Interest Income"
                confidence = 0.90

        return {
            **normalized_txn,
            "suggested_ledger": suggested_ledger,
            "confidence_score": confidence
        }

transaction_ai = TransactionAIService()
