const mongoose = require('mongoose')
const {Schema} = mongoose;
const Author = require('../models/author')

const bookSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref:"Author",
        validate: {
            validator(authorId) {
                return Author.findById(authorId);
            }
        }
    }
})

const Book = mongoose.model("Book", bookSchema)

module.exports = Book;