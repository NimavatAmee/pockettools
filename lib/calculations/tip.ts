export interface TipInput {
  billAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
}

export interface TipResult {
  billAmount: number;
  tipPercentage: number;
  tipAmount: number;
  totalAmount: number;
  numberOfPeople: number;
  tipPerPerson: number;
  totalPerPerson: number;
}

export function calculateTip(input: TipInput): TipResult {
  const billAmount = Math.max(0, isNaN(input.billAmount) ? 0 : input.billAmount);
  const tipPercentage = Math.max(0, isNaN(input.tipPercentage) ? 0 : input.tipPercentage);
  const numberOfPeople = Math.max(1, isNaN(input.numberOfPeople) ? 1 : Math.round(input.numberOfPeople));

  const tipAmount = (billAmount * tipPercentage) / 100;
  const totalAmount = billAmount + tipAmount;
  const tipPerPerson = tipAmount / numberOfPeople;
  const totalPerPerson = totalAmount / numberOfPeople;

  return {
    billAmount: Number(billAmount.toFixed(2)),
    tipPercentage: Number(tipPercentage.toFixed(2)),
    tipAmount: Number(tipAmount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    numberOfPeople,
    tipPerPerson: Number(tipPerPerson.toFixed(2)),
    totalPerPerson: Number(totalPerPerson.toFixed(2)),
  };
}
