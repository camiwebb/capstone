const { createTables } = require('./seed');
const client = require('./client');

const syncAndSeed = async()=> {
  console.log('Syncing and seeding the database...');

  try {
    
  } catch (err) {
    console.error("Error syncing and seeding:", err);
  }
};


module.exports = {
  syncAndSeed,
  client
};
