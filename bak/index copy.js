var express = require('express');
var axios = require('axios');
var router = express.Router();
var util = require('util');

var axios_instance = axios.create();
axios_instance.defaults.timeout = 2200;

const rpc_seeds = [
  // MAINNET
  // Recommend
  'https://bsc-dataseed.binance.org',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed1.ninicoin.io',
  // Backups
  'https://bsc-dataseed2.defibit.io',
  'https://bsc-dataseed3.defibit.io',
  'https://bsc-dataseed4.defibit.io',
  'https://bsc-dataseed2.ninicoin.io',
  'https://bsc-dataseed3.ninicoin.io',
  'https://bsc-dataseed4.ninicoin.io',
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
  'https://bsc-dataseed4.binance.org'
];
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/', async (req, res) => {
  // console.log(util.inspect(req));
  console.log(`= REQUEST ===================================================`);
  console.log(JSON.stringify(req.headers['content-type']));
  console.log(JSON.stringify(req.method));
  console.log(JSON.stringify(req.body));
  console.log(`=============================================================`);

  let response;
  for (const rpc_seed of rpc_seeds) {
    try {
      console.log(`request : ${rpc_seed}`);
      response = await axios_instance({ method: req.method, url: rpc_seed, data: req.body, Headers: req.headers['content-type'] });
      break;
    } catch (error) {
      console.log(`request fail : ${rpc_seed}`);
      if (rpc_seed === rpc_seeds[rpc_seeds.length - 1]) {
        response = { error: { message: error } };
      };
      continue;
    }
  }

  console.log(`= RESPONSE ===================================================`);
  // console.log(util.inspect(response));
  console.log(response.status);
  console.log(`=============================================================`);
  res.json(response.data);
});
module.exports = router;