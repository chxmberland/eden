const mongoose = require('mongoose')

const transactionModel = new mongoose.Schema({
    transactionID: String,
    buyerID: String,
    vendorID: String,
    tokenID: String,
    tokensPurchased: Number,
    transactionValueInUSD: Number,
    currencyPayedWith: String,
    amountPayed: Number
})

module.exports = mongoose.model("transaction", transactionModel)