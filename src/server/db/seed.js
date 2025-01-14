require('dotenv').config();
const { Client } = require('pg');
const client = require('./client');

const users = [
    { username: 'johndoe', email: 'johndoe@example.com', password: 'password123', role: 'user'},
    { username: 'janedoe', email: 'janedoe@example.com', password: 'password456', role: 'admin'}
];

const restStops = [
    { name: 'I-15 Rest Area - Northbound', description: 'Clean restrooms and a pet area.', average_rating: 4.2 },
    { name: 'Scipio Rest Area', description: 'Vending machines and picnic tables.', average_rating: 3.8 },
    { name: 'Echo Canyon Rest Area', description: 'Wi-Fi and scenic views.', average_rating: 4.5 },
];

const reviews = [
    { rating: 5, review_text: 'Great place to stop and rest!' },
    { rating: 3, review_text: 'It was okay, nothing special.' },
  ];

const createTables = async () => {
    const SQL = /*SQL*/ `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        DROP TABLE IF EXISTS comments;
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS rest_stops;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(20) DEFAULT 'user'
        );

        CREATE TABLE rest_stops (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(100) NOT NULL,
            description TEXT,
            average_rating DECIMAL(3, 2) DEFAULT 0.00
        );

        CREATE TABLE reviews (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES users(id) NOT NULL,
            location_id UUID REFERENCES rest_stops(id) NOT NULL,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            review_text TEXT, 
            created_at TIMESTAMP DEFAULT current_timestamp
        );

        CREATE TABLE comments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            review_id SERIAL REFERENCES reviews(id),
            user_id UUID REFERENCES users(id),
            comment_text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT current_timestamp
        );
    `;

    try {
        await client.query(SQL);
        console.log('Tables created successfully.');

        await seedData();
        
    } catch (err) {
        console.error("Error creating tables:", err);
    }
};

const seedData = async ()=> {
    try {
        const userInsertPromises = users.map(user =>
            client.query(
              `INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id`,
              [user.username, user.email, user.password, user.role]
            )
          );
          const userResults = await Promise.all(userInsertPromises);
      
          const restStopInsertPromises = restStops.map(restStop =>
            client.query(
              `INSERT INTO rest_stops (name, description, average_rating) VALUES ($1, $2, $3) RETURNING id`,
              [restStop.name, restStop.description, restStop.average_rating]
            )
          );
          const restStopResults = await Promise.all(restStopInsertPromises);
      
          const reviewInsertPromises = reviews.map((review, index) =>
            client.query(
              `INSERT INTO reviews (user_id, location_id, rating, review_text) VALUES ($1, $2, $3, $4)`,
              [
                userResults[index % userResults.length].rows[0].id,
                restStopResults[index % restStopResults.length].rows[0].id,
                review.rating,
                review.review_text,
              ]
            )
          );
          await Promise.all(reviewInsertPromises);
      
          console.log('Seed data inserted successfully.');
    } catch (err) {
        console.error('Error inserting seed data:', err);
    }
};

module.exports = { createTables };