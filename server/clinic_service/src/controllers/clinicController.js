import Clinic from "../models/clinic.js";

export const create = async (message) => {
    try {
        const { name, address, phone, email, latitude, longitude } = JSON.parse(message);

        const clinic = await Clinic.findOne({ email }).maxTimeMS(5000);
        if (clinic) {
            return { status: { code: 400, message: 'Invalid clinic data' } };
        }

        const newClinic = new Clinic({ name, address, phone, email, latitude, longitude });

        await newClinic.save();

        return { status: { code: 200, message: 'Clinic created successfully' }, data: newClinic };
    } catch (error) {
        console.error('Error creating clinic:', error);
        return { status: { code: 500, message: 'Internal server error' } };
    }
};
