// dependencies
const fs = require("fs");
const path = require("path");
const express = require("express");
const route = express.Router();

// main app
const cdn = express();

// middlweares
cdn.use(express.json());
cdn.use(express.urlencoded({ extended: true }));

// getting root dir
const dir = path.resolve("./");

// main controller
const getContentFile = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // regex for find file name from given path
  const fileNameregx = /\w\d*\.\w\d*(\.\w\d*)*/gi;
  const fileName = req.path.match(fileNameregx);

  if (!fileName) {
    fs.readdir(`${dir}/${process.env.PUBLIC_PATH}/${req.path}`, (err, data) => {
      // if any err happen or user give wrong dir name that dosent exist.
      if (err || !data) {
        console.log(err);
        res.json({
          error: "wrong cdn path. please try again",
        });
      } else {
        res.json({
          Available: `${data}`,
        });
      }
    });
  } else {
    res.sendFile(`${dir}/${process.env.PUBLIC_PATH}/${req.path}`);
  }
};

// index route of /cdn
route.get("/", (req, res) => {
  res.send("try /yourDirName/fileName");
});

// getting dir and file by params. Ex: /dirName/fileName
route.get("^/:dir*/:file?", getContentFile);

// index route
cdn.get("/", (req, res) => {
  res.json({ message: "nothing here, go /cdn" });
});

// cdn route
cdn.use("/cdn", route);

// exports the cdn app
module.exports = cdn;
