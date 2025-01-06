#!/bin/bash
mongoimport --db appointment_db --collection slots --file /docker-entrypoint-initdb.d/seed_appointment_data.json --jsonArray --upsert --upsertFields _id