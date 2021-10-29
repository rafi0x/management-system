// external dependencies
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const cors = require("cors");
const userAgent = require("express-useragent");
const MongoDBStore = require("connect-mongodb-session")(session);

// internal dependencies
const { isUserLoggedIn } = require("./common/checker");

// storage to sessions
const store = new MongoDBStore({
  uri: process.env.SESSION_DB,
  collection: "mySessions",
});

// middlewares for main app
const middleware = [
  cors(),
  morgan("dev"),
  express.static("public"),
  express.urlencoded({
    extended: true,
  }),
  express.json(),
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
    store,
  }),
  isUserLoggedIn(),
  userAgent.express(),
];

// using middlwares in app.use
module.exports = (app) => {
  middleware.map((mw) => {
    app.use(mw);
  });
};
