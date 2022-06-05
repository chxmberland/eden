const mongoose = require('mongoose')

const tokenListingModel = new mongoose.Schema({
    tokenListingID: String,
    sourceAsset: String,
    numberOfTokensListed: Number
})

