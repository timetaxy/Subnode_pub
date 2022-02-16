const express = require("express");
var path = require('path');
const logger = require("morgan");
const WebSocket = require("ws");
const util = require("util");
const { router } = require("./route");
const { processProxy } = require("./route");
const cache = require("./cache.js");
const bodyParser = require("body-parser");

cache.init();

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
  });
  // ws.send("test return msg");
});
console.log(`ws server opened, port:${wsPORT}`);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const server = app.listen(httpPORT);
console.log(`http server opened, port:${httpPORT}`);
// app.use("/", (req, res) => {
//   res.status(503).send("Server shutting down");
// });

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use((req, res, next)=>{
  let {method, params} = req.body;
  // if(method && params && (cache.isCashed(params[0].data))){
  if(method && params && (params.indexOf('latest') <= -1)){
    cache.redisGet(req,res,next);
  }else{next();}
});

app.use("/", router);
app.use("/", (req, res) => {
  res.json("Not Found");
});

app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

process.on(`SIGINT`, async function () {
  ONLINE = false;
  console.log(`going to graceful shutdown`);
  const delay = 3000;
  console.log(`server going to stop in ${delay} ms`);
  wss.clients.forEach((socket) => {
    console.log(`sending websocket close signal...`);
    socket.close();
    socket.close();
  });

  setTimeout(() => {
    wss.clients.forEach((socket) => {
      if ([socket.OPEN, socket.CLOSING].includes(socket.readyState)) {
        socket.terminate();
      }
    });
    server.close(function () {
      console.log(`server closed`);
    });

    process.exit(0);
  }, delay);
});

module.exports = app;