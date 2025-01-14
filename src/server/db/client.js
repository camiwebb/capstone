const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL || 'postgres://localhost/uni_fullstack_template_db');

client.connect();

module.exports = client;
