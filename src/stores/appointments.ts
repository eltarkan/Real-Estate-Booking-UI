import { defineStore } from 'pinia'
import type { AppointmentRecord, AirtableResponse } from '@/types/airtable'
import { CreateAppointmentModalPayload, UpdateAppointmentModalPayload } from '../types/airtable'
import { safeGet, getTime } from '../helpers/utils'
import moment from 'moment'

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

const API_KEY = import.meta.env.VITE_AIRTABLE_KEY
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE
const TABLE = 'Appointments'

// export let API_URL = 'http://127.0.0.1:8000/v0'
export let API_URL = 'https://reb-api.kodbukucu.com/v0'
// export let API_URL = 'https://api.airtable.com/v0'

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

          const res = await fetch(`${API_URL}/${BASE_ID}/${encodeURIComponent(TABLE)}?${params}`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
          })
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

        acc.sort((a, b) => getTime(b) - getTime(a)) // DESC

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

    filter(
      q: string,
      to: string,
      from: string,
      status: string,
      agents: string[] = [],
    ): AppointmentRecord[] {
      this.currentFilters = {
        q: (q ?? '').trim(),
        from: from ?? '',
        to: to ?? '',
        status: (status as Filters['status']) || 'all',
        agents: agents ?? [],
      } as any

      const baseActive = this._isFilterActive()
      const isActive = baseActive || (agents && agents.length > 0)

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
      const toTs = this.currentFilters.to ? new Date(this.currentFilters.to).getTime() : NaN

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
        if (!isNaN(toTs) && !isNaN(ts) && ts > toTs) return false

        if (agents && agents.length) {
          const set = new Set(agents)
          const recAgents: string[] = f.agent_id ?? []
          if (!recAgents.some((id) => set.has(id))) return false
        }

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

    getUsersAppointments(email: string): object[] {
      const userMail = String(safeGet(email, 'fields.contact_email[0]') || '').toLowerCase()

      const now = moment()

      return this.allItems
        .filter((rec: AppointmentRecord) => {
          const recMail = String(safeGet(rec, 'fields.contact_email[0]') || '').toLowerCase()
          return recMail === userMail
        })
        .map((rec: AppointmentRecord) => {
          let status = ''
          const apptRaw = safeGet(rec, 'fields.appointment_date')
          const appt = apptRaw ? moment(apptRaw) : null

          if (safeGet(rec, 'fields.is_cancelled')) {
            status = 'Cancelled'
          } else if (!appt || !appt.isValid()) {
            status = ''
          } else if (appt.isBefore(now)) {
            status = 'Completed'
          } else if (appt.isAfter(now)) {
            status = 'Upcoming'
          }

          return {
            appointmentDate: appt.format('DD/MM/YYYY HH:mm'),
            appointmentAddress: safeGet(rec, 'fields.appointment_address'),
            status,
          }
        })
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

    async createAppointment(payload: CreateAppointmentModalPayload) {
      this.loading = true
      this.error = null

      try {
        const postBody = {
          records: [
            {
              fields: {
                appointment_date: payload.appointmentAt,
                appointment_address: payload.address,
                contact_id: [payload.userId],
                agent_id: [payload.agentId],
                is_cancelled: payload.isCancelled,
              },
            },
          ],
        }
        console.log(postBody)

        const res = await fetch(`${API_URL}/${BASE_ID}/${encodeURIComponent(TABLE)}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postBody),
        })

        if (!res.ok) {
          let detail = ''
          try {
            const errJson = await res.json()
            detail = errJson?.error?.message || JSON.stringify(errJson)
          } catch {
            detail = await res.text()
          }
          const msg = `Airtable request failed: ${res.status} ${res.statusText}${detail ? ` — ${detail}` : ''}`
          throw new Error(msg)
        }

        return await res.json()
      } catch (e: any) {
        this.error = e?.message ?? 'Create error'
        throw e
      } finally {
        this.loading = false
      }
    },
    async updateAppointment(payload: UpdateAppointmentModalPayload) {
      this.loading = true
      this.error = null

      try {
        const updateBody = {
          fields: {
            appointment_date: payload.appointmentAt,
            appointment_address: payload.address,
            contact_id: [payload.userId],
            agent_id: [payload.agentId],
            is_cancelled: payload.isCancelled,
          },
        }

        const res = await fetch(
          `${API_URL}/${BASE_ID}/${encodeURIComponent(TABLE)}/${payload.appointmentId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateBody),
          },
        )

        if (!res.ok) {
          let detail = ''
          try {
            const errJson = await res.json()
            detail = errJson?.error?.message || JSON.stringify(errJson)
          } catch {
            detail = await res.text()
          }
          const msg = `Airtable request failed: ${res.status} ${res.statusText}${detail ? ` — ${detail}` : ''}`
          throw new Error(msg)
        }

        return await res.json()
      } catch (e: any) {
        this.error = e?.message ?? 'Create error'
        throw e
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    total: (s) => s.allItems.length,
    totalPages: (s) => Math.max(1, Math.ceil(s.allItems.length / s.pageSize)),
    canNext: (s) => s.page < Math.ceil((s.allItems.length || 1) / s.pageSize),
    canPrev: (s) => s.page > 1,
    count: (s) => s.items.length,
    emails: (s) => s.allItems.flatMap((r) => r.fields.contact_email),
  },
})
