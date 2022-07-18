const userApi = require("../user/user-api.js")

const modelLocation = '../../models'
const Transaction = require(`${modelLocation}/transaction-model.js`)
const User = require(`${modelLocation}/user-model.js`)
const Vendor = require(`${modelLocation}/vendor-model.js`)



/* 
 * Endpoint:
 * 
 * [POST]
 * v1/database/transaction/create-transaction
 * 
 * Inputs:
 * 
 *  - buyerID: The unique ID of the user or vendor that is purchasing the token
 *  - vendorID: The unique ID of the vendor that is selling the token
 *  - tokenID: The unique token ID of the token that is being listed
 *  - tokensPurchased: The number of tokens that are being purchased by the buyer
 *  - transactionValue: The value of the transaction in USD
 *  - currencyPayedWith: The currency that the buyer is using to create the transaction
 *  - amountPayed: The amount of currency (see currencyPayedWith) used in the transaction
 * 
 * Description:
 * 
 * This function logs a transaction and adjusts the holdings of the user and the vendor in the database. 
 * 
 * Returns:
 * 
 * The transaction document if successful, null if unsucsessful.
*/
async function createTransaction(buyerID, vendorID, tokenID, tokensPurchased, transactionValue, currencyPayedWith, amountPayed) {
    // TODO: Enure the buyer and vendor both have enough tokens to finance the transaction
    if (!(await ensureFunds(vendorID, tokenID, tokensPurchased))) {
        console.log("The seller does not have sufficient funds.")
        return null
    }

    // Creating and saving the transaction
    const newTransaction = new Transaction({
        transactionID: "",
        buyerID: buyerID,
        vendorID: vendorID,
        tokenID: tokenID,
        tokensPurchased: tokensPurchased,
        transactionValue: transactionValue,
        currencyPayedWith: currencyPayedWith,
        amountPayed: amountPayed
    })
    const savedTransaction = await newTransaction.save()

    // Adding a unique transactionID to the transaction using Mongo's unique ID
    let filter = { _id: savedTransaction._id }
    let update = { transactionID: `TR-${savedTransaction._id}` }
    let options = {
        new: true,
        upsert: false
    }
    const updatedTransaction = await Transaction.findOneAndUpdate(filter, update, options)

    // Adding the transactionID to the buyer
    update = { $addToSet: { transactionHistory: updatedTransaction.transactionID } }
    options = {
        new: true,
        upsert: false
    }
    const buyerIsUser = (buyerID.charAt(0) == "U")
    const updatedBuyer = (
        buyerIsUser ? 
            await User.findOneAndUpdate({ userID: buyerID }, update, options) : 
            await Vendor.findOneAndUpdate({ vendorID: buyerID }, update, options)
    )

    // Adding the transactionID to the vendor
    const updatedVendor = await Vendor.findOneAndUpdate({ vendorID: vendorID }, update, options)

    // Updating the holdings of the buyer
    const updatedBuyerHoldings = buyerIsUser ? await updateUserHoldings(buyerID, tokenID, tokensPurchased) : await updateVendorHoldings(buyerID, tokeID, tokensPurchased)

    // Updating the holdings of the vendor
    const updatedVendorHoldings = updateVendorHoldings(vendorID, tokenID, (tokensPurchased * -1))

    return updatedTransaction
}



/*
 * Inputs:
 * 
 *  - id: The unique id of the user/vendor that we are checking (can be either)
 *  - tokenID: The tokens that we are ensuring the user/vendor has
 *  - amount: The amount that the user must have for the function to return true
 * 
 * Description:
 * 
 * This function esures that the user specified by the input id has atleast amount of tokenID
 * in their holdings.
 * 
 * Returns:
 * 
 * True if the user/vendor at id has enough, and false if they do not.
*/
async function ensureFunds(id, tokenID, amount) {
    // Checking to see what type of user they are
    const isUser = (id.charAt(0) == "U")

    // Getting the user
    const toCheck = isUser ? await userApi.getUser(id) : await userApi.getVendor(id)

    // Checking to see if the user (1. Is holding the token, 2. Has enough token to sell)
    for (let i = 0; i < toCheck.holdings.length; i++) {
        const curHolding = toCheck.holdings[i]
        if (curHolding.tokenID == tokenID && curHolding.amount >= amount) {
            return true
        }
    }

    return false
}



/*
 * Endpoint:
 * 
 * [POST]
 * v1/database/user/update-user-holdings
 * 
 * Inputs:
 * 
 *  - userID: The ID of the user who's holdings are updated
 *  - tokenID: The ID of the token that you are updating in the users holdings field
 *  - amount: The amount that the token is being updated
 * 
 * Description:
 * 
 * This function updated the holdings of a user at a specific token.
 * 
 * Returns:
 * 
 * The updated user document.
*/
async function updateUserHoldings(userID, tokenID, amount) {
    // Finding the user
    const filter = { userID: userID }
    const projection = "holdings userID"
    const user = await User.findOne(filter, projection)

    // Updating the holdings
    const updatedUser = checkAndUpdateHolding(user, tokenID, amount)

    // Saving the modified vendor
    const update = { holdings: updatedUser.holdings }
    const options = {
        new: true,
        upsert: false
    }
    return User.findOneAndUpdate(filter, update, options)
}



/*
 * Endpoint:
 * 
 * [POST]
 * v1/database/user/update-vendor-holdings
 * 
 * Inputs:
 * 
 *  - vendorID: The ID of the vendor who's holdings are updated
 *  - tokenID: The ID of the token that you are updating in the users holdings field
 *  - amount: The amount that the token is being updated
 * 
 * Description:
 * 
 * This function updated the holdings of a vendor at a specific token.
 * 
 * Returns:
 * 
 * The updated vendor document.
*/
async function updateVendorHoldings(vendorID, tokenID, amount) {
    // Finding the vendor and returning their vendorID and holdings 
    const filter = { vendorID: vendorID }
    const projection = "holdings vendorID"
    const vendor = await Vendor.findOne(filter, projection)

    // Updating the holdings
    const updatedVendor = checkAndUpdateHolding(vendor, tokenID, amount)

    // Saving the modified vendor
    const update = { holdings: updatedVendor.holdings }
    const options = {
        new: true,
        upsert: false
    }
    return await Vendor.findOneAndUpdate(filter, update, options)
}



/*
 * Inputs:
 * 
 *  - user: A user/vendor document
 *  - tokenID: The unique token ID that is going to be updated
 *  - amount: The amount the holdings of the user/vendor document at the token specified needs to be changed by
 * 
 * Description:
 * 
 * This function checks if a token is present for a user, and then updated the amount that is held
 * by the user before returning.
 * 
 * Returns:
 * 
 * The updated user/vendor document.
*/
function checkAndUpdateHolding(user, tokenID, amount) {
    // Checking to see if the user already holds the token
    let present = false
    let index = null
    for (let i = 0; i < user.holdings.length; i++) {
        if (user.holdings[i].tokenID == tokenID) {
            present = true
            index = i
        }
    }

    if (present) {
        user.holdings[index].amount += amount
    } else {
        user.holdings.push({
            tokenID: tokenID,
            amount: amount
        })
    }

    return user
}



/*
 * Endpoint:
 * 
 * [GET]
 * v1/database/user/get-transaction
 * 
 * Inputs:
 * 
 *  - transactionID: The unique ID of the transaction that should be returned
 * 
 * Description: 
 * 
 * This function retrieves a transaction document from the database.
 * 
 * Returns: 
 * 
 * A transaction document.
*/
async function getTransaction(transactionID) {
    return await Transaction.findOne({ transactionID: transactionID })
}

/*
 * Endpoint:
 * 
 * [GET]
 * v1/database/user/get-holdings
 * 
 * Inputs:
 * 
 *  - id: The unique ID of the user/vendor whose holdings are of interest
 * 
 * Description: 
 * 
 * This function retrieves the holdings of a user/vendor
 * 
 * Returns: 
 * 
 * An object containing the userID/vendorID and the holdings object of a user/vendor
*/
async function getHoldings(id) {
    const isUser = id.charAt(0) == "U"

    return isUser ? 
        await User.findOne({ userID : id }, 'userID holdings') : 
        await Vendor.findOne({ vendorID: id }, 'vendorID holdings')
}

module.exports = {
    createTransaction,
    updateUserHoldings,
    updateVendorHoldings,
    getTransaction,
    getHoldings
}