import chalk from 'chalk';
import { mainMenu } from './mainMenu.js';
import { mqttRequestResponse } from '../util/mqttRequest.js';
import { MQTT_TOPICS } from '../../../shared/mqtt/mqttTopics.js';
import Table from 'cli-table3';

// Function to view appointments
export const viewAppointments = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(today.getDate() + 7);
        let appointments = [];

        try {
            const hardCodedDentistId = '673d250e840b29fc54c9da0c'; // Hard-coded dentist ID for now
            let response = await mqttRequestResponse({ data: { dentistId: hardCodedDentistId, startingDate: today, endingDate: sevenDaysLater } }, MQTT_TOPICS.DENTIST.GET_APPOINTMENTS);
            if (response.status.code === 200) {
                appointments = response.data;
                // Sorts appointments by start time
                appointments.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            } else {
                console.log(chalk.red('Error fetching appointments:', response.status.message));
                await mainMenu();
            }
        }
        catch (error) {
            console.error('Error fetching appointments:', error);
            await mainMenu();
        }

        const appointmentsByDay = {};
        appointments.forEach(appointment => {
            const dateKey = new Date(appointment.startTime).toDateString();
            if (!appointmentsByDay[dateKey]) {
                appointmentsByDay[dateKey] = [];
            }
            appointmentsByDay[dateKey].push(appointment);
        });

        for (const date in appointmentsByDay) {
            console.log(chalk.yellow(`\nAppointments for ${date}:`));
            const table = new Table({
                head: ['Patient ID', 'Start Time', 'End Time', 'Status'],
                colWidths: [20, 10, 10, 15]
            });

            appointmentsByDay[date].forEach(appointment => {
                let statusColor;
                switch (appointment.status) {
                    case 'booked':
                        statusColor = chalk.green;
                        break;
                    case 'canceled':
                        statusColor = chalk.red;
                        break;
                    case 'available':
                    default:
                        statusColor = chalk.blue;
                        break;
                }
                const patientId = statusColor(appointment.patientId || 'N/A');
                const startTime = statusColor(new Date(appointment.startTime).toLocaleTimeString());
                const endTime = statusColor(new Date(appointment.endTime).toLocaleTimeString());
                const status = statusColor(appointment.status);

                table.push([patientId, startTime, endTime, status]);
            });
            console.log(table.toString());
        }
        await mainMenu();
    } catch (error) {
        console.error('Error loading appointments page:', error);
        await mainMenu();
    }
};