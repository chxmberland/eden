const mongoose = require('mongoose')

const assetListingModel = new mongoose.Schema({
    assetID: String,
    tokenID: String,
    vendorID: String,
    info: {
        assetName: String,
        description: String
    },
    numberOfTokensListed: Number,
    numberOfTokensSold: Number,
    assetPrice: Number
})

const AssetListing =  mongoose.model("assetListings", assetListingModel)
module.exports = AssetListing