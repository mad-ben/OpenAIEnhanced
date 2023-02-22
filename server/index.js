import { Configuration, OpenAIApi } from "openai";
//const { Configuration, OpenAIApi } = require("openai")
import express from 'express';
//const express = require('express')
//const bodyParser = require('body-parser')
import bodyParser from "body-parser";
//const cors = require('cors')
import cors from 'cors';

const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);

//const response = await openai.listEngines();

//Create a simple express api that calls the function above


const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = 3080

app.post('/', async (req, res) => {
    const { message, currentModel } = req.body;
    console.log(message)
    const response = await openai.createCompletion({
        model: `${currentModel}`,
        prompt: `${message}`,
        max_tokens: 100,
        temperature: 0.5,
      });
      res.json({
        message: response.data.choices[0].text
      })
});

app.get('/models', async (req, res) => {
    const response = await openai.listModels();
    console.log(response.data.data)
    res.json({
        models: response.data.data
      })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});