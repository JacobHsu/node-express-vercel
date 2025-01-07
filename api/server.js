require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const expressip = require("express-ip");
app.use(express.json());
app.use(cors());
app.use(expressip().getIpInfoMiddleware);

const API_KEY = process.env.API_KEY;

app.get("/", (req, res) => res.send("Express on Vercel"));

app.post("/completions", async (req, res) => {
  // https://platform.openai.com/docs/api-reference/chat/create
  // https://platform.openai.com/docs/models#model-endpoint-compatibility

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", //gpt-4o-mini
      messages: [{ role: "user", content: req.body.message }],
      max_tokens: 100,
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    const ipInfo = req.ipInfo;
    res.send({ ...data, ipInfo });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
