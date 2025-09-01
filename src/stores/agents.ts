import { defineStore } from 'pinia'
import type { AgentRecord, AirtableAgentsResponse } from '@/types/airtable'
import {API_URL} from "./appointments"
interface State {
  allItems: AgentRecord[]
  items: AgentRecord[]

  page: number
  pageSize: number
  loading: boolean
  loadedAll: boolean
  error: string | null
}

export const useAgents = defineStore('agents', {
  state: (): State => ({
    allItems: [],
    items: [],
    page: 1,
    pageSize: 10,
    loading: false,
    loadedAll: false,
    error: null,
  }),

  actions: {
    async fetchAll() {
      if (this.loadedAll) {
        this._applyPage()
        return
      }

      const API_KEY = import.meta.env.VITE_AIRTABLE_KEY
      const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE
      const TABLE   = 'Agents'

      const baseParams = new URLSearchParams()
      baseParams.set('pageSize', '100')
      baseParams.set('sort[0][field]', 'number')
      baseParams.set('sort[0][direction]', 'asc')

      this.loading = true
      this.error = null

      try {
        let offset: string | undefined
        const acc: AgentRecord[] = []
        let guard = 0

        do {
          const params = new URLSearchParams(baseParams)
          if (offset) params.set('offset', offset)

          const res = await fetch(
            `${API_URL}/${BASE_ID}/${encodeURIComponent(TABLE)}?${params}`,
            { headers: { Authorization: `Bearer ${API_KEY}` } }
          )
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
          const data: AirtableAgentsResponse = await res.json()

          acc.push(...data.records)
          offset = data.offset
          guard++
          if (guard > 500) throw new Error('Pagination guard tripped')

        } while (offset)

        acc.sort((a, b) => a.fields.number - b.fields.number)

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
    names: (s) => s.allItems.map(r => `${r.fields.agent_name} ${r.fields.agent_surname}`),
    groupedByAppointment: (s) => {
      const map: Record<string, AgentRecord[]> = {}
      for (const a of s.allItems) {
        for (const appId of a.fields.appointments || []) {
          if (!map[appId]) map[appId] = []
          map[appId].push(a)
        }
      }
      return map
    },
    getAgentsForAppointment: (s) => (appointmentId: string) =>
      s.allItems.filter(a => a.fields.appointments?.includes(appointmentId)),
  },
})
