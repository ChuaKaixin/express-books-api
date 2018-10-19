const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')


//for creating author
router.post("/", async(req, res) => {
    try {
        let author = new Author(req.body);
        await author.save();
        res.status(201).json({message:`author with name ${req.body.name} save successful`});
    }
    catch(error) {
        res.status(400).json({message:`error in saving author ${req.body.name}. error message: ${error.message}`});
    }
})

//for editing author
router.put("/:id", async(req, res) => {
    try {
        await Author.findByIdAndUpdate(req.params.id, req.body);
        res.status(201).json({message:`author with name ${req.body.name} updated successful`});
    }
    catch(error) {
        res.status(400).json({message:`error in updating author ${req.body.name}. error message: ${error.message}`});
    }
})

router.delete("/:id", async(req, res) => {
    try {
        await Author.findByIdAndDelete(req.params.id);
        res.status(201).json({message:`author with id ${req.params.id} deleted successfully`});
    }
    catch(error) {
        res.status(400).json({message:`error in deleting author ${req.params.id}. error message: ${error.message}`});
    }
})

//for searching the author by name
router.get("/:name", async (req, res, next) => {
    try {
        const result = await Author.find({name: new RegExp(req.params.name,'gi')});
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
})

router.get("/", async(req, res, next) => {
    try {
        /**
        const authorResult = await Author.findById(req.query.id);
        const bookResult = await Book.find({author:req.query.id}).populate('author');
        res.json({
            ...authorResult.toJSON(),
            books:bookResult
        }) */
        const authorResult = await Author.find();
        
        res.json(authorResult);
    }
    catch(error) {
        next(error);
    }
})

module.exports = router;

//{"name":"Author", "age":40, "occupation":"Freelance"}