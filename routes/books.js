const express = require("express");
const router = express.Router();
const Book = require('../models/book')
const Author = require('../models/author')

/* GET books listing. */
router.get("/", async(req, res) => {
  try {
    let lookupCriteria = {};
    if(req.query.authorname) {
      let authors = await Author.find({name: new RegExp(req.query.authorname,'gi')}, "name");
      let authorsCriteria = authors.map((author) => {return {author:author._id}});
      const books11 = await Book.find({$or:authorsCriteria}).populate('author');
      return res.status(200).json(books11);
    } else {
      if(req.query.author) {
        lookupCriteria = {author:req.query.author}
      } 
        const books = await Book.find(lookupCriteria).populate('author');
        res.status(200).json(books);
    }
  }
  catch(error) {
      res.status(400).json({message: error.message})
  }
})

router.get("/:id", async (req, res, next) => {
  try {
      const result = await Book.findById(req.params.id);
      res.status(200).json(result);
  }
  catch (error) {
      next(error);
  }
})

router.post("/", async(req, res, next) => {
  try {
      const book = new Book(req.body)
      await book.save();
      res.status(200).json({message: `create new book using data from ${req.body}`})
  } catch (error) {
      next(error)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
      const result = await Book.findByIdAndUpdate(req.params.id, req.body, {new: true});
      res.status(200).json(result);
  }
  catch (error) {
      next(error);
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
      const result = await Book.findByIdAndDelete(req.params.id);
      res.status(200).json(result);
  }
  catch (error) {
      next(error);
  }
})

module.exports = router;
//{"title":"Book Kitten", "description":"This is a kitten book", "price":25, "author":"5bc849c3bc5d5b0b66ad9d26"}
