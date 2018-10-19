const mongoose = require('mongoose')
const {Schema} = mongoose;

const authorSchema = ({
    name: {type: String, required:true},
    age: Number,
    occupation: String
})

const Author = mongoose.model("Author", authorSchema)

module.exports = Author;