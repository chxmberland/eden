const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    walletAddress: String,
    username: String,
    userID: String,
    hash: String,
    transactionHistory: [String],
    holdings: [{
        tokenID: String,
        amount: Number
    }]
})

const User = mongoose.model("users", userModel)
module.exports = User