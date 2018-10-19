if(process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}
const express = require("express");
const logger = require("morgan");

const authors = require("./routes/authors");
const books = require("./routes/books");
const index = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());

app.use("/authors", authors);
app.use("/", index);
app.use("/books", books);

module.exports = app;
