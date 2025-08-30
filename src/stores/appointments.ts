import { defineStore } from 'pinia'
import type { AppointmentRecord, AirtableResponse } from '@/types/airtable'

interface State {
  items: AppointmentRecord[]
  offset: string | null
  loading: boolean
  error: string | null
}

export const useAppointments = defineStore('appointments', {
  state: (): State => ({
    items: [],
    offset: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchAppointments(pageSize: number = 10) {
      const API_KEY = import.meta.env.VITE_AIRTABLE_KEY
      const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE

      const TABLE   = 'Appointments'

      const params = new URLSearchParams({ pageSize: String(pageSize) })
      if (this.offset) params.set('offset', this.offset)

      this.loading = true
      this.error = null
      try {
        const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE}?${params}`, {
          headers: { Authorization: `Bearer ${API_KEY}` }
        })
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const data: AirtableResponse = await res.json()

        this.items.push(...data.records)
        this.offset = data.offset ?? null
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    reset() {
      this.items = []
      this.offset = null
      this.error = null
      this.loading = false
    }
  },
  getters: {
    count: (s) => s.items.length,
    emails: (s) => s.items.flatMap(r => r.fields.contact_email)
  }
})
