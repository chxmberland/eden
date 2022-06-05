const mongoose = require('mongoose')

const assetListingModel = new mongoose.Schema({
    assetID: String,
    info: {
        itemName: String,
        description: String
    },
    relatedTokenID: String,
    tokensSold: Number,
    assetPrice: Number
})

module.exports = mongoose.model("assetListing", assetListingModel)