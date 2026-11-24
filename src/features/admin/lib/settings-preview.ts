export function calculatePreview({
  subtotal,
  orderType,
  serviceRate,
  taxRate,
  taxInclusive,
  taxBaseIncludesService,
}: {
  subtotal: number
  orderType: 'DINE_IN' | 'TAKEAWAY'
  serviceRate: number
  taxRate: number
  taxInclusive: boolean
  taxBaseIncludesService: boolean
}) {
  const serviceAmount =
    orderType === 'DINE_IN'
      ? Math.round((subtotal * serviceRate * 100) / 10000)
      : 0
  const taxBase = subtotal + (taxBaseIncludesService ? serviceAmount : 0)
  let taxAmount = 0
  let total = subtotal + serviceAmount

  if (taxRate > 0) {
    const rateBp = Math.round(taxRate * 100)
    if (taxInclusive) {
      taxAmount = Math.round((taxBase * rateBp) / (10000 + rateBp))
    } else {
      taxAmount = Math.round((taxBase * rateBp) / 10000)
      total += taxAmount
    }
  }

  return {
    subtotal,
    service: serviceAmount,
    tax: taxAmount,
    total,
  }
}
