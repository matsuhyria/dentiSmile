import connectDB from './config/db.js'
import setupMQTT from './config/mqtt.js'
import mqttRouter from './routes/appointmentRouter.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/appointment_db'
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883'
const MQTT_OPTIONS = {
    clientId: 'appointmentService',
    reconnectPeriod: 2000,
    connectTimeout: 30 * 1000,
    clean: true
}

await connectDB(MONGODB_URI)
await setupMQTT(MQTT_URI, MQTT_OPTIONS)

mqttRouter()