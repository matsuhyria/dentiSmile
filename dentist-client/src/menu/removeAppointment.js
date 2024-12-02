import inquirer from "inquirer";
import { startupScreen } from "./startup.js";
import { viewAppointments } from "./viewAppointments.js";
import { mqttRequestResponse } from '../util/mqttRequest.js';
import { MQTT_TOPICS } from '../../../shared/mqtt/mqttTopics.js';
import Table from 'cli-table3';
import chalk from 'chalk';

// Main menu after login
export const removeAppointment = async () => {
    const action = await inquirer.prompt([
        {
            type: 'input',
            name: 'appointmentId',
            message: 'Enter the appointment id:'
        },
    ]);
    await mqttRequestResponse({ data: { "appointmentId": action.appointmentId } }, MQTT_TOPICS.DENTIST.GET_APPOINTMENT).then((response) => {
        console.log(response);
        if (response.status.code === 200) {
            console.log('Appointment found:');
            printAppointment(response.data);
        } else {
            console.log(chalk.red('Error fetching appointment:', response.status.message));
        }
    }).catch((error) => {
        console.error('Error fetching appointment:', error);
    });

    const confirm = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmed',
            message: 'Are you sure?'
        },
    ]);

    if (confirm.confirmed) {
        await mqttRequestResponse({ data: { "appointmentId": action.appointmentId } }, MQTT_TOPICS.DENTIST.REMOVE_APPOINTMENT).then((response) => {
            if (response.status.code === 200) {
                console.log(chalk.green('Appointment removed successfully'));
            } else {
                console.log(chalk.red('Error removing appointment:', response.status.message));
            }
        }).catch((error) => {
            console.error('Error removing appointment:', error);
        });
    }
};

const printAppointment = (appointment) => {
    const table = new Table({
        head: ['Patient ID', 'Start Time', 'End Time', 'Status'],
        colWidths: [20, 10, 10, 15]
    });

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
    console.log(table.toString());
}