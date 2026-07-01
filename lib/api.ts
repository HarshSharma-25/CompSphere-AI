// Backend API Client
const API_BASE_URL = 'https://ca-ai-tool-backend.onrender.com';

export interface Client {
  _id?: string;
  clientName: string;
  businessName: string;
  gstNumber: string;
  email: string;
  phone: string;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  taxAmount: number;
  paymentStatus: string;
  createdAt?: string;
}

export interface DashboardData {
  totalInvoices: number;
  totalRevenue: number;
  totalGST: number;
  paidInvoices: number;
  pendingInvoices: number;
}

export interface CopilotResponse {
  question: string;
  answer: string;
  dashboardData: DashboardData;
}

export interface AIAnalysisResult {
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  taxAmount: number;
  paymentStatus: string;
  gstRate: number;
  gstComplianceStatus: string;
  issuesFound: string[];
  shortSummary: string;
}

// Clients API
export async function addClient(client: Client): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/api/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  });
  if (!response.ok) throw new Error('Failed to add client');
  const data = await response.json();
  return data.data;
}

export async function getClients(): Promise<Client[]> {
  const response = await fetch(`${API_BASE_URL}/api/clients`);
  if (!response.ok) throw new Error('Failed to fetch clients');
  return response.json();
}

// Document Upload & Analysis
export async function uploadDocument(file: File): Promise<{
  fileName: string;
  filePath: string;
  fileType: string;
  extractedText: string;
  aiAnalysis: AIAnalysisResult;
}> {
  const formData = new FormData();
  formData.append('document', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload document');
  const data = await response.json();
  return {
    fileName: data.fileName,
    filePath: data.filePath,
    fileType: data.fileType,
    extractedText: data.extractedText,
    aiAnalysis: typeof data.aiAnalysis === 'string' ? JSON.parse(data.aiAnalysis) : data.aiAnalysis,
  };
}

// Dashboard Data
export async function getDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`);
  if (!response.ok) throw new Error('Failed to fetch dashboard data');
  return response.json();
}

// AI Copilot
export async function askCopilot(question: string): Promise<CopilotResponse> {
  const response = await fetch(`${API_BASE_URL}/api/copilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) throw new Error('Copilot request failed');
  return response.json();
}

// GST Compliance Check
export async function checkGSTCompliance(
  taxableAmount: number,
  taxAmount: number,
  totalAmount: number
): Promise<{
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
  gstRate: number;
  gstComplianceStatus: string;
  issuesFound: string[];
}> {
  const response = await fetch(`${API_BASE_URL}/api/gst-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taxableAmount, taxAmount, totalAmount }),
  });
  if (!response.ok) throw new Error('GST check failed');
  return response.json();
}

// Financial Report
export async function generateReport(): Promise<{
  message: string;
  dashboardData: DashboardData;
  report: string;
}> {
  const response = await fetch(`${API_BASE_URL}/api/report`);
  if (!response.ok) throw new Error('Failed to generate report');
  return response.json();
}
