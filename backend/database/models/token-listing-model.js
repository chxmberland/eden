const mongoose = require('mongoose')

const tokenListingModel = new mongoose.Schema({
    tokenListingID: String,
    tokenID: String,
    sourceAssetListingID: String,
    listeeID: String,
    numberOfTokensListed: Number,
    numberOfTokensSold: Number
})

const TokenListing = mongoose.model('tokenListings', tokenListingModel)
module.exports = TokenListing