// app.test.js
const express = require("express");
const request = require("supertest");

// Initialize MongoDB Memory Server
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/author");
const Book = require("../models/book");

const app = require("../app");

async function addFakeAuthors() {
  const author1 = new Author({
    name: "paulo",
    age: 49
  });

  await author1.save();

  const author2 = new Author({
    name: "john",
    age: 50
  });

  await author2.save();
}

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

beforeEach(async () => {
  // Clean DB between test runs
  mongoose.connection.db.dropDatabase();

  // Add fake data to the DB to be used in the tests
  await addFakeAuthors();
});

test("GET /authors", async () => {
  const response = await request(app).get("/authors");

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body.length).toBe(2);
});

test("Get /books should display all books", async() => {
  await addFakeBooks();
  const response = await request(app).get("/books");
  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body.length).toBe(1);
});
//test("Get / display welcome message");