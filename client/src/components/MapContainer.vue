<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';

/* import { Api } from '../Api';
 */
const lat = ref(0)
const lng = ref(0)
const map = ref()
const mapContainer = ref()
const dentists = ref([])
const clinicMarkers = ref(new Map())

onMounted(() => {
    map.value = L.map(mapContainer.value, { zoomAnimation: false }).setView([57.7, 12], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map.value);

    // Custom control for the "Get my Location" button
    const locationControl = L.Control.extend({
        onAdd: function () {
            const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
            button.innerHTML = '<IBi0Circle />';
            button.style.backgroundColor = 'white';
            button.style.width = '40px';
            button.style.height = '40px';
            button.onclick = findLocation;
            return button;
        }
    });

    map.value.addControl(new locationControl({ position: 'topleft' }));

    fetchClinics();

});

function findLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            lat.value = position.coords.latitude;
            lng.value = position.coords.longitude;
            map.value.setView([lat.value, lng.value], 14);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}
/* 
async fetchClinics() {
            await Api.get(`/dentists`)
                .then((response) => {
                    this.dentists = response.data.dentists;
                    this.createMarkers();
                })
                .catch((error) => {
                    console.log("Error fetching dentists: " + error);
                });
            // Fetch clinics from the backend
            // Save result to this.dentists
        }, 
*/

function fetchClinics() {
    dentists.value = [
        {
            _id: "64b1f1f4f4d3f1f4f4d3f1f1",
            first_name: "John",
            surname: "Doe",
            username: "johndoe",
            date_of_birth: "1980-01-01",
            phone_number: "123-456-7890",
            password: "password123",
            clinic_location: {
                latitude: 57.7,
                longitude: 12.0,
                street: "123 Main St",
                zip: "12345",
                city: "Anytown"
            },
            email: "johndoe@example.com"
        },
        {
            _id: "64b1f1f4f4d3f1f4f4d3f1f2",
            first_name: "Jane",
            surname: "Doe",
            username: "janedoe",
            date_of_birth: "1985-02-02",
            phone_number: "123-456-7891",
            password: "password123",
            clinic_location: {
                latitude: 57.8,
                longitude: 12.1,
                street: "456 Elm St",
                zip: "67890",
                city: "Othertown"
            },
            email: "janedoe@example.com"
        },
        {
            _id: "64b1f1f4f4d3f1f4f4d3f1f3",
            first_name: "Bob",
            surname: "Smith",
            username: "bobsmith",
            date_of_birth: "1975-03-03",
            phone_number: "123-456-7892",
            password: "password123",
            clinic_location: {
                latitude: 57.6,
                longitude: 12.2,
                street: "789 Oak St",
                zip: "54321",
                city: "Sometown"
            },
            email: "bobsmith@example.com"
        },
        {
            _id: "64b1f1f4f4d3f1f4f4d3f1f4",
            first_name: "Alice",
            surname: "Smith",
            username: "alicesmith",
            date_of_birth: "1990-04-04",
            phone_number: "123-456-7893",
            password: "password123",
            clinic_location: {
                latitude: 57.7,
                longitude: 12.3,
                street: "101 Pine St",
                zip: "98765",
                city: "Anycity"
            },
            email: "alicesmith@example.com"
        },
        {
            _id: "64b1f1f4f4d3f1f4f4d3f1f5",
            first_name: "Charlie",
            surname: "Brown",
            username: "charliebrown",
            date_of_birth: "1988-05-05",
            phone_number: "123-456-7894",
            password: "password123",
            clinic_location: {
                latitude: 57.8,
                longitude: 12.4,
                street: "202 Maple St",
                zip: "65432",
                city: "Othercity"
            },
            email: "charliebrown@example.com"
        },
        {
            _id: "64b1f1f4f4d3f1f4f4d3f1f6",
            first_name: "David",
            surname: "Johnson",
            username: "davidjohnson",
            date_of_birth: "1970-06-06",
            phone_number: "123-456-7895",
            password: "password123",
            clinic_location: {
                latitude: 57.6,
                longitude: 12.5,
                street: "303 Birch St",
                zip: "32145",
                city: "Somecity"
            },
            email: "davidjohnson@example.com"
        }
    ];
    createMarkers();

}

function createMarkers() {
    for (const dentist of dentists.value) {
        const clinic = dentist.clinic_location;
        var clinicMarker = L.marker([clinic.latitude, clinic.longitude]).addTo(map.value);
        createMarkerPopup(dentist, clinicMarker);
        clinicMarkers.value.set(dentist, clinicMarker);
    }
}

function createMarkerPopup(dentist, clinicMarker) {
    clinicMarker.bindPopup(`<a
      href="/dentists/${dentist.username}/appointments"><b>${dentist.first_name} ${dentist.surname} </b><br>${dentist.clinic_location.street} ${dentist.clinic_location.zip}</a>`).openPopup();
}
</script>

<template>
    <div>
        <div ref="mapContainer" id="map"></div>
    </div>
</template>

<script>
export default {
    name: 'MapContainer',
}
</script>

<style>
#map {
    height: 100vh;
    width: 100vw;
}
</style>