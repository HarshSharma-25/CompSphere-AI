'use strict';

const { Injectable } = require('@nestjs/common');
const { InjectModel } = require('@nestjs/mongoose');

class InvoicesService {
  constructor(invoiceModel) {
    this.invoiceModel = invoiceModel;
  }

  async create(data) {
    const invoice = new this.invoiceModel(data);
    return invoice.save();
  }

  async findAll() {
    return this.invoiceModel.find().sort({ createdAt: -1 }).exec();
  }

  async getDashboardStats() {
    const invoices = await this.findAll();
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const totalGST = invoices.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0);
    const paidInvoices = invoices.filter(
      (inv) => String(inv.paymentStatus).toLowerCase() === 'paid',
    ).length;
    const pendingInvoices = totalInvoices - paidInvoices;

    return { totalInvoices, totalRevenue, totalGST, paidInvoices, pendingInvoices };
  }
}

// Apply NestJS DI decorators for plain JavaScript
Injectable()(InvoicesService);

// Tell NestJS what to inject at constructor index 0
InjectModel('Invoice')(InvoicesService, undefined, 0);

module.exports = { InvoicesService };
