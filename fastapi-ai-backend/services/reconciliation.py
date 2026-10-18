from typing import List, Dict

class ReconciliationService:
    def __init__(self):
        pass
        
    def reconcile_with_invoices(self, transactions: List[Dict], pending_invoices: List[Dict]) -> List[Dict]:
        """
        Matches transactions to invoices based on amount and date proximity.
        """
        results = []
        for txn in transactions:
            matched_invoice = None
            for inv in pending_invoices:
                # Mock matching logic: amount matches exactly (in real life, fuzzy match and date checks)
                if abs(txn.get("amount", 0) - inv.get("amount", 0)) < 0.01:
                    matched_invoice = inv
                    break
            
            reconciliation_status = "MATCHED" if matched_invoice else "UNMATCHED"
            
            results.append({
                **txn,
                "reconciliation_status": reconciliation_status,
                "matched_invoice_id": matched_invoice.get("id") if matched_invoice else None
            })
            
        return results

    def check_gst_itc_mismatches(self, transactions: List[Dict]) -> List[Dict]:
        """
        Checks for GST ITC risks, e.g. B2B vendor paid after 180 days.
        """
        results = []
        for txn in transactions:
            # Mock logic
            itc_risk = False
            if txn.get("type") == "DEBIT" and txn.get("amount", 0) > 50000:
                # If large payment, flag it to check 180-day rule
                itc_risk = True
            
            results.append({
                **txn,
                "itc_risk_flag": itc_risk
            })
            
        return results

reconciliation_service = ReconciliationService()
