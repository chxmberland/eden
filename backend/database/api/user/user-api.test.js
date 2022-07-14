const assert = require('assert')
const databaseApi = require('../database-api.js')
const userApi = require('./user-api.js')

const Vendor = require("../../models/vendor-model.js")
const Location = require("../../models/location-model.js")

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
    
    // Asserting the location exists in the vendor documents (need the updated vendors)
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

async function testAddHoldingToUser() {
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

    await userApi.addHolding(ur.userID, h1.tokenID, h1.amount, "U")
    const nur = await userApi.addHolding(ur.userID, h2.tokenID, h2.amount, "U")

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

async function testAddHoldingToVendor() {
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

    await userApi.addHolding(vr.vendorID, h1.tokenID, h1.amount, "V")
    const nvr = await userApi.addHolding(vr.vendorID, h2.tokenID, h2.amount, "V")

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

// TESTS: [GET] v1/database/get-user

async function testGetUser() {
    const u = {
        walletAddress: "0x0A7d16aF0fEb082288B43F1678BB707650eEe651",
        username: "RogerOutages",
        hash: "8F9602AA161E406B7426EDAFC6C17433C21E62C38D6B5A6B5F81862F9F7BE6DB"
    }

    const ur = await userApi.createUser(u.walletAddress, u.username, u.hash)

    const foundUser = await userApi.getUser(ur.userID)

    assert(
        foundUser.walletAddress == ur.walletAddress,
        `testGetUser() [0] failed with bad wallet address ${foundUser.walletAddress}`
    )
    assert(
        foundUser.username == ur.username,
        `testGetUser() [1] failed with bad usernam ${foundUser.username}`
    )
    assert(
        foundUser.userID == ur.userID,
        `testGetUser() [2] failed with bad userID ${foundUser.userID}`
    )
    assert(
        foundUser.hash == ur.hash,
        `testGetUser() [3] failed with bad hash ${foundUser.hash}`
    )
    assert(
        foundUser.transactionHistory.length == ur.transactionHistory.length,
        `testGetUser() [4] failed with bad transaction history length ${foundUser.transactionHistory.length}`
    )
    for (let i = 0; i < foundUser.transactionHistory.length; i++) {
        assert(
            foundUser.transactionHistory[i] == ur.transactionHistory[i],
            `testGetUser() [5] failed with bad transaction history ${foundUser.transactionHistory[i]}`
        )
    }
    assert(
        foundUser.holdings.length == ur.holdings.length,
        `testGetUser() [6] failed with bad holdings length ${foundUser.holdings.length}`
    )
    for (let i = 0; i < foundUser.holdings.length; i++) {
        assert(
            foundUser.holdings[i] == ur.holdings[i],
            `testGetUser() [7] failed with bad holdings ${foundUser.holdings[i]}`
        )
    }
    console.log("testGetUser() OK")
}

// TESTS: [PATCH] v1/database/user/update-username

async function testUpdateUsername() {
    // Testing changing a users username
    const u = {
        walletAddress: "0x296770B977d4F2E849078F738f7ac234B2d193AA",
        username: "superman",
        hash: "17F29B073143D8CD97B5BBE492BDEFFEC1C5FEE55CC1FE2112C8B9335F8B6121"
    }
    let newUsername = "the flash"

    const savedUser = await userApi.createUser(u.walletAddress, u.username, u.hash)
    const newUser = await userApi.updateUsername(savedUser.userID, newUsername, "U")

    assert(
        newUser.username == newUsername,
        `testUpdateUsername() [0] failed with bad user username ${newUser.username}`
    )

    // Testing changing a vendors username
    const v = {
        walletAddres: "0xd52cF2D05Dec9171dB252838a2Eb89025a5BA0e5",
        username: "green lantern",
        hash: "2995FF81D719DC2131E0B53AD86CE42D0956CE7B95657E9A20C64F683DEDE795"
    }
    newUsername = "black panther"
    
    const savedVendor = await userApi.createVendor(v.walletAddress, v.username, v.hash)
    const newVendor = await userApi.updateUsername(savedVendor.vendorID, newUsername, "V") 

    assert(
        newVendor.username == newUsername,
        `testUpdateUsername() [1] failed with bad vendor username ${newVendor.username}`
    )

    console.log("testUpdateUsername() OK")
}

// TESTS: [PATCH] v1/database/user/update-wallet-address

async function testUpdateWalletAddress() {
    // Testing changing a users wallet address
    const u = {
        walletAddress: "0x70E32946Cb8894fF9c13b82EAF7456D6E3ef391E",
        username: "dollarama",
        hash: "61FF03469452EA67EB58AB5F266222D89160F420FA72C0439F1C7CB59B55763C"
    }
    let newWalletAddress = "NEW WALLET ADDRESS"

    const savedUser = await userApi.createUser(u.walletAddress, u.username, u.hash)
    const newUser = await userApi.updateWalletAddress(savedUser.userID, newWalletAddress, "U")

    assert(
        newUser.walletAddress == newWalletAddress,
        `testUpdateWalletAddress() [0] failed with bad user wallet address ${newUser.walletAddress}`
    )

    // Testing changing a vendors wallet address
    const v = {
        walletAddres: "0xe4655c5cf58A3120B38eC3F0f9a7be4D5eF6bAb5",
        username: "LCBO",
        hash: "7FE8B22CE93E9CDB3CC71F5FC1672EA030E4641FACB336CFF8C42B67655D6E1D"
    }

    const savedVendor = await userApi.createVendor(v.walletAddress, v.username, v.hash)
    const newVendor = await userApi.updateWalletAddress(savedVendor.vendorID, newWalletAddress, "V") 

    assert(
        newVendor.walletAddress == newWalletAddress,
        `testUpdateWalletAddress() [1] failed with bad vendor wallet address ${newVendor.walletAddress}`
    )

    console.log("testUpdateWalletAddress() OK")
}

async function testUpdateLocation() {
    const firstLocation = {
        country: "New Zealand",
        city: "Auckland",
        street: "Westchester Crt.",
        streetNumber: "65",
        postalCode: "G4F D2H"
    }
    const newLocation = {
        country: "Morrocco",
        city: "Casablanca",
        street: "Sashay Ave.",
        streetNumber: "73",
        postalCode: "2345"
    }
    const savedLocation = await userApi.createLocation([], firstLocation.country, firstLocation.city, firstLocation.street, firstLocation.streetNumber, firstLocation.postalCode)
    const updatedLocation = await userApi.updateLocation(savedLocation.locationID, newLocation.country, newLocation.city, newLocation.street, newLocation.streetNumber, newLocation.postalCode)

    assert(
        updatedLocation.country == newLocation.country,
        `testUpdateVendorLocation() [0] failed with country ${updatedLocation.country}`
    )
    assert(
        updatedLocation.city == newLocation.city,
        `testUpdateVendorLocation() [1] failed with city ${updatedLocation.city}`
    )
    assert(
        updatedLocation.street == newLocation.street,
        `testUpdateVendorLocation() [2] failed with street ${updatedLocation.street}`
    )
    assert(
        updatedLocation.streetNumber == newLocation.streetNumber,
        `testUpdateVendorLocation() [3] failed with street number ${updatedLocation.streetNumber}`
    )
    assert(
        updatedLocation.postalCode == newLocation.postalCode,
        `testUpdateVendorLocation() [4] failed with postal code ${updatedLocation.postalCode}`
    )

    console.log("testUpdateVendorLocation() OK")
}

async function testUpdateHoldings() {
    // Creating a user and some mock holdings
    const user = {
        walletAddress: "0x4C97BfC355338968c9446A610e8d05Ed43dD152C",
        username: "Jeanne Mance",
        hash: "750E4AE9942ACD739ADCD6C44E7135125C01D57FE24013D0B9E4B021C914FD06"
    }
    const token = {
        tokenID: "T-TEST",
        amount: 100
    }
    const updatedAmount = 200

    // Saving the user and tokens to the database
    const createdUser = await userApi.createUser(user.walletAddress, user.username, user.hash)
    const userWithHoldings = await userApi.addHolding(createdUser.userID, token.tokenID, token.amount, "U")

    // Updating the holdings
    const updatedUserWithHoldings = await userApi.updateHolding(userWithHoldings.userID, token.tokenID, updatedAmount, "U")

    // Checking to see if the update worked
    assert(
        updatedUserWithHoldings.holdings[0].tokenID == token.tokenID,
        `testUpdateHoldings() [0] failed with bad tokenID ${updatedUserWithHoldings.holdings[0].tokenID}`
    )
    assert(
        updatedUserWithHoldings.holdings[0].amount == updatedAmount,
        `testUpdateHoldings() [1] failed with bad amount ${updatedUserWithHoldings.holdings[0].amount}`
    )

    // Creating a vendor and some mock holdings
    const vendor = {
        walletAddress: "0x4C97BfC355338968c9446A610e8d05Ed43dD152C",
        username: "Jeanne Mance",
        hash: "750E4AE9942ACD739ADCD6C44E7135125C01D57FE24013D0B9E4B021C914FD06"
    } 

    // Saving the vendor and tokens to the database
    const createdVendor = await userApi.createVendor(vendor.walletAddress, vendor.username, vendor.hash)
    const vendorWithHoldings = await userApi.addHolding(createdVendor.vendorID, token.tokenID, token.amount, "V")

    // Updating the holdings
    const updatedVendorWithHoldings = await userApi.updateHolding(vendorWithHoldings.vendorID, token.tokenID, updatedAmount, "V")

    assert(
        updatedVendorWithHoldings.holdings[0].tokenID == token.tokenID,
        `testUpdateHoldings() [2] failed with bad tokenID ${updatedVendorWithHoldings.holdings[0].tokenID}`
    )
    assert(
        updatedVendorWithHoldings.holdings[0].amount == updatedAmount,
        `testUpdateHoldings() [3] failed with bad amount ${updatedVendorWithHoldings.holdings[0].amount}`
    )

    console.log("testUpdateHoldings() OK")
}

async function testDeleteUser() {
    // Creating the user and saving it to the database
    const user ={
        walletAddress: "0xFD3a9d5a0A5d7dbA53e46801CB87ec3E894a0464",
        username: "Jackson",
        hash: "E797C0013811A1D1E35AD7EDD10FB99986DB664B0996C76ED9AE5E0A5151BBF9"
    }
    const savedUser = await userApi.createUser(user.walletAddress, user.username, user.hash)

    // Deleting the user
    const res = await userApi.deleteUser(savedUser.userID)

    // Asserting the user was deleted
    assert(
        res.acknowledged == true,
        `testDeleteUser() [0] failed with an aknowledgment of ${res.acknowledged} (should be true)`
    )
    assert(
        res.deletedCount == 1,
        `testDeleteUser() [1] failed with the number of deleted documents being ${res.deletedCount} (should be 1)`
    )
    console.log("testDeleteUser() OK")
}

async function testDeleteVendor() {
    // Creating a vendor
    const vendor = {
        walletAddress: "0xa6A0BA28B03f2099eb14dd49CF9616B264ff9653",
        username: "Winners",
        hash: "8761E99B70755115286A856207A46E7BA10FAFD3324ABA86838A8F9ECD2579D3"
    }
    const savedVendor = await userApi.createVendor(vendor.walletAddress, vendor.username, vendor.hash)

    // Creating some mock locations
    const torontoLocation = {
        country: "Canada",
        city: "Toronto",
        street: "King St.",
        streetNumber: "400",
        postalCode: "N2D 4T6"
    }
    const ottawaLocation = {
        country: "Canada",
        city: "Ottawa",
        street: "Parliment Ct.",
        streetNumber: "12",
        postalCode: "T6Y 7U8"
    }

    savedTorontoLocation = await userApi.createLocation([savedVendor.vendorID], torontoLocation.country, torontoLocation.city, torontoLocation.street, torontoLocation.streetNumber, torontoLocation.postalCode)
    savedOttawaLocation = await userApi.createLocation([savedVendor.vendorID], ottawaLocation.country, ottawaLocation.city, ottawaLocation.street, ottawaLocation.streetNumber, ottawaLocation.postalCode)

    // Asserting the vendorID exists in both locations
    assert(
        savedTorontoLocation.vendorIDs[0] == savedVendor.vendorID,
        `testDeleteVendor() [0] failed with bad vendorID on location ${savedTorontoLocation.vendorIDs[0]}`    
    )
    assert(
        savedOttawaLocation.vendorIDs[0] == savedVendor.vendorID,
        `testDeleteVendor() [1] failed with bad vendorID on location ${savedOttawaLocation.vendorIDs[0]}`    
    )

    // Deleting the vendor
    const res = await userApi.deleteVendor(savedVendor.vendorID)

    // Asserting the vendor was deleted
    assert(
        res.acknowledged == true,
        `testDeleteVendor() [2] failed with an aknowledgment of ${res.acknowledged} (should be true)`
    )
    assert(
        res.deletedCount == 1,
        `testDeleteVendor() [3] failed with the number of deleted documents being ${res.deletedCount} (should be 1)`
    )

    // Asserting the vendorID has been removed from each location
    const newTorontoLocation = await Location.findOne({ locationID: savedTorontoLocation.locationID })
    const newOttawaLocation = await Location.findOne({ locationID: savedOttawaLocation.locationID })

    assert(
        newTorontoLocation.vendorIDs.length == 0,
        `testDeleteVendor() [4] failed: The vendorID was not deleted from the Toronto location ${newTorontoLocation.vendorIDs}`
    )
    assert(
        newOttawaLocation.vendorIDs.length == 0,
        `testDeleteVendor() [5] failed: The vendorID was not deleted from the Ottawa location ${newOttawaLocation.vendorIDs}`
    )

    console.log("testDeleteVendor() OK")
}

// TESTING: General functionality

async function testUserApi(flushDb) {
    await userApi.flushDatabase(process.env.FLUSH_PASS)
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
    await testAddHoldingToUser()
    await testAddHoldingToVendor()

    // TESTING: [GET] v1/database/user/get-user
    console.log("\n----------TESTING v1/database/user/get-user-----------\n")
    await testGetUser()

    // TESTING: [PATCH] v1/database/user/update-username
    console.log("\n-------TESTING v1/database/user/update-username-------\n")
    await testUpdateUsername()

    console.log("\n----TESTING v1/database/user/update-wallet-address----\n")
    await testUpdateWalletAddress()

    console.log("\n-------TESTING v1/database/user/update-location-------\n")
    await testUpdateLocation()

    console.log("\n-------TESTING v1/database/user/update-holdings-------\n")
    await testUpdateHoldings()

    console.log("\n-----TESTING v1/database/user/delete-user:vendor------\n")
    await testDeleteUser()
    await testDeleteVendor()

    console.log("\n-------------------ALL TESTS PASSED-------------------\n")

    flushDb && userApi.flushDatabase(process.env.FLUSH_PASS)
}

connect()
testUserApi(false)