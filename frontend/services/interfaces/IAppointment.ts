export interface IAppointment {
    _id: string
    clinicName: string
    clinicId: string
    dentistId: string
    patientId?: string
    startTime: string
    endTime: string
    status: 'available' | 'booked'
}
