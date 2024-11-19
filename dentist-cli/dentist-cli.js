import chalk from 'chalk';
import axios from 'axios';
import readlineSync from 'readline-sync';

const BASE_API = 'http://localhost:5000/api/v1';


const validateDates = (startDate, endDate) => {
  if (isValidIsoDate(startDate) || isValidIsoDate(endDate)) {
    console.log(chalk.red('Invalid date format. Please try again.'));
    return false;
  }

  if (new Date(startDate) >= new Date(endDate)) {
    console.log(chalk.red('Start date must be earlier than end date.'));
    return false;
  }

  return true;
}

const isValidIsoDate = (date) => {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}\.\d+Z)?$/.test(date);
}

const getTimeRange = () => {
  console.log(chalk.blue('Please provide the available time range:'));

  while (true) {
    const startDate = readlineSync.question(
      chalk.yellow('Start date (YYYY-MM-DDTHH:mm): ')
    );

    const endDate = readlineSync.question(
      chalk.yellow('End date (YYYY-MM-DDTHH:mm): ')
    );

    if (validateDates(startDate, endDate)) {
      return { startDate, endDate };
    }

    console.log(chalk.red('Invalid input. Please try again.\n'));
  }
};

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
