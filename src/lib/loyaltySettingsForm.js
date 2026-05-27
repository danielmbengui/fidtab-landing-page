import { ClassSettings } from '@/classes/ClassSettings'

export function getDefaultLoyaltyFormValues() {
  return {
    min_amount_to_earn_one_point: String(ClassSettings.MIN_AMOUNT_TO_EARN_ONE_POINT),
    max_amount_to_earn_one_point: String(ClassSettings.MAX_AMOUNT_TO_EARN_ONE_POINT),
    amount_to_use_one_point: String(ClassSettings.AMOUNT_TO_USE_ONE_POINT),
    currency_to_earn_one_point: ClassSettings.DEFAULT_CURRENCY,
    uids_products_prohibited_from_earning_points: [],
  }
}

export function settingsToFormValues(settings) {
  if (!settings) return getDefaultLoyaltyFormValues()
  return {
    min_amount_to_earn_one_point: String(settings.min_amount_to_earn_one_point ?? ''),
    max_amount_to_earn_one_point: String(settings.max_amount_to_earn_one_point ?? ''),
    amount_to_use_one_point: String(settings.amount_to_use_one_point ?? ''),
    currency_to_earn_one_point: settings.currency_to_earn_one_point ?? ClassSettings.DEFAULT_CURRENCY,
    uids_products_prohibited_from_earning_points: Array.isArray(settings.uids_products_prohibited_from_earning_points)
      ? [...settings.uids_products_prohibited_from_earning_points]
      : [],
  }
}

function parseAmount(value) {
  if (value === '' || value === null || value === undefined) return NaN
  return Number(value)
}

function normalizeFormValues(values = {}) {
  return {
    min_amount_to_earn_one_point: parseAmount(values.min_amount_to_earn_one_point),
    max_amount_to_earn_one_point: parseAmount(values.max_amount_to_earn_one_point),
    amount_to_use_one_point: parseAmount(values.amount_to_use_one_point),
    currency_to_earn_one_point: String(values.currency_to_earn_one_point ?? '').trim(),
    uids_products_prohibited_from_earning_points: [...(values.uids_products_prohibited_from_earning_points ?? [])].sort(),
  }
}

export function hasLoyaltyFormChanges(current, baseline) {
  if (!baseline) return false
  return JSON.stringify(normalizeFormValues(current))
    !== JSON.stringify(normalizeFormValues(baseline))
}

export function validateLoyaltyForm(values, messages) {
  const errors = {}
  const min = parseAmount(values.min_amount_to_earn_one_point)
  const max = parseAmount(values.max_amount_to_earn_one_point)
  const use = parseAmount(values.amount_to_use_one_point)

  if (!Number.isFinite(min) || min <= 0) {
    errors.min_amount_to_earn_one_point = messages.invalidMin
  }
  if (!Number.isFinite(max) || max <= 0) {
    errors.max_amount_to_earn_one_point = messages.invalidMax
  }
  if (Number.isFinite(min) && Number.isFinite(max) && min > max) {
    errors.max_amount_to_earn_one_point = messages.minGreaterThanMax
  }
  if (!Number.isFinite(use) || use <= 0) {
    errors.amount_to_use_one_point = messages.invalidUse
  }
  if (!String(values.currency_to_earn_one_point ?? '').trim()) {
    errors.currency_to_earn_one_point = messages.invalidCurrency
  }

  return errors
}

export function formValuesToSettings(form, { uid = ClassSettings.DEFAULT_UID } = {}) {
  return ClassSettings.makeInstance(uid, {
    uid,
    min_amount_to_earn_one_point: parseAmount(form.min_amount_to_earn_one_point),
    max_amount_to_earn_one_point: parseAmount(form.max_amount_to_earn_one_point),
    amount_to_use_one_point: parseAmount(form.amount_to_use_one_point),
    currency_to_earn_one_point: String(form.currency_to_earn_one_point ?? ClassSettings.DEFAULT_CURRENCY).trim(),
    uids_products_prohibited_from_earning_points: form.uids_products_prohibited_from_earning_points ?? [],
    last_edit_time: new Date(),
  })
}
