const mongoose = require('mongoose')

const locationModel = new mongoose.Schema({
    locationID: String,
    vendorIDs: [String],
    country: String,
    city: String,
    street: String,
    streetNumber: String,
    postalCode: String
})

const Location = mongoose.model("locations", locationModel)
module.exports = Location