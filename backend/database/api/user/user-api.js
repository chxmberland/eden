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
        await addLocationToVendor(vendorID, uniqueLocation.locationID)
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
async function addHolding(id, tokenID, amount, type) {
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
    return await User.findOne({ userID: userID })
}

/*
 * [GET]
 * v1/database/get-vendor
 * Gets a user document.
*/
async function getVendor(vendorID) {
    return await Vendor.findOne({ vendorID: vendorID })
}


/*
 * [PATCH]
 * v1/database/user/update-username
 * Updates the username of a user.
*/
async function updateUsername(id, newUsername, type) {
    // Ensuring the username is unique
    const matchingUsers = (type == "U" ? await User.find({ username: newUsername }) : await Vendor.find({ username: newUsername }))
    if (matchingUsers.length != 0) {
        return null
    } 

    // Updating the username
    const options = {
        new: true,
        upsert: false
    }
    const update = {
        username: newUsername
    }
    if (type == "U") {
        return await User.findOneAndUpdate( { userID: id }, update, options )
    } else if (type == "V") {
        return await Vendor.findOneAndUpdate( { vendorID: id }, update, options )
    }
}


/*
 * [PATCH]
 * v1/database/user/update-wallet-address
 * Updates the wallet of a user.
*/
async function updateWalletAddress(id, newWallet, type) {
    const options = {
        new: true,
        upsert: false
    }
    const update = {
        walletAddress: newWallet
    }

    if (type == "U") {
        return await User.findOneAndUpdate( { userID: id }, update, options )
    } else if (type == "V") {
        return await Vendor.findOneAndUpdate( { vendorID: id }, update, options )
    }
}


/*
 * [PATCH]
 * v1/database/user/update-vendor-location
 * Updates a vendor location.
*/
async function updateLocation(locationID, country, city, street, streetNumber, postalCode) {
    const options = {
        new: true,
        upsert: false
    }
    const filter = {
        locationID: locationID
    }
    const update = {
        country: country,
        city: city,
        street: street,
        streetNumber: streetNumber,
        postalCode: postalCode
    }

    // Updating the location document
    return await Location.findOneAndUpdate(filter, update, options)
}


/*
 * [PATCH]
 * v1/database/user/update-holdings
 * Updates the holdings of a user.
*/
async function updateHolding(id, tokenID, amount, type) {
    const options = {
        new: true,
        upsert: false
    }

    // Updating a users holdings
    if (type == "U") {
        // Finding the user to get their current holdings
        const user = await User.findOne({ userID: id })

        // Updating the holdings
        return await User.findOneAndUpdate( 
            { userID: id }, 
            { holdings: insertnewAmountIntoHoldings(user.holdings, tokenID, amount) }, 
            options
        )
    } else if (type == "V") {
        const vendor = await Vendor.findOne({ vendorID: id })
        return await Vendor.findOneAndUpdate( 
            { vendorID: id }, 
            { holdings: insertnewAmountIntoHoldings(vendor.holdings, tokenID, amount) }, 
            options
        )
    }
}

function insertnewAmountIntoHoldings(holdings, tokenID, amount) {
    for (let i = 0; i < holdings.length; i++) {
        if (holdings[i].tokenID == tokenID) {
            holdings[i].amount = amount
            break
        }
    }
    return holdings
}


/*
 * [DELETE] 
 * v1/database/user/delete-user
 * Deletes a user document, and all of it's associated documents.
*/
async function deleteUser(userID) {
    // Finding the document that is going to be deleted
    return await User.deleteOne({ userID: userID })
}

/*
 * [DELETE] 
 * v1/database/user/delete-vendor
 * Deletes a vendor document, and all of it's associated documents.
*/
async function deleteVendor(vendorID) {
    // Getting the vendor and the related location IDs
    const vendor = await Vendor.findOne({ vendorID: vendorID })
    const vendorLocations = vendor.locations

    const options = {
        new: true,
        upsert: false
    }

    // Removing the vendor ID from each location\
    for (let i = 0; i < vendorLocations.length; i++) {
        let location = await Location.findOne({ locationID: vendorLocations[i] })
        const filteredVendors = location.vendorIDs.filter(vendorID => vendorID != vendor.vendorID)
        location.vendorIDs = filteredVendors
        await Location.findOneAndUpdate({ locationID: location.locationID }, { vendorIDs: filteredVendors }, options)
    }

    // Deleting the vendor
    return await Vendor.deleteOne({ vendorID: vendorID })
}

module.exports = {
    createUser,
    createVendor,
    createLocation,
    addHolding,
    getUser,
    getVendor,
    updateUsername,
    updateWalletAddress,
    updateLocation,
    updateHolding,
    deleteUser,
    deleteVendor,
}