import { ClassAddress } from '@/classes/ClassAddress'
import { ClassCompany } from '@/classes/ClassCompany'
import { ClassContact } from '@/classes/ClassContact'

export function buildCompanyStoragePath(uid) {
  const id = String(uid ?? '').trim() || 'draft'
  return `${ClassCompany.STORAGE_FOLDER}/${id}/logo.jpg`
}

function pickContactEmail(contact) {
  const emails = contact?.emails ?? []
  const preferred = emails.find((entry) => entry.type === ClassContact.TYPE_EMAIL.CONTACT)
  return preferred?.value ?? emails[0]?.value ?? ''
}

function pickContactPhone(contact) {
  const phones = contact?.phones ?? []
  const preferred = phones.find((entry) => entry.type === ClassContact.TYPE_PHONE.SHOP)
  return preferred?.value ?? phones[0]?.value ?? ''
}

export function getDefaultCompanyFormValues(uid = '') {
  return {
    name: '',
    tag: '',
    storage_url: buildCompanyStoragePath(uid),
    logo_url: '',
    address_street: '',
    address_zip: '',
    address_city: '',
    address_country: 'CH',
    email_contact: '',
    phone: '',
  }
}

export function companyToFormValues(company) {
  if (!company) return getDefaultCompanyFormValues()
  const uid = company.uid ?? ''
  const address = company.address instanceof ClassAddress
    ? company.address
    : new ClassAddress(company.address ?? {})
  const contact = company.contact instanceof ClassContact
    ? company.contact
    : ClassContact.fromFirestore(company.contact ?? {})

  return {
    name: company.name ?? '',
    tag: company.tag ?? '',
    storage_url: buildCompanyStoragePath(uid),
    logo_url: company.logo_url ?? '',
    address_street: address.street ?? '',
    address_zip: address.zip_code ?? '',
    address_city: address.city_name ?? '',
    address_country: address.country_code ?? 'CH',
    email_contact: pickContactEmail(contact),
    phone: pickContactPhone(contact),
  }
}

function normalizeCompanyFormValues(values = {}) {
  return {
    name: String(values.name ?? '').trim(),
    tag: String(values.tag ?? '').trim(),
    storage_url: String(values.storage_url ?? '').trim(),
    logo_url: String(values.logo_url ?? '').trim(),
    address_street: String(values.address_street ?? '').trim(),
    address_zip: String(values.address_zip ?? '').trim(),
    address_city: String(values.address_city ?? '').trim(),
    address_country: String(values.address_country ?? '').trim().toUpperCase(),
    email_contact: String(values.email_contact ?? '').trim(),
    phone: String(values.phone ?? '').trim(),
  }
}

export function hasCompanyFormChanges(current, baseline) {
  if (!baseline) return false
  return JSON.stringify(normalizeCompanyFormValues(current))
    !== JSON.stringify(normalizeCompanyFormValues(baseline))
}

export function formValuesToCompany(form, { uid = '' } = {}) {
  const normalized = normalizeCompanyFormValues(form)
  const contactEmails = normalized.email_contact
    ? [{ type: ClassContact.TYPE_EMAIL.CONTACT, value: normalized.email_contact }]
    : []
  const contactPhones = normalized.phone
    ? [{ type: ClassContact.TYPE_PHONE.SHOP, value: normalized.phone }]
    : []

  return new ClassCompany({
    uid,
    name: normalized.name,
    tag: normalized.tag,
    logo_url: normalized.logo_url,
    address: new ClassAddress({
      street: normalized.address_street,
      zip_code: normalized.address_zip,
      city_name: normalized.address_city,
      country_code: normalized.address_country || 'CH',
    }),
    contact: new ClassContact({
      emails: contactEmails,
      phones: contactPhones,
    }),
    last_edit_time: new Date(),
  })
}

export function formatCompanyCity(company, empty = '—') {
  const address = company?.address
  const city = address?.city_name ?? address?._city_name ?? ''
  return city ? String(city) : empty
}
