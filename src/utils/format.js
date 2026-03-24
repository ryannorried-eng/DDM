const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  return usd.format(value);
}

export function formatRange(low, high) {
  return `${usd.format(low)} – ${usd.format(high)}`;
}
