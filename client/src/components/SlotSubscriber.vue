<template>
  <div class="appointment-booking-container">
    <div class="connection-status" :class="connectionStatusClass">
      MQTT Connection: {{ connectionStatus }}
    </div>

    <div class="calendar-container">
      <div class="calendar-header">
        <button @click="changeMonth(-1)">&lt;</button>
        <h2>{{ currentMonthYear }}</h2>
        <button @click="changeMonth(1)">&gt;</button>
      </div>

      <div class="calendar-grid">
        <div class="weekday-headers">
          <div v-for="day in weekdays" :key="day">{{ day }}</div>
        </div>
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index" 
          class="calendar-day"
          :class="{
            'current-month': day.isCurrentMonth,
            'has-slots': day.hasSlots,
            'selected': selectedDate === day.date
          }"
          @click="selectDate(day)"
        >
          {{ day.dayNumber }}
          <div v-if="day.hasSlots" class="slot-indicator">
            {{ day.slotCount }} slots
          </div>
        </div>
      </div>

      <div v-if="selectedDateSlots.length" class="slots-details">
        <h3>Available Slots for {{ formatSelectedDate }}</h3>
        <div class="slot-list">
          <div 
            v-for="slot in selectedDateSlots" 
            :key="slot._id" 
            class="slot-item"
            @click="bookAppointment(slot)"
          >
            <span>{{ formatTime(slot.startTime) }}</span>
            <span>Dentist: {{ slot.dentistId }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="debugMode" class="debug-info">
      <pre>{{ debugInfo }}</pre>
    </div>
  </div>
</template>

<script>
import mqtt from 'mqtt';

export default {
  data() {
    return {
      client: null,
      slots: [],
      connectionStatus: 'Connecting...',
      debugMode: true,
      debugInfo: '',
      topic: 'appointment/slots',
      currentMonth: new Date(),
      selectedDate: null,
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    };
  },
  computed: {
    connectionStatusClass() {
      return {
        'status-connecting': this.connectionStatus === 'Connecting...',
        'status-connected': this.connectionStatus === 'Connected' || this.connectionStatus === 'Subscribed',
        'status-error': this.connectionStatus.includes('Error')
      };
    },
    currentMonthYear() {
      return this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    },
    calendarDays() {
      const firstDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
      const lastDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
      
      const days = [];
      const startingDay = firstDayOfMonth.getDay();
      
      // Previous month's days
      for (let i = 0; i < startingDay; i++) {
        days.push({ dayNumber: '', isCurrentMonth: false });
      }
      
      // Current month's days
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const currentDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i);
        const slotsForDay = this.slots.filter(slot => this.isSameDay(new Date(slot.startTime), currentDate));
        
        days.push({
          dayNumber: i,
          isCurrentMonth: true,
          date: currentDate,
          hasSlots: slotsForDay.length > 0,
          slotCount: slotsForDay.length
        });
      }
      
      return days;
    },
    formatSelectedDate() {
      return this.selectedDate ? this.selectedDate.toLocaleDateString() : '';
    },
    selectedDateSlots() {
      return this.selectedDate 
        ? this.slots.filter(slot => this.isSameDay(new Date(slot.startTime), this.selectedDate))
        : [];
    }
  },
  methods: {
    formatTime(time) {
      return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    connectToBroker() {
      const brokerUrl = 'ws://localhost:9001';
      
      const options = {
        clientId: `vue_client_${Math.random().toString(16).slice(3)}`,
        clean: true,
        connectTimeout: 4000,
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
          }
        });
      });

      this.client.on('message', (topic, payload) => {
        try {
          const slots = JSON.parse(payload.toString());
          this.slots = slots;
          this.debugInfo += `Received ${slots.length} slots\n`;
        } catch (error) {
          this.debugInfo += `Error parsing message: ${error.message}\n`;
        }
      });

      this.client.on('error', (error) => {
        this.connectionStatus = 'Connection Error';
        this.debugInfo += `Connection error: ${error.message}\n`;
        console.error('MQTT Connection Error:', error);
      });
    },
    changeMonth(delta) {
      this.currentMonth = new Date(
        this.currentMonth.getFullYear(), 
        this.currentMonth.getMonth() + delta, 
        1
      );
    },
    selectDate(day) {
      if (day.isCurrentMonth && day.hasSlots) {
        this.selectedDate = day.date;
      }
    },
    isSameDay(date1, date2) {
      return date1.getFullYear() === date2.getFullYear() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getDate() === date2.getDate();
    },
    bookAppointment(slot) {
      // Placeholder for booking logic
      this.debugInfo += `Attempting to book slot: ${this.formatTime(slot.startTime)}\n`;
      // You would typically emit an event or call a method to handle booking
      // For example: this.$emit('book-slot', slot);
    }
  },
  mounted() {
    this.connectToBroker();
  },
  beforeUnmount() {
    if (this.client) {
      this.client.end();
    }
  }
};
</script>

<style scoped>
.appointment-booking-container {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.connection-status {
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

.status-connecting { background-color: #f0ad4e; }
.status-connected { background-color: #5cb85c; color: white; }
.status-error { background-color: #d9534f; color: white; }

.calendar-container {
  border: 1px solid #ddd;
  padding: 15px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.weekday-headers {
  display: contents;
}

.weekday-headers > div {
  text-align: center;
  font-weight: bold;
  background-color: #f0f0f0;
  padding: 10px;
}

.calendar-day {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  cursor: default;
}

.calendar-day:not(.current-month) {
  background-color: #f9f9f9;
  color: #999;
}

.calendar-day.has-slots {
  cursor: pointer;
  background-color: #e6f3ff;
}

.calendar-day.selected {
  background-color: #007bff;
  color: white;
}

.slot-indicator {
  font-size: 0.8em;
  color: #007bff;
  margin-top: 5px;
}

.slots-details {
  margin-top: 15px;
  border-top: 1px solid #ddd;
  padding-top: 15px;
}

.slot-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.slot-item {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.slot-item:hover {
  background-color: #f0f0f0;
}

.debug-info {
  margin-top: 15px;
  background-color: #f4f4f4;
  padding: 10px;
  overflow-x: auto;
}
</style>