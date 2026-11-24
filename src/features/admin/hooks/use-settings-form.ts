import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { Settings, TaxRule } from '../api/types'
import {
  defaultSettingsValues,
  settingsSchema,
  toSettingsFormValues,
  type SettingsValues,
} from '../lib/settings-form'

export function useSettingsForm(settings?: Settings, taxRules?: TaxRule[]) {
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettingsValues,
  })

  useEffect(() => {
    if (!settings) {
      return
    }
    form.reset(toSettingsFormValues(settings, taxRules))
  }, [form, settings, taxRules])

  return form
}
