const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/ComunidadDB';

mongoose.connect(DB_URI, {})
    .then(console.log("DB CONECTADA"))
    .catch(err => console.log("ERROR", err));