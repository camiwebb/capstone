require('dotenv').config();
const { Client } = require('pg');
const client = require('./client');

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
        
    } catch (err) {
        console.error("Error creating tables:", err);
    }
};

module.exports = { createTables };