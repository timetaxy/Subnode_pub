module.exports = {
  apps: [
    {
      script: "index.js",
      instances: "max",
      exec_mode: `cluster`,
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
    },
  ],
};
