const mongoose = require('mongoose')

const assetListingModel = new mongoose.Schema({
    locationID: String,
    vendorID: String,
    country: String,
    city: String,
    street: String,
    streetNumber: String,
    postalCode: String
})

module.exports = mongoose.model("location", assetListingModel)