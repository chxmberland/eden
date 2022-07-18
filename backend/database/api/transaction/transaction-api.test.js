const assert = require('assert')

const transactionApi = require('./transaction-api.js')
const databaseApi = require('../database-api.js')
const userApi = require('../user/user-api.js')

const modelLocation = '../../models'
const Transaction = require(`${modelLocation}/transaction-model.js`)

const mockTokenID = "a2"
const mockBuyerTokenHolding = 10
const mockVendorTokenHolding = 100
const mockTransactionAmount = 100

const mockUser = {
    walletAddress: "0xE4224304F6BFDC6825360CA6DB2125206B38C06D",
    username: "Ben",
    hash: "c88a33b9469ecf552b4659f193d27078b35da960",
    transactionHistory: ["t5", "t0", "t4"],
    holdings: [
        {
            tokenID: "a1",
            amount: 100
        },
        {
            tokenID: mockTokenID,
            amount: mockBuyerTokenHolding
        },
    ]
}

const mockVendor = {
    walletAddress: "0xE6F85C5A9951975ADD51416CFB408BBB52216275",
    username: "Index Exchange",
    hash: "c8b02b7417a800616799a8ba0b9eb65cd8ebeac8",
    locations: ["c2", "f4"],
    transactionHistory: ["t5", "t8", "t10"],
    holdings: [
        {
            tokenID: mockTokenID,
            amount: mockVendorTokenHolding
        },
        {
            tokenID: "a6",
            amount: 100
        },
        {
            tokenID: "d3",
            amount: 0
        },
    ]
}

const mockTransaction = {
    tokenID: mockTokenID,
    tokensPurchased: mockTransactionAmount,
    transactionValue: 23,
    currencyPayedWith: "ETH",
    amountPayed: 0.002
}

async function connect() {
    await databaseApi.connectToDatabase(databaseApi.connectionUri, databaseApi.connectionParams)
}

async function testUpdateUserHoldings() {

    // Creating the a user
    const user = await userApi.createUser(mockUser.walletAddress, mockUser.username, mockUser.hash)

    // Adding NEW holdings to the user
    let updatedUser = await transactionApi.updateUserHoldings(user.userID, mockUser.holdings[0].tokenID, mockUser.holdings[0].amount)

    // Asserting that the holdings were added to the user
    assert(
        updatedUser.holdings[0].tokenID == mockUser.holdings[0].tokenID,
        `testUpdateUserHoldings() [0] failed: The updated users holding did not match. Has ${updatedUser.holdings[0].tokenID}, expected ${mockUser.holdings[0].tokenID}`
    )
    assert(
        updatedUser.holdings[0].amount == mockUser.holdings[0].amount,
        `testUpdateUserHoldings() [1] failed: The updated users holding did not match. Has ${updatedUser.holdings[0].amount}, expected ${mockUser.holdings[0].amount}`
    )

    // Updating existing holdings
    const updateAmount = -50
    updatedUser = await transactionApi.updateUserHoldings(user.userID, mockUser.holdings[0].tokenID, updateAmount)
    
    // Asserting that the existing holdings were updated
    assert(
        updatedUser.holdings.length == 1,
        `testUpdateUserHoldings() [2] failed: The updated user did not have the correct holding length at ${updatedUser.holdings.length}`
    )
    assert(
        updatedUser.holdings[0].tokenID == mockUser.holdings[0].tokenID,
        `testUpdateUserHoldings() [3] failed: The updated users holding did not match. Has ${updatedUser.holdings[0].tokenID}, expected ${mockUser.holdings[0].tokenID}`
    )
    assert(
        updatedUser.holdings[0].amount == mockUser.holdings[0].amount + updateAmount,
        `testUpdateUserHoldings() [4] failed: The updated users holding did not match. Has ${updatedUser.holdings[0].amount}, expected ${mockUser.holdings[0].amount + updateAmount}`
    )

    console.log("\n\t\ttestUpdateUserHoldings() OK")
}

async function testUpdateVendorHoldings() {

    // Creating the a user
    const vendor = await userApi.createVendor(mockVendor.walletAddress, mockVendor.username, mockVendor.hash)

    // Adding NEW holdings to the user
    let updatedVendor = await transactionApi.updateUserHoldings(user.userID, mockVendor.holdings[0].tokenID, mockVendor.holdings[0].amount)

    // Asserting that the holdings were added to the user
    assert(
        updatedVendor.holdings[0].tokenID == mockVendor.holdings[0].tokenID,
        `testUpdateVendorHoldings() [0] failed: The updated users holding did not match. Has ${updatedVendor.holdings[0].tokenID}, expected ${mockVendor.holdings[0].tokenID}`
    )
    assert(
        updatedVendor.holdings[0].amount == mockVendor.holdings[0].amount,
        `testUpdateVendorHoldings() [1] failed: The updated users holding did not match. Has ${updatedVendor.holdings[0].amount}, expected ${mockVendor.holdings[0].amount}`
    )

    // Updating existing holdings
    const updateAmount = -50
    updatedVendor = await transactionApi.updateVendiorHoldings(vendor.userID, mockVendor.holdings[0].tokenID, updateAmount)
    
    // Asserting that the existing holdings were updated
    assert(
        updatedVendor.holdings.length == 1,
        `testUpdateVendorHoldings() [2] failed: The updated user did not have the correct holding length at ${updatedVendor.holdings.length}`
    )
    assert(
        updatedVendor.holdings[0].tokenID == mockVendor.holdings[0].tokenID,
        `testUpdateVendorHoldings() [3] failed: The updated users holding did not match. Has ${updatedVendor.holdings[0].tokenID}, expected ${mockVendor.holdings[0].tokenID}`
    )
    assert(
        updatedVendor.holdings[0].amount == mockVendor.holdings[0].amount + updateAmount,
        `testUpdateVendorHoldings() [4] failed: The updated users holding did not match. Has ${updatedVendor.holdings[0].amount}, expected ${mockVendor.holdings[0].amount + updateAmount}`
    )

    console.log("\n\t\ttestUpdateVendorHoldings() OK")
}

async function testCreateTransaction() {
    // Creating the user
    const user = await userApi.createUser(
        mockUser.walletAddress,
        mockUser.username,
        mockUser.hash
    )

    // Creating the vendor
    const vendor = await userApi.createVendor(
        mockVendor.walletAddress,
        mockVendor.username,
        mockVendor.hash
    )

    // Adding holdings to the vendor and user
    const userWithHoldings = await transactionApi.updateUserHoldings(user.userID, mockTokenID, mockBuyerTokenHolding)
    const vendorWithHoldings = await transactionApi.updateVendorHoldings(vendor.vendorID, mockTokenID, mockVendorTokenHolding)
    
    // Saving the transaction to the database and pulling it for testing
    const savedTransaction = await transactionApi.createTransaction(
        user.userID, 
        vendor.vendorID, 
        mockTransaction.tokenID, 
        mockTransaction.tokensPurchased, 
        mockTransaction.transactionValue, 
        mockTransaction.currencyPayedWith, 
        mockTransaction.amountPayed
    )

    // Testing getTransaction
    const foundTransaction = await transactionApi.getTransaction(savedTransaction.transacionID)

    assert(
        foundTransaction.transactionID == `TR-${savedTransaction._id}`,
        `testCreateTransaction() [0] failed: The transactionID in the database is incorrect. Got ${foundTransaction.transactionID}, expected ${savedTransaction.transactionID}`
    )
    assert(
        foundTransaction.buyerID == user.userID,
        `testCreateTransaction() [1] failed: The buyerID does not match the mockTransaction. Got ${foundTransaction.buyerID}, expected ${user.userID}`
    )
    assert(
        foundTransaction.vendorID == vendor.vendorID,
        `testCreateTransaction() [2] failed: The vendorID does not match the mockTransaction. Got ${foundTransaction.vendorID}, expected ${vendor.vendorID}`
    )
    assert(
        foundTransaction.tokenID == mockTransaction.tokenID,
        `testCreateTransaction() [3] failed: The tokenID does not match the mockTransaction. Got ${foundTransaction.tokenID}, expected ${mockTransaction.tokenID}`
    )
    assert(
        foundTransaction.tokensPurchased == mockTransaction.tokensPurchased,
        `testCreateTransaction() [4] failed: The tokensPurchased does not match the mockTransaction. Got ${foundTransaction.tokensPurchased}, expected ${mockTransaction.tokensPurchased}`
    )
    assert(
        foundTransaction.transactionValue == mockTransaction.transactionValue,
        `testCreateTransaction() [5] failed: The transactionValue does not match the mockTransaction. Got ${foundTransaction.transactionValue}, expected ${mockTransaction.transactionValue}`
    )
    assert(
        foundTransaction.currencyPayedWith == mockTransaction.currencyPayedWith,
        `testCreateTransaction() [6] failed: The currencyPayedWith does not match the mockTransaction. Got ${foundTransaction.currencyPayedWith}, expected ${mockTransaction.currencyPayedWith}`
    )
    assert(
        foundTransaction.amountPayed == mockTransaction.amountPayed,
        `testCreateTransaction() [7] failed: The amountPayed does not match the mockTransaction. Got ${foundTransaction.amountPayed}, expected ${mockTransaction.amountPayed}`
    )

    // Checking to see if the transaction has been added to the user and vendor
    const modifiedUser = await userApi.getUser(user.userID)
    const modifiedVendor = await userApi.getVendor(vendor.vendorID)

    assert(  
        modifiedUser.transactionHistory[0] == foundTransaction.transactionID,
        `testCreateTransaction() [8] failed: The user document does not contain the transaction ID. See here\n${modifiedUser}`
    )
    assert(
        modifiedVendor.transactionHistory[0] == foundTransaction.transactionID,
        `testCreateTransaction() [9] failed: The vendor document does not contain the transaction ID. See here\n${modifiedVendor}`
    )

    // Checking the holdings of the buyer
    let check = false
    let index = 0 // Stores the index of the token in the holdings object if it exists
    for (let i = 0; i < modifiedUser.holdings.length; i++) {
        if (modifiedUser.holdings[i].tokenID == mockTokenID) {
            check = true
            index = i
        }
    }
    assert(
        check,
        `testCreateTransaction() [10] failed: The puchased token is not in the buyers holdings. Got: ${modifiedUser.holdings}`
    )
    assert(
        modifiedUser.holdings[index].amount == mockBuyerTokenHolding + mockTransactionAmount,
        `testCreateTransaction() [11] failed: The buyer holds the token, but the amount is incorrect. Has ${modifiedUser.holdings[index].amount}, expected ${mockBuyerTokenHolding + mockVendorTokenHolding}`
    )

    // Checking the holdings of the vendor
    check = false
    index = 0
    for (let i = 0; i < modifiedVendor.holdings.length; i++) {
        if (modifiedVendor.holdings[i].tokenID == mockTokenID) {
            check = true
            index = i
        }
    }
    assert(
        modifiedVendor.holdings[index].amount == mockVendorTokenHolding - mockTransactionAmount,
        `testCreateTransaction() [12] failed: The vendor holds an incorrect amount of the token. Has ${modifiedVendor.holdings[index].amount}, expected ${mockVendorTokenHolding - mockTransactionAmount}`
    )

    console.log("\n\t\ttestCreateTransaction() OK")
}

async function testGetHoldings() {
    // Creating the user 
    const user = await userApi.createUser(
        mockUser.walletAddress,
        mockUser.username,
        mockUser.hash
    )

    // Adding the holdings
    const userWithHoldings = await transactionApi.updateUserHoldings(user.userID, mockUser.holdings0[0].tokenID, mockUser.holdings[0].amount)

    // Testing getHoldings()
    const holdings = transactionApi.getHoldings(user.userApi)

    // Asserting the function got the holdings and userID
    assert(
        holdings.userID == user.userID,
        `testGetHoldings() [0] failed: The userID is incorrect with  ${holdings.userID}`
    )
    assert(
        holdings.holdings[0] == mockUser.holdings[0],
        `testGetHoldings() [0] failed: The holdings that were returned are incorrect. Got ${holdings.holdings[0]} and expected ${mockUser.holdings[0]}`
    )

}

async function testTransactionApi() {
    await userApi.flushDatabase(process.env.FLUSH_PASS)

    console.log("-> Testing updateUserHoldings()")
    await testUpdateUserHoldings()
    await userApi.flushDatabase(process.env.FLUSH_PASS)

    console.log("\n-> Testing updateVendorHoldings()")
    await testUpdateUserHoldings()
    await userApi.flushDatabase(process.env.FLUSH_PASS)

    console.log("\n-> Testing createTransaction()")
    await testCreateTransaction()
    await userApi.flushDatabase(process.env.FLUSH_PASS)

    console.log("\n-> Testing testGetHoldings()")
    await testGetHoldings()
    await userApi.flushDatabase(process.env.FLUSH_PASS)
}

connect()
testTransactionApi()