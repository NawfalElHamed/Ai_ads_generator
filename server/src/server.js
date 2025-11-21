const express = require("express");
const app = express();
const cors = require('cors');

const { connection } = require("./Config/Database");

const database = connection();

require("dotenv").config();

// 🔥 Allow frontend to call backend
app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const userRouter = require("./Routes/UserRoute");

app.use("/users", userRouter);

database.connectToMongo();

app.listen(5000, () => {
  console.log("listening on 5000");
});
