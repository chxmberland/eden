// Importing 3rd party software
const mongoose = require("mongoose")

// Importing models
const Vendor = require("../../models/vendor-model.js")
const Location = require("../../models/location-model.js")

// Importing apis
const userApi = require("./user-api.js")
const databaseApi = require("../database-api.js")

// Creating mock objects
const mockUserA = {
    walletAddress: "0x8c7c0a40E6362f8833BceDCb4865aBAb6A758b10",
    username: "Ben",
    hash: "c88a33b9469ecf552b4659f193d27078b35da960",
}
const mockUserB = {
    walletAddress: "0xf527758d760F0DC53603168F2C961BaE98e889ed",
    username: "John",
    hash: "780baff7f64fa1a1cccd1a8878085eceb7c50fb2",
}
const mockVendorA = {
    walletAddress: "0x417bC424226215754fDb21968EA1789BD4F3905A",
    username: "Index Exchange",
    hash: "c8b02b7417a800616799a8ba0b9eb65cd8ebeac8",
}
const mockVendorB = {
    walletAddress: "0x3BD3682DBf6da33f59eCCcC889CC95196Bc52991",
    username: "Google",
    hash: "da8d4e7635f4f2901a99b82d6cdae6a240258432",
}
const mockLocation = {
    country: "Canada",
    city: "Montreal",
    street: "Jeanne Mance",
    streetNumber: "3550",
    postalCode: "H2X 3P7"
}

async function connect() {
    await databaseApi.connectToDatabase(databaseApi.connectionUri, databaseApi.connectionParams)
}

async function disconnect() {
    await mongoose.connection.close()
}

test('Ensuring createUser() properly creates a user in the database.', async () => {
    // Connect muct be present in the first test
    connect()

    // Creating the user
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testUserDocument = await userApi.createUser(mockUserA.walletAddress, mockUserA.username, mockUserA.hash)

    // Asserting that it was created correctly
    expect(testUserDocument.walletAddress).toBe(mockUserA.walletAddress)
    expect(testUserDocument.username).toBe(mockUserA.username)
    expect(testUserDocument.hash).toBe(mockUserA.hash)
    expect(testUserDocument.userID).toBe(`U-${testUserDocument._id}`)
    expect(testUserDocument.transactionHistory.length).toBe(0)
    expect(testUserDocument.holdings.length).toBe(0)
})

test('Ensuring createUser() only allows for unique usernames', async () => {
    // Creating the user
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    await userApi.createUser(mockUserA.walletAddress, mockUserA.username, mockUserA.hash)

    // Trying to create the same user again
    const duplicateUser = await userApi.createUser(mockUserB.walletAddress, mockUserA.username, mockUserB.hash)

    // Asserting that the user was not created
    expect(duplicateUser).toBe(null)
})

test('Ensuring createVendor() properly creates a vendor in the database.', async () => {
    // Creating the vendor
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testVendorDocument = await userApi.createVendor(mockVendorA.walletAddress, mockVendorA.username, mockVendorA.hash)

    // Asserting that it was created correctly
    expect(testVendorDocument.walletAddress).toBe(mockVendorA.walletAddress)
    expect(testVendorDocument.username).toBe(mockVendorA.username)
    expect(testVendorDocument.hash).toBe(mockVendorA.hash)
    expect(testVendorDocument.vendorID).toBe(`V-${testVendorDocument._id}`)
    expect(testVendorDocument.transactionHistory.length).toBe(0)
    expect(testVendorDocument.holdings.length).toBe(0)
    expect(testVendorDocument.locations.length).toBe(0)
    expect(testVendorDocument.listings.length).toBe(0)
})

test('Ensuring createVendor() only allows for unique usernames', async () => {
    // Creating the vendor
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    await userApi.createVendor(mockVendorA.walletAddress, mockVendorA.username, mockVendorA.hash)

    // Trying to create the same vendor again
    const duplicateVendor = await userApi.createVendor(mockVendorB.walletAddress, mockVendorA.username, mockVendorB.hash)

    // Asserting that the user was not created
    expect(duplicateVendor).toBe(null)
})

test('Ensuring createLocation() properly creates a location document in the database.', async () => {
    // Creating the location
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testLocationDocument = await userApi.createLocation([], mockLocation.country, mockLocation.city, mockLocation.street, mockLocation.streetNumber, mockLocation.postalCode)

    // Asserting the location was created correctly
    expect(testLocationDocument.locationID).toBe(`L-${testLocationDocument._id}`)
    expect(testLocationDocument.country).toBe(mockLocation.country)
    expect(testLocationDocument.vendorIDs.length).toBe(0)
    expect(testLocationDocument.city).toBe(mockLocation.city)
    expect(testLocationDocument.street).toBe(mockLocation.street)
    expect(testLocationDocument.streetNumber).toBe(mockLocation.streetNumber)
    expect(testLocationDocument.postalCode).toBe(mockLocation.postalCode)
})

test('Ensuring createLocation() properly related vendors and locations', async () => {
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)

    // Creating the vendor
    const testVendorDocument = await userApi.createVendor(mockVendorA.walletAddress, mockVendorA.username, mockVendorA.hash)

    // Creating the location and adding the vendor to it
    const testLocationDocument = await userApi.createLocation([testVendorDocument.vendorID], mockLocation.country, mockLocation.city, mockLocation.street, mockLocation.streetNumber, mockLocation.postalCode)

    // Getting the vendor so it's location fields can be checked
    const testVendorWithLocation = await Vendor.findOne({ vendorID: testVendorDocument.vendorID })

    // Asserting the vendor was added to the location
    expect(testLocationDocument.vendorIDs.length).toBe(1)
    expect(testLocationDocument.vendorIDs[0]).toBe(testVendorDocument.vendorID)
    expect(testVendorWithLocation.locations.length).toBe(1)
    expect(testVendorWithLocation.locations[0]).toBe(testLocationDocument.locationID)
})

test('Ensuring getUser() properly retrieves a user from the database', async () => {
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)

    // Creating the user
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testUserDocument = await userApi.createUser(mockUserA.walletAddress, mockUserA.username, mockUserA.hash)

    // Getting the user
    const retrievedUserDocument = await userApi.getUser(testUserDocument.userID)

    // Asserting the user matches correctly
    expect(retrievedUserDocument.walletAddress).toBe(mockUserA.walletAddress)
    expect(retrievedUserDocument.username).toBe(mockUserA.username)
    expect(retrievedUserDocument.hash).toBe(mockUserA.hash)
    expect(retrievedUserDocument.userID).toBe(`U-${testUserDocument._id}`)
    expect(retrievedUserDocument.transactionHistory.length).toBe(0)
    expect(retrievedUserDocument.holdings.length).toBe(0)
})

test('Ensuring getVendor() properly retrieves a user from the database', async () => {
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)

    // Creating the user
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testVendorDocument = await userApi.createVendor(mockVendorA.walletAddress, mockVendorA.username, mockVendorA.hash)

    // Getting the user
    const retrievedVendorDocument = await userApi.getVendor(testVendorDocument.vendorID)

    // Asserting the user matches correctly
    expect(retrievedVendorDocument.walletAddress).toBe(mockVendorA.walletAddress)
    expect(retrievedVendorDocument.username).toBe(mockVendorA.username)
    expect(retrievedVendorDocument.hash).toBe(mockVendorA.hash)
    expect(retrievedVendorDocument.vendorID).toBe(`V-${testVendorDocument._id}`)
    expect(retrievedVendorDocument.transactionHistory.length).toBe(0)
    expect(retrievedVendorDocument.holdings.length).toBe(0)
    expect(retrievedVendorDocument.locations.length).toBe(0)
    expect(retrievedVendorDocument.listings.length).toBe(0)
})

test('Ensuring updateUsername() properly updates a user/vendor\'s username', async () => {
    // Creating the user and the vendor
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testUserDocumentA = await userApi.createUser(mockUserA.walletAddress, mockUserA.username, mockUserA.hash)
    const testUserDocumentB = await userApi.createUser(mockUserB.walletAddress, mockUserB.username, mockUserB.hash)
    const testVendorDocumentA = await userApi.createVendor(mockVendorA.walletAddress, mockVendorA.username, mockVendorA.hash)
    const testVendorDocumentB = await userApi.createVendor(mockVendorB.walletAddress, mockVendorB.username, mockVendorB.hash)


    // Updating the user's username
    const newUsername = "test-username"
    const newUserA = await userApi.updateUsername(testUserDocumentA.userID, newUsername)
    const newUserB = await userApi.updateUsername(testUserDocumentB.userID, newUsername)

    // Updating the vendor's username
    const newVendorA = await userApi.updateUsername(testVendorDocumentA.vendorID, newUsername)
    const newVendorB = await userApi.updateUsername(testVendorDocumentB.vendorID, newUsername)

    // Asserting the username was updated and no duplicates have been allowed
    expect(newUserA.username).toBe(newUsername)
    expect(newUserB).toBe(null)
    expect(newVendorA.username).toBe(newUsername)
    expect(newVendorB).toBe(null)
})

test('Ensuring updateWalletAddress() properly updates a douments wallet address.', async () => {
    // Creating the user and the vendor
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testUserDocumentA = await userApi.createUser(mockUserA.walletAddress, mockUserA.username, mockUserA.hash)
    const testVendorDocumentA = await userApi.createVendor(mockVendorA.walletAddress, mockVendorA.username, mockVendorA.hash)

    // Updating the user's username
    const newWalletAddress = "test-wallet-address"
    const newUserA = await userApi.updateWalletAddress(testUserDocumentA.userID, newWalletAddress)

    // Updating the vendor's username
    const newVendorA = await userApi.updateWalletAddress(testVendorDocumentA.vendorID, newWalletAddress)

    expect(newUserA.walletAddress).toBe(newWalletAddress)
    expect(newVendorA.walletAddress).toBe(newWalletAddress)
})

test('Ensuring updateLocation() correctly updates an existing location in the database.', async () => {
    // Creating the location
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testLocationDocument = await userApi.createLocation(
        [], 
        mockLocation.country, 
        mockLocation.city, 
        mockLocation.street,
        mockLocation.streetNumber, 
        mockLocation.postalCode
    )

    // Creating an updated location
    const newLocation = {
        country: "France",
        city: "Marsailles",
        street: "Rue De La Montagne",
        streetNumber: 405,
        postalCode: "C6Y9I0"
    }
    const updatedLocation = await userApi.updateLocation(
        testLocationDocument.locationID, 
        newLocation.country, 
        newLocation.city, 
        newLocation.street, 
        newLocation.streetNumber, 
        newLocation.postalCode
    )

    // Asserting that it was updated correctly
    expect(updatedLocation.locationID).toBe(testLocationDocument.locationID)
    expect(updatedLocation.country).toBe(newLocation.country)
    expect(updatedLocation.city).toBe(newLocation.city)
    expect(updatedLocation.street).toBe(newLocation.street)
    expect(updatedLocation.streetNumber).toBe(String(newLocation.streetNumber))
    expect(updatedLocation.postalCode).toBe(newLocation.postalCode)
})

test('Ensuring deleteUser() properly deletes a user.', async () => {
    // Creating the user and the vendor
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testUserDocument = await userApi.createUser(mockUserA.walletAddress, mockUserA.username, mockUserA.hash)

    // Deleting the user
    const deleteRes = await userApi.deleteUser(testUserDocument.userID)

    // Trying to find the user
    const deletedUser = await userApi.getUser(testUserDocument.userID)

    // Checking to make sure the user was deleted
    expect(deleteRes.acknowledged).toBe(true)
    expect(deleteRes.deletedCount).toBe(1)
    expect(deletedUser).toBe(null)
})

test('Ensuring deleteUser() properly deletes a user.', async () => {
    // Creating the user and the vendor
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testVendorDocument = await userApi.createVendor(mockUserA.walletAddress, mockUserA.username, mockUserA.hash)

    // Deleting the user
    const deleteRes = await userApi.deleteVendor(testVendorDocument.vendorID)

    // Trying to find the user
    const deletedVendor = await userApi.getVendor(testVendorDocument.vendorID)
    
    // The last test needs to disconnect from the database
    disconnect()

    // Checking to make sure the user was deleted
    expect(deleteRes.acknowledged).toBe(true)
    expect(deleteRes.deletedCount).toBe(1)
    expect(deletedVendor).toBe(null)
})