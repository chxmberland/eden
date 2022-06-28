const mongoose = require('mongoose')

const tokenListingModel = new mongoose.Schema({
    userID: String,
    tokenListingID: String,
    sourceAsset: String,            // This is a listingID referencing an external document
    numberOfTokensListed: Number
})

