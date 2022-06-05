const mongoose = require('mongoose')

const modelLocation = "./backend/database/models/"

const userModel = require(modelLocation + "user-model.js")

mongoose.connect(
    "monogdb://localhost/testdb", 
    () => {
        console.log("Connected")
    },
    e => console.log(e)
)

