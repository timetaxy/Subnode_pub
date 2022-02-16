const redis = require("redis");
const sms = require("./sms.js")
const REDIS_PORT = 6379;
const REDIS_EX = 86400 * 30;
const redisClient = redis.createClient(REDIS_PORT);
const filter = {
  signature : { "0x18160ddd":"totalSupply", "0xd4c3eea0":"totalValue" },
  methods : ["eth_blockNumber"],
  params : ["latest"]
};

redisClient.on("error", function (error) {
  console.error(`Redis Error: ${error}`);
  sms.slackSend(`[ERROR] DELTA_BSC REDIS DOWN`);
});

redisClient.on("ready", () => {
  console.log('redis have ready !');
});

redisClient.on("connect", () => {
  console.log('connect redis success !');
});

const init = ()=>{
  redisClient.connect().then().catch();
}

const redisSet = async (k,v)=>{
  console.log(`cache save, id:${k}, val:${JSON.stringify(v).substring(0,80)}...`);
  redisClient.set(k, JSON.stringify(v));
  redisClient.expire(k, REDIS_EX);
};
const redisGet = async (req, res, next)=>{
  const k = genK(req);
  const data = await new Promise(async (res,rej)=>{
    setTimeout(()=>{ res(null); }, 100);
    res(await redisClient.get(k));
  });
  const logging=data?data.substring(0,80):null;
  console.log(`cache loaded, id:${k}, val:${logging}...`);
  data !== null ? res.send(JSON.parse(data)):next();
};
const genK = (req)=>{
  let {method, params} = req.body;
  // const k = method + params[0].data + params[0].to + params[1];
  const k = JSON.stringify(method) + JSON.stringify(params);
  console.log('key:',k);
  return k;
};
const isNotCached = (method, params) => {
// console.log(params[0] === undefined);
// console.log(filter.methods.indexOf(method) > -1);
// console.log(filter.params.indexOf(params[0]) > -1);
// console.log(filter.params.indexOf(params[1]) > -1);
// console.log(params[0].data && !(params[0].data in filter.signature));
return (params[0] === undefined) ||
        (filter.methods.indexOf(method) > -1) ||
        (filter.params.indexOf(params[0]) > -1) ||
        (filter.params.indexOf(params[1]) > -1)
;
};
module.exports= {init, redisGet, redisSet, genK, isNotCached};