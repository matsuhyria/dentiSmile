const connectDB = require('./config/db.js');
const {
    connectMQTT,
    publish,
    subscribe,
    disconnectMQTT
} = require('../../mqtt/mqtt.js');
const { registerUserMQTT, loginUserMQTT } = require('./controllers/authController.js');

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGODB_URI;
const MQTT_URI = process.env.MQTT_BROKER_URI;

connectDB(MONGO_URI);

function publishDelay(client) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Publishing to a topic');
            const message = JSON.stringify({
                email: 'user@example.com',
                password: 'securePassword123'
            });
            console.log(message);
            publish(client, 'Sys/Auth/Register', message);
            resolve('Published');
        }, 5000);
        setTimeout(() => {
            console.log('Publishing to a topic');
            const message = JSON.stringify({
                email: 'user@example.com',
                password: 'securePassword123'
            });
            console.log(message);
            publish(client, 'Sys/Auth/Login', message);
            resolve('Published');
        }, 5000);
    });
}

(async () => {
    const client = await connectMQTT(MQTT_URI);

    // Subscribe for user registration
    await subscribe(client, 'Sys/Auth/Register', async (message) => {
        const responseTopicForRegisteringANewUser = 'Sys/Auth/Register/Response';
        await registerUserMQTT(
            message,
            client,
            responseTopicForRegisteringANewUser
        );
    });

    // Subscribe for user login
    await subscribe(client, 'Sys/Auth/Login', async (message) => {
        const responseTopicForLoggingIn = 'Sys/Auth/Login/Response';
        await loginUserMQTT(message, client, responseTopicForLoggingIn);
    });

    await publishDelay(client);
})();



console.log(`Server is running on http://localhost:${PORT}`);