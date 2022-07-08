const assert = require('assert')
const databaseApi = require('./database-api.js')
const userApi = require('./user/user-api.js')

const Vendor = require(`../models/vendor-model.js`)

async function connect() {
    await databaseApi.connectToDatabase(databaseApi.connectionUri, databaseApi.connectionParams)
}

async function disconnect() {
    await databaseApi.disconnectFromDatabase() 
}

// TESTS: [POST] v1/database/user/create-user

async function testCreateUser() {
    const u = {
        walletAddress: "0xb794f5ea0ba39494ce839613fffba74279579268",
        username: "wetheweast",
        hash: "E721B33486877C08EE43B8D344F9BFF54F9260A0E75CBE66D58BC4C3ABACBD12"
    }

    const ur = await userApi.createUser(u.walletAddress, u.username, u.hash)

    assert(
        ur != null,
        `testCreateUser() [0] failed with NULL user`
    )
    assert(
        ur.walletAddress == "0xb794f5ea0ba39494ce839613fffba74279579268", 
        `testCreateUser() [1] failed with bad wallet address ${ur.walletAddress}`
    )
    assert(
        ur.username == "wetheweast",
        `testCreateUser() [2] failed with bad username ${ur.username}`
    )
    assert(
        ur.userID != "",
        `testCreateUser() [3] failed with a blank userID`
    )
    assert(
        ur.hash == "E721B33486877C08EE43B8D344F9BFF54F9260A0E75CBE66D58BC4C3ABACBD12",
        `testCreateUser() [4] failed with bad hash ${ur.hash}`
    )
    console.log("testCreateUser() OK")
}

async function testUniqueUserID() {
    const u = {
        walletAddress: "0xE02e5Ad4e6721F83BfC8917573AC6D688A140D64",
        username: "sherbourne",
        hash: "708B51BB99A2B5DDFC8FDB4C8A62F3E14D7D6A06944DEE081B3012BEC5FB4976"
    }

    const ur = await userApi.createUser(u.walletAddress, u.username, u.hash)    

    assert(
        ur.userID = "U-" + ur._id,
        `testUniqueUserID() [0] failed with bad userID ${ur.userID}`
    )
    console.log("testUniqueUserID() OK")
}

async function testUniqueUserUsername() {
    const u1 = {
        walletAddress: "0x8Ed24DB5F549b66041A2EcED69956DaD9d052071",
        username: "benjamin",
        hash: "51EB76423AA25FB5B7C5D5E3B90535E3ECCF110C6B7C611D7FD85C0B8E0A74D1"
    }

    const u2 = {
        walletAddress: "0xBA222C7c9f39E99bea1e8280E27718Ce17c4DC05",
        username: "benjamin",
        hash: "317C5783ACC4DB3E7AFD0C51F7C136FC42CF10E49E8E4DA1010073EDD8193708"
    }

    const u1r = await userApi.createUser(u1.walletAddress, u1.username, u1.hash)
    const u2r = await userApi.createUser(u2.walletAddress, u2.username, u2.hash)

    assert(
        u2r == null,
        `testUniqueUsername() [0] failed by adding two users with the same username `
    )
    console.log("testUniqueUserUsername() OK")
}

// TESTS: [POST] v1/database/user/create-vendor

async function testCreateVendor() {
    const v = {
        walletAddress: "0x874532774CD8DA616c2294fFC8Bd6fAF40FA807A",
        username: "nike",
        hash: "69E9D79AA33EAD8074331BFAD0ED6337FC85E4B5EA4DDC5C477DBB84386DBB3F"
    }

    const vr = await userApi.createVendor(v.walletAddress, v.username, v.hash)

    assert(
        vr != null,
        `testCreateVendor() [0] failed with NULL vendor`
    )
    assert(
        vr.walletAddress == "0x874532774CD8DA616c2294fFC8Bd6fAF40FA807A", 
        `testCreateVendor() [1] failed with bad wallet address ${vr.walletAddress}`
    )
    assert(
        vr.username == "nike",
        `testCreateVendor() [2] failed with bad username ${vr.username}`
    )
    assert(
        vr.userID != "",
        `testCreateVendor() [3] failed with a blank vendorID`
    )
    assert(
        vr.hash == "69E9D79AA33EAD8074331BFAD0ED6337FC85E4B5EA4DDC5C477DBB84386DBB3F",
        `testCreateVendor() [4] failed with bad hash ${vr.hash}`
    )
    console.log("testCreateVendor() OK")
}

async function testUniqueVendorID() {
    const v = {
        walletAddress: "0xbc22518aD508e5652a4A7AaEa54f86d5A45A99B1",
        username: "costco",
        hash: "08B76F3998A016DC687E8118359BEFAEF3E0AF5F505047C05C72E0859E1DADB7"
    }

    const vr = await userApi.createVendor(v.walletAddress, v.username, v.hash)    

    assert(
        vr.userID = "V-" + vr._id,
        `testUniqueVendorID() [0] failed with bad vendorID ${vr.userID}`
    )
    console.log("testUniqueVendorID() OK")
}

async function testUniqueVendorUsername() {
    const v1 = {
        walletAddress: "0x72f620D71eD32B9e5da2E5E42bb72c5BDC6567f4",
        username: "adidas",
        hash: "BE46077AC85F5BB067C3ADB5CF446A8579E642FA779C12E2A7FC3C64BF682AFB"
    }

    const v2 = {
        walletAddress: "0xe8583C67ba18278108D39dadfAe162e7D3CB253F",
        username: "adidas",
        hash: "5229E8CD112080A3C48068C3336E4E8108A3CB58114C0D0C6F5D9DEA21E15121"
    }

    await userApi.createVendor(v1.walletAddress, v1.username, v1.hash)
    const v2r = await userApi.createVendor(v2.walletAddress, v2.username, v2.hash)

    assert(
        v2r == null,
        `testUniqueVendorUsername() [0] failed by adding two users with the same username `
    )
    console.log("testUniqueVendorUsername() OK")
}

// TESTS: [POST] v1/database/user/create-vendor

async function testCreateLocation() {
    const l = {
        country: "Canada",
        city: "Montreal",
        street: "Jeanne Mance",
        streetNumber: "3550",
        postalCode: "H2X 3P7"
    }

    const lr = await userApi.createLocation([], l.country, l.city, l.street, l.streetNumber, l.postalCode)

    assert(
        lr.country == "Canada",
        `testCreateLocation() [0] failed with country ${lr.country}`
    )
    assert(
        lr.city == "Montreal",
        `testCreateLocation() [1] failed with country ${lr.city}`
    )
    assert(
        lr.street == "Jeanne Mance",
        `testCreateLocation() [2] failed with street ${lr.street}`
    )
    assert(
        lr.streetNumber == "3550",
        `testCreateLocation() [3] failed with street number ${lr.streetNumber}`
    )
    assert(
        lr.postalCode == "H2X 3P7",
        `testCreateLocation() [4] failed with postal code ${lr.postalCode}`
    )
    assert(
        lr.locationID != "",
        `testCreateLocation() [5] failed with blank location ID`
    )
    console.log("testCreateLocation() OK")
}

async function testAddingVendorToLocation() {
    // Creating test vendors
    const v1 = {
        walletAddress: "0x1a780561b97f6A7E1fFAA294786FfD0d96B04072",
        username: "Berkshire Hathaway",
        hash: "B0B28369E9CFA35B9F74F4FBF50645961FD4A0E146E22E462E1C77E8E10C7C6C"
    }

    const v2 = {
        walletAddress: "0xa732cf88758520adE894cB421f62b122c5fce57c",
        username: "Blackrock",
        hash: "7E6578C2E34B53136741C6EFE7799A2DCE739651C22404A7894B48D42AA88B41"
    }

    const l = {
        country: "Canada",
        city: "Saint-Laurent",
        street: "Ouimet St",
        streetNumber: "3550",
        postalCode: "H4L 5C7"
    }

    const v1r = await userApi.createVendor(v1.walletAddress, v1.username, v1.hash)
    const v2r = await userApi.createVendor(v2.walletAddress, v2.username, v2.hash)
    const lr = await userApi.createLocation([v1r.vendorID, v2r.vendorID], l.country, l.city, l.street, l.streetNumber, l.postalCode)

    //Asserting the location exists in the location document
    assert(
        lr.vendorIDs[0] == v1r.vendorID,
        `testAddingVendorToLocation() [0] failed with bad first vendor ${lr.vendorIDs}`
    )
    assert(
        lr.vendorIDs[1] == v2r.vendorID,
        `testAddingVendorToLocation() [1] failed with bad first vendor ${lr.vendorIDs}`
    )
    
    // Asserting the location exists in the vendor documents
    const fv1 = await Vendor.findOne({ vendorID: v1r.vendorID })
    const fv2 = await Vendor.findOne({ vendorID: v2r.vendorID })
    assert(
        fv1.locations == lr.locationID,
        `testAddingVendorToLocation() [2] failed with bad location field ${fv1.locations}`
    )
    assert(
        fv2.locations == lr.locationID,
        `testAddingVendorToLocation() [3] failed with bad location field ${fv2.locations}`
    )
    console.log("testAddingVendorToLocation() OK")
}

// TESTS: [POST] v1/database/user/add-holdings

async function testAddHoldingsToUser() {
    const u = {
        walletAddress: "0x5c4444FF22f1b0e195C81b4627B4820cdE2D163a",
        username: "Asya",
        hash: "ABD37511FAD460B31CD56713A69F6E70682D80913EBD1D054E96F47212901F12"
    }

    const ur = await userApi.createUser(u.walletAddress, u.username, u.hash)

    const h1 = {
        tokenID: "T-TEST1",
        amount: 500
    }
    const h2 = {
        tokenID: "T-TEST2",
        amount: 100
    }

    await userApi.addHoldings(ur.userID, h1.tokenID, h1.amount, "U")
    const nur = await userApi.addHoldings(ur.userID, h2.tokenID, h2.amount, "U")

    assert(
        nur.holdings.length == 2,
        `testAddHoldingsToUser() [0] failed with bad number of holdings ${nur.holdings.length}`
    )
    assert(
        nur.holdings[0].tokenID == h1.tokenID,
        `testAddHoldingsToUser() [1] failed with bad tokenID ${nur.holdings[0].tokenID}`
    )
    assert(
        nur.holdings[0].amount == h1.amount,
        `testAddHoldingsToUser() [2] failed with bad tokenID ${nur.holdings[0].amount}`
    )
    assert(
        nur.holdings[1].tokenID == h2.tokenID,
        `testAddHoldingsToUser() [2] failed with bad tokenID ${nur.holdings[1].tokenID}`
    )
    assert(
        nur.holdings[1].amount == h2.amount,
        `testAddHoldingsToUser() [3] failed with bad tokenID ${nur.holdings[1].amount}`
    )
    console.log("testAddHoldingsToUser() OK")
}

async function testAddHoldingsToVendor() {
    const v = {
        walletAddress: "0xB98Ad8451d20A98f2729A14814d83FC69837c013",
        username: "Marshalls",
        hash: "9DE1B7CB8BC2BA60F464739AC3E1AE6ACCF0E52300E4B4FA09066B2121946C3C"
    }

    const vr = await userApi.createVendor(v.walletAddress, v.username, v.hash)

    const h1 = {
        tokenID: "T-TEST3",
        amount: 12
    }
    const h2 = {
        tokenID: "T-TEST4",
        amount: 24
    }

    await userApi.addHoldings(vr.vendorID, h1.tokenID, h1.amount, "V")
    const nvr = await userApi.addHoldings(vr.vendorID, h2.tokenID, h2.amount, "V")

    assert(
        nvr.holdings.length == 2,
        `testAddHoldingsToVendor() [0] failed with bad number of holdings ${nvr.holdings.length}`
    )
    assert(
        nvr.holdings[0].tokenID == h1.tokenID,
        `testAddHoldingsToVendor() [1] failed with bad tokenID ${nvr.holdings[0].tokenID}`
    )
    assert(
        nvr.holdings[0].amount == h1.amount,
        `testAddHoldingsToVendor() [2] failed with bad tokenID ${nvr.holdings[0].amount}`
    )
    assert(
        nvr.holdings[1].tokenID == h2.tokenID,
        `testAddHoldingsToVendor() [2] failed with bad tokenID ${nvr.holdings[1].tokenID}`
    )
    assert(
        nvr.holdings[1].amount == h2.amount,
        `testAddHoldingsToVendor() [3] failed with bad tokenID ${nvr.holdings[1].amount}`
    )
    console.log("testAddHoldingsToVendor() OK")
}

// TESTING: General functionality

async function testUserApi(flushDb) {
    await userApi.flushDatabase(process.env.FLUSH_PASS)
    try {
        // TESTING: [POST] v1/database/user/create-user
        console.log("----------TESTING v1/database/user/create-user---------\n")
        await testCreateUser()
        await testUniqueUserID()
        await testUniqueUserUsername()

        // TESTING: [POST] v1/database/user/create-vendor
        console.log("\n--------TESTING v1/database/user/create-vendor--------\n")
        await testCreateVendor()
        await testUniqueVendorID()
        await testUniqueVendorUsername()

        // TESTING: [POST] v1/database/user/create-location
        console.log("\n-------TESTING v1/database/user/create-location-------\n")
        await testCreateLocation()
        await testAddingVendorToLocation()

        // TESTING: [POST] v1/database/user/add-location
        console.log("\n-------TESTING v1/database/user/create-location-------\n")
        await testAddHoldingsToUser()
        await testAddHoldingsToVendor()

        console.log("\n-------------------ALL TESTS PASSED-------------------\n")
    } catch (err) {
        console.log(`\n${err}`)
    }
    flushDb && userApi.flushDatabase(process.env.FLUSH_PASS)
}

connect()
testUserApi(false)