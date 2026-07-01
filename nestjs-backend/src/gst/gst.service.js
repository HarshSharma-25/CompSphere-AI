'use strict';

const { Injectable } = require('@nestjs/common');

class GstService {
  check({ taxableAmount, taxAmount, totalAmount }) {
    const taxable = Number(taxableAmount);
    const tax = Number(taxAmount);
    const total = Number(totalAmount);

    let gstRate = 0;
    let status = 'Valid';
    const issues = [];

    if (!taxable || !tax || !total) {
      status = 'Warning';
      issues.push('Some GST/tax values are missing.');
    }

    if (taxable && tax) {
      gstRate = (tax / taxable) * 100;
    }

    if (taxable + tax !== total) {
      status = 'Warning';
      issues.push('Total amount does not match taxable amount plus tax amount.');
    }

    return {
      taxableAmount: taxable,
      taxAmount: tax,
      totalAmount: total,
      gstRate: Number(gstRate.toFixed(2)),
      gstComplianceStatus: status,
      issuesFound: issues,
    };
  }
}

Injectable()(GstService);

module.exports = { GstService };
