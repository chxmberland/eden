// Importing models
const tokenModel = require("../../models/token-model.js")

/*
 * Endpoint:
 * 
 * [POST]
 * v1/database/token/create-token
 * 
 * Description:
 * 
 * Creates a token document in the MongoDB Atlas instance. This function should be called by the blockchain
 * API after a token smart contract is sucsessfully created and deployed.
 * 
 * Takes:  
 * 
 *  - contractAddress: The address of the contract managing the token on the blockchain
 *  - tokenName: The plain text name of the token
 *  - tokenSupply: The maximum number of tokens that exist
 *  - pricePerTokenInUSD: The price for each token is USD
 *  - abi: The contract abi that is created before any smart contract is deployed
 * 
 * Returns:
 * 
 * The document of the token that is created, null if there is an error.
*/
async function createTokenInDB(contractAddress, tokenName, tokenSupply, pricePerTokenInUSD, abi) {
    // Creating the token
    const newToken = new tokenModel({
        tokenID: "",
        contractAddress: contractAddress,
        tokenName: tokenName,
        tokenSupply: tokenSupply,
        pricePerTokenInUSD: pricePerTokenInUSD,
        abi: abi
    })
    let savedToken = await newToken.save()

    // Updating the tokenID in the database
    const filter = { _id: savedToken._id }
    const update = { tokenID: `TK-${savedToken._id}` }
    const options = {
        new: true,
        upsert: false
    }
    return await tokenModel.findOneAndUpdate(filter, update, options)
}



/*
 * Endpoint:
 * 
 * [GET]
 * v1/database/token/get-token
 * 
 * Description:
 * 
 * Retrieves a single token document from the database.
 * 
 * Takes:  
 * 
 *  - tokenID: The unique ID of the token that should be found
 * 
 * Returns:
 * 
 * The document of the token that is created, null if there is an error.
*/
async function getTokenFromDB(tokenID) {
    const filter = { tokenID: tokenID }
    return await tokenModel.findOne(filter)
}



/*
 * Endpoint:
 * 
 * [PATCH]
 * v1/database/token/update-price-per-token
 * 
 * Description:
 * 
 * Updates the pricePerTokenInUSD of a token document.
 * 
 * Takes:  
 * 
 *  - tokenID: The unique ID of the token that should be updated
 *  - newPrice: The new price of the token
 * 
 * Returns:
 * 
 * The document of the token, null if there is an error.
*/
async function updatePricePerTokenInDB(tokenID, newPrice) {
    const filter = { tokenID: tokenID }
    const update = { pricePerTokenInUSD: newPrice }
    const options = {
        new: true,
        upsert: false
    }
    return await tokenModel.findOneAndUpdate(filter, update, options)
}



/*
 * Endpoint:
 * 
 * [DELETE]
 * v1/database/token/delete-token
 * 
 * Description:
 * 
 * Deletes a token document from the database.
 * 
 * Takes:  
 * 
 *  - tokenID: The unique ID of the token document that should be deleted
 * 
 * Returns:
 * 
 * The response of the deletion.
*/
async function deleteTokenFromDB(tokenID) {
    const filter = { tokenID: tokenID }
    const res = await tokenModel.deleteOne(filter)
    return res
}

module.exports = {
    createTokenInDB,
    getTokenFromDB,
    updatePricePerTokenInDB,
    deleteTokenFromDB
}