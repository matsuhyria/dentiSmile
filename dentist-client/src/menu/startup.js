import inquirer from 'inquirer'
import { exitSequence } from '../util/disconnect.js';
import { login } from './login.js';
import { mainMenu } from './mainMenu.js';

// Startup screen, requests login
export const startupScreen = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Welcome to the Dentist CLI Tool!',
      choices: ['Login', 'Exit'],
    },
  ]);

  if (action === 'Login') {
    //await login();
    await mainMenu();
  } else if (action === 'Exit') {
      exitSequence();
  }
};


