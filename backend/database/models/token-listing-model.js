const mongoose = require('mongoose')

const tokenListingModel = new mongoose.Schema({
    userID: String,
    tokenListingID: String,
    sourceAsset: String,
    numberOfTokensListed: Number
})

