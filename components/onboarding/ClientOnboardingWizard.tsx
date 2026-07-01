'use client';

import { useState } from 'react';
import { UserCheck, Sparkles, Building2, Landmark, Check, AlertCircle } from 'lucide-react';

export default function ClientOnboardingWizard() {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [gstin, setGstin] = useState<string>('');
  
  // Form values state
  const [formData, setFormData] = useState({
    legalName: '',
    pan: '',
    entityType: 'Private Limited',
    address: '',
    email: '',
    phone: '',
    accountNumber: '',
    ifsc: ''
  });

  const triggerMockLookup = () => {
    if (!gstin || gstin.length < 15) {
      alert('Please enter a valid 15-character GSTIN');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormData(prev => ({
        ...prev,
        legalName: 'Apex Software Solutions Private Limited',
        pan: gstin.substring(2, 12),
        address: 'Suite 405, Dynasty Business Park, Andheri Kurla Road, Mumbai, Maharashtra 400059',
        email: 'accounts@apexsolutions.in',
        phone: '+91 98765 43210'
      }));
    }, 1500);
  };

  const handleInputChange = (field: string, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl text-slate-900 max-w-5xl mx-auto">
      {/* Header and Step indicators */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3 text-indigo-600">
            <Building2 className="h-6 w-6" />
            AI Client Onboarding Wizard
          </h2>
          <p className="text-base text-slate-500 mt-2">Accelerate KYC checks and generate statutory compliance schedules</p>
        </div>
        
        {/* Step dots */}
        <div className="flex items-center gap-4">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-3">
              <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? 'bg-indigo-600 text-white' : 
                step > s ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' : 
                'bg-slate-50 border border-slate-200 text-slate-400'
              }`}>
                {step > s ? <Check className="h-4 w-4" /> : s}
              </span>
              <span className={`text-sm font-bold uppercase tracking-wider ${step === s ? 'text-indigo-600' : 'text-slate-400'}`}>
                {s === 1 && 'Identity'}
                {s === 2 && 'Banking'}
                {s === 3 && 'Confirm'}
              </span>
              {s < 3 && <div className="h-px w-12 bg-slate-200" />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: IDENTITY */}
      {step === 1 && (
        <div className="space-y-8">
          <div className="bg-slate-50 p-6 border border-slate-200 rounded-xl flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">GSTIN Auto-Lookup</label>
              <input
                type="text"
                placeholder="E.g., 27AAAAA1111A1Z1"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                className="w-full px-5 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 text-base text-slate-900 placeholder-slate-400 transition-shadow"
              />
            </div>
            <button
              onClick={triggerMockLookup}
              disabled={loading}
              className="px-8 py-3 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-500 text-white text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 whitespace-nowrap"
            >
              <Sparkles className="h-5 w-5" />
              {loading ? 'Verifying...' : 'Fetch Gov Data'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Legal Business Name</label>
              <input
                type="text"
                value={formData.legalName}
                onChange={(e) => handleInputChange('legalName', e.target.value)}
                className="w-full px-5 py-3 border border-slate-200 rounded-xl bg-slate-50 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">PAN Code</label>
              <input
                type="text"
                value={formData.pan}
                onChange={(e) => handleInputChange('pan', e.target.value)}
                className="w-full px-5 py-3 border border-slate-200 rounded-xl bg-slate-50 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-shadow"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Registered Office Address</label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-5 py-4 border border-slate-200 rounded-xl bg-slate-50 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-shadow"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 mt-8 border-t border-slate-200">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BANKING */}
      {step === 2 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Current Account Number</label>
              <input
                type="text"
                placeholder="E.g., 001205001948"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className="w-full px-5 py-3 border border-slate-200 rounded-xl bg-slate-50 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">IFSC Code</label>
              <input
                type="text"
                placeholder="E.g., HDFC0000012"
                value={formData.ifsc}
                onChange={(e) => handleInputChange('ifsc', e.target.value)}
                className="w-full px-5 py-3 border border-slate-200 rounded-xl bg-slate-50 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Contact Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-5 py-3 border border-slate-200 rounded-xl bg-slate-50 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Primary Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-5 py-3 border border-slate-200 rounded-xl bg-slate-50 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-shadow"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 mt-8 border-t border-slate-200">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-transparent text-slate-500 hover:text-slate-900 font-semibold text-base transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Save & Review
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRM */}
      {step === 3 && (
        <div className="space-y-8">
          <div className="bg-slate-50 p-8 border border-slate-200 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 border-b border-slate-200 pb-4">
              <UserCheck className="h-6 w-6 text-indigo-600" />
              Verify & Complete Onboarding File
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-8 text-base">
              <div className="text-slate-500 font-medium">Legal Name:</div>
              <div className="sm:col-span-2 text-slate-900 font-semibold">{formData.legalName || '-'}</div>

              <div className="text-slate-500 font-medium">PAN ID:</div>
              <div className="sm:col-span-2 text-slate-900 font-mono uppercase">{formData.pan || '-'}</div>

              <div className="text-slate-500 font-medium">Registered Address:</div>
              <div className="sm:col-span-2 text-slate-700">{formData.address || '-'}</div>

              <div className="text-slate-500 font-medium">Bank Details:</div>
              <div className="sm:col-span-2 text-slate-900 font-mono">
                {formData.accountNumber ? `A/c: ${formData.accountNumber} (IFSC: ${formData.ifsc})` : '-'}
              </div>

              <div className="text-slate-500 font-medium">Email / Phone:</div>
              <div className="sm:col-span-2 text-slate-700">
                {formData.email ? `${formData.email} | ${formData.phone}` : '-'}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 mt-8 border-t border-slate-200">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-transparent text-slate-500 hover:text-slate-900 font-semibold text-base transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                alert(`Onboarding completed successfully for ${formData.legalName}! compliance calendar generated.`);
                setStep(1);
                setFormData({
                  legalName: '',
                  pan: '',
                  entityType: 'Private Limited',
                  address: '',
                  email: '',
                  phone: '',
                  accountNumber: '',
                  ifsc: ''
                });
                setGstin('');
              }}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Check className="h-5 w-5" />
              Complete Onboarding
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
