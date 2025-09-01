import type { AppointmentRecord } from '@/types/airtable'
export const safeGet = (obj: object | string, path: string, fallback = '') => {
  try {
    // path 'fields.contact_name[0]':
    return path
      .replace(/\[(\d+)\]/g, '.$1')
      .split('.')
      // @ts-expect-error
      .reduce((o, k) => (o && k in o ? o[k] : undefined), obj) ?? fallback
  } catch { return fallback }
}

export const getTime = (r: AppointmentRecord) => {
  const ad = (r.fields as any)?.appointment_date;
  const iso = Array.isArray(ad) ? ad?.[0] : ad;
  const t = Date.parse(iso ?? '');
  return Number.isFinite(t) ? t : Date.parse(r.createdTime ?? '');
};
