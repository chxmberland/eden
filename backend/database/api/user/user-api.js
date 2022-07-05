const modelLocation = '../../models'
const User = require(`${modelLocation}/user-model.js`)
const Vendor = require(`${modelLocation}/vendor-model.js`)
const Location = require(`${modelLocation}/location-model.js`)

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

    // Checking to see if the username exists
    User.find({ username: username }, function(err, res) {
        if (res.length > 0) {
            console.log(`There exists a user with the username ${username} already, so the user was not created.`)
        } else {
            // Saving the user document
            newUser
                .save()
                // Getting the saved document to use it's ID
                // The .save() function can only handle errors with a callback if you use .then()
                .then(savedDoc => {
                    addUniqueUserID(savedDoc)
                })
                .catch(err => {
                    console.log(`There was an issue saving User ${username}.\n\n${err}`)
                })
        }
    })
}

// Adds a unique ID to a user that has just been saved to the database
function addUniqueUserID(savedDoc) {
    let uniqueID = "U-" + savedDoc._id

    // Adding the unique user ID
    User.updateOne({ _id: savedDoc._id }, { userID: uniqueID }, function(err, res) {
        if (err || res.matchedCount == 0) {
            console.log(`There was an issue adding the unique UserID.\n`)
            err && console.log(err) // If the error exists, print it
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
    const newVendor = new Vendor({
        walletAddresss: walletAddress,
        username: username,
        vendorID: "",
        hash: hash,
        locations: [],
        transactionHistory: [],
        listings: [],
        holdings: []
    })

    Vendor.find({ username: username }, function(err, res) {
        if (res.length > 0) {
            console.log(`There exists a vendor with the username ${username} already, so the user was not created.`)
        } else {
            newVendor
                .save()
                // Getting the saved document to use it's ID
                // The .save() function can only handle errors with a callback if you use .then() and .catch()
                .then(savedDoc => {
                    addUniqueVendorID(savedDoc)
                })
                .catch(err => {
                    console.log(`There was an issue saving Vendor ${username}.\n\n${err}`)
                })
        }
    })
}

function addUniqueVendorID(savedDoc) {
    let uniqueID = "V-" + savedDoc._id

    // Adding the unique user ID
    Vendor.updateOne({ _id: savedDoc._id }, { vendorID: uniqueID }, function(err, res) {
        if (err || res.matchedCount == 0) {
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
function createLocation(vendorIDs, country, city, street, streetNumber, postalCode) {
    const newLocation = new Location({
        locationID: "",
        vendorIDs: vendorIDs, // Adding the relevant vendor IDs to the location
        country: country,
        city: city,
        street: street,
        streetNumber: streetNumber,
        postalCode: postalCode
    })

    // Saving the location to the database (seperate to the Vendor)
    newLocation
        .save()
        .then(savedDoc => {
            const uniqueID = createUniqueLocationID(savedDoc) // Creating the unique location ID
            // Linking the location to each vendor by adding the location ID to the vendor's locations field
            for (vendorID of vendorIDs) {
                addLocationToVendor(vendorID, uniqueID)
            }
        })
        .catch(err => {
            console.log(`There was an issue saving Location at ${country}, ${city}.\n\n${err}`)
        })
}

function createUniqueLocationID(savedDoc) {
    let uniqueID = "L-" + savedDoc._id

    // Adding the unique location ID
    Location.updateOne({ _id: savedDoc._id }, { locationID: uniqueID }, function(err, res) {
        if (err || !res.length) {
            console.log(`There was an issue adding the unique LocationID.\n\n${err}`)
        } else {
            console.log(`Location saved with unique ID ${uniqueID} sucsessfully.`)
        }
    })
    return uniqueID
}

function addLocationToVendor(vendorID, locationID) {
    // Adding the locationID to the Vendor ($addToSet allows you to append to a list)
    Vendor.updateOne({ vendorID: vendorID }, { $addToSet: { locations: locationID } }, function(err, res) {
        if (err) {
            console.log(`There was an issue linking the existing Location ${locationID} to the Vendor ${vendorID}.\n\n${err}`)
        } else {
            console.log(`Sucsessfully linked location ${locationID} to vendor ${vendorID}.`)
        }
    })
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