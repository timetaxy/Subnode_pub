const express = require("express");
const axios = require("axios");
const router = express.Router();
const Slack = require("slack-node");

const slack = new Slack();
const webhookUri =
  "https://hooks.slack.com/services/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";
slack.setWebhook(webhookUri);
const slackSend = async (msg) => {
  slack.webhook(
    {
      // channel:"#general",
      username: "BSC node operator",
      text: msg,
    },
    function (err, res) {
      // console.log(res);
    }
  );
};
// send();

// var util = require("util");

var axios_instance = axios.create();
axios_instance.defaults.timeout = 2200;

const rpc_seeds = [
  // MAINNET
  "https://speedy-nodes-nyc.moralis.io/ccf0bc8d5c592d2563a371f0/bsc/mainnet/archive",
  // Recommend
  // "https://bsc-dataseed.binance.org",
  // "https://bsc-dataseed1.defibit.io",
  // "https://bsc-dataseed1.ninicoin.io",
  // Backups
  // "https://bsc-dataseed2.defibit.io",
  // "https://bsc-dataseed3.defibit.io",
  // "https://bsc-dataseed4.defibit.io",
  // "https://bsc-dataseed2.ninicoin.io",
  // "https://bsc-dataseed3.ninicoin.io",
  // "https://bsc-dataseed4.ninicoin.io",
  // "https://bsc-dataseed1.binance.org",
  // "https://bsc-dataseed2.binance.org",
  // "https://bsc-dataseed3.binance.org",
  // "https://bsc-dataseed4.binance.org",
];

const testnet_rpc_seeds = [
  "https://speedy-nodes-nyc.moralis.io/ccf0bc8d5c592d2563a371f0/bsc/testnet/archive",
];

const processProxy = async (req, res) => {
  // console.log(util.inspect(req));
  console.log(`= REQUEST ===================================================`);
  console.log(JSON.stringify(req.headers["content-type"]));
  console.log(JSON.stringify(req.method));
  console.log(JSON.stringify(req.body));
  console.log(`=============================================================`);

  let response;
  // res.json("Server maintenance, contact admin");
  for (const rpc_seed of rpc_seeds) {
    console.log(`request : ${rpc_seed}`);
    response = await axios_instance({
      method: req.method,
      url: rpc_seed,
      data: req.body,
      Headers: req.headers["content-type"],
    }).catch((error) => {
      console.log(`request fail : ${rpc_seed}`);
      slackSend(
        `[WARN] BSC_NODE_DOWN, \n URI : ${rpc_seed}, \n REQ:${JSON.stringify(
          req.body
        )}, \n ERROR:${error}`
      );
      if (rpc_seed === rpc_seeds[rpc_seeds.length - 1]) {
        slackSend(
          `[ERROR] BSC_NODE_DOWN, \n URI : ALL, \n REQ:${JSON.stringify(
            req.body
          )}, \n ERROR:${error}`
        );
        // response = { error: { message: error }, data: "N/A" };
        console.log("response test:", response);
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
        `[WARN] BSC_NODE_DOWN, \n URI : ${rpc_seed}, \n REQ:${JSON.stringify(
          req.body
        )}, \n ERROR:${error}`
      );
      if (rpc_seed === rpc_seeds[rpc_seeds.length - 1]) {
        slackSend(
          `[ERROR] BSC_NODE_DOWN, \n URI : ALL, \n REQ:${JSON.stringify(
            req.body
          )}, \n ERROR:${error}`
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
// module.exports = (router, processProxy);
module.exports = { processProxy, router };
