#!/usr/bin/env node

import chalk from 'chalk';
import axios from 'axios';
import readlineSync from 'readline-sync';

// Function to get user input for start and end times
const getTimeRange = () => {
  console.log(chalk.blue('Please provide the available time range:'));
  const startDate = readlineSync.question(
    chalk.yellow('Start date (YYYY-MM-DD HH:mm): ')
  );
  const endDate = readlineSync.question(
    chalk.yellow('End date (YYYY-MM-DD HH:mm): ')
  );

  // Validate dates (basic validation)
  if (isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
    console.log(chalk.red('Invalid date format. Please try again.'));
    return null;
  }

  if (new Date(startDate) >= new Date(endDate)) {
    console.log(
      chalk.red('Start date must be before the end date. Please try again.')
    );
    return null;
  }

  return { startDate, endDate };
};

// Function to publish available times
const publishTime = async (startDate, endDate) => {
  const apiEndpoint = 'http://localhost5000/api/v1/appointments';
  try {
    console.log(chalk.blue('Publishing available times...'));

    const response = await axios.post(apiEndpoint, { startDate, endDate });
    if (response.status === 200 || response.status === 201) {
      console.log(chalk.green('Success! Available times published.'));
    } else {
      console.log(
        chalk.red(
          `Failed to publish times. Server responded with status: ${response.status}`
        )
      );
    }
  } catch (error) {
    console.error(
      chalk.red('An error occurred while publishing times: '),
      error.message
    );
  }
};

// Main CLI logic
(async () => {
  console.log(chalk.green('Welcome to the Dentist CLI Tool!'));

  const timeRange = getTimeRange();
  if (!timeRange) return;

  const { startDate, endDate } = timeRange;

  const confirm = readlineSync.keyInYNStrict(
    chalk.cyan(
      `Confirm publishing availability from ${startDate} to ${endDate}?`
    )
  );

  if (confirm) {
    await publishTime(startDate, endDate);
  } else {
    console.log(chalk.red('Operation canceled.'));
  }
})();
