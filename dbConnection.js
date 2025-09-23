const mongoose = require('mongoose');

async function dbConnection(url) {
    try {
        await mongoose.connect(url)
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Error in connecting database");
    }
}

module.exports=dbConnection