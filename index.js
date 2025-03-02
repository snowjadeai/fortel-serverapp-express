const cors = require('cors')
const OpenAI = require('openai')
const express = require('express')

const { calculateDestinyBoard, calculateNatalChart } = require('./calculate.js')

const app = express()
const openai = new OpenAI()
const port = 3000

app.use(
  cors({
    origin: process.env.REACT_APP_ENDPOINT,
  })
)

app.get('/', async (req, res) => {
  // takes in the birth date input and store it into a variable
  const birthDateString = req.query?.date

  // ternary conditional operator
  // if the input is empty, use today's date => new Date()
  // if its not empty, load it into a date object => new Date(birthDateString)
  const date = birthDateString ? new Date(birthDateString) : new Date()

  // call the astrology functions
  const natalChart = calculateNatalChart(date)
  const destinyBoard = calculateDestinyBoard(date)

  const stream = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    stream: true,
    messages: [
        {
          role: "system", 
          content: `
            You are a Cross-Cultural Astrologer. A Bazi Master and also a Famous Western Astrologist.
            Your customers consult you only because you give them interpretation about both astrology systems.
          `
        },
        {
            role: "user",
            content: `
              Given a customer with the following:
                - destiny board: """${destinyBoard}"""
                - natal chart: """${natalChart}"""
              Start your response by explaining that you are finding the overlaping intepretations from both western and chinese astrology
              Intepret the person's fortune for 2025 in 5 aspect of life. Career, Health, Family, Romance and Finance.
              Be sure to talk about overlaps in both astrology systems.
              Explain the intepretation as if the listener does not know anything about astrology.
              Give your response fully in English, translate and type in phonetics if neccesary.
              Limit your response to 150 words.
              At the end of your response, summarize the intepretation in 5 aspects of life in ratings out of 10.
              Example summary below:
              - Career: 8/10
              - Health: 3/10
              - Family: 6/10
              - Romance: 2/10
              - Finance: 5/10
            `,
        },
    ],
  });
  
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  for await (const chunk of stream) {
    res.write(Buffer.from(chunk.choices[0]?.delta?.content || "", "utf-8"));
  }
  res.end();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
