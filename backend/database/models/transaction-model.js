const mongoose = require('mongoose')

const transactionModel = new mongoose.Schema({
    transactionID: String,
    buyerID: String,
    vendorID: String,
    tokenID: String,
    tokensPurchased: Number,
    transactionValue: Number,
    currencyPayedWith: String,  // TokenID or reference to a token not listed on Eden
    amountPayed: Number
})

const Transaction =  mongoose.model("transactions", transactionModel)
module.exports = Transaction