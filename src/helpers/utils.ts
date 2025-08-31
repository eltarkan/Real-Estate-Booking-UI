export const safeGet = (obj, path, fallback = '') => {
  try {
    // path 'fields.contact_name[0]':
    return path
      .replace(/\[(\d+)\]/g, '.$1')
      .split('.')
      .reduce((o, k) => (o && k in o ? o[k] : undefined), obj) ?? fallback
  } catch { return fallback }
}
