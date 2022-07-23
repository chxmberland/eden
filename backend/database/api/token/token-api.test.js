// Importing 3rd party software
const mongoose = require("mongoose")

// Importing models and apis
const tokenModel = require("../../models/token-model.js")
const tokenApi = require("./token-api.js")
const databaseApi = require("../database-api.js")

// Creating a mock token
const mockToken = {
    contractAddress: "test-contract-address",
    tokenName: "Bitcoin",
    tokenSupply: 10000,
    pricePerTokenInUSD: 100,
    abi: "test-abi"
}

async function connect() {
    await databaseApi.connectToDatabase(databaseApi.connectionUri, databaseApi.connectionParams)
}

async function closeConnection() {
    await mongoose.connection.close()
}

test('Ensuring createTokenInDB() properly creates a token document.', async () => {
    // Connect must be present in the first test
    connect() 

    // Setting up the test
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testTokenDocument = await tokenApi.createTokenInDB(mockToken.contractAddress, mockToken.tokenName, mockToken.tokenSupply, mockToken.pricePerTokenInUSD, mockToken.abi)

    // Asserting the reponse is correct
    expect(testTokenDocument.tokenID).toBe(`TK-${testTokenDocument._id}`)
    expect(testTokenDocument.contractAddress).toBe(mockToken.contractAddress)
    expect(testTokenDocument.tokenName).toBe(mockToken.tokenName)
    expect(testTokenDocument.tokenSupply).toBe(mockToken.tokenSupply)
    expect(testTokenDocument.pricePerTokenInUSD).toBe(mockToken.pricePerTokenInUSD)
    expect(testTokenDocument.abi).toBe(mockToken.abi)
})

test('Ensuring getTokenFromDB() properly gets a token document', async () => {
    // Setting up the test
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testTokenDocument = await tokenApi.createTokenInDB(mockToken.contractAddress, mockToken.tokenName, mockToken.tokenSupply, mockToken.pricePerTokenInUSD, mockToken.abi)
    const retreivedTokenDocument = await tokenApi.getTokenFromDB(testTokenDocument.tokenID)

    // Asserting the reponse is correct
    expect(retreivedTokenDocument.tokenID).toBe(`TK-${testTokenDocument._id}`)
    expect(retreivedTokenDocument.contractAddress).toBe(mockToken.contractAddress)
    expect(retreivedTokenDocument.tokenName).toBe(mockToken.tokenName)
    expect(retreivedTokenDocument.tokenSupply).toBe(mockToken.tokenSupply)
    expect(retreivedTokenDocument.pricePerTokenInUSD).toBe(mockToken.pricePerTokenInUSD)
    expect(retreivedTokenDocument.abi).toBe(mockToken.abi)
})

test('Ensuring updatePricePerTokenInDB() properly updates a token value', async () => {
    // Setting up test contexts
    const newPrice = 200

    // Setting up the test
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testTokenDocument = await tokenApi.createTokenInDB(mockToken.contractAddress, mockToken.tokenName, mockToken.tokenSupply, mockToken.pricePerTokenInUSD, mockToken.abi)
    await tokenApi.updatePricePerTokenInDB(testTokenDocument.tokenID, newPrice)
    const retreivedTokenDocument = await tokenApi.getTokenFromDB(testTokenDocument.tokenID)

    // Asserting the reponse is correct
    expect(retreivedTokenDocument.pricePerTokenInUSD).toBe(newPrice)
})

test('Ensuring deleteTokenFromDB() properly deletes an existing token', async () => {
    // Setting up the test
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const testTokenDocument = await tokenApi.createTokenInDB(mockToken.contractAddress, mockToken.tokenName, mockToken.tokenSupply, mockToken.pricePerTokenInUSD, mockToken.abi)
    const deleteRes = await tokenApi.deleteTokenFromDB(testTokenDocument.tokenID)
    
    // Asserting the reponse is correct
    expect(deleteRes.acknowledged).toBe(true)
    expect(deleteRes.deletedCount).toBe(1)
})

test('Ensuring deleteTokenFromDB() behaves properly when trying to delete a non-existing token', async () => {
    // Setting up the test
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)
    const deleteRes = await tokenApi.deleteTokenFromDB('fake-token-id')

    // Disconnect must be present in the last test
    closeConnection() 

    // Asserting the response is correct
    expect(deleteRes.acknowledged).toBe(true)
    expect(deleteRes.deletedCount).toBe(0)
})