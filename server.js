const express = require("express");
const bodyParser = require("body-parser");
const { parseIntent, handleIntent } = require("./intent");
const { sendMessageToWhatsApp } = require("./twilio");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/whatsapp", async (req, res) => {
  const msg = req.body.Body;
  const from = req.body.From;

  const intent = await parseIntent(msg);
  const result = await handleIntent(intent);

  await sendMessageToWhatsApp(from, result);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("AgentLink backend running on port 3000");
});
