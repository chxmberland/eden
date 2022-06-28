const mongoose = require('mongoose')

const tokenModel = new mongoose.Schema({
    tokenID: String,
    contractAddress: String,
    tokenName: String,
    tokenSupply: Number,
    abi: String
})

module.exports = mongoose.model("token", tokenModel)