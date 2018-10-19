const express = require("express");
const request = require("supertest");
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");

const Author = require("../models/author");
const Book = require("../models/book");

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

beforeEach(async () => {
    // Clean DB between test runs
    mongoose.connection.db.dropDatabase();
    await addFakeAuthors();
});


test("POST /authors should create new author", async() => {
    const authorDetails = {name:"Author Name", age:40, occupation: "Freelance"};
    await request(app).post("/authors")
    .send(authorDetails)
    .expect(201, {message:"author with name Author Name save successful"});
})
test("PUT /authors/:id should update selected author", async() => {
    const authors = await Author.find();
    const authorId = authors[0]._id;
    const authorDetails = {name:"Author Name New", age:40, occupation: "Freelance"};
    await request(app).put(`/authors/${authorId}`)
    .send(authorDetails)
    .expect(201, {message:"author with name Author Name New updated successful"});
})
test("DELETE /authors/:id should delete selected author", async() => {
    const authors = await Author.find();
    const authorId = authors[0]._id;
    await request(app).delete(`/authors/${authorId}`)
    .expect(201, {message:`author with id ${authorId} deleted successfully`});

})
test("GET/authors/:name should retrieve selected author", async() => {
    const response = await request(app).get("/authors/paulo");
    expect(response.status).toBe(208);
    expect(response.body[0]).toMatchObject({name:"paulo", age:49});
})