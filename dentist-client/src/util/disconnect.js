import mqttUtils from 'shared-mqtt'
const { disconnectMQTT } = mqttUtils;

export const exitSequence = async () => {
    await disconnectMQTT()
    process.exit()
}