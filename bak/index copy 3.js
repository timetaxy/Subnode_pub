const express = require("express");
const logger = require("morgan");
const route = require("./route");
const processProxy = require("./route");
const WebSocket = require("ws");
const util = require("util");
// const { ServerResponse } = require("http");
const wsPORT = 8546;
const httpPORT = 8545;

const wss = new WebSocket.Server({ port: wsPORT });
wss.on("connection", (ws) => {
  ws.on("message", (req) => {
    console.log(`recv: ${req}`);
    let reqData = JSON.parse(req);
    // console.log(`is Array: ${Array.isArray(reqData)}`);
    // console.log(`req obj:${JSON.stringify(reqObj)}`);
    if (!Array.isArray(reqData)) reqData = [reqData];
    // if (Array.isArray(reqData)) {
    for (const reqDataEl of reqData) {
      const reqObj = {
        method: "POST",
        body: reqDataEl,
        headers: { "content-type": "application/json" },
      };
      processProxy(reqObj, null).then((res) => {
        console.log(`res from processProxy: ${util.inspect(res)}`);
        ws.send(JSON.stringify(res));
      });
    }
    // }
    // const reqObj = {
    //   method: "POST",
    //   body: reqData,
    //   headers: { "content-type": "application/json" },
    // };
    // processProxy(reqObj, null).then((res) => {
    //   console.log(`res from processProxy: ${util.inspect(res)}`);
    //   ws.send(JSON.stringify(res));
    // });
  });
  // ws.send("return msg");
});

const server = express();

server.listen(httpPORT);
server.use(logger("dev"));
server.use(express.json());
server.use(
  express.urlencoded({
    extended: true,
  })
);
server.use("/", route);

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
