import Clinic from "../models/clinic.js";

export const create = async (message) => {
    try {
        const { name, address, phone, email, latitude, longitude } = JSON.parse(message);

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (email && !emailRegex.test(email)) {
            return { status: { code: 400, message: 'Invalid email format' } };
        }

        const clinic = await Clinic.findOne({ email });
        if (clinic) {
            return { status: { code: 400, message: 'Clinic already exists' } };
        }

        const newClinic = new Clinic({ name, address, phone, email, latitude, longitude });

        await newClinic.save();

        return { status: { code: 200, message: 'Clinic created successfully' }, data: newClinic };
    } catch (error) {
        console.error('Error creating clinic:', error);
        return { status: { code: 500, message: 'Internal server error' } };
    }
};

export const update = async (message) => {
    try {
        const { name, address, phone, email, latitude, longitude, newEmail } = JSON.parse(message);

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (newEmail && !emailRegex.test(newEmail)) {
            return { status: { code: 400, message: 'Invalid email format' } };
        }

        const clinic = await Clinic.findOne({ email });
        if (!clinic) {
            return { status: { code: 404, message: 'Clinic not found' } };
        }

        clinic.name = name || clinic.name;
        clinic.address = address || clinic.address;
        clinic.phone = phone || clinic.phone;
        clinic.latitude = latitude || clinic.latitude;
        clinic.longitude = longitude || clinic.longitude;

        if (newEmail) {
            clinic.email = newEmail;
        }

        // idempotent as mongodb only updates the fields that are actually changed
        await clinic.save();

        return { status: { code: 200, message: 'Clinic updated successfully' }, data: clinic };
    } catch (error) {
        console.error('Error updating clinic:', error);
        return { status: { code: 500, message: 'Internal server error' } };
    }
};

export const remove = async (message) => {
    try {
        const { email } = JSON.parse(message);

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (email && !emailRegex.test(email)) {
            return { status: { code: 400, message: 'Invalid email format' } };
        }

        await Clinic.findOneAndDelete({ email });

        return { status: { code: 200, message: 'Clinic removed successfully' } };
    } catch (error) {
        console.error('Error removing clinic:', error);
        return { status: { code: 500, message: 'Internal server error' } };
    }
};

export const retrieveAll = async () => {
    try {
        const clinics = await Clinic.find();

        if (clinics.length === 0) {
            return { status: { code: 404, message: 'No clinics found' } };
        }

        return { status: { code: 200, message: 'Clinics retrieved successfully' }, data: clinics };
    } catch (error) {
        console.error('Error retrieving clinics:', error);
        return { status: { code: 500, message: 'Internal server error' } };
    }
};