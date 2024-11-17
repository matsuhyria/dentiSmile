<template>
  <div :class="slotClass" @click="handleClick">
    <div id="slotTime">
      {{ this.slotStartingHour }}:00 - {{ this.slotStartingHour + 1 }}:00
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeSlot',
  props: {
    slotStartingHour: Number,
    appointment: Object,
  },
  computed: {
    slotClass() {
      if (this.appointment) {
        if (this.appointment.status === 'booked') {
          // Booked by you or else logic could be added here
          return 'booked';
        } else if (this.appointment.status === 'canceled') {
          // Don't know what cancelled status means
          return 'available';
        }
        return 'available';
      }
      return 'unavailable';
    }
  },
  methods: {
    handleClick() {
      if (this.slotClass === 'available') {
        // Create a separate component for book handling as this
        //component would also show the data that is accessible to the patient
      }
    }
  }
};
</script>

<style scoped>
.available {
  background-color: white;
}

.booked {
  background-color: red;
}

.unavailable {
  background-color: gray;
}

#slotTime {
  font-size: 0.9rem;
}

div {
  border: 1px solid black;
  height: 5rem;
  width: 18rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>