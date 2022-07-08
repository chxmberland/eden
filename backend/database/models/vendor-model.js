const mongoose = require('mongoose')

const vendorModel = new mongoose.Schema({
    walletAddress: String,
    username: String,
    vendorID: String,
    hash: String,
    locations: [String],            // List of locationID's referencing external documents
    transactionHistory: [String],   // List of transactionID's referencing external documents
    listings: [String],             // List of listingID's referencing external documents
    holdings: [{
        tokenID: String,
        amount: Number
    }]
})

const Vendor = mongoose.model("vendor", vendorModel)
module.exports = Vendor