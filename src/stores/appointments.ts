import { defineStore } from 'pinia'
import type { AppointmentRecord, AirtableResponse } from '@/types/airtable'
import { UserPopData } from '../helpers/dummy'

interface State {
  items: AppointmentRecord[]

  pageOffsets: Record<number, string | null>
  itemsByPage: Record<number, AppointmentRecord[]>

  page: number
  pageSize: number
  hasNext: boolean

  loading: boolean
  error: string | null

  dummyData: object[]
}

export const useAppointments = defineStore('appointments', {
  state: (): State => ({
    items: [],
    pageOffsets: { 1: null },
    itemsByPage: {},
    page: 1,
    pageSize: 10,
    hasNext: false,
    loading: false,
    error: null,
    dummyData: [],
  }),

  actions: {
    async fetchPage(targetPage: number = 1) {
      if (targetPage < 1) targetPage = 1

      // Get from cache
      if (this.itemsByPage[targetPage]) {
        this.page = targetPage
        this.items = this.itemsByPage[targetPage]
        return
      }

      const API_KEY = import.meta.env.VITE_AIRTABLE_KEY
      const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE
      const TABLE   = 'Appointments'

      const params = new URLSearchParams()
      params.set('pageSize', String(this.pageSize))
      params.set('sort[0][field]', 'appointment_date')
      params.set('sort[0][direction]', 'desc')

      this.loading = true
      this.error = null

      try {
        let currentPage = this._maxKnownPage() || 1
        if (!this.itemsByPage[currentPage] && currentPage === 1) {
          currentPage = 1
        }

        while (currentPage <= targetPage) {
          if (this.itemsByPage[currentPage]) {
            if (currentPage === targetPage) break
            currentPage++
            continue
          }

          const offset = this.pageOffsets[currentPage] ?? null
          const urlParams = new URLSearchParams(params)
          if (offset) urlParams.set('offset', offset)

          const res = await fetch(
            `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}?${urlParams}`,
            { headers: { Authorization: `Bearer ${API_KEY}` } }
          )
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
          const data: AirtableResponse = await res.json()

          const sorted = [...data.records].sort((a, b) => {

            const adA = (a.fields as any)?.appointment_date
            const adB = (b.fields as any)?.appointment_date
            if (adA && adB) {
              return new Date(adB).getTime() - new Date(adA).getTime()
            }

            return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
          })

          // Store in cache
          this.itemsByPage[currentPage] = sorted

          if (data.offset) {
            this.pageOffsets[currentPage + 1] = data.offset
            this.hasNext = true
          } else {
            this.hasNext = false
          }

          if (currentPage === targetPage) break
          currentPage++
        }

        this.page = targetPage
        this.items = this.itemsByPage[targetPage] ?? []

      } catch (e: any) {
        this.error = e?.message ?? 'Fetch error'
      } finally {
        this.loading = false
      }
    },

    async nextPage() {
      if (!this.hasNext) return
      await this.fetchPage(this.page + 1)
    },

    async prevPage() {
      if (this.page <= 1) return
      await this.fetchPage(this.page - 1)
    },

    async dummyDataFeed() {
      this.dummyData = UserPopData
    },

    reset() {
      this.items = []
      this.itemsByPage = {}
      this.pageOffsets = { 1: null }
      this.page = 1
      this.hasNext = false
      this.error = null
      this.loading = false
    },

    _maxKnownPage(): number | null {
      const pages = Object.keys(this.itemsByPage).map(n => Number(n)).filter(Boolean)
      return pages.length ? Math.max(...pages) : null
    },
  },

  getters: {
    count: (s) => s.items.length,
    emails: (s) => s.items.flatMap(r => r.fields.contact_email),
    canNext: (s) => s.hasNext,
    canPrev: (s) => s.page > 1,
  }
})
