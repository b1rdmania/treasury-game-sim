export function formatMillions(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}b`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return `${Math.round(value)}`;
}

export function formatMoney(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}b`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${value.toFixed(0)}`;
}

