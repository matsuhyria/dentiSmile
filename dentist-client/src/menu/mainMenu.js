import inquirer from "inquirer";
import { startupScreen } from "./startup.js";
import { viewAppointments } from "./viewAppointments.js";
import { removeAppointment } from "./removeAppointment.js";

// Main menu after login
export const mainMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose an option:',
      choices: ['View Appointments', 'Create Appointment', 'Cancel Appointment', 'Remove Appointment', 'Logout'],
    },
  ]);

  switch (action) {
    case 'View Appointments':
      await viewAppointments();
      break;

    case 'Create Appointment':
      console.log('Feature coming soon: Creating an appointment...');
      break;

    case 'Cancel Appointment':
      console.log('Feature coming soon: Cancelling an appointment...');
      break;

    case 'Remove Appointment':
      await removeAppointment();
      break;

    case 'Logout':
      console.log('\nLogging out...\n');
      await startupScreen(); // Return to login screen
      break;
  }

  // Return to the main menu
  if (action !== 'Logout') await mainMenu();
};