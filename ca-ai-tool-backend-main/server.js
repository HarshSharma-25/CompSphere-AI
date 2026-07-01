require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const Client = require("./models/Client");
const Invoice = require("./models/Invoice");

const mongoose = require("mongoose");
require("dotenv").config();
const Groq = require("groq-sdk");

const app = express();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

let invoices = [];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

async function analyzeInvoiceWithAI(extractedText) {
  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant for Chartered Accountants. Extract important invoice details from the given invoice text. . Do not add extra explanation.",
      },
      {
        role: "user",
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

app.get("/", (req, res) => {
  res.send("CA AI Tool Backend Running Successfully");
});

app.post("/api/clients", async (req, res) => {
  try {
    const client = await Client.create({
      clientName: req.body.clientName,
      businessName: req.body.businessName,
      gstNumber: req.body.gstNumber,
      email: req.body.email,
      phone: req.body.phone,
    });

    res.json({
      message: "Client added successfully",
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding client",
      error: error.message,
    });
  }
});

app.get("/api/clients", async (req, res) => {
  try {
    const clients = await Client.find();

    res.json(clients);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching clients",
      error: error.message,
    });
  }
});

app.post("/api/upload", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;
    const mimeType = req.file.mimetype;

    let extractedText = "";

    if (mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (mimeType.startsWith("image/")) {
      const result = await Tesseract.recognize(filePath, "eng");
      extractedText = result.data.text;
    } else {
      extractedText = "This file type is uploaded but OCR is not supported for this format.";
    }

    let aiAnalysis = null;

    if (extractedText && extractedText.length > 20) {
      aiAnalysis = await analyzeInvoiceWithAI(extractedText);
    }
    try {
  const parsedAI = JSON.parse(aiAnalysis);

 const totalAmountValue =
  parsedAI.totalAmount ||
  parsedAI.totalDue ||
  parsedAI.amount ||
  parsedAI.finalAmount ||
  "0";

const taxAmountValue =
  parsedAI.taxAmount ||
  parsedAI.gstAmount ||
  parsedAI.tax ||
  parsedAI.GST ||
  "0";

invoices.push({
  invoiceNumber: parsedAI.invoiceNumber || "Not found",
  customerName: parsedAI.customerName || "Not found",
  totalAmount: Number(String(totalAmountValue).replace(/[^0-9.]/g, "")),
  taxAmount: Number(String(taxAmountValue).replace(/[^0-9.]/g, "")),
  paymentStatus: parsedAI.paymentStatus || "Unknown",
});
await Invoice.create({
  invoiceNumber: parsedAI.invoiceNumber,
  customerName: parsedAI.customerName,
  totalAmount: Number(String(totalAmountValue).replace(/[^0-9.]/g, "")),
  taxAmount: Number(String(taxAmountValue).replace(/[^0-9.]/g, "")),
  paymentStatus: parsedAI.paymentStatus || "Unknown",
});

console.log("Invoice saved to MongoDB");
}catch (e) {
  console.log("Invoice save error:", e);
}

    res.json({
      message: "Document uploaded, text extracted, and AI analysis completed",
      fileName: fileName,
      filePath: filePath,
      fileType: mimeType,
      extractedText: extractedText,
      aiAnalysis: aiAnalysis,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while processing document",
      error: error.message,
    });
  }
});
app.get("/api/dashboard", (req, res) => {
  const totalInvoices = invoices.length;

  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + (inv.totalAmount || 0),
    0
  );

  const totalGST = invoices.reduce(
    (sum, inv) => sum + (inv.taxAmount || 0),
    0
  );

  const paidInvoices = invoices.filter(
    (inv) => String(inv.paymentStatus).toLowerCase() === "paid"
  ).length;

  const pendingInvoices = totalInvoices - paidInvoices;

  res.json({
    totalInvoices,
    totalRevenue,
    totalGST,
    paidInvoices,
    pendingInvoices,
  });
});
app.post("/api/copilot", async (req, res) => {
  try {
    const question = req.body.question;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const dashboardData = {
      totalInvoices: invoices.length,
      totalRevenue: invoices.reduce(
        (sum, inv) => sum + (inv.totalAmount || 0),
        0
      ),
      totalGST: invoices.reduce(
        (sum, inv) => sum + (inv.taxAmount || 0),
        0
      ),
      paidInvoices: invoices.filter(
        (inv) => String(inv.paymentStatus).toLowerCase() === "paid"
      ).length,
      pendingInvoices: invoices.filter(
        (inv) => String(inv.paymentStatus).toLowerCase() !== "paid"
      ).length,
    };

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI Copilot for Chartered Accountants. Answer questions using only the provided dashboard data. Keep answers short and professional.",
        },
        {
          role: "user",
          content: `
Dashboard Data:
${JSON.stringify(dashboardData)}

Question:
${question}
          `,
        },
      ],
    });

    res.json({
      question: question,
      answer: chatCompletion.choices[0].message.content,
      dashboardData: dashboardData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in CA Copilot",
      error: error.message,
    });
  }
});
app.post("/api/gst-check", async (req, res) => {
  try {
    const { taxableAmount, taxAmount, totalAmount } = req.body;

    const taxable = Number(taxableAmount);
    const tax = Number(taxAmount);
    const total = Number(totalAmount);

    let gstRate = 0;
    let status = "Valid";
    let issues = [];

    if (!taxable || !tax || !total) {
      status = "Warning";
      issues.push("Some GST/tax values are missing.");
    }

    if (taxable && tax) {
      gstRate = (tax / taxable) * 100;
    }

    if (taxable + tax !== total) {
      status = "Warning";
      issues.push("Total amount does not match taxable amount plus tax amount.");
    }

    res.json({
      taxableAmount: taxable,
      taxAmount: tax,
      totalAmount: total,
      gstRate: Number(gstRate.toFixed(2)),
      gstComplianceStatus: status,
      issuesFound: issues,
    });
  } catch (error) {
    res.status(500).json({
      message: "GST check failed",
      error: error.message,
    });
  }
});
app.get("/api/report", async (req, res) => {
  try {
    const dashboardData = {
      totalInvoices: invoices.length,
      totalRevenue: invoices.reduce(
        (sum, inv) => sum + (inv.totalAmount || 0),
        0
      ),
      totalGST: invoices.reduce(
        (sum, inv) => sum + (inv.taxAmount || 0),
        0
      ),
      paidInvoices: invoices.filter(
        (inv) => String(inv.paymentStatus).toLowerCase() === "paid"
      ).length,
      pendingInvoices: invoices.filter(
        (inv) => String(inv.paymentStatus).toLowerCase() !== "paid"
      ).length,
    };

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an AI financial report assistant for Chartered Accountants. Generate a short professional financial report using the given dashboard data.",
        },
        {
          role: "user",
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

    res.json({
      message: "Financial report generated successfully",
      dashboardData,
      report: chatCompletion.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({
      message: "Report generation failed",
      error: error.message,
    });
  }
});
app.listen(3001, () => {
  console.log("Server running on port 3001");
});