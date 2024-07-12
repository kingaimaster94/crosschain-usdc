export const toFixed = (amount: string, decimals = 2) => {
  return parseFloat(amount).toFixed(decimals);
};
