require('dotenv').config()

const modelLocation = '../../models'
const User = require(`${modelLocation}/user-model.js`)
const Vendor = require(`${modelLocation}/vendor-model.js`)
const Location = require(`${modelLocation}/location-model.js`)

/* 
 * [POST]
 * v1/database/user/create-user
 * Creating a user in the database.    
*/
async function createUser(walletAddress, username, hash) {
    const matchingUsers = await User.find({ username: username })

    // Ensuring that no other user exists with the same username
    if (matchingUsers.length != 0) {
        return null
    } else {
        // Initializing a new user document
        const newUser = new User({
            walletAddress: walletAddress,
            username: username,
            userID: "",
            hash: hash,
            transactionHistory: [],
            holdings: []
        })

        //Saving the user document without it's unique user ID
        const savedUser = await newUser.save()

        //Adding a unique user id based on Mongo's _id and returning it
        const uniqueUser = await addUniqueUserID(savedUser)
        //console.log(`Sucsessfully saved unique user with userID ${uniqueUser.userID}.`)
        return uniqueUser
    }
}

// Adds a unique ID to a user that has just been saved to the database
async function addUniqueUserID(savedDoc) {
    let uniqueID = "U-" + savedDoc._id

    const filter = { _id: savedDoc._id }
    const update = { userID: uniqueID }
    const options = {
        new: true,
        upsert: false
    }
    
    // Updating the unique ID and returning the user object
    return await User.findOneAndUpdate(filter, update, options)
}


/*
 * [POST]
 * v1/database/user/create-vendor
 * Creating a vendor in the database.
*/
async function createVendor(walletAddress, username, hash) {
    const matchingVendors = await Vendor.find({ username: username })

    // Ensuring that no other vendor already exists with the same username
    if (matchingVendors.length != 0) {
        return null
    } else {
        // Initializing a new user document
        const newVendor = new Vendor({
            walletAddress: walletAddress,
            username: username,
            vendorID: "",
            hash: hash,
            locations: [],
            transactionHistory: [],
            listings: [],
            holdings: []
        })

        //Saving the user document
        const savedVendor = await newVendor.save()

        //Adding a unique user id based on Mongo's _id 
        const uniqueVendor = await addUniqueVendorID(savedVendor)
        return uniqueVendor
    }
}

async function addUniqueVendorID(savedDoc) {
    let uniqueID = "V-" + savedDoc._id

    const filter = { _id: savedDoc._id }
    const update = { vendorID: uniqueID }
    const options = {
        new: true,
        upsert: false
    }
    
    // Updating the unique ID and returning the user object
    return await Vendor.findOneAndUpdate(filter, update, options)
}


/*
 * [POST]
 * v1/database/user/add-vendor-location
 * Adding an additional location document.
*/
async function createLocation(vendorIDs, country, city, street, streetNumber, postalCode) {
    // Initializing a new user document
    const newLocation = new Location({
        locationID: "",
        vendorIDs: vendorIDs, // Adding the relevant vendor IDs to the location
        country: country,
        city: city,
        street: street,
        streetNumber: streetNumber,
        postalCode: postalCode
    })

    //Saving the user document
    const savedLocation = await newLocation.save()

    // Creating and getting the unique location ID
    const uniqueLocation = await addUniqueLocationID(savedLocation)

    // Linking the location to each vendor by adding the location ID to the vendor's locations field
    for (vendorID of vendorIDs) {
        addLocationToVendor(vendorID, uniqueLocation.locationID)
    }

    //Returning the location document that was just saved
    return uniqueLocation
}

async function addUniqueLocationID(savedDoc) {
    let uniqueID = "L-" + savedDoc._id

    const filter = { _id: savedDoc._id }
    const update = { locationID: uniqueID }
    const options = {
        new: true,
        upsert: false
    }
    
    // Updating the unique ID and returning the location object
    return await Location.findOneAndUpdate(filter, update, options)
}

async function addLocationToVendor(vendorID, locationID) {
    const filter = { vendorID: vendorID }
    const update = { $addToSet: { locations: locationID }}
    const options = {
        new: false,     // Preventing Mongoose from returning the modified document to save bandwidth
        upsert: false
    }

    await Vendor.findOneAndUpdate(filter, update, options)
}


/*
 * [POST]
 * v1/database/user/add-holdings
 * Adding holdings to a user document.
*/
async function addHoldings(id, tokenID, amount, type) {
    // Create a new holdings document (it is not a data model)
    const newHoldings = {
        tokenID: tokenID,
        amount: amount
    }

    const update = { $addToSet : { holdings: newHoldings } }
    const options = {
        new: true,
        upsert: false
    }

    if (type == "U") {
        const filter = { userID: id }
        return await User.findOneAndUpdate(filter, update, options)
    } else if (type == "V") {
        const filter = { vendorID: id }
        return await Vendor.findOneAndUpdate(filter, update, options)
    }
}


/*
 * [GET]
 * v1/database/get-user
 * Gets a user document.
*/
async function getUser(userID) {

}


/*
 * [PATCH]
 * v1/database/user/update-username
 * Updates the username of a user.
*/
async function updateUsername(userID, newUsername) {

}


/*
 * [PATCH]
 * v1/database/user/update-wallet-address
 * Updates the wallet of a user.
*/
async function updateWalletAddress(userID, newWallet) {
    
}


/*
 * [PATCH]
 * v1/database/user/update-vendor-location
 * Updates a vendor location.
*/
async function updateVendorLocation(locationID, country, city, street, streetNumber, postalCode) {
    
}


/*
 * [PATCH]
 * v1/database/user/update-holdings
 * Updates the holdings of a user.
*/
async function updateHoldings(userID, tokenID, amount) {
    
}


/*
 * [DELETE] 
 * v1/database/user/delete-user
 * Deletes a user document, and all of it's associated documents.
*/
async function deleteUser(userID) {

}

async function flushDatabase(pass) {
    if (pass == process.env.FLUSH_PASS) {
        User.deleteMany({}, function(err, res) {})
        Vendor.deleteMany({}, function(err, res) {})
        Location.deleteMany({}, function(err, res) {})
    }
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
    deleteUser,
    flushDatabase
}