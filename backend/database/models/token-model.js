const mongoose = require('mongoose')

const tokenModel = new mongoose.Schema({
    tokenID: String,
    contractAddress: String,
    tokenName: String,
    tokenSupply: Number,
    pricePerTokenInUSD: Number,
    abi: String
})

const Token = mongoose.model("tokens", tokenModel)
module.exports = Token