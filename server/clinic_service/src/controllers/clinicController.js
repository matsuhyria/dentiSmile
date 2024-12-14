import Clinic from '../models/clinic.js'

export const create = async (message) => {
    try {
        const { name, address, phone, email, position } = JSON.parse(message)

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if (email && !emailRegex.test(email)) {
            return { status: { code: 400, message: 'Invalid email format' } }
        }

        const existingClinic = await Clinic.findOne({ email })
        if (existingClinic) {
            return { status: { code: 400, message: 'Clinic already exists' } }
        }

        const newClinic = new Clinic({ name, address, phone, email, position })

        await newClinic.save()

        return {
            status: { code: 200, message: 'Clinic created successfully' },
            data: newClinic
        }
    } catch (error) {
        console.error('Error creating clinic:', error)
        return { status: { code: 500, message: 'Internal server error' } }
    }
}

export const update = async (message) => {
    try {
        const { _id, name, address, phone, email, position } =
            JSON.parse(message)

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if (email && !emailRegex.test(email)) {
            return { status: { code: 400, message: 'Invalid email format' } }
        }

        const clinic = await Clinic.findOne({ _id })
        if (!clinic) {
            return { status: { code: 404, message: 'Clinic not found' } }
        }

        clinic.name = name || clinic.name
        clinic.address = address || clinic.address
        clinic.phone = phone || clinic.phone
        clinic.email = email || clinic.email
        clinic.position = position || clinic.position

        await clinic.save()

        return {
            status: { code: 200, message: 'Clinic updated successfully' },
            data: clinic
        }
    } catch (error) {
        console.error('Error updating clinic:', error)
        return { status: { code: 500, message: 'Internal server error' } }
    }
}

export const remove = async (message) => {
    try {
        const { _id } = JSON.parse(message)

        await Clinic.findOneAndDelete({ _id })

        return { status: { code: 200, message: 'Clinic removed successfully' } }
    } catch (error) {
        console.error('Error removing clinic:', error)
        return { status: { code: 500, message: 'Internal server error' } }
    }
}

export const retrieveAll = async () => {
    try {
        const clinics = await Clinic.find()

        return {
            status: { code: 200, message: 'Clinics retrieved successfully' },
            data: clinics
        }
    } catch (error) {
        console.error('Error retrieving clinics:', error)
        return { status: { code: 500, message: 'Internal server error' } }
    }
}

export const retreieveOne = async (message) => {
    try {
        const { _id } = JSON.parse(message)

        const clinic = await Clinic.findOne({ _id })
        if (!clinic) {
            return { status: { code: 404, message: 'Clinic not found' } }
        }

        return {
            status: { code: 200, message: 'Clinic retrieved successfully' },
            data: clinic
        }
    } catch (error) {
        console.error('Error retrieving clinics:', error)
        return { status: { code: 500, message: 'Internal server error' } }
    }
}

export const addDentist = async (message) => {
    try {
        const { clinicId, dentistId } = JSON.parse(message)

        const clinic = await Clinic.findOne({ _id: clinicId })
        if (!clinic) {
            return { status: { code: 404, message: 'Clinic not found' } }
        }

        clinic.dentists.push(dentistId)

        clinic.save()
        return {
            status: { code: 200, message: 'Dentist added successfully' },
            data: clinic
        }
    } catch (error) {
        console.error('Error retrieving clinics:', error)
        return { status: { code: 500, message: 'Internal server error' } }
    }
}
