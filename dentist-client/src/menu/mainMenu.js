import inquirer from "inquirer";
import { startupScreen } from "./startup.js";
import { viewAppointments } from "./viewAppointments.js";
import { cancelOrRemoveAppointment } from "./cancelOrRemoveAppointment.js";

// Main menu after login
export const mainMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose an option:',
      choices: ['View Appointments', 'Create Appointment', 'Cancel or Remove Appointment', 'Logout'],
    },
  ]);

  switch (action) {
    case 'View Appointments':
      await viewAppointments();
      break;

    case 'Create Appointment':
      console.log('Feature coming soon: Creating an appointment...');
      break;

    case 'Cancel or Remove Appointment':
      await cancelOrRemoveAppointment();
      break;

    case 'Logout':
      console.log('\nLogging out...\n');
      await startupScreen(); // Return to login screen
      break;
  }
};