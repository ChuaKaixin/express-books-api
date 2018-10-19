const mongoose = require('mongoose')
const app = require('./app');
const dbURL = process.env.MONGODB_URI;
mongoose.connect(dbURL, {useNewUrlParser:true})
const db = mongoose.connection;

db.on("error", error => {
    console.error("Error in DB connection")
})

db.once("open", () => {
    console.log("Database is connected");
}
)

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}...`);
});
