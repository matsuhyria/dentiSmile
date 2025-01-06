#!/bin/bash
mongoimport --db clinic_db --collection clinics --file /docker-entrypoint-initdb.d/seed_clinic_data.json --jsonArray --upsert --upsertFields _id