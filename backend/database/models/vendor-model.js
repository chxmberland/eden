const mongoose = require('mongoose')

const vendorModel = new mongoose.schema({
    walletAddresss: String,
    username: String,
    vendorID: String,
    hash: String,
    locations: [String],
    transactionHistory: [String],
    listings: [String],
    holdings: [{
        tokenID: String,
        amount: Boolean
    }]
})

module.exports = mongoose.model("vendor", vendorModel)