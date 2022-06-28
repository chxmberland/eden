const mongoose = require('mongoose')

const transactionModel = new mongoose.Schema({
    transactionID: String,
    buyerID: String,            // Referencing an external document
    vendorID: String,           // Referencing an external document
    tokenID: String,            // Referencing an external document
    tokensPurchased: Number,
    transactionValue: Number,
    currencyPayedWith: String,
    amountPayed: Number
})

module.exports = mongoose.model("transaction", transactionModel)