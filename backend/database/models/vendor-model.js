const mongoose = require('mongoose')

const vendorModel = new mongoose.schema({
    walletAddresss: String,
    username: String,
    vendorID: String,
    hash: String,
    locations: [String],            // List of locationID's referencing external documents
    transactionHistory: [String],   // List of transactionID's referencing external documents
    listings: [String],             // List of listingID's referencing external documents
    holdings: [{
        tokenID: String,
        amount: Boolean
    }]
})

module.exports = mongoose.model("vendor", vendorModel)