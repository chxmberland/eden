const databaseApi = require('./database-api.js')
const userApi = require('./user/user-api.js')

databaseApi.connectToDatabase(databaseApi.connectionUri, databaseApi.connectionParams)

userApi.createUser("0x830830", "benc", "ogj049045h094h5g04h50gh9409g")