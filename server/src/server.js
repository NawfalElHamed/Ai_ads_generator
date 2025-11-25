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
const aiRouter = require("./Routes/AiRoute");

app.use("/users", userRouter);
app.use("/ai", aiRouter);

database.connectToMongo();

app.listen(5000, () => {
  console.log("listening on 5000");
});
