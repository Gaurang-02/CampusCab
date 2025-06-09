const dotenv=require('dotenv');
dotenv.config();
const express = require("express");
const app = express();
const cors=require('cors');
const connecToDB=require('./db/db');
const userRoutes=require('./routes/user.routes')
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

connecToDB();


app.get("/", (req, res) => {
  res.send("hello world");
});

app.use('/users',userRoutes);

module.exports = app;
