const { MongoClient, ServerApiVersion } = require('mongodb');

const modelLocation = "./backend/database/models/"
const userModel = require(modelLocation + "user-model.js")
const pass = null

const connectionUri = "mongodb+srv://admin:" + pass + "@atlascluster.wmlg9zu.mongodb.net/?retryWrites=true&w=majority";
const connectionParams = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    serverApi: ServerApiVersion.v1 
}

const client = new MongoClient(connectionUri, connectionParams);

client.connect(err => {
    // const collection = client.db( [database] ).collection( [collection] );
    client.close()
});