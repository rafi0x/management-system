//external dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// internal dependencies
const cdn = require("./routers/cdn"); // cdn
const setMiddlewares = require("./middlewares/appMiddleware"); // app middleweares
const setRouters = require("./routers"); // routers
const errHandler = require("./middlewares/common/error"); // error handler

// main app
const app = express();
const server = require("http").createServer(app);

// socket.io
const io = require("socket.io")(server);
global.io = io;

// set view engin
app.set("view engine", "ejs");

// uses
setMiddlewares(app);
setRouters(app);

// error handler
app.use(errHandler());

// db & servers connections
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
    // cdn server
    cdn.listen(process.env.CDN_PORT, () => {
      console.log(`CDN started on ${process.env.CDN_PORT}`);
    });
    // main web server
    server.listen(process.env.APP_PORT, () => {
      console.log(`webServer started on ${process.env.APP_PORT}`);
    });
  })
  .catch((err) => console.log(err));
