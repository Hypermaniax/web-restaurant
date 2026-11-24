import { useState } from 'react'
import { customerApi } from '../api/customer-api'
import type { CreatedOrder, QrisPayment } from '../api/types'
import { getCustomerErrorMessage } from '../lib/errors'

export function useQrisPayment(tableCode: string) {
  const [qris, setQris] = useState<QrisPayment | null>(null)
  const [preparingQris, setPreparingQris] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [simulating, setSimulating] = useState(false)
  const [simulationError, setSimulationError] = useState<string | null>(null)
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null)

  function clearSimulationFeedback() {
    setSimulationError(null)
    setSimulationNotice(null)
  }

  function clearPaymentAlerts() {
    setPaymentError(null)
    clearSimulationFeedback()
  }

  function clearPaymentFeedback() {
    setQris(null)
    clearPaymentAlerts()
  }

  async function startQris(order: CreatedOrder) {
    setPreparingQris(true)
    clearPaymentAlerts()

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
    clearSimulationFeedback()

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

  return {
    qris,
    preparingQris,
    paymentError,
    simulating,
    simulationError,
    simulationNotice,
    startQris,
    simulatePayment,
    clearPaymentFeedback,
  }
}
