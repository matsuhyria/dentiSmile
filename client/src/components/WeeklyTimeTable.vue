<template>
    <b-row class="weekly-timetable">
        <b-col class="day justify-content-center align-items-center flex-direction-column" v-for="day in daysInWeek"
            :key="day.date">
            <div class="day-header"> {{ day.dayName }} - {{ formatDate(day.date) }}</div>
            <TimeSlot v-for="hour in hours" :key="hour" :slotStartingHour="hour" :appointment="findAppointment(day.date, hour)">
            </TimeSlot>
        </b-col>
    </b-row>
</template>

<script>
import TimeSlot from './TimeSlot.vue';

export default {
    name: 'WeeklyTimeTable',
    components: { TimeSlot },
    data() {
        return {
            startingHours: 7,
            endingHours: 18,
        };
    },
    props: {
        appointments: Array,
        selectedWeek: {
            type: Date,
            required: true
        },
        dentist: String,
    },
    computed: {
        daysInWeek() {
            // Set Monday as the first day of the week rather than Sunday
            const mondayDate = new Date(this.selectedWeek);

            //! REMOVE
            console.log("DATE:" + this.selectedWeek);
            console.log( "GETDATE" + this.selectedWeek.getDate());
            
            mondayDate.setDate(this.selectedWeek.getDate() - ((this.selectedWeek.getDay() + 6) % 7));

            const days = [];

            for (let i = 0; i < 7; i++) {
                const date = new Date(mondayDate);
                date.setDate(mondayDate.getDate() + i);
                days.push({
                    date,
                    dayName: date.toLocaleDateString(undefined, { weekday: 'short' })
                });
            }
            return days;
        },
        hours() {
            return Array.from({ length: this.endingHours - this.startingHours + 1 }, (_, i) => i + this.startingHours);
        }
    },
    methods: {
        getSlotTime(date, hour) {
            const slotTime = new Date(date);
            slotTime.setHours(hour, 0, 0, 0);
            return slotTime;
        },
        findAppointment(date, hour) {
            const slotTime = this.getSlotTime(date, hour).getTime();
            return this.appointments.find(appointment => {
                return (
                    appointment.startTime.getTime() === slotTime
                );
            });
        },
        formatDate(date) {
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
    }
};
</script>

<style scoped>
.weekly-timetable {
    display: flex;
}

.day {
    flex: 1;
}

.day-header {
    font-weight: bold;
    text-align: center;
}
</style>