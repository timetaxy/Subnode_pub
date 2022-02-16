const WebSocket = require("ws");
const url = "ws://localhost:8546";
// const url = "ws://bsc.deltafinance.io/rpc";
const conn = new WebSocket(url);
const req = [
  { jsonrpc: "2.0", id: "1", method: "eth_blockNumber", params: [] },
  {
    id: 1,
    jsonrpc: "2.0",
    method: "eth_syncing",
    params: [],
  },
  {
    id: 1,
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: ["0x84737EcF888a958409A678be71F2131baFd05844", "latest"],
  },
  {
    id: 1,
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: ["0x84737EcF888a958409A678be71F2131baFd05844", "0x4"],
  },
];
// const req = { jsonrpc: "2.0", id: "1", method: "eth_blockNumber", params: [] };

conn.onopen = () => {
  conn.send(JSON.stringify(req));
};
conn.onerror = (error) => {
  console.log(`websocket error: ${error}`);
};
conn.onmessage = (e) => {
  console.log(e.data);
};
