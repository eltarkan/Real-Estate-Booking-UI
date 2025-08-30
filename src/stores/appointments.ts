import { defineStore } from 'pinia'
import type { AppointmentRecord, AirtableResponse } from '@/types/airtable'
import { UserPopData } from '../helpers/dummy'

interface Filters {
  q: string
  from: string
  to: string
  status: 'all' | 'cancelled' | 'completed' | 'upcoming'
}

interface State {
  // fresh data
  allItems: AppointmentRecord[]
  items: AppointmentRecord[]

  // backup
  originalAllItems: AppointmentRecord[] | null

  // filter state
  currentFilters: Filters

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
    originalAllItems: null,
    currentFilters: { q: '', from: '', to: '', status: 'all' },
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
          if (adA && adB) return new Date(adB).getTime() - new Date(adA).getTime()
          return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
        })

        this.allItems = acc
        this.originalAllItems = null
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

    filter(q: string, to: string, from: string, status: string): AppointmentRecord[] {
      this.currentFilters = {
        q: (q ?? '').trim(),
        from: from ?? '',
        to: to ?? '',
        status: (status as Filters['status']) || 'all',
      }

      const isActive = this._isFilterActive()

      if (isActive && !this.originalAllItems) {
        this.originalAllItems = this.allItems.slice()
      }

      if (!isActive) {
        if (this.originalAllItems) {
          this.allItems = this.originalAllItems
          this.originalAllItems = null
        }
        this.page = 1
        this._applyPage()
        return this.items
      }

      const source = this.originalAllItems ?? this.allItems

      const qLower = this.currentFilters.q.toLowerCase()
      const fromTs = this.currentFilters.from ? new Date(this.currentFilters.from).getTime() : NaN
      const toTs   = this.currentFilters.to   ? new Date(this.currentFilters.to).getTime()   : NaN

      const filtered = source.filter((rec) => {
        const f: any = rec.fields ?? {}
        const dateStr: string | undefined = f.appointment_date || rec.createdTime
        const ts = dateStr ? new Date(dateStr).getTime() : NaN
        let statusVal: Filters['status']
        if (f.is_cancelled) statusVal = 'cancelled'
        else if (!isNaN(ts) && ts < Date.now()) statusVal = 'completed'
        else statusVal = 'upcoming'

        if (this.currentFilters.status !== 'all' && statusVal !== this.currentFilters.status) {
          return false
        }

        if (!isNaN(fromTs) && !isNaN(ts) && ts < fromTs) return false
        if (!isNaN(toTs)   && !isNaN(ts) && ts > toTs)   return false

        if (qLower) {
          const hay = [
            ...(f.contact_name ?? []),
            ...(f.contact_surname ?? []),
            ...(f.contact_email ?? []),
            ...(f.contact_phone ?? []),
            f.appointment_address ?? '',
            f.status ?? '',
          ]
            .join(' ')
            .toLowerCase()
          if (!hay.includes(qLower)) return false
        }

        return true
      })

      this.allItems = filtered
      this.page = 1
      this._applyPage()
      return this.items
    },

    clearFilters() {
      this.currentFilters = { q: '', from: '', to: '', status: 'all' }
      if (this.originalAllItems) {
        this.allItems = this.originalAllItems
        this.originalAllItems = null
      }
      this.page = 1
      this._applyPage()
    },

    nextPage() {
      if (this.canNext) this.setPage(this.page + 1)
    },
    prevPage() {
      if (this.canPrev) this.setPage(this.page - 1)
    },

    async dummyDataFeed() {
      this.dummyData = UserPopData
    },

    _applyPage() {
      const start = (this.page - 1) * this.pageSize
      const end = start + this.pageSize
      this.items = this.allItems.slice(start, end)
    },

    reset() {
      this.allItems = []
      this.items = []
      this.originalAllItems = null
      this.currentFilters = { q: '', from: '', to: '', status: 'all' }
      this.page = 1
      this.pageSize = 10
      this.loadedAll = false
      this.error = null
      this.loading = false
    },

    _isFilterActive(): boolean {
      const f = this.currentFilters
      return !!(f.q || f.from || f.to || (f.status && f.status !== 'all'))
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
