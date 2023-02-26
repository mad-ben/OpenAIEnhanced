import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', async (req,res)=>{
  res.status(200).send({
      message: 'Hello from Jericho',
  })

const port = 3080;

app.post("/", async (req, res) => {
  const { message, currentModel, responceLeng, temp } = req.body;
  console.log(responceLeng);
  console.log(temp);
  const response = await openai.createCompletion({
    model: `${currentModel}`,
    prompt: `${message}`,
    max_tokens: parseInt(responceLeng),
    temperature: parseInt(temp),
  });
  res.json({
    message: response.data.choices[0].text,
  });
});

app.get("/models", async (req, res) => {
  const response = await openai.listModels();
  //console.log(response.data.data);
  res.json({
    models: response.data.data,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
