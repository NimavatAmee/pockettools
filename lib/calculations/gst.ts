export interface GstInput {
  amount: number;
  rate: number;
  isInclusive: boolean;
}

export interface GstResult {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export function calculateGst(input: GstInput): GstResult {
  const { amount, rate, isInclusive } = input;
  const safeAmount = Math.max(0, isNaN(amount) ? 0 : amount);
  const safeRate = Math.max(0, isNaN(rate) ? 0 : rate);

  if (safeAmount === 0 || safeRate === 0) {
    return {
      baseAmount: safeAmount,
      gstAmount: 0,
      totalAmount: safeAmount,
      cgst: 0,
      sgst: 0,
      igst: 0,
    };
  }

  let baseAmount: number;
  let gstAmount: number;
  let totalAmount: number;

  if (isInclusive) {
    // Total amount includes GST: Base = Amount / (1 + Rate / 100)
    baseAmount = safeAmount / (1 + safeRate / 100);
    gstAmount = safeAmount - baseAmount;
    totalAmount = safeAmount;
  } else {
    // Exclusive mode: GST added to Base
    baseAmount = safeAmount;
    gstAmount = (safeAmount * safeRate) / 100;
    totalAmount = safeAmount + gstAmount;
  }

  const halfTax = gstAmount / 2;

  return {
    baseAmount: Number(baseAmount.toFixed(2)),
    gstAmount: Number(gstAmount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    cgst: Number(halfTax.toFixed(2)),
    sgst: Number(halfTax.toFixed(2)),
    igst: Number(gstAmount.toFixed(2)),
  };
}
