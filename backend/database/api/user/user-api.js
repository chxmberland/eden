const modelLocation = '../../models'
const User = require(`${modelLocation}/user-model.js`)
const Vendor = require(`${modelLocation}/vendor-model.js`)

/* 
    Creating a user in the database.    

    POST v1/database/user/create-user

    This endpoint communicates with the database to create and store a user document.
*/
function createUser(walletAddress, username, hash) {

    // TODO: Create unique user ID

    const newUser = new User({
        walletAddress: walletAddress,
        username: username,
        userID: "test-user-id",
        hash: hash,
        transactionHistory: [],
        holdings: []
    })

    newUser.save(function(err) {
        if (err) {
            console.log(`There was an issue saving the user ${username}\n\n${err}`)
        } else {
            console.log(`Sucsessfuly saved ${username} (user) to Atlas.`)
        }
    })
}


/*
    Creating a vendor in the database.    

    POST v1/database/user/create-vendor

    This endpoint communicates with the database to create and store a vendor document. 
*/
function createVendor(walletAddress, username, hash) {

    // TODO: Create unique vendor ID

    const newVendor = new Vendor({
        walletAddresss: walletAddress,
        username: username,
        vendorID: "test-vednor-id",
        hash: hash,
        locations: [],
        transactionHistory: [],
        listings: [],
        holdings: []
    })

    newVendor.save(function(err) {
        if (err) {
            console.log(`There was an issue saving the vendor ${username}\n\n${err}`)
        } else {
            console.log(`Sucsessfuly saved ${username} (vendor) to Atlas.`)
        }
    })
}


/*
    Adding an additional location document.

    POST v1/database/user/add-vendor-location

    This endpoint communicates with the database to create and store a location document.
*/
function createLocation(vendorID, country, city, street, streetNumber, postalCode) {

}


/*
    Adding holdings to a user document.

    POST v1/database/user/add-holdings

    This endpoint communicates with the database to add holdings to a user or a 
    vendor document.
*/
function addHoldings(userID, tokenID, amount) {

}


/*
    Gets a user document.

    GET v1/database/get-user

    This endpoint will return a user document to the caller.
*/
function getUser(userID) {

}


/*
    Updates the username of a user.

    PATCH v1/database/user/update-username

    This endpoint communicates with the database to update the username of a user.
*/
function updateUsername(userID, newUsername) {

}


/*
    Updates the wallet of a user.

    PATCH v1/database/user/update-wallet-address

    This endpoint communicates with the database to update the wallet address of the user.
*/
function updateWalletAddress(userID, newWallet) {
    
}


/*
    Updates a vendor location.

    PATCH v1/database/user/update-vendor-location

    This endpoint communicates with the database to update a vendor location.
*/
function updateVendorLocation(locationID, country, city, street, streetNumber, postalCode) {
    
}


/*
    Updates the holdings of a user.

    PATCH v1/database/user/update-holdings

    This endpoint communicates with the database to update the holdings of the user.
*/
function updateHoldings(userID, tokenID, amount) {
    
}


/*
    Deletes a user document, and all of it's associated documents.

    DELETE v1/database/user/delete-user

    This endpoint deletes a user document.
*/
function deleteUser(userID) {

}

module.exports = {
    createUser,
    createVendor,
    createLocation,
    addHoldings,
    getUser,
    updateUsername,
    updateWalletAddress,
    updateVendorLocation,
    updateHoldings,
    deleteUser
}