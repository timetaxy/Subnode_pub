const Slack = require("slack-node");
const env = require("./env.js");
const slack = new Slack();
  const webhookUri =env.slack;
slack.setWebhook(webhookUri);
const slackSend = async (header, msg) => {
  slack.webhook(
    {
      // channel:"#general",
      username: "NODE_WATCHER",
      text: header,
      attachments: [
        {
          color: "#D00000",
          fields: [
            {
              value: msg,
              short: false,
            },
          ],
        },
      ],
    },
    function (err, res) {
      // console.log(res);
    }
  );
};
module.exports={slackSend}