'use strict';

const { Injectable } = require('@nestjs/common');
const { InvoicesService } = require('../invoices/invoices.service');
const Groq = require('groq-sdk');

class ReportService {
  constructor(invoicesService) {
    this.invoicesService = invoicesService;
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async generateReport() {
    const dashboardData = await this.invoicesService.getDashboardStats();

    const chatCompletion = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI financial report assistant for Chartered Accountants. Generate a short professional financial report using the given dashboard data.',
        },
        {
          role: 'user',
          content: `
Dashboard Data:
${JSON.stringify(dashboardData)}

Generate:
1. Revenue Summary
2. GST Summary
3. Payment Status Summary
4. Business Insight
5. CA Recommendation
          `,
        },
      ],
    });

    return {
      message: 'Financial report generated successfully',
      dashboardData,
      report: chatCompletion.choices[0].message.content,
    };
  }
}

Injectable()(ReportService);
Reflect.metadata('design:paramtypes', [InvoicesService])(ReportService);

module.exports = { ReportService };
