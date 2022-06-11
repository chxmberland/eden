const mongoose = require('mongoose')

const assetListingModel = new mongoose.Schema({
    assetID: String,
    vendorID: String,
    info: {
        assetName: String,
        description: String
    },
    tokenID: String,
    tokensSold: Number,
    assetPrice: Number
})

module.exports = mongoose.model("assetListing", assetListingModel)