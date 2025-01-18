require('dotenv').config();
const express = require("express");
const { syncAndSeed, client } = require('./db');
const app = require('./app');

const init = async ()=> {
  try {
    if (process.env.SYNC === 'TRUE') {
      await syncAndSeed();
    }

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
  });
  
  }
  catch(ex) {
    console.log(ex);
  }
};

init();