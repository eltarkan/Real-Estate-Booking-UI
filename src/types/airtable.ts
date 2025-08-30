export interface AppointmentFields {
  appointment_id: number
  appointment_date: string         // ISO date
  appointment_address: string
  contact_id: string[]
  contact_name: string[]
  contact_surname: string[]
  contact_email: string[]
  contact_phone: number[]
  is_cancelled: boolean | false
}

export interface AppointmentRecord {
  id: string
  createdTime: string
  fields: AppointmentFields
}

export interface AirtableResponse {
  records: AppointmentRecord[]
  offset?: string
}
