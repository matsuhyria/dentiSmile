<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Api } from '../Api';
import { ScheduleXCalendar } from '@schedule-x/vue';
import {
    createCalendar,
    createViewDay,
    createViewWeek,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import '@schedule-x/theme-default/dist/index.css';

const route = useRoute();

const calendarStart = ref('');
const calendarEnd = ref('');
const appointments = ref([]);
const dentist = ref({});

const config = {
    views: [
        createViewDay(),
        createViewWeek(),
    ],
    isDark: true,
    dayBoundaries: {
        start: '07:00',
        end: '17:00',
    },
    callbacks: {
        onRangeUpdate(range) {
            calendarStart.value = range.start;
            calendarEnd.value = range.end;
            fetchAppointments();
        },
        beforeRender($app) {
            const range = $app.calendarState.range.value;
            calendarStart.value = range.start;
            calendarEnd.value = range.end;
        },
        onEventClick(calendarEvent) {
            if (calendarEvent.appointment.status === 'available') {
                // TODO: Show appointment booking
                console.log("Bookable");
            } else {
                console.log("Not bookable");
                // Show appointment details
            }
        },
    },
    minDate: new Date().toISOString().split('T')[0],
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
};

const eventsServicePlugin = createEventsServicePlugin();
const calendarApp = createCalendar(config, [eventsServicePlugin]);

async function fetchDentist() {
    const dentistId = route.params.dentistId;
    await Api.get(`/dentists/${dentistId}`)
        .then((response) => {
            dentist.value = response.data;
            console.log(dentist.value);
        })
        .catch((error) => {
            console.log("Error fetching dentist: " + error);
        });
}

async function fetchAppointments() {
    await Api.get(`/appointments`, {
        params: {
            dentistId: dentist.value._id,
            startingDate: calendarStart.value.split(' ')[0],
            endingDate: calendarEnd.value.split(' ')[0],
        }
    })
        .then((response) => {
            appointments.value = response.data;
            manageCalendarEvents();
        })
        .catch((error) => {
            console.log("Error fetching appointments: " + error);
        });
}

function addCalendarEvent(appointment) {
    eventsServicePlugin.add({
        id: appointment._id,
        appointment: appointment,
        start: new Date(appointment.startTime).toISOString().slice(0, 16).replace('T', ' '),
        end: new Date(appointment.endTime).toISOString().slice(0, 16).replace('T', ' '),
    });
}


function manageCalendarEvents() {
    eventsServicePlugin.clear();
    appointments.value.forEach((appointment) => {
        addCalendarEvent(appointment);
    });
}

const dateRange = computed(() => {
    return `${calendarStart.value} - ${calendarEnd.value}`;
});

watch(dateRange, () => {
    fetchAppointments();
}, { immediate: true });

onMounted(() => {
    fetchDentist();
});
</script>

<template>
    <div style="width: 90vw;">
        <ScheduleXCalendar :calendar-app="calendarApp">
            <template #headerContentRightPrepend>
                <div class="clinicHeader">
                    {{ dentist.street }} {{ dentist.zip }} {{ dentist.city }} / {{ dentist.first_name }} {{ dentist.surname }}
                </div>
            </template>

            <template #timeGridEvent="{ calendarEvent }">
                <div :class="['event', calendarEvent.appointment.status]">
                    {{ "calendarEvent.title" }}
                </div>
            </template>
        </ScheduleXCalendar>
    </div>
</template>

<style scoped>
.clinicHeader {
    font-size: 1.8em;
    font-weight: bold;
    text-align: center;
    color: #dbd8ff;
}

.event {
    border-radius: 8px;
    padding-bottom: 5px;
    color: rgb(0, 0, 0);
    background-color: rgb(255, 141, 236);
    width: 100%;
    height: 100%;
}

.event.available {
    background-color: rgb(81, 122, 81);
}

.event.booked {
    background-color: rgb(153, 95, 95);
}

.event.canceled {
    background-color: rgb(141, 141, 141);
}
</style>