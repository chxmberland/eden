const databaseApi = require('./database-api.js')
const userApi = require('./user/user-api.js')

databaseApi.connectToDatabase(databaseApi.connectionUri, databaseApi.connectionParams)