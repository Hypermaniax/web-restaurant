import { useEffect, useRef, useState } from 'react'
import { customerApi, usePaymentStatus } from '../api/customer-api'
import type {
  CreatedOrder,
  PaymentMethod,
  QuoteInputItem,
  QuoteTotals,
} from '../api/types'
import type { CheckoutFormValues } from '../components/checkout-panel'
import { getCustomerErrorMessage } from '../lib/errors'
import { useQrisPayment } from './use-qris-payment'

type Stage = 'menu' | 'checkout' | 'payment'

interface UseCustomerOrderOptions {
  tableCode: string
  quote: QuoteTotals | undefined
  quoteItems: QuoteInputItem[]
}

function newIdempotencyKey(): string {
  const randomUUID = globalThis.crypto?.randomUUID
  if (typeof randomUUID === 'function') {
    return randomUUID.call(globalThis.crypto)
  }
  return `order-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function useCustomerOrder({
  tableCode,
  quote,
  quoteItems,
}: UseCustomerOrderOptions) {
  const [stage, setStage] = useState<Stage>('menu')
  const [activeOrder, setActiveOrder] = useState<CreatedOrder | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const idempotencyKey = useRef<string | null>(null)
  const qrisPayment = useQrisPayment(tableCode)
  const paymentStatus = usePaymentStatus(
    tableCode,
    activeOrder?.id ?? null,
    stage === 'payment',
  )

  const quoteKey = JSON.stringify(quoteItems)

  useEffect(() => {
    idempotencyKey.current = null
  }, [quoteKey])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stage])

  function resetOrderState() {
    setActiveOrder(null)
    setPaymentMethod(null)
    qrisPayment.clearPaymentFeedback()
    setSubmitError(null)
    idempotencyKey.current = null
  }

  function startCheckout() {
    setSubmitError(null)
    setStage('checkout')
  }

  async function submitCheckout(values: CheckoutFormValues) {
    if (!quote || submitting || quoteItems.length === 0) {
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    const key = idempotencyKey.current ?? newIdempotencyKey()
    idempotencyKey.current = key

    try {
      const order = await customerApi.createOrder(tableCode, quoteItems, {
        customerName: values.customerName || null,
        notes: values.notes || null,
        idempotencyKey: key,
      })

      setActiveOrder(order)
      setPaymentMethod(values.paymentMethod)
      qrisPayment.clearPaymentFeedback()
      setStage('payment')

      if (values.paymentMethod === 'QRIS') {
        await qrisPayment.startQris(order)
      }
    } catch (error) {
      setSubmitError(getCustomerErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  function switchToCash() {
    setPaymentMethod('CASH')
    qrisPayment.clearPaymentFeedback()
  }

  function backToMenu() {
    setStage('menu')
    resetOrderState()
  }

  return {
    stage,
    activeOrder,
    paymentMethod,
    qris: qrisPayment.qris,
    preparingQris: qrisPayment.preparingQris,
    paymentError: qrisPayment.paymentError,
    simulating: qrisPayment.simulating,
    simulationError: qrisPayment.simulationError,
    simulationNotice: qrisPayment.simulationNotice,
    submitError,
    submitting,
    paymentStatus,
    startCheckout,
    startQris: qrisPayment.startQris,
    simulatePayment: qrisPayment.simulatePayment,
    submitCheckout,
    switchToCash,
    backToMenu,
  }
}

export type CustomerOrderController = ReturnType<typeof useCustomerOrder>
