// Importing 3rd party software
const mongoose = require("mongoose")

// Importing apis
const transactionApi = require('./transaction-api.js')
const tokenApi = require('../token/token-api.js')
const userApi = require("../user/user-api.js")
const databaseApi = require("../database-api.js")
const { update } = require("../../models/token-model.js")

// Creating mock objects
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
const mockTokenA = {
    contractAddress: "0x224D2F09e645E00E8042eDE55a547F6E7F6Ed1ef",
    tokenName: "Bitcoin",
    tokenSupply: 1000000,
    pricePerTokenInUSD: 59000,
    abi: "mock-bitcoin-abi"
}
const mockTokenB = {
    contractAddress: "0xF04b945fD72151105A0B94041366c859D208Bf79",
    tokenName: "Ethereum",
    tokenSupply: 6000000,
    pricePerTokenInUSD: 3980,
    abi: "mock-ethereum-abi"
}
const mockTransaction = {
    // Use tokenID from mockToken when it's created
    // Use buyerID from mockUser when it's created
    // Use vendorID from mockVendor when it's created
    tokensPurchased: 100,
    transactionValue: 23,
    currencyPayedWith: "ETH",
    amountPayed: 0.002
}

async function connect() {
    await databaseApi.connectToDatabase(databaseApi.connectionUri, databaseApi.connectionParams)
}

async function disconnect() {
    await mongoose.connection.close()
}

test('Ensuring updateUserHoldings() properly changes the holdings in a user document.', async () => {
    // Connect must be present in the first test
    connect()
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)

    // Creating the user
    const testUserDocument = await userApi.createUser(mockUser.walletAddress, mockUser.username, mockUser.hash)

    // Creating the token
    const testTokenDocumentA = await tokenApi.createTokenInDB(mockTokenA.contractAddress, mockTokenA.tokenName, mockTokenA.tokenSupply, mockTokenA.pricePerTokenInUSD, mockTokenA.abi)

    // Adding a token to the users holdings
    const initialAmountA = 100
    let updatedUser = await transactionApi.updateUserHoldings(testUserDocument.userID, testTokenDocumentA.tokenID, initialAmountA)

    // Asserting that the holding was added correctly
    expect(updatedUser.holdings.length).toBe(1)
    expect(updatedUser.holdings[0].tokenID).toBe(testTokenDocumentA.tokenID)
    expect(updatedUser.holdings[0].amount).toBe(initialAmountA)

    // Updating the holding of the first token
    const amountToAdd = 10
    updatedUser = await transactionApi.updateUserHoldings(testUserDocument.userID, testTokenDocumentA.tokenID, amountToAdd)

    // Asserting that it was adjusted correctly
    expect(updatedUser.holdings.length).toBe(1)
    expect(updatedUser.holdings[0].tokenID).toBe(testTokenDocumentA.tokenID)
    expect(updatedUser.holdings[0].amount).toBe(initialAmountA + amountToAdd)

    // Creating another token
    const testTokenDocumentB = await tokenApi.createTokenInDB(mockTokenB.contractAddress, mockTokenB.tokenName, mockTokenB.tokenSupply, mockTokenB.pricePerTokenInUSD, mockTokenB.abi)

    // Adding the new token to the user
    const initialAmountB = 200
    updatedUser = await transactionApi.updateUserHoldings(testUserDocument.userID, testTokenDocumentB.tokenID, initialAmountB) 

    // Asserting that it was added correctly
    expect(updatedUser.holdings.length).toBe(2)
    expect(updatedUser.holdings[1].tokenID).toBe(testTokenDocumentB.tokenID)
    expect(updatedUser.holdings[1].amount).toBe(initialAmountB)

    // Ensuring that the function rejects invalid values
    expect(await transactionApi.updateUserHoldings('bad-user-id', testTokenDocumentB.tokenID, initialAmountB)).toBe(null)
    expect(await transactionApi.updateUserHoldings(testUserDocument.userID, 'bad-token-id', initialAmountB)).toBe(null)
})

test('Ensuring updateVendorHoldings() properly changes the holdings in a user document.', async () => {
    // Connect must be present in the first test
    connect()
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)

    // Creating the vendor
    const testVendorDocument = await userApi.createVendor(mockVendor.walletAddress, mockVendor.username, mockVendor.hash)

    // Creating the token
    const testTokenDocumentA = await tokenApi.createTokenInDB(mockTokenA.contractAddress, mockTokenA.tokenName, mockTokenA.tokenSupply, mockTokenA.pricePerTokenInUSD, mockTokenA.abi)

    // Adding a NEW token to the users holdings
    const initialAmountA = 100
    let updatedVendor = await transactionApi.updateVendorHoldings(testVendorDocument.vendorID, testTokenDocumentA.tokenID, initialAmountA)

    // Asserting that the holding was added correctly
    expect(updatedVendor.holdings.length).toBe(1)
    expect(updatedVendor.holdings[0].tokenID).toBe(testTokenDocumentA.tokenID)
    expect(updatedVendor.holdings[0].amount).toBe(initialAmountA)

    // Updating the EXISTING holding of the first token
    const amountToAdd = 10
    updatedVendor = await transactionApi.updateVendorHoldings(testVendorDocument.vendorID, testTokenDocumentA.tokenID, amountToAdd)

    // Asserting that it was adjusted correctly
    expect(updatedVendor.holdings.length).toBe(1)
    expect(updatedVendor.holdings[0].tokenID).toBe(testTokenDocumentA.tokenID)
    expect(updatedVendor.holdings[0].amount).toBe(initialAmountA + amountToAdd)

    // Creating another token
    const testTokenDocumentB = await tokenApi.createTokenInDB(mockTokenB.contractAddress, mockTokenB.tokenName, mockTokenB.tokenSupply, mockTokenB.pricePerTokenInUSD, mockTokenB.abi)

    // Adding a SECOND token to the vendors holdings
    const initialAmountB = 200
    updatedVendor = await transactionApi.updateVendorHoldings(testVendorDocument.vendorID, testTokenDocumentB.tokenID, initialAmountB) 

    // Asserting that it was added correctly
    expect(updatedVendor.holdings.length).toBe(2)
    expect(updatedVendor.holdings[1].tokenID).toBe(testTokenDocumentB.tokenID)
    expect(updatedVendor.holdings[1].amount).toBe(initialAmountB)

    // Ensuring that the function rejects invalid values
    expect(await transactionApi.updateUserHoldings('bad-vendor-id', testTokenDocumentB.tokenID, initialAmountB)).toBe(null)
    expect(await transactionApi.updateUserHoldings(testVendorDocument.vendorID, 'bad-token-id', initialAmountB)).toBe(null)
})

test('Ensuring createTransaction() properly creates a transaction between a user and a vendor.', async () => {
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)

    // Creating the user
    const testUserDocument = await userApi.createUser(mockUser.walletAddress, mockUser.username, mockUser.hash)

    // Creating the vendor
    const testVendorDocument = await userApi.createVendor(mockVendor.walletAddress, mockVendor.username, mockVendor.hash)

    // Creating the token
    const testTokenDocument = await tokenApi.createTokenInDB(mockTokenA.contractAddress, mockTokenA.tokenName, mockTokenA.tokenSupply, mockTokenA.pricePerTokenInUSD, mockTokenA.abi)

    // Adding the necessary holdings to the user and vendor
    const initialUserHoldings = 10
    const initialVendorHoldings = 100
    await transactionApi.updateUserHoldings(testUserDocument.userID, testTokenDocument.tokenID, initialUserHoldings)
    await transactionApi.updateVendorHoldings(testVendorDocument.vendorID, testTokenDocument.tokenID, initialVendorHoldings)

    // Creating a transaction
    const testTransactionDocument = await transactionApi.createTransaction(
        testUserDocument.userID,
        testVendorDocument.vendorID,
        testTokenDocument.tokenID,
        mockTransaction.tokensPurchased,
        mockTransaction.transactionValue,
        mockTransaction.currencyPayedWith,
        mockTransaction.amountPayed
    )

    // Getting the updated user and vendor
    const updatedUser = await userApi.getUser(testUserDocument.userID)
    const updatedVendor = await userApi.getVendor(testVendorDocument.vendorID)

    // Ensuring the transaction was stored correctly
    expect(testTransactionDocument.buyerID).toBe(testUserDocument.userID)
    expect(testTransactionDocument.vendorID).toBe(testVendorDocument.vendorID)
    expect(testTransactionDocument.tokenID).toBe(testTokenDocument.tokenID)
    expect(testTransactionDocument.tokensPurchased).toBe(mockTransaction.tokensPurchased)
    expect(testTransactionDocument.currencyPayedWith).toBe(mockTransaction.currencyPayedWith)
    expect(testTransactionDocument.transactionValue).toBe(mockTransaction.transactionValue)
    expect(testTransactionDocument.amountPayed).toBe(mockTransaction.amountPayed)

    // Ensuring the user has been updated correctly
    expect(updatedUser.transactionHistory[0]).toBe(testTransactionDocument.transactionID)
    expect(updatedUser.holdings.length).toBe(1)
    expect(updatedUser.holdings[0].tokenID).toBe(testTokenDocument.tokenID)
    expect(updatedUser.holdings[0].amount).toBe(initialUserHoldings + mockTransaction.tokensPurchased)

    // Ensuring the vendor has been updated correctly
    expect(updatedVendor.transactionHistory[0]).toBe(testTransactionDocument.transactionID)
    expect(updatedVendor.holdings.length).toBe(1)
    expect(updatedVendor.holdings[0].tokenID).toBe(testTokenDocument.tokenID)
    expect(updatedVendor.holdings[0].amount).toBe(initialVendorHoldings - mockTransaction.tokensPurchased)
})

test('Ensuring thet getTransaction() properly gets a transaction from the database.', async () => {
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)

    // Creating the user
    const testUserDocument = await userApi.createUser(mockUser.walletAddress, mockUser.username, mockUser.hash)

    // Creating the vendor
    const testVendorDocument = await userApi.createVendor(mockVendor.walletAddress, mockVendor.username, mockVendor.hash)

    // Creating the token
    const testTokenDocument = await tokenApi.createTokenInDB(mockTokenA.contractAddress, mockTokenA.tokenName, mockTokenA.tokenSupply, mockTokenA.pricePerTokenInUSD, mockTokenA.abi)

    // Adding the necessary holdings to the user and vendor
    const initialUserHoldings = 10
    const initialVendorHoldings = 100
    await transactionApi.updateUserHoldings(testUserDocument.userID, testTokenDocument.tokenID, initialUserHoldings)
    await transactionApi.updateVendorHoldings(testVendorDocument.vendorID, testTokenDocument.tokenID, initialVendorHoldings)

    // Creating a transaction
    const testTransactionDocument = await transactionApi.createTransaction(
        testUserDocument.userID,
        testVendorDocument.vendorID,
        testTokenDocument.tokenID,
        mockTransaction.tokensPurchased,
        mockTransaction.transactionValue,
        mockTransaction.currencyPayedWith,
        mockTransaction.amountPayed
    )

    // Retrieving the transaction
    const retrievedTransaction = await transactionApi.getTransaction(testTransactionDocument.transactionID)

    // Ensuring the transaction was stored correctly
    expect(retrievedTransaction.buyerID).toBe(testUserDocument.userID)
    expect(retrievedTransaction.vendorID).toBe(testVendorDocument.vendorID)
    expect(retrievedTransaction.tokenID).toBe(testTokenDocument.tokenID)
    expect(retrievedTransaction.tokensPurchased).toBe(mockTransaction.tokensPurchased)
    expect(retrievedTransaction.currencyPayedWith).toBe(mockTransaction.currencyPayedWith)
    expect(retrievedTransaction.transactionValue).toBe(mockTransaction.transactionValue)
    expect(retrievedTransaction.amountPayed).toBe(mockTransaction.amountPayed)
})

test('Ensuring getHoldings() properly retrieves the holdings of a user/vendor.', async () => {
    await databaseApi.flushDatabase(process.env.FLUSH_PASS)

    // Creating the user
    const testUserDocument = await userApi.createUser(mockUser.walletAddress, mockUser.username, mockUser.hash)

    // Creating the vendor
    const testVendorDocument = await userApi.createVendor(mockVendor.walletAddress, mockVendor.username, mockVendor.hash)

    // Creating the token
    const testTokenDocumentA = await tokenApi.createTokenInDB(mockTokenA.contractAddress, mockTokenA.tokenName, mockTokenA.tokenSupply, mockTokenA.pricePerTokenInUSD, mockTokenA.abi)
    const testTokenDocumentB = await tokenApi.createTokenInDB(mockTokenB.contractAddress, mockTokenB.tokenName, mockTokenB.tokenSupply, mockTokenB.pricePerTokenInUSD, mockTokenB.abi)


    // Adding holdings to the user and vendor
    const holdingAmountA = 100
    const holdingAmountB = 200
    await transactionApi.updateUserHoldings(testUserDocument.userID, testTokenDocumentA.tokenID, holdingAmountA)
    await transactionApi.updateUserHoldings(testUserDocument.userID, testTokenDocumentB.tokenID, holdingAmountB)
    await transactionApi.updateVendorHoldings(testVendorDocument.vendorID, testTokenDocumentA.tokenID, holdingAmountA)
    await transactionApi.updateVendorHoldings(testVendorDocument.vendorID, testTokenDocumentB.tokenID, holdingAmountB)

    // Getting the holdings of the user/vendor
    const userHoldings = await transactionApi.getHoldings(testUserDocument.userID)

    // Ensuring they were retrieved correctly
    expect(userHoldings.holdings.length).toBe(2)
    expect(userHoldings.holdings[0].tokenID).toBe(testTokenDocumentA.tokenID)
    expect(userHoldings.holdings[0].amount).toBe(holdingAmountA)
    expect(userHoldings.holdings[1].tokenID).toBe(testTokenDocumentB.tokenID)
    expect(userHoldings.holdings[1].amount).toBe(holdingAmountB)

    // Getting the holdings of the user/vendor
    const vendorHoldings = await transactionApi.getHoldings(testVendorDocument.vendorID)
    
    // Disconnect must be present in the last test
    disconnect()

    // Ensuring they were retrieved correctly
    expect(vendorHoldings.holdings.length).toBe(2)
    expect(vendorHoldings.holdings[0].tokenID).toBe(testTokenDocumentA.tokenID)
    expect(vendorHoldings.holdings[0].amount).toBe(holdingAmountA)
    expect(vendorHoldings.holdings[1].tokenID).toBe(testTokenDocumentB.tokenID)
    expect(vendorHoldings.holdings[1].amount).toBe(holdingAmountB)
})