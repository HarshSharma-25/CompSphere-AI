'use strict';

const { Injectable } = require('@nestjs/common');
const { InvoicesService } = require('../invoices/invoices.service');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const Groq = require('groq-sdk');

class UploadService {
  constructor(invoicesService) {
    this.invoicesService = invoicesService;
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async analyzeInvoiceWithAI(extractedText) {
    const chatCompletion = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI assistant for Chartered Accountants. Extract important invoice details from the given invoice text. Do not add extra explanation.',
        },
        {
          role: 'user',
          content: `Return only valid JSON
Extract and analyze these fields from the invoice text:

Basic Invoice Details:
- invoiceNumber
- invoiceDate
- dueDate
- vendorName
- customerName
- customerEmail
- paymentStatus

GST / Tax Analysis:
- taxableAmount
- taxAmount
- gstRate
- totalAmount
- gstComplianceStatus
- issuesFound

Summary:
- shortSummary

Important:
You must include taxableAmount, taxAmount, gstRate, totalAmount, gstComplianceStatus and issuesFound in JSON.
Do not skip any field.

Rules:
1. Return ONLY pure JSON.
2. Do NOT add explanations.
3. Do NOT add comments.
4. Do NOT use // comments.
5. Do NOT use markdown.
6. If any value is missing, write "Not found".
7. Calculate gstRate if taxableAmount and taxAmount are available.
8. gstComplianceStatus should be "Valid", "Warning", or "Invalid".
9. issuesFound should explain missing GST/tax problems in simple words.
10. Return JSON object only.

Invoice Text:
${extractedText}
          `,
        },
      ],
    });

    return chatCompletion.choices[0].message.content;
  }

  async processFile(file) {
    const filePath = file.path;
    const fileName = file.filename;
    const mimeType = file.mimetype;

    let extractedText = '';

    if (mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (mimeType.startsWith('image/')) {
      const result = await Tesseract.recognize(filePath, 'eng');
      extractedText = result.data.text;
    } else {
      extractedText =
        'This file type is uploaded but OCR is not supported for this format.';
    }

    let aiAnalysis = null;

    if (extractedText && extractedText.length > 20) {
      aiAnalysis = await this.analyzeInvoiceWithAI(extractedText);
    }

    try {
      const parsedAI = JSON.parse(aiAnalysis);

      const totalAmountValue =
        parsedAI.totalAmount ||
        parsedAI.totalDue ||
        parsedAI.amount ||
        parsedAI.finalAmount ||
        '0';

      const taxAmountValue =
        parsedAI.taxAmount ||
        parsedAI.gstAmount ||
        parsedAI.tax ||
        parsedAI.GST ||
        '0';

      await this.invoicesService.create({
        invoiceNumber: parsedAI.invoiceNumber || 'Not found',
        customerName: parsedAI.customerName || 'Not found',
        totalAmount: Number(String(totalAmountValue).replace(/[^0-9.]/g, '')),
        taxAmount: Number(String(taxAmountValue).replace(/[^0-9.]/g, '')),
        paymentStatus: parsedAI.paymentStatus || 'Unknown',
      });

      console.log('✅ Invoice saved to MongoDB');
    } catch (e) {
      console.log('⚠️  Invoice save/parse error:', e.message);
    }

    return {
      message: 'Document uploaded, text extracted, and AI analysis completed',
      fileName,
      filePath,
      fileType: mimeType,
      extractedText,
      aiAnalysis,
    };
  }
}

Injectable()(UploadService);
Reflect.metadata('design:paramtypes', [InvoicesService])(UploadService);

module.exports = { UploadService };
