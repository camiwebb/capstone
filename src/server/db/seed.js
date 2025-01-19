require('dotenv').config();
const client = require('./client');

const users = [
    { username: 'johndoe', email: 'johndoe@example.com', password: 'password123', name: 'John Doe' },
    { username: 'janedoe', email: 'janedoe@example.com', password: 'password456', name: 'Jane Doe' },
    { username: 'alice', email: 'alice@example.com', password: 'password789', name: 'Alice Wonderland' },
    { username: 'bob', email: 'bob@example.com', password: 'password101', name: 'Bob Builder' },
    { username: 'charlie', email: 'charlie@example.com', password: 'password202', name: 'Charlie Brown' },
    { username: 'david', email: 'david@example.com', password: 'password303', name: 'David Copperfield' },
    { username: 'eve', email: 'eve@example.com', password: 'password404', name: 'Eve Adams' },
    { username: 'frank', email: 'frank@example.com', password: 'password505', name: 'Frank Sinatra' }
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
    { rating: 4, review_text: 'Good place for a quick stop, but could be cleaner.', rest_stop_index: 0 },
    { rating: 3, review_text: 'It was busy when I stopped, but the restrooms were clean.', rest_stop_index: 2 },
    { rating: 5, review_text: 'Loved the peaceful surroundings!', rest_stop_index: 3 },
    { rating: 4, review_text: 'Clean and well-maintained facilities, but could use more shade.', rest_stop_index: 4 },
    { rating: 5, review_text: 'Great location, perfect for long drives!', rest_stop_index: 5 },
  ];

  const comments = [
    { reviewIndex: 0, userIndex: 1, comment_text: 'I agree, great place!' },
    { reviewIndex: 1, userIndex: 0, comment_text: 'It was okay, could use more vending options.' },
    { reviewIndex: 0, userIndex: 2, comment_text: 'Absolutely! I love stopping here on road trips.' },
    { reviewIndex: 2, userIndex: 3, comment_text: 'The restrooms were top notch, very impressed.' },
    { reviewIndex: 3, userIndex: 4, comment_text: 'I agree, the environment is so calming.' },
    { reviewIndex: 4, userIndex: 1, comment_text: 'I hope they improve the maintenance soon.' },
    { reviewIndex: 6, userIndex: 2, comment_text: 'I love the trails here too! Great spot for a hike.' },
    { reviewIndex: 8, userIndex: 5, comment_text: 'The views were breathtaking! Worth the stop.' },
    { reviewIndex: 10, userIndex: 6, comment_text: 'I felt the same, a bit crowded, but still nice.' },
    { reviewIndex: 5, userIndex: 7, comment_text: 'Vending options were great, but more seating would be nice.' },
    { reviewIndex: 7, userIndex: 0, comment_text: 'Absolutely, perfect for a road trip break!' },
    { reviewIndex: 9, userIndex: 3, comment_text: 'Views were stunning, highly recommend this stop.' },
];

const validateSeedData = () => {
    const invalidReviews = reviews.filter(review =>
        review.rest_stop_index < 0 || review.rest_stop_index >= restStops.length
    );
    if (invalidReviews.length > 0) {
        console.error('Invalid rest_stop_index found in reviews:', invalidReviews);
        throw new Error('Invalid rest_stop_index detected.');
    }

    const invalidComments = comments.filter(comment =>
        comment.reviewIndex < 0 || comment.reviewIndex >= reviews.length
    );
    if (invalidComments.length > 0) {
        console.error('Invalid reviewIndex found in comments:', invalidComments);
        throw new Error('Invalid reviewIndex detected.');
    }

    console.log('Seed data validation passed.');
};

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
            name VARCHAR(100) NOT NULL
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
            created_at TIMESTAMP DEFAULT current_timestamp,
            updated_at TIMESTAMP DEFAULT NOW()
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
        validateSeedData();


        const userResults = await Promise.all(
            users.map(user =>
                client.query(
                    `INSERT INTO users (username, email, password, name) VALUES ($1, $2, $3, $4) RETURNING id`,
                    [user.username, user.email, user.password, user.name]
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
            reviews.map(review => {
                const randomUser = userResults[Math.floor(Math.random() * userResults.length)].rows[0].id;
                return client.query(
                    `INSERT INTO reviews (user_id, location_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING id`,
                    [
                        randomUser,
                        restStopResults[review.rest_stop_index].rows[0].id,
                        review.rating,
                        review.review_text
                    ]
                );
            })
        );

        await Promise.all(
            comments.map(comment => {
                const reviewResult = reviewResults[comment.reviewIndex];
                const userResult = userResults[comment.userIndex];
            
                if (!reviewResult || !reviewResult.rows || reviewResult.rows.length === 0) {
                  console.error(`Invalid review at index ${comment.reviewIndex}`);
                  return; // Skip this iteration or handle it accordingly
                }
                if (!userResult || !userResult.rows || userResult.rows.length === 0) {
                  console.error(`Invalid user at index ${comment.userIndex}`);
                  return; // Skip this iteration or handle it accordingly
                }
            
                return client.query(
                  `INSERT INTO comments (review_id, user_id, comment_text) VALUES ($1, $2, $3)`,
                  [
                    reviewResult.rows[0].id,
                    userResult.rows[0].id,
                    comment.comment_text
                  ]
                );
              })
            );
            

        console.log('Seed data inserted successfully.');
    } catch (err) {
        console.error('Error inserting seed data:', err);
    }
};

module.exports = { createTables };