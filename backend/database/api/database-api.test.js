const databaseApi = require('./database-api.js')
const userApi = require('./user/user-api.js')

async function testUserApi() {
    await databaseApi.connectToDatabase(databaseApi.connectionUri, databaseApi.connectionParams)

    //const newUser = await userApi.createUser("Asyas wallet", "odwdiehp2", "asyas hash")

    const newVendor = await userApi.createVendor("test-wallet-address", "test-sojfgdj", "test-hash")

    await userApi.createLocation([newVendor.vendorID], "Canada", "Montreal", "Jeanne Mance", "3550", "H2X 3P7")
}

testUserApi()