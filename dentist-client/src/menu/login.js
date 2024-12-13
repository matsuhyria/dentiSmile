import inquirer from 'inquirer';
import { mainMenu } from './mainMenu.js';
import { mqttRequestResponse } from '../util/mqttRequest.js';
import { startupScreen } from './startup.js';
import mqttUtils from 'shared-mqtt'

const { MQTT_TOPICS } = mqttUtils;

// Login functionality
export const login = async () => {
  const credentials = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Enter your username:',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter your password:',
      mask: '*', // Masks the password with '*'
    },
  ]);
  const loginResult = await mqttRequestResponse({ username: credentials.username, password: credentials.password }, MQTT_TOPICS.AUTHENTICATION.LOGIN);
  console.log(loginResult);
  if (loginResult.status === true) {
    console.log('\nLogin successful!\n');
    await mainMenu();
  } else {
    console.log('\nInvalid credentials. Please try again.\n');
    await startupScreen();
  }
};
