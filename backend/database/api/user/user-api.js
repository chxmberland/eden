const modelLocation = '../../models'
const User = require(`${modelLocation}/user-model.js`)
const Vendor = require(`${modelLocation}/vendor-model.js`)

/* 
 * [POST]
 * v1/database/user/create-user
 * Creating a user in the database.    
*/
function createUser(walletAddress, username, hash) {

    // Initializing a new user document
    const newUser = new User({
        walletAddress: walletAddress,
        username: username,
        userID: "",
        hash: hash,
        transactionHistory: [],
        holdings: []
    })

    // Saving the user document
    newUser
        .save()
        // Getting the saved document to use it's ID
        .then(savedDoc => {
            addUniuqeUserID(savedDoc)
        })
        .catch(err => {
            console.log(`There was an issue saving User ${username}.\n\n${err}`)
        })
}

// Adds a unique ID to a user that has just been saved to the database
function addUniuqeUserID(savedDoc) {
    let uniqueID = "U-" + savedDoc._id

    // Adding the unique user ID
    User.updateOne({ _id: savedDoc._id }, { userID: uniqueID }, function(err, res) {
        if (err) {
            console.log(`There was an issue adding the unique UserID.\n\n${err}`)
        } else {
            console.log(`User saved with unique ID ${uniqueID} sucsessfully.`)
        }
    })
}


/*
 * [POST]
 * v1/database/user/create-vendor
 * Creating a vendor in the database.
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

    newVendor
        .save()
        // Getting the saved document to use it's ID
        .then(savedDoc => {
            addUniuqeVendorID(savedDoc)
        })
        .catch(err => {
            console.log(`There was an issue saving Vendor ${username}.\n\n${err}`)
        })
}

function addUniuqeVendorID(savedDoc) {
    let uniqueID = "V-" + savedDoc._id

    // Adding the unique user ID
    User.updateOne({ _id: savedDoc._id }, { vendorID: uniqueID }, function(err, res) {
        if (err) {
            console.log(`There was an issue adding the unique VendorID.\n\n${err}`)
        } else {
            console.log(`Vendor saved with unique ID ${uniqueID} sucsessfully.`)
        }
    })
}


/*
 * [POST]
 * v1/database/user/add-vendor-location
 * Adding an additional location document.
*/
function createLocation(vendorID, country, city, street, streetNumber, postalCode) {

}


/*
 * [POST]
 * v1/database/user/add-holdings
 * Adding holdings to a user document.
*/
function addHoldings(userID, tokenID, amount) {

}


/*
 * [GET]
 * v1/database/get-user
 * Gets a user document.
*/
function getUser(userID) {

}


/*
 * [PATCH]
 * v1/database/user/update-username
 * Updates the username of a user.
*/
function updateUsername(userID, newUsername) {

}


/*
 * [PATCH]
 * v1/database/user/update-wallet-address
 * Updates the wallet of a user.
*/
function updateWalletAddress(userID, newWallet) {
    
}


/*
 * [PATCH]
 * v1/database/user/update-vendor-location
 * Updates a vendor location.
*/
function updateVendorLocation(locationID, country, city, street, streetNumber, postalCode) {
    
}


/*
 * [PATCH]
 * v1/database/user/update-holdings
 * Updates the holdings of a user.
*/
function updateHoldings(userID, tokenID, amount) {
    
}


/*
 * [DELETE] 
 * v1/database/user/delete-user
 * Deletes a user document, and all of it's associated documents.
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