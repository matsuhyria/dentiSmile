import { disconnectMQTT } from "../../../shared/mqtt/mqtt.js"

export const exitSequence = async () => {
    await disconnectMQTT()
    process.exit()
}