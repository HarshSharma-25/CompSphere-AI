'use strict';

const { Injectable } = require('@nestjs/common');
const { InvoicesService } = require('../invoices/invoices.service');
const Groq = require('groq-sdk');

class CopilotService {
  constructor(invoicesService) {
    this.invoicesService = invoicesService;
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async ask(question) {
    const dashboardData = await this.invoicesService.getDashboardStats();

    const chatCompletion = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful AI Copilot for Chartered Accountants. Answer questions using only the provided dashboard data. Keep answers short and professional.',
        },
        {
          role: 'user',
          content: `
Dashboard Data:
${JSON.stringify(dashboardData)}

Question:
${question}
          `,
        },
      ],
    });

    return {
      question,
      answer: chatCompletion.choices[0].message.content,
      dashboardData,
    };
  }
}

Injectable()(CopilotService);
Reflect.metadata('design:paramtypes', [InvoicesService])(CopilotService);

module.exports = { CopilotService };
