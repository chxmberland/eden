const mongoose = require('mongoose')

const assetListingModel = new mongoose.Schema({
    assetListingID: String,
    tokenID: String,
    vendorID: String,
    info: {
        assetName: String,
        description: String
    },
    relatedTokenListings: [String],
    numberOfTokensListed: Number,
    numberOfTokensSold: Number,
    assetPrice: Number
})

const AssetListing =  mongoose.model("assetListings", assetListingModel)
module.exports = AssetListing