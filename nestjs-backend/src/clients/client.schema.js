'use strict';

const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    businessName: { type: String, default: '' },
    gstNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  { timestamps: true },
);

module.exports = { ClientSchema };
