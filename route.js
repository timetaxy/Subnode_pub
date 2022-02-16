const express = require("express");
const axios = require("axios");
const router = express.Router();
const sms = require("./sms.js");
const cache = require("./cache.js");
const env = require("./env.js");
var axios_instance = axios.create();
axios_instance.defaults.timeout = 2500;

const rpc_seeds  = env.mainnets;
const testnet_rpc_seeds = env.testnets;

const processProxy = async (req, res) => {
  // console.log(util.inspect(req));
  console.log(`= REQUEST ===================================================`);
  console.log(JSON.stringify(req.headers["content-type"]));
  console.log(JSON.stringify(req.method));
  console.log(JSON.stringify(req.body));
  console.log(`=============================================================`);

  let response;
  // res.json("Server maintenance, contact admin");
  for (const rpc_seed of env.mainnets) {
    console.log(`request : ${rpc_seed}`);
    response = await axios_instance({
      method: req.method,
      url: rpc_seed,
      data: req.body,
      Headers: req.headers["content-type"],
    }).catch((error) => {
      console.log(`request fail : ${rpc_seed}`);
      sms.slackSend(
        `[WARN] DELTA_BSC \n URI : ${rpc_seed}`,
        `REQ:${JSON.stringify(req.body)}, \n ERROR:${error}`
      );
      if (rpc_seed === rpc_seeds[rpc_seeds.length - 1]) {
        sms.slackSend(
          `[ERROR] DELTA_BSC \n URI : ALL`,
          `REQ:${JSON.stringify(req.body)}, \n ERROR:${error}`
        );
        // response = { error: { message: error }, data: "N/A" };
        // console.log("response test:", response);
      }
    });
    if (response) {
      console.log(
        `= RESPONSE ===================================================`
      );
      // console.log(util.inspect(response));
      console.log(response.status);
      console.log(
        `=============================================================`
      );
      break;
    }
  }

  //case: req err
  response = response
    ? response
    : { error: "Server maintenance, contact admin", data: "N/A" };
if(!cache.isNotCached(req.body.method, req.body.params)){
  cache.redisSet(cache.genK(req), response.data);
}
  //case: ws res=null
  res ? res.json(response.data) : null;

  //for ws
  return response.data;
};

const testnetProcessProxy = async (req, res) => {
  // console.log(util.inspect(req));
  console.log(`= REQUEST TESTNET ==========================================`);
  console.log(JSON.stringify(req.headers["content-type"]));
  console.log(JSON.stringify(req.method));
  console.log(JSON.stringify(req.body));
  console.log(`=============================================================`);

  let response;
  // res.json("Server maintenance, contact admin");
  for (const rpc_seed of testnet_rpc_seeds) {
    console.log(`request : ${rpc_seed}`);
    response = await axios_instance({
      method: req.method,
      url: rpc_seed,
      data: req.body,
      Headers: req.headers["content-type"],
    }).catch((error) => {
      console.log(`request fail : ${rpc_seed}`);
      slackSend(
        `[WARN] ERROR \n URI : ${rpc_seed}`,
        `REQ:${JSON.stringify(req.body)}, \n ERROR:${error}`
      );
      if (rpc_seed === rpc_seeds[rpc_seeds.length - 1]) {
        slackSend(
          `[ERROR] DOWN \n URI : ALL`,
          `REQ:${JSON.stringify(req.body)}, \n ERROR:${error}`
        );
        // response = { error: { message: error }, data: "N/A" };
        console.log("response test:", response);
      }
    });
    if (response) {
      console.log(
        `= RESPONSE TESTNET =========================================`
      );
      // console.log(util.inspect(response));
      console.log(response.status);
      console.log(
        `=============================================================`
      );
      break;
    }
  }

  //case: req err
  response = response
    ? response
    : { error: "Server maintenance, contact admin", data: "N/A" };

  //case: ws res=null
  res ? res.json(response.data) : null;

  //for ws
  return response.data;
};
router.get("/", function (req, res, next) {
  res.json("n/a");
});
router.post("/", async (req, res) => processProxy(req, res));
router.post("/testnet/", async (req, res) => testnetProcessProxy(req, res));
module.exports = { processProxy, router };