import { useEffect, useRef, useState } from 'react'
import { customerApi, usePaymentStatus } from '../api/customer-api'
import type {
  CreatedOrder,
  PaymentMethod,
  QrisPayment,
  QuoteInputItem,
  QuoteTotals,
} from '../api/types'
import type { CheckoutFormValues } from '../components/checkout-panel'
import { getCustomerErrorMessage } from '../lib/errors'

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
  const [qris, setQris] = useState<QrisPayment | null>(null)
  const [preparingQris, setPreparingQris] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [simulating, setSimulating] = useState(false)
  const [simulationError, setSimulationError] = useState<string | null>(null)
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const idempotencyKey = useRef<string | null>(null)
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

  function startCheckout() {
    setSubmitError(null)
    setStage('checkout')
  }

  async function startQris(order: CreatedOrder) {
    setPreparingQris(true)
    setPaymentError(null)
    setSimulationError(null)
    setSimulationNotice(null)

    try {
      const payment = await customerApi.payOnline(tableCode, order.id)
      setQris(payment)
    } catch (error) {
      setPaymentError(getCustomerErrorMessage(error))
    } finally {
      setPreparingQris(false)
    }
  }

  async function simulatePayment(order: CreatedOrder) {
    if (simulating) {
      return
    }

    setSimulating(true)
    setSimulationError(null)
    setSimulationNotice(null)

    try {
      await customerApi.simulatePayment(tableCode, order.id)
      setSimulationNotice(
        'Simulasi dikirim ke Xendit. Menunggu status pembayaran...',
      )
    } catch (error) {
      setSimulationError(getCustomerErrorMessage(error))
    } finally {
      setSimulating(false)
    }
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
      setQris(null)
      setPaymentError(null)
      setSimulationError(null)
      setSimulationNotice(null)
      setStage('payment')

      if (values.paymentMethod === 'QRIS') {
        await startQris(order)
      }
    } catch (error) {
      setSubmitError(getCustomerErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  function switchToCash() {
    setPaymentMethod('CASH')
    setQris(null)
    setPaymentError(null)
    setSimulationError(null)
    setSimulationNotice(null)
  }

  function backToMenu() {
    setStage('menu')
    setActiveOrder(null)
    setPaymentMethod(null)
    setQris(null)
    setPaymentError(null)
    setSimulationError(null)
    setSimulationNotice(null)
    setSubmitError(null)
    idempotencyKey.current = null
  }

  return {
    stage,
    activeOrder,
    paymentMethod,
    qris,
    preparingQris,
    paymentError,
    simulating,
    simulationError,
    simulationNotice,
    submitError,
    submitting,
    paymentStatus,
    startCheckout,
    startQris,
    simulatePayment,
    submitCheckout,
    switchToCash,
    backToMenu,
  }
}
