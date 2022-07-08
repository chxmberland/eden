const mongoose = require('mongoose')
require('dotenv').config() // Allows accsess to environment variables in .env file

// Importing shelled APIs
const userAPI = require('./user/user-api.js')

const connectionUri = `mongodb+srv://admin:${process.env.DB_AUTH}@atlascluster.wmlg9zu.mongodb.net/?retryWrites=true&w=majority`
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "pheasant-test"
}

/* Description:
 *      This function creates a connection to the Atlas cluster
 * Params:
 *      connectionUri -> The uri given by MongoDB that allows for authentication
 *      connectionParams -> Various paramaters that can be given to on connection
*/
async function connectToDatabase(connectionUri, connectionParams) {
    try {
        await mongoose.connect(connectionUri, connectionParams) 
    } catch (err) {
        err && console.log(`Error!\n\n${err}`) // If there is an error, it is logged to the console
        return false
    }
 
    // Listening for errors during connection
    mongoose.connection.on('error', err => {
        console.log(`There has been an error in the connection.\n\n${err}`)
    })

    // Listening for unexcpected disconnections
    mongoose.connection.on('disconnected', () => {
        console.log(`The mongoose driver has been disconnected from the database.\n\n${msg}`)
    })

    // Listening for reconnections if a disconnect has occured
    mongoose.connection.on('reconnected', () => {
        console.log(`Mongoose has sucsessfully reconnected to the database\n\n${msg}`)
    })

    return true
}

function disconnectFromDatabase() {
    mongoose.disconnect()
}

module.exports = {
    connectionUri,
    connectionParams,
    connectToDatabase,
    disconnectFromDatabase
}