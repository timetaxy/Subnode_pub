const express = require("express");
const logger = require("morgan");
const routes = require("../route");
// const ws = require("ws");

const server = express();
const PORT = 8545;

server.listen(PORT);
server.use(logger("dev"));
server.use(express.json());
server.use(
  express.urlencoded({
    extended: true,
  })
);
server.use("/", routes);

server.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

server.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

process.on(`SIGINT`, function () {
  server.close(function () {
    console.log(`server closed`);
    process.exit(0);
  });
});
module.exports = server;
