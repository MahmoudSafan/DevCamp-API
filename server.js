const express = require('express');
const dotenv = require('dotenv');
const config = require('./config/config');

dotenv.config({ path: './config/config.env' });

const app = express();

app.listen(config.PORT, ()=>{
    console.log(`server running on ${config.NODE_ENV} in port ${config.PORT}`);
});