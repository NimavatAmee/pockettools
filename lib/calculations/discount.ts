export interface DiscountInput {
  originalPrice: number;
  discountPercentage: number;
}

export interface DiscountResult {
  originalPrice: number;
  discountPercentage: number;
  savingsAmount: number;
  finalPrice: number;
}

export function calculateDiscount(input: DiscountInput): DiscountResult {
  const originalPrice = Math.max(0, isNaN(input.originalPrice) ? 0 : input.originalPrice);
  const discountPercentage = Math.min(100, Math.max(0, isNaN(input.discountPercentage) ? 0 : input.discountPercentage));

  const savingsAmount = (originalPrice * discountPercentage) / 100;
  const finalPrice = Math.max(0, originalPrice - savingsAmount);

  return {
    originalPrice: Number(originalPrice.toFixed(2)),
    discountPercentage: Number(discountPercentage.toFixed(2)),
    savingsAmount: Number(savingsAmount.toFixed(2)),
    finalPrice: Number(finalPrice.toFixed(2)),
  };
}
