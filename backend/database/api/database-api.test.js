const databaseApi = require('./database-api.js')
const userApi = require('./user/user-api.js')

databaseApi.connectToDatabase(databaseApi.connectionUri, databaseApi.connectionParams)

//userApi.createUser("Asyas wallet", "mother_russia", "asyas hash")

userApi.createVendor("test-wallet-address", "test-username", "test-hash")

//userApi.createLocation(["V-62c340617cb2920b82a8bc4d"], "Canada", "Montreal", "Jeanne Mance", "3550", "H2X 3P7")