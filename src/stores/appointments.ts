import { defineStore } from 'pinia'
import type { AppointmentRecord, AirtableResponse } from '@/types/airtable'
import { UserPopData } from '../helpers/dummy'

interface State {
  allItems: AppointmentRecord[]
  items: AppointmentRecord[]

  page: number
  pageSize: number
  loading: boolean
  loadedAll: boolean
  error: string | null

  dummyData: object[]
}

export const useAppointments = defineStore('appointments', {
  state: (): State => ({
    allItems: [],
    items: [],
    page: 1,
    pageSize: 10,
    loading: false,
    loadedAll: false,
    error: null,
    dummyData: [],
  }),

  actions: {
    async fetchAll() {
      if (this.loadedAll) {
        this._applyPage()
        return
      }

      const API_KEY = import.meta.env.VITE_AIRTABLE_KEY
      const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE
      const TABLE   = 'Appointments'

      const baseParams = new URLSearchParams()
      baseParams.set('pageSize', '100')
      baseParams.set('sort[0][field]', 'appointment_date')
      baseParams.set('sort[0][direction]', 'desc')

      this.loading = true
      this.error = null

      try {
        let offset: string | undefined
        const acc: AppointmentRecord[] = []
        let guard = 0

        do {
          const params = new URLSearchParams(baseParams)
          if (offset) params.set('offset', offset)

          const res = await fetch(
            `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}?${params}`,
            { headers: { Authorization: `Bearer ${API_KEY}` } }
          )
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
          const data: AirtableResponse = await res.json()

          acc.push(...data.records)
          offset = data.offset
          guard++
          if (guard > 500) throw new Error('Pagination guard tripped')

        } while (offset)

        acc.sort((a, b) => {
          const adA = (a.fields as any)?.appointment_date
          const adB = (b.fields as any)?.appointment_date
          if (adA && adB) {
            return new Date(adB).getTime() - new Date(adA).getTime()
          }
          return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
        })

        this.allItems = acc
        this.loadedAll = true
        this.page = 1
        this._applyPage()
      } catch (e: any) {
        this.error = e?.message ?? 'Fetch error'
      } finally {
        this.loading = false
      }
    },


    setPage(p: number) {
      const max = Math.max(1, this.totalPages)
      this.page = Math.min(Math.max(1, p), max)
      this._applyPage()
    },

    nextPage() {
      if (this.canNext) this.setPage(this.page + 1)
    },
    prevPage() {
      if (this.canPrev) this.setPage(this.page - 1)
    },

    /**
     * Avatar dummy verisi
     */
    async dummyDataFeed() {
      this.dummyData = UserPopData
    },

    /**
     * Mevcut page & pageSize'a göre items slice uygular.
     */
    _applyPage() {
      const start = (this.page - 1) * this.pageSize
      const end = start + this.pageSize
      this.items = this.allItems.slice(start, end)
    },

    reset() {
      this.allItems = []
      this.items = []
      this.page = 1
      this.pageSize = 10
      this.loadedAll = false
      this.error = null
      this.loading = false
    },
  },

  getters: {
    total: (s) => s.allItems.length,
    totalPages: (s) => Math.max(1, Math.ceil(s.allItems.length / s.pageSize)),
    canNext: (s) => s.page < Math.ceil((s.allItems.length || 1) / s.pageSize),
    canPrev: (s) => s.page > 1,
    count: (s) => s.items.length,
    emails: (s) => s.allItems.flatMap(r => r.fields.contact_email),
  },
})
