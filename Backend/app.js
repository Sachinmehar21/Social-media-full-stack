const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const morgan = require('morgan')

const cookieParser = require('cookie-parser');
const connectDb = require("./config/db.js")

var path = require('path');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cors = require("cors");

var app = express()

connectDb()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true 
}));

app.set('view engine', 'ejs')
app.set('views', './views');

// middleware
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) //
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use("/", require("./routes/userRoutes"))
app.use("/", require("./routes/postRoutes"))
app.use("/", require("./routes/authRoutes"))

app.listen(process.env.PORT)