const express = require('express');
const connectDB = require('./auth_db.js');
const authRoutes = require('./routes/authRoutes.js');
const mqtt = require('./mqtt/mqtt.js');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;
const MQTT_URI = process.env.MQTT_BROKER_URI;

connectDB(MONGO_URI);

(async () => {
  const client = await mqtt.connectMQTT(MQTT_URI);

  await mqtt.subscribe(client, 'Sys/Auth/Register', async (message) => {
    const responseTopicForRegisteringANewUser = 'Sys/Auth/Register/Response';
    await registerUserMQTT(
      message,
      client,
      responseTopicForRegisteringANewUser
    );
  });
})();

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
