const mongoose = require('mongoose')
require('dotenv').config() // Allows accsess to environment variables in .env file

// Importing APIs
const userAPI = require('./user/user-api.js')

// Importing models
const User = require('../models/user-model.js')
const Vendor = require('../models/vendor-model.js')
const Location = require('../models/location-model.js')
const Transaction = require('../models/transaction-model.js')

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

async function flushDatabase(pass) {
    if (pass == process.env.FLUSH_PASS) {
        const userRes = await User.deleteMany({})
        const vendorRes = await Vendor.deleteMany({})
        const locationRes = await Location.deleteMany({})
        const transactionRes = await Transaction.deleteMany({})
    }
}

module.exports = {
    connectionUri,
    connectionParams,
    connectToDatabase,
    flushDatabase
}