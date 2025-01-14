require('dotenv').config();
const express = require("express");
// const ViteExpress = require("vite-express");

const { syncAndSeed, client } = require('./db');

const app = require('./app');

const init = async ()=> {
  try {
    if (!client._connected) {
    await client.connect(); 
  }
    if (process.env.SYNC === 'TRUE') {
      await syncAndSeed();
    }

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
  });
  

    // ViteExpress.listen(app, port, () =>
    //   console.log(`Server is listening on port ${port}...`)
    // );
  }
  catch(ex) {
    console.log(ex);
  }
};

init();