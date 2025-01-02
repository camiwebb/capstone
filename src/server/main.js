require('dotenv').config();
const express = require("express");
const ViteExpress = require("vite-express");

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const app = require('./app');
const { syncAndSeed, client } = require('./db');

const init = async()=> {
  try {
    await client.connect();
    if(process.env.SYNC === 'TRUE'){
      await syncAndSeed();
    }
    const port = process.env.PORT || 3000;
    ViteExpress.listen(app, port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  }
  catch(ex){
    console.log(ex);
  }
};

init();



