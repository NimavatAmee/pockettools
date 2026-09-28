import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { EmiResult } from "@/lib/calculations/emi";
import { AmortizationMonth } from "@/lib/calculations/amortization";
import { GstResult } from "@/lib/calculations/gst";
import { SipResult, SipParams } from "@/lib/calculations/sip";
import { CompoundInterestResult, CompoundInterestParams } from "@/lib/calculations/compound-interest";
import { IncomeTaxComparisonResult, IncomeTaxInputs } from "@/lib/calculations/income-tax";
import { formatCurrency } from "@/lib/formatters";

function addPdfHeader(doc: jsPDF, subtitle: string) {
  doc.setFillColor(91, 91, 240); // Primary #5B5BF0
  doc.rect(0, 0, 210, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("POCKET TOOLS", 14, 12);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle, 14, 18);

  const reportDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.text(`Generated: ${reportDate}`, 196, 18, { align: "right" });
}

function addPdfFooters(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.text(
      `Pocket Tools (pockettools.app) — Free, Private In-Browser Utilities — Page ${i} of ${pageCount}`,
      105,
      290,
      { align: "center" }
    );
  }
}

/**
 * Generates and downloads a branded PDF report for EMI Loan Amortization Schedule
 */
export function exportEmiScheduleToPdf(
  emiResult: EmiResult,
  interestRate: number,
  monthlySchedule: AmortizationMonth[]
): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  addPdfHeader(doc, "Loan EMI Amortization Schedule & Repayment Report");

  doc.setTextColor(23, 23, 26);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Loan Overview Summary", 14, 34);

  autoTable(doc, {
    startY: 38,
    theme: "grid",
    head: [["Loan Principal", "Interest Rate", "Loan Tenure", "Monthly EMI", "Total Interest", "Total Payable"]],
    body: [
      [
        formatCurrency(emiResult.principal),
        `${interestRate}% p.a.`,
        `${emiResult.months} Months`,
        formatCurrency(emiResult.monthlyEmi),
        formatCurrency(emiResult.totalInterest),
        formatCurrency(emiResult.totalPayment),
      ],
    ],
    headStyles: { fillColor: [91, 91, 240], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8, halign: "center" },
    bodyStyles: { fontSize: 8.5, halign: "center", fontStyle: "bold" },
    styles: { cellPadding: 3 },
  });

  const startAmortY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Month-by-Month Repayment Schedule", 14, startAmortY);

  const tableRows = monthlySchedule.map((m) => [
    `Month ${m.month}`,
    formatCurrency(m.openingBalance),
    formatCurrency(m.emi),
    formatCurrency(m.principalPaid),
    formatCurrency(m.interestPaid),
    formatCurrency(m.closingBalance),
  ]);

  autoTable(doc, {
    startY: startAmortY + 4,
    head: [["Period", "Opening Balance", "Monthly EMI", "Principal Paid", "Interest Paid", "Closing Balance"]],
    body: tableRows,
    theme: "striped",
    headStyles: { fillColor: [72, 72, 220], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [248, 248, 251] },
    styles: { cellPadding: 2 },
  });

  addPdfFooters(doc);
  doc.save(`PocketTools_EMI_Schedule_${Date.now()}.pdf`);
}

/**
 * Generates and downloads a branded PDF receipt for GST Tax Calculation
 */
export function exportGstReceiptToPdf(
  amount: number,
  rate: number,
  isInclusive: boolean,
  result: GstResult
): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  addPdfHeader(doc, "Goods & Services Tax (GST) Calculation Receipt");

  doc.setTextColor(23, 23, 26);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Tax Transaction Breakdown", 14, 34);

  autoTable(doc, {
    startY: 38,
    theme: "striped",
    head: [["Particulars", "Details / Value"]],
    body: [
      ["Calculation Mode", isInclusive ? "GST Inclusive (Tax Extracted)" : "GST Exclusive (Tax Added)"],
      ["Input Amount", formatCurrency(amount)],
      ["Applied GST Rate", `${rate}%`],
      ["Base Net Amount", formatCurrency(result.baseAmount)],
      ["CGST (Central Tax 50%)", formatCurrency(result.cgst)],
      ["SGST / UTGST (State Tax 50%)", formatCurrency(result.sgst)],
      ["Total GST Tax Amount", formatCurrency(result.gstAmount)],
      ["Total Gross Payable", formatCurrency(result.totalAmount)],
    ],
    headStyles: { fillColor: [91, 91, 240], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
    styles: { cellPadding: 3.5 },
  });

  addPdfFooters(doc);
  doc.save(`PocketTools_GST_Receipt_${Date.now()}.pdf`);
}

/**
 * Generates and downloads a branded PDF report for SIP & Lumpsum Wealth Projections
 */
export function exportSipReportToPdf(params: SipParams, result: SipResult): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  addPdfHeader(doc, "Mutual Fund SIP & Wealth Growth Projection Report");

  doc.setTextColor(23, 23, 26);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Investment Overview Summary", 14, 34);

  autoTable(doc, {
    startY: 38,
    theme: "grid",
    head: [["Investment Type", "Periodic Amount", "Expected Return", "Time Duration", "Total Invested", "Est. Capital Gains", "Future Corpus"]],
    body: [
      [
        params.investmentType === "sip" ? "Monthly SIP" : "One-Time Lumpsum",
        params.investmentType === "sip" ? formatCurrency(params.monthlyInvestment) : formatCurrency(params.lumpsumAmount),
        `${params.expectedReturnRate}% p.a.`,
        `${params.timePeriodYears} Years`,
        formatCurrency(result.totalInvested),
        formatCurrency(result.wealthGained),
        formatCurrency(result.totalValue),
      ],
    ],
    headStyles: { fillColor: [91, 91, 240], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8, halign: "center" },
    bodyStyles: { fontSize: 8, halign: "center", fontStyle: "bold" },
    styles: { cellPadding: 2.5 },
  });

  const startProgY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Year-by-Year Wealth Growth Progression", 14, startProgY);

  const progRows = result.yearlySchedule.map((yr) => [
    `Year ${yr.year}`,
    formatCurrency(yr.investedAmount),
    formatCurrency(yr.wealthGained),
    formatCurrency(yr.totalCorpus),
  ]);

  autoTable(doc, {
    startY: startProgY + 4,
    head: [["Timeline", "Invested Amount", "Estimated Wealth Gained", "Total Accumulated Corpus"]],
    body: progRows,
    theme: "striped",
    headStyles: { fillColor: [72, 72, 220], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [248, 248, 251] },
    styles: { cellPadding: 2.5 },
  });

  addPdfFooters(doc);
  doc.save(`PocketTools_SIP_Wealth_Report_${Date.now()}.pdf`);
}

/**
 * Generates and downloads a branded PDF report for Income Tax Regime Comparison
 */
export function exportIncomeTaxReportToPdf(inputs: IncomeTaxInputs, result: IncomeTaxComparisonResult): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  addPdfHeader(doc, "Income Tax Comparison Report — Old vs New Regime (FY 2024-25)");

  doc.setTextColor(23, 23, 26);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Side-by-Side Tax Comparison Summary", 14, 34);

  autoTable(doc, {
    startY: 38,
    theme: "grid",
    head: [["Particulars", "New Tax Regime (Default)", "Old Tax Regime"]],
    body: [
      ["Gross Annual Salary / Income", formatCurrency(result.newRegime.grossIncome), formatCurrency(result.oldRegime.grossIncome)],
      ["Standard Deduction", formatCurrency(result.newRegime.standardDeduction), formatCurrency(result.oldRegime.standardDeduction)],
      ["Total Deductions (80C, 80D, HRA, etc.)", formatCurrency(result.newRegime.totalDeductions), formatCurrency(result.oldRegime.totalDeductions)],
      ["Net Taxable Income", formatCurrency(result.newRegime.netTaxableIncome), formatCurrency(result.oldRegime.netTaxableIncome)],
      ["Base Slab Tax", formatCurrency(result.newRegime.baseTax), formatCurrency(result.oldRegime.baseTax)],
      ["Section 87A Tax Rebate", `- ${formatCurrency(result.newRegime.rebate87A)}`, `- ${formatCurrency(result.oldRegime.rebate87A)}`],
      ["Health & Education Cess (4%)", formatCurrency(result.newRegime.cess), formatCurrency(result.oldRegime.cess)],
      ["Total Final Tax Payable", formatCurrency(result.newRegime.totalTaxLiability), formatCurrency(result.oldRegime.totalTaxLiability)],
      [
        "Recommendation Result",
        result.recommendedRegime === "new" ? `RECOMMENDED (Saves ${formatCurrency(result.taxSavings)})` : "Higher Tax",
        result.recommendedRegime === "old" ? `RECOMMENDED (Saves ${formatCurrency(result.taxSavings)})` : "Higher Tax",
      ],
    ],
    headStyles: { fillColor: [91, 91, 240], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [30, 30, 30] },
    styles: { cellPadding: 3 },
  });

  addPdfFooters(doc);
  doc.save(`PocketTools_Income_Tax_Comparison_${Date.now()}.pdf`);
}
