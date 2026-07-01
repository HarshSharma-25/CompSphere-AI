'use strict';

const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, default: 'Not found' },
    customerName: { type: String, default: 'Not found' },
    totalAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, default: 'Unknown' },
  },
  { timestamps: true },
);

module.exports = { InvoiceSchema };
