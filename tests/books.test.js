const express = require("express");
const request = require("supertest");
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Book = require("../models/book");
const Author = require("../models/author");

const app = require("../app");


beforeAll(async () => {
    // Increase timeout to allow MongoDB Memory Server to be donwloaded
    // the first time
    jest.setTimeout(120000);
  
    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri);
  });


afterAll(() => {
    mongoose.disconnect();
    mongod.stop();
});

async function addFakeBooks() {
    const author1 = new Author({
      name: "John",
      age: 49
    });
  
    const savedAuthor = await author1.save();
  
    const book = new Book({
      title: "Big book",
      description: "Description",
      price: 25,
      author: `${savedAuthor._id}`
    });
  
    await book.save();
}

beforeEach(async () => {
    // Clean DB between test runs
    mongoose.connection.db.dropDatabase();
    await addFakeBooks();
});

test("POST /books should create new book", async() => {
    const authors = await Author.find();
    const bookDetails = {
        title: "A new book",
        description: "book description",
        price: 30,
        author: `${authors[0]._id}`
    }

    const response = await request(app).post('/books').send(bookDetails);
    expect(response.status).toEqual(200);
    expect(response.body.message).toMatch(/create new book using data from /);
})

test("PUT /books/:id should update book", async() => {
    const authors = await Author.find();
    const oldbook = await Book.find();
    const bookDetails = {
        title: "Updated book",
        description: "book description",
        price: 30,
        author: `${authors[0]._id}`
    }

    const response = await request(app).put(`/books/${oldbook[0]._id}`).send(bookDetails);
    expect(response.status).toEqual(200);
    expect(response.body.title).toMatch("Updated book");
})

test("DELETE /books/:id should delete book", async() => {
    const oldbook = await Book.find();

    const response = await request(app).delete(`/books/${oldbook[0]._id}`);
    expect(response.status).toEqual(200);
})

test("GET /books/:id should get the book", async() => {
    const oldbook = await Book.find();

    const response = await request(app).delete(`/books/${oldbook[0]._id}`);
    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual("Big book");
    expect(response.body.description).toEqual("Description");
})