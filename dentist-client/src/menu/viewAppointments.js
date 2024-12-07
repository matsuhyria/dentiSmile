import chalk from 'chalk';
import inquirer from 'inquirer';
import { mainMenu } from './mainMenu.js';
import { mqttRequestResponse } from '../util/mqttRequest.js';
import { MQTT_TOPICS } from '../../../shared/mqtt/mqttTopics.js';
import Table from 'cli-table3';

const hardCodedDentistId = '673d250e840b29fc54c9da0c'; // Hard-coded dentist ID for now
let appointments = [];
let appointmentsByDay = {};

const today = new Date();
today.setHours(0, 0, 0, 0);
const sevenDaysLater = new Date(today);
sevenDaysLater.setDate(today.getDate() + 7);


// Function to view appointments
export const viewAppointments = async () => {

    await displayAppointments();
    let action;
    do {
        ({ action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Choose an option:',
                choices: ['Increase the week', 'Decrease the week', 'Exit'],
            },
        ]));
        switch (action) {
            case 'Increase the week':
                changeSelectedTime(7);
                await displayAppointments();
                break;

            case 'Decrease the week':
                changeSelectedTime(-7);
                await displayAppointments();
                break;

            case 'Exit':
                console.log('\nReturning to Main Menu\n');
                await mainMenu();
                break;
        }
    } while (action !== 'Exit');
};

const displayAppointments = async () => {
    try {
        await retrieveAppointments(today, sevenDaysLater);
        mapAppointmentsByDay();
        appointmentTable();
    } catch (error) {
        console.error('Error loading appointments page:', error);
    }
}

const retrieveAppointments = async (startingDate, endingDate) => {
    try {
        let response = await mqttRequestResponse({ data: { dentistId: hardCodedDentistId, startingDate: startingDate, endingDate: endingDate } }, MQTT_TOPICS.DENTIST.GET_APPOINTMENTS);
        if (response.status.code === 200) {
            appointments = response.data;
            appointments.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        } else {
            console.log(chalk.red('Error fetching appointments:', response.status.message));
        }
    }
    catch (error) {
        console.error('Error fetching appointments: ', error);
    }
}

const appointmentTable = () => {
    for (const date in appointmentsByDay) {
        console.log(chalk.yellow(`\nAppointments for ${date}:`));
        let table = new Table({
            head: ['Patient ID', 'Start Time', 'End Time', 'Status', 'Appointment ID'],
            colWidths: [20, 10, 10, 15, 26]
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
            const appointmentId = statusColor(appointment._id)
            table.push([patientId, startTime, endTime, status, appointmentId]);
        });
        console.log(table.toString());
    }
}

const mapAppointmentsByDay = () => {
    appointmentsByDay = {};
    appointments.forEach(appointment => {
        const dateKey = new Date(appointment.startTime).toDateString();
        if (!appointmentsByDay[dateKey]) {
            appointmentsByDay[dateKey] = [];
        }
        appointmentsByDay[dateKey].push(appointment);
    });
}

const changeSelectedTime = (changeByDays) => {
    today.setDate(today.getDate() + changeByDays);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + changeByDays);
}