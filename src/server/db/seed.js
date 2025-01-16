require('dotenv').config();
const client = require('./client');

const users = [
    { username: 'johndoe', email: 'johndoe@example.com', password: 'password123', role: 'user'},
    { username: 'janedoe', email: 'janedoe@example.com', password: 'password456', role: 'admin'}
];

const restStops = [
    { name: 'I-15 Rest Area - Northbound', description: 'Clean restrooms and a pet area.', average_rating: 4.2 },
    { name: 'Scipio Rest Area', description: 'Vending machines and picnic tables.', average_rating: 3.8 },
    { name: 'Echo Canyon Rest Area', description: 'Wi-Fi and scenic views.', average_rating: 4.5 },
    { name: 'Cedar City Rest Area', description: 'Shaded picnic spots and clean facilities.', average_rating: 4.1 },
    { name: 'Fillmore Rest Area', description: 'Large parking area and vending machines.', average_rating: 3.9 },
    { name: 'Spanish Fork Rest Area', description: 'Modern restrooms and plenty of parking.', average_rating: 4.3 },
    { name: 'Price Canyon Rest Area', description: 'Scenic stop with a hiking trail.', average_rating: 4.7 },
    { name: 'Kanab Rest Area', description: 'Quaint area with picnic tables.', average_rating: 4.0 },
    { name: 'Green River Rest Area', description: 'Near the river, great for a quick break.', average_rating: 4.2 },
    { name: 'Parowan Rest Area', description: 'Small but clean, with a pet area.', average_rating: 4.1 },
    { name: 'Brigham City Rest Area', description: 'Conveniently located with clean facilities.', average_rating: 3.7 },
    { name: 'Hurricane Rest Area', description: 'Friendly staff and shaded parking.', average_rating: 4.0 },
    { name: 'Richfield Rest Area', description: 'Nice views and vending machines.', average_rating: 3.9 },
    { name: 'Provo Canyon Rest Area', description: 'Beautiful scenery and fresh air.', average_rating: 4.8 },
    { name: 'Moab Rest Area', description: 'Close to Arches National Park, a must-stop.', average_rating: 4.6 },
    { name: 'Salt Flats Rest Area', description: 'Unique view of the Bonneville Salt Flats.', average_rating: 4.3 },
    { name: 'Ogden Rest Area', description: 'Good place for families traveling with kids.', average_rating: 4.1 },
    { name: 'St. George Rest Area', description: 'Warm weather and clean facilities.', average_rating: 4.4 },
    { name: 'Bear Lake Rest Area', description: 'Amazing lake views and picnic areas.', average_rating: 4.9 },
    { name: 'Logan Canyon Rest Area', description: 'Quiet and peaceful with walking trails.', average_rating: 4.7 },
    { name: 'Park City Rest Area', description: 'Upscale facilities and close to attractions.', average_rating: 4.6 },
    { name: 'Timpanogos Rest Area', description: 'Nice restrooms and a nearby nature trail.', average_rating: 4.3 },
    { name: 'Bluff Rest Area', description: 'Scenic spot in the desert with clean facilities.', average_rating: 4.0 },
    { name: 'Bountiful Rest Area', description: 'Clean and modern, with a helpful staff.', average_rating: 4.2 },
    { name: 'Draper Rest Area', description: 'Large parking lot and good for overnight stops.', average_rating: 3.8 }
];

const reviews = [
    { rating: 5, review_text: 'Great place to stop and rest!', rest_stop_index: 0 },
    { rating: 3, review_text: 'It was okay, nothing special.', rest_stop_index: 1 },
    { rating: 4, review_text: 'Clean and well-maintained facilities.', rest_stop_index: 2 },
    { rating: 5, review_text: 'Beautiful scenery and relaxing environment.', rest_stop_index: 6 },
    { rating: 2, review_text: 'Bathrooms need better maintenance.', rest_stop_index: 3 },
    { rating: 4, review_text: 'Good parking and plenty of vending options.', rest_stop_index: 4 },
    { rating: 3, review_text: 'Crowded during peak hours but decent.', rest_stop_index: 5 },
    { rating: 5, review_text: 'Loved the hiking trail nearby!', rest_stop_index: 6 }, 
    { rating: 4, review_text: 'Great for a quick snack and rest.', rest_stop_index: 7 },
    { rating: 5, review_text: 'Amazing views of the lake!', rest_stop_index: 18 },
  ];

  const comments = [
    { reviewIndex: 0, userIndex: 1, comment_text: 'I agree, great place!' },
    { reviewIndex: 1, userIndex: 0, comment_text: 'It was okay, could use more vending options.' }
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
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
            location_id UUID REFERENCES rest_stops(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            review_text TEXT, 
            created_at TIMESTAMP DEFAULT current_timestamp
        );

        CREATE TABLE comments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            review_id UUID REFERENCES reviews(id) ON DELETE CASCADE ON UPDATE CASCADE,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
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
        const userResults = await Promise.all(
            users.map(user =>
                client.query(
                    `INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id`,
                    [user.username, user.email, user.password, user.role]
                )
            )
        );

        const restStopResults = await Promise.all(
            restStops.map(restStop =>
                client.query(
                    `INSERT INTO rest_stops (name, description, average_rating) VALUES ($1, $2, $3) RETURNING id`,
                    [restStop.name, restStop.description, restStop.average_rating]
                )
            )
        );

        const reviewResults = await Promise.all(
            reviews.map((review, index) =>
                client.query(
                    `INSERT INTO reviews (user_id, location_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING id`,
                    [
                        userResults[index % userResults.length].rows[0].id,
                        restStopResults[index % restStopResults.length].rows[0].id,
                        review.rating,
                        review.review_text
                    ]
                )
            )
        );

        await Promise.all(
            comments.map(comment =>
                client.query(
                    `INSERT INTO comments (review_id, user_id, comment_text) VALUES ($1, $2, $3)`,
                    [
                        reviewResults[comment.reviewIndex].rows[0].id,
                        userResults[comment.userIndex].rows[0].id,
                        comment.comment_text
                    ]
                )
            )
        );

        console.log('Seed data inserted successfully.');
    } catch (err) {
        console.error('Error inserting seed data:', err);
    }
};

module.exports = { createTables };