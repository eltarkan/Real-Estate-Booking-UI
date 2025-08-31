export interface AppointmentFields {
  appointment_id: number
  appointment_date: string // ISO date
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

export interface AgentFields {
  number: number
  agent_name: string
  agent_surname: string
  appointments: string[] // Appointment record IDs
  color?: string
}

export interface AgentRecord {
  id: string
  createdTime: string
  fields: AgentFields
}

export interface AirtableAgentsResponse {
  records: AgentRecord[]
  offset?: string
}

export interface CreateAppointmentModalPayload {
  userId: string
  address: string
  agentId: string
  appointmentAt: string
  isCancelled: boolean
}
