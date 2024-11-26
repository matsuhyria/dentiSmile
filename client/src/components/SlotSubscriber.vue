<template>
  <div>
    <h1>MQTT Connection</h1>
    <p>Connection Status: {{ connectionStatus }}</p>
    <p>Received Message: {{ message }}</p>
    <pre v-if="debugMode">{{ debugInfo }}</pre>
  </div>
</template>

<script>
import mqtt from 'mqtt';

export default {
  data() {
    return {
      client: null,
      message: '',
      connectionStatus: 'Connecting...',
      debugMode: true,
      debugInfo: '',
      topic: 'test'
    };
  },
  mounted() {
    this.connectToBroker();
  },
  methods: {
    connectToBroker() {
      // Precise connection using container IP
      const brokerUrl = 'mqtt://172.17.0.2:1883';
      
      const options = {
        clientId: `vue_client_${Math.random().toString(16).slice(3)}`,
        clean: true,
        connectTimeout: 4000,
        username: 'guest',
        password: 'guest'
      };

      this.debugInfo += `Connecting to: ${brokerUrl}\n`;

      this.client = mqtt.connect(brokerUrl, options);

      this.client.on('connect', () => {
        this.connectionStatus = 'Connected';
        this.debugInfo += 'Successfully connected to broker\n';

        this.client.subscribe(this.topic, (err) => {
          if (err) {
            this.debugInfo += `Subscription error: ${err.message}\n`;
            this.connectionStatus = 'Subscription Failed';
          } else {
            this.debugInfo += `Subscribed to topic: ${this.topic}\n`;
            this.connectionStatus = 'Subscribed';

            // Optional: Publish a test message
            this.client.publish(this.topic, 'Hello from Vue!', (publishErr) => {
              if (publishErr) {
                this.debugInfo += `Publish error: ${publishErr.message}\n`;
              } else {
                this.debugInfo += 'Test message published\n';
              }
            });
          }
        });
      });

      this.client.on('message', (topic, payload) => {
        const message = payload.toString();
        this.debugInfo += `Received message on ${topic}: ${message}\n`;
        this.message = message;
      });

      this.client.on('error', (error) => {
        this.connectionStatus = 'Connection Error';
        this.debugInfo += `Connection error: ${error.message}\n`;
        console.error('MQTT Connection Error:', error);
      });
    }
  },
  beforeUnmount() {
    if (this.client) {
      this.client.end();
    }
  }
};
</script>

<style scoped>
h1 {
  color: #333;
}
</style>