// Importing models
const modelLocation = "../../models"
const TokenListingModel = require(`${modelLocation}/token-listing-model.js`)
const AssetListingModel = require(`${modelLocation}/asset-listing-model.js`)

// Importing APIs
const tokenApi = require("../token/token-api.js")

/*
 * Endpoint:
 * 
 * [POST]
 * v1/database/token/create-token-listing
 * 
 * Description:
 * 
 * Creates a token listing document in the MongoDB Atlas instance.
 * 
 * Takes:  
 * 
 *  - sourceAssetID: The unique ID of the asset that the token in the listing is linked to.
 *  - tokenID: The unique ID of the token that the token listing is selling
 *  - listeeID: The user/vendor that is selling the token
 *  - numberOfTokensListed: The total number of tokens that are for sale
 * 
 * Returns:
 * 
 * The document of the token listing that is created, null if there is an error.
*/
async function createTokenListing(sourceAssetListingID, tokenID, listeeID, numberOfTokensListed) {
    // Checking to see if the asset exists
    if (await getAssetListing(sourceAssetListingID) == null) return null

    // Creating a new token listing model
    const tokenListing = new TokenListingModel({
        tokenListingID: "",
        tokenID: tokenID,
        sourceAssetListingID: sourceAssetListingID,
        listeeID: listeeID,
        numberOfTokensListed: numberOfTokensListed,
        numberOfTokensSold: 0
    })
    const savedTokenListing = await tokenListing.save()

    // Adding a uniqueID
    if (savedTokenListing != null) {
        const filter = { _id: savedTokenListing._id }
        const update = { tokenListingID: `TL-${savedTokenListing._id}` }
        const options = {
            new: true,
            upsert: false
        }
        return await TokenListingModel.findOneAndUpdate(filter, update, options)
    }
    return null
}

/*
 * Endpoint:
 * 
 * [POST]
 * v1/database/token/create-asset-listing
 * 
 * Description:
 * 
 * Creates an asset listing document in the MongoDB Atlas instance.
 * 
 * Takes:  
 * 
 *  - tokenID: The unique ID of the token that the asset is being represented by
 *  - assetName: The plain text name of the asset as described by the user
 *  - description: The plain text description of the asset as described by the user
 *  - numberOfTokensListed: The total number of tokens that have been listed by the seller
 * 
 * Returns:
 * 
 * The document of the asset listing that is created, false if there is an error.
*/
async function createAssetListing(tokenID, vendorID, assetName, description, numberOfTokensListed, assetPrice) {
    // Checking to see if the token exists
    if (await tokenApi.getTokenFromDB(tokenID) == null) return false

    // Creating a new asset listing
    const newAssetListing = new AssetListingModel({
        assetListingID: "",
        tokenID: tokenID,
        vendorID: vendorID,
        info: {
            assetName: assetName,
            description: description
        },
        numberOfTokensListed: numberOfTokensListed,
        numberOfTokensSold: 0,
        assetPrice: assetPrice
    })
    const savedAssetListing = await newAssetListing.save()

    // Adding the unqiue id
    if (savedAssetListing != null) {
        const filter = { _id: savedAssetListing._id }
        const update = { assetListingID: `AL-${savedAssetListing._id}` }
        const options = {
            new: true,
            upsert: false
        }
        return await AssetListingModel.findOneAndUpdate(filter, update, options)
    }
    return null
}


/*
 * Endpoint:
 * 
 * [POST]
 * v1/database/token/get-token-listing
 * 
 * Description:
 * 
 * Gets a token listing document from the MongoDB Atlas instance.
 * 
 * Takes:  
 * 
 *  - tokenListingID: The unique ID of the token listing that you want to get
 * 
 * Returns:
 * 
 * The document of the token listing if it exists, false if it could not be found.
*/
async function getTokenListing(tokenListingID) {
    const tokenListingModel = await TokenListingModel.findOne({ tokenListingID: tokenListingID })
    return (tokenListingModel == null) ? false : tokenListingModel 
}

/*
 * Endpoint:
 * 
 * [POST]
 * v1/database/token/get-asset-listing
 * 
 * Description:
 * 
 * Gets an asset listing document from the MongoDB Atlas instance.
 * 
 * Takes:  
 * 
 *  - assetListingID: The unique ID of the token listing that you want to get
 * 
 * Returns:
 * 
 * The document of the token listing if it exists, false if it could not be found.
*/
async function getAssetListing(assetListingID) {
    const assetListingModel = await AssetListingModel.findOne({ assetListingID: assetListingID })
    return (assetListingModel == null) ? false : assetListingModel
}

/*
 * Endpoint:
 * 
 * [POST]
 * v1/database/token/update-asset-price
 * 
 * Description:
 * 
 * Updates the asset price of a given asset. It then updates each related token listing. Note that this should
 * not touch the blockchain API. The price of a token gets updated on a transaction occurence to minimize the
 * number of calls that need to be made to the blockchain.
 * 
 * Takes:  
 * 
 *  - assetListingID: The unique ID of the token listing that you want to get
 *  - newAssetPrice: The new price of the asset
 * 
 * Returns:
 * 
 * The document of the asset listing if sucsessful, null if it could not be found.
*/
async function updateAssetPrice(assetListingID, newPrice) {
    const filter = { assetListingID: assetListingID }
    const update = { assetPrice: newPrice }
    const options = {
        new: true,
        upsert: false
    }
    return await AssetListingModel.findOneAndUpdate(filter, update, options)
}

/*
 * Endpoint:
 * 
 * [POST]
 * v1/database/token/update-asset-description
 * 
 * Description:
 * 
 * Updates the description of a given asset.
 * 
 * Takes:  
 * 
 *  - assetListingID: The unique ID of the asset that you want to update
 *  - newName: The plain text name of the asset that the vendor wants to change
 *  - newAssetPrice: The new price of the asset
 * 
 * Returns:
 * 
 * The document of the asset listing if sucsessful, null if it could not be found.
*/
async function updateAssetDescription(assetListingID, newName, newDescription) {
    // Accounting for blank inputs
    const assetListing = await getAssetListing(assetListingID)
    if (assetListing == null) return false
    if (newName.length == 0) newName = assetListing.info.assetName
    if (newDescription.length == 0) newDescription = assetListing.info.description

    const filter = { assetListingID: assetListingID }
    const update = {
        info: {
            assetName: newName,
            description: newDescription
        }
    }
    const options = {
        new: true,
        upsert: false
    }
    return await AssetListingModel.findOneAndUpdate(filter, update, options)
}

/*
 * Endpoint:
 * 
 * [POST]
 * v1/database/token/delete-token-listing
 * 
 * Description:
 * 
 * Deletes an asset listing.
 * 
 * Takes:  
 * 
 *  - tokenListingID: The unique ID of the asset listing document you want to delete
 * 
 * Returns:
 * 
 * Returns true if the document was deleted, and false if not.
*/
async function deleteTokenListing(tokenListingID) {
    const filter = { tokenListingID: tokenListingID }
    const delRes = await TokenListingModel.deleteOne(filter)
    return delRes.acknowledged && delRes.deletedCount == 1
}

/*
 * Endpoint:
 * 
 * [POST]
 * v1/database/token/delete-token-listing
 * 
 * Description:
 * 
 * Deletes an asset listing.
 * 
 * Takes:  
 * 
 *  - tokenListingID: The unique ID of the asset listing document you want to delete
 * 
 * Returns:
 * 
 * Returns true if the document was deleted, and false if not.
*/
async function deleteAssetListing(assetListingID) {
    const filter = { assetListingID: assetListingID }
    const delRes = await AssetListingModel.deleteOne(filter)
    return delRes.acknowledged && delRes.deletedCount == 1
}

module.exports = {
    createTokenListing,
    createAssetListing,
    getTokenListing,
    getAssetListing,
    updateAssetPrice,
    updateAssetDescription,
    deleteTokenListing,
    deleteAssetListing
}