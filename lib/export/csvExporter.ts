import { AmortizationMonth, AmortizationYear } from "@/lib/calculations/amortization";
import { GstResult } from "@/lib/calculations/gst";
import { EmiResult } from "@/lib/calculations/emi";
import { SipResult, SipParams } from "@/lib/calculations/sip";
import { CompoundInterestResult, CompoundInterestParams } from "@/lib/calculations/compound-interest";

/**
 * Downloads data as a CSV file directly in the browser
 */
export function downloadCsv(filename: string, csvContent: string): void {
  // UTF-8 BOM for Excel compatibility with ₹ symbols
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports EMI Loan Amortization Schedule to CSV
 */
export function exportEmiScheduleToCsv(
  emiResult: EmiResult,
  monthlySchedule: AmortizationMonth[],
  yearlySchedule: AmortizationYear[]
): void {
  const lines: string[] = [];

  lines.push("POCKET TOOLS - LOAN EMI AMORTIZATION REPORT");
  lines.push(`Generated Date,${new Date().toLocaleDateString("en-IN")}`);
  lines.push("");
  lines.push("LOAN SUMMARY");
  lines.push(`Principal Amount,${emiResult.principal}`);
  lines.push(`Total Months,${emiResult.months}`);
  lines.push(`Monthly EMI,${emiResult.monthlyEmi}`);
  lines.push(`Total Interest,${emiResult.totalInterest}`);
  lines.push(`Total Repayment,${emiResult.totalPayment}`);
  lines.push("");

  lines.push("YEARLY SUMMARY");
  lines.push("Year,Principal Repaid,Interest Paid,Total Installment,Closing Balance");
  yearlySchedule.forEach((yr) => {
    lines.push(`Year ${yr.year},${yr.principalPaid},${yr.interestPaid},${yr.totalPaid},${yr.closingBalance}`);
  });
  lines.push("");

  lines.push("MONTH-BY-MONTH REPAYMENT SCHEDULE");
  lines.push("Month,Opening Balance,Monthly EMI,Principal Paid,Interest Paid,Closing Balance");
  monthlySchedule.forEach((m) => {
    lines.push(`${m.month},${m.openingBalance},${m.emi},${m.principalPaid},${m.interestPaid},${m.closingBalance}`);
  });

  const csvContent = lines.join("\r\n");
  downloadCsv(`PocketTools_EMI_Schedule_${Date.now()}`, csvContent);
}

/**
 * Exports GST Calculation Summary to CSV
 */
export function exportGstSummaryToCsv(
  amount: number,
  rate: number,
  isInclusive: boolean,
  result: GstResult
): void {
  const lines: string[] = [];

  lines.push("POCKET TOOLS - GST TAX CALCULATION RECEIPT");
  lines.push(`Generated Date,${new Date().toLocaleDateString("en-IN")}`);
  lines.push("");
  lines.push("TRANSACTION BREAKDOWN");
  lines.push(`Calculation Mode,${isInclusive ? "GST Inclusive (Extract Tax)" : "GST Exclusive (Add Tax)"}`);
  lines.push(`Input Amount,${amount}`);
  lines.push(`GST Tax Rate,${rate}%`);
  lines.push(`Base Net Amount,${result.baseAmount}`);
  lines.push(`CGST (50%),${result.cgst}`);
  lines.push(`SGST (50%),${result.sgst}`);
  lines.push(`Total GST Tax,${result.gstAmount}`);
  lines.push(`Total Gross Payable,${result.totalAmount}`);

  const csvContent = lines.join("\r\n");
  downloadCsv(`PocketTools_GST_Receipt_${Date.now()}`, csvContent);
}

/**
 * Exports SIP Wealth Progression to CSV
 */
export function exportSipSummaryToCsv(params: SipParams, result: SipResult): void {
  const lines: string[] = [];

  lines.push("POCKET TOOLS - MUTUAL FUND SIP WEALTH REPORT");
  lines.push(`Generated Date,${new Date().toLocaleDateString("en-IN")}`);
  lines.push("");
  lines.push("INVESTMENT SUMMARY");
  lines.push(`Investment Type,${params.investmentType === "sip" ? "Monthly SIP" : "Lumpsum"}`);
  lines.push(`Amount,${params.investmentType === "sip" ? params.monthlyInvestment : params.lumpsumAmount}`);
  lines.push(`Expected Annual Return,${params.expectedReturnRate}%`);
  lines.push(`Duration (Years),${params.timePeriodYears}`);
  lines.push(`Total Amount Invested,${result.totalInvested}`);
  lines.push(`Estimated Capital Gains,${result.wealthGained}`);
  lines.push(`Total Future Corpus,${result.totalValue}`);
  lines.push("");

  lines.push("YEAR-BY-YEAR WEALTH PROGRESSION");
  lines.push("Year,Invested Amount,Estimated Wealth Gained,Total Accumulated Corpus");
  result.yearlySchedule.forEach((yr) => {
    lines.push(`Year ${yr.year},${yr.investedAmount},${yr.wealthGained},${yr.totalCorpus}`);
  });

  const csvContent = lines.join("\r\n");
  downloadCsv(`PocketTools_SIP_Wealth_Report_${Date.now()}`, csvContent);
}

/**
 * Exports Compound Interest Schedule to CSV
 */
export function exportCompoundInterestSummaryToCsv(
  params: CompoundInterestParams,
  result: CompoundInterestResult
): void {
  const lines: string[] = [];

  lines.push("POCKET TOOLS - COMPOUND INTEREST WEALTH REPORT");
  lines.push(`Generated Date,${new Date().toLocaleDateString("en-IN")}`);
  lines.push("");
  lines.push("COMPOUNDING SUMMARY");
  lines.push(`Initial Principal,${result.initialPrincipal}`);
  lines.push(`Annual Interest Rate,${params.annualRate}%`);
  lines.push(`Compounding Frequency,${params.frequency}`);
  lines.push(`Duration (Years),${params.timeYears}`);
  lines.push(`Total Deposits,${result.totalDeposits}`);
  lines.push(`Total Interest Earned,${result.totalInterest}`);
  lines.push(`Final Maturity Balance,${result.finalBalance}`);
  lines.push(`Gain from Compounding (vs SI),${result.compoundDifference}`);
  lines.push("");

  lines.push("YEAR-BY-YEAR COMPOUNDING PROGRESSION");
  lines.push("Year,Total Invested,Interest Earned,Total Balance");
  result.yearlySchedule.forEach((yr) => {
    lines.push(`Year ${yr.year},${yr.principalInvested},${yr.interestEarned},${yr.totalBalance}`);
  });

  const csvContent = lines.join("\r\n");
  downloadCsv(`PocketTools_Compound_Interest_Report_${Date.now()}`, csvContent);
}
