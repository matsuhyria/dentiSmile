<template>
    <div class="appointment-booking">
      <h1>Book an Appointment</h1>
      <vue-cal
        class="calendar"
        :time="true"
        :events="events"
        @cell-click="fetchSlots"
        events-color="blue"
      ></vue-cal>
  
      <div v-if="slots.length" class="slots-container">
        <h2>Available Slots for {{ selectedDate }}</h2>
        <div class="time-slots">
          <TimeSlot
            v-for="slot in slots"
            :key="slot._id"
            :slot="slot"
            @book="bookSlot"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  import axios from 'axios';
  import TimeSlot from './TimeSlot.vue';
  
  export default {
    components: { VueCal, TimeSlot },
    data() {
      return {
        selectedDate: null,
        slots: [],
        events: [] // To store the calendar events
      };
    },
    mounted() {
      this.fetchAllSlots(); // Fetch all slots when the component is mounted
    },
    methods: {
      // Fetch all slots from the backend
      async fetchAllSlots() {
        try {
          const response = await axios.get('http://localhost:5000/api/v1/appointments'); // Update the endpoint if needed
          this.slots = response.data.slots;
  
          // Convert slots to calendar events format
          this.events = this.slots.map(slot => ({
            start: slot.startTime, // Assuming 'startTime' is in a valid format
            end: slot.endTime, // Assuming 'endTime' is in a valid format
            title: `Available Slot`, // Title to display on the calendar
            id: slot._id // The slot's ID for reference
          }));
        } catch (error) {
          console.error('Error fetching slots:', error);
        }
      },
  
      async fetchSlots(date) {
        this.selectedDate = date.date;
        try {
          const response = await axios.get('/api/v1/slots/available', {
            params: { date: this.selectedDate },
          });
          this.slots = response.data;
        } catch (error) {
          console.error('Error fetching slots:', error);
        }
      },
  
      async bookSlot(slotId) {
        try {
          const response = await axios.post(`/api/v1/slots/${slotId}/book`, {
            patientId: 'some-patient-id', // Replace with actual ID
          });
          alert(response.data.message);
          this.fetchSlots({ date: this.selectedDate });
        } catch (error) {
          alert('Error booking slot: ' + error.response.data.message);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .appointment-booking {
    font-family: Arial, sans-serif;
  }
  .calendar {
    margin: 20px auto;
    max-width: 800px;
  }
  .slots-container {
    margin-top: 20px;
  }
  .time-slots {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  </style>
  