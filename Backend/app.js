const dotenv=require('dotenv');
dotenv.config();
const express = require("express");
const app = express();
const cors=require('cors');
const connecToDB=require('./db/db');
const userRoutes=require('./routes/user.routes')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

connecToDB();


app.get("/", (req, res) => {
  res.send("hello world");
});

app.use('/users',userRoutes);

module.exports = app;
