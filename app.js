const mongoose = require('mongoose')
require('dotenv').config() // Allows accsess to environment variables

const connectionUri = `mongodb+srv://admin:${process.env.DB_AUTH}@atlascluster.wmlg9zu.mongodb.net/?retryWrites=true&w=majority`
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

function connectToDatabase(connectionUri, connectionParams) {
    mongoose.connect(connectionUri, connectionParams, function(error) {
        if (error) {
            console.log("Error!" + error);
        }
    });
}

/*
TESTING BEYOND THIS POINT
*/

connectToDatabase(connectionUri, connectionParams)