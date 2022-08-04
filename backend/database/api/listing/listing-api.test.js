// Importing 3rd party software
const mongoose = require('mongoose')

// Importing APIs
const databaseApi = require('../database-api.js')
const userApi = require('../user/user-api.js')
const tokenApi = require('../token/token-api.js')
const listingApi = require('./listing-api.js')

// Creating mock models
const mockUser = {
    walletAddress: "0x8c7c0a40E6362f8833BceDCb4865aBAb6A758b10",
    username: "Ben",
    hash: "c88a33b9469ecf552b4659f193d27078b35da960",
}
const mockVendor = {
    walletAddress: "0x417bC424226215754fDb21968EA1789BD4F3905A",
    username: "Index Exchange",
    hash: "c8b02b7417a800616799a8ba0b9eb65cd8ebeac8",
}
const mockToken = {
    contractAddress: "test-contract-address",
    tokenName: "Bitcoin",
    tokenSupply: 10000,
    pricePerTokenInUSD: 100,
    abi: "test-abi"
}
const mockTokenListing = {
    numberOfTokensListed: 100,
    numberOfTokensSold: 30
}
const mockAssetListing = {
    info: {
        assetName: "Air Jordan 1s",
        description: "Cool shoes"
    },
    numberOfTokensListed: 400,
    numberOfTokensSold: 120,
    assetPrice: 1000
}

// Connect and disconnect functions
async function connect() {
    await databaseApi.connectToDatabase(databaseApi.connectionUri, databaseApi.connectionParams)
}
async function disconnect() {
    await mongoose.connection.close()
}

test('Ensuring createAssetListing() properly creates an asset listing, and getAssetListing() properly gets an asset listing.', async () => {
    // Connect must be present in the first test
    connect()
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    
    // Creating mock data models
    const testTokenDocument = await tokenApi.createTokenInDB(
        mockToken.contractAddress, 
        mockToken.tokenName, 
        mockToken.tokenSupply, 
        mockToken.pricePerTokenInUSD, 
        mockToken.abi
    )
    const testVendorDocument = await userApi.createVendor(mockVendor.walletAddress, mockVendor.username, mockVendor.hash)
    
    // Creating the asset listing
    let testAssetListingDocument = await listingApi.createAssetListing(
        testTokenDocument.tokenID, 
        testVendorDocument.vendorID, 
        mockAssetListing.info.assetName,
        mockAssetListing.info.description,
        mockAssetListing.numberOfTokensListed,
        mockAssetListing.assetPrice
    )

    // Getting the asset listing from the database
    testAssetListingDocument = await listingApi.getAssetListing(testAssetListingDocument.assetListingID)

    expect(testAssetListingDocument.assetListingID).toBe(`AL-${testAssetListingDocument._id}`)
    expect(testAssetListingDocument.tokenID).toBe(testTokenDocument.tokenID)
    expect(testAssetListingDocument.vendorID).toBe(testVendorDocument.vendorID)
    expect(testAssetListingDocument.info.assetName).toBe(mockAssetListing.info.assetName)
    expect(testAssetListingDocument.info.description).toBe(mockAssetListing.info.description)
    expect(testAssetListingDocument.relatedTokenListings.length).toBe(0)
    expect(testAssetListingDocument.numberOfTokensListed).toBe(mockAssetListing.numberOfTokensListed)
    expect(testAssetListingDocument.numberOfTokensSold).toBe(0)
    expect(testAssetListingDocument.assetPrice).toBe(mockAssetListing.assetPrice)
})

test('Ensuring createTokenListing() properly creates a token listing and getTokenListing() properly gets a token listing.', async () => {
    // Flushing the database
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)

    // Creating a mock models in the database
    const testTokenDocument = await tokenApi.createTokenInDB(
        mockToken.contractAddress, 
        mockToken.tokenName, 
        mockToken.tokenSupply, 
        mockToken.pricePerTokenInUSD, 
        mockToken.abi
    )
    const testUserDocument = await userApi.createUser(mockUser.walletAddress, mockUser.username, mockUser.hash)
    const testVendorDocument = await userApi.createVendor(mockVendor.walletAddress, mockVendor.username, mockVendor.hash)
    const testAssetListingDocument = await listingApi.createAssetListing(
        testTokenDocument.tokenID, 
        testVendorDocument.vendorID, 
        mockAssetListing.info.assetName,
        mockAssetListing.info.description,
        mockAssetListing.numberOfTokensListed,
        mockAssetListing.assetPrice
    )

    // Creating the token listing
    let testTokenListingDocument = await listingApi.createTokenListing(
        testAssetListingDocument.assetListingID,
        testTokenDocument.tokenID,
        testUserDocument.userID,
        mockTokenListing.numberOfTokensListed
    )

    // Getting the token listing
    testTokenListingDocument = await listingApi.getTokenListing(testTokenListingDocument.tokenListingID)

    // Asserting the token was created correctly
    expect(testTokenListingDocument.tokenListingID).toBe(`TKL-${testTokenListingDocument._id}`)
    expect(testTokenListingDocument.tokenID).toBe(testTokenDocument.tokenID)
    expect(testTokenListingDocument.sourceAssetListingID).toBe(testAssetListingDocument.assetListingID)
    expect(testTokenListingDocument.listeeID).toBe(testUserDocument.userID)
    expect(testTokenListingDocument.numberOfTokensListed).toBe(mockTokenListing.numberOfTokensListed)
    expect(testTokenListingDocument.numberOfTokensSold).toBe(0)

    // Ensuring the token listing was added to the asset listings related token listing field
    const updatedAssetListing = await listingApi.getAssetListing(testAssetListingDocument.assetListingID)
    expect(updatedAssetListing.relatedTokenListings.length).toBe(1)
    expect(updatedAssetListing.relatedTokenListings[0]).toBe(testTokenListingDocument.tokenListingID)
})

test('Ensuring updateAssetPrice() and updateAssetDescription() properly update an asset.', async () => {
    // Flushing the database
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    
    // Creating mock data models
    const testTokenDocument = await tokenApi.createTokenInDB(
        mockToken.contractAddress, 
        mockToken.tokenName, 
        mockToken.tokenSupply, 
        mockToken.pricePerTokenInUSD, 
        mockToken.abi
    )
    const testVendorDocument = await userApi.createVendor(mockVendor.walletAddress, mockVendor.username, mockVendor.hash)
    
    // Creating the asset listing
    const testAssetListingDocument = await listingApi.createAssetListing(
        testTokenDocument.tokenID, 
        testVendorDocument.vendorID, 
        mockAssetListing.info.assetName,
        mockAssetListing.info.description,
        mockAssetListing.numberOfTokensListed,
        mockAssetListing.assetPrice
    )

    // Updating the price of the asset listing
    const newPrice = 4000
    let updatedAssetListingDocument = await listingApi.updateAssetPrice(testAssetListingDocument.assetListingID, newPrice)

    expect(updatedAssetListingDocument.assetPrice).toBe(newPrice)

    // Updating the description of the asset
    const newName = "Golf club"
    const newDescription = "Great for hitting balls"
    updatedAssetListingDocument = await listingApi.updateAssetDescription(testAssetListingDocument.assetListingID, newName, newDescription)

    expect(updatedAssetListingDocument.info.assetName).toBe(newName)
    expect(updatedAssetListingDocument.info.description).toBe(newDescription)
})

test('Ensuring that deleteTokenListing() and deleteAssetListing() properly deletes the listing documents.', async () => {
    // Flushing the database
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)

    // Creating a mock models in the database
    const testTokenDocument = await tokenApi.createTokenInDB(
        mockToken.contractAddress, 
        mockToken.tokenName, 
        mockToken.tokenSupply, 
        mockToken.pricePerTokenInUSD, 
        mockToken.abi
    )
    const testUserDocument = await userApi.createUser(mockUser.walletAddress, mockUser.username, mockUser.hash)
    const testVendorDocument = await userApi.createVendor(mockVendor.walletAddress, mockVendor.username, mockVendor.hash)
    const testAssetListingDocument = await listingApi.createAssetListing(
        testTokenDocument.tokenID, 
        testVendorDocument.vendorID, 
        mockAssetListing.info.assetName,
        mockAssetListing.info.description,
        mockAssetListing.numberOfTokensListed,
        mockAssetListing.assetPrice
    )
    const testTokenListingDocument = await listingApi.createTokenListing(
        testAssetListingDocument.assetListingID,
        testTokenDocument.tokenID,
        testUserDocument.userID,
        mockTokenListing.numberOfTokensListed
    )

    // Deleting the token listing
    const tokenDelResponse = await listingApi.deleteTokenListing(testTokenListingDocument.tokenListingID)

    // Ensuring the related asset has the token listing removed from it's related token listings field
    const updatedAssetListing = await listingApi.getAssetListing(testAssetListingDocument.assetListingID)

    expect(updatedAssetListing.relatedTokenListings.length).toBe(0)

    // Deleting the asset listing
    const assetDelResponse = await listingApi.deleteAssetListing(testAssetListingDocument.assetListingID)

    expect(assetDelResponse).toBe(true)
    expect(tokenDelResponse).toBe(true)

    // Disconnect must be present in the last test
    disconnect()
})