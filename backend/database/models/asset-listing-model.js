const mongoose = require('mongoose')

const assetListingModel = new mongoose.Schema({
    assetID: String,
    vendorID: String,
    info: {
        assetName: String,
        description: String
    },
    tokenID: String,        // Referencing an external document
    tokensSold: Number,
    assetPrice: Number
})

const AssetListing =  mongoose.model("assetListings", assetListingModel)
module.exports = AssetListing