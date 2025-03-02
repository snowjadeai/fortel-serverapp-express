const express = require('express')

const { calculateDestinyBoard, calculateNatalChart } = require('./calculate.js')

const app = express()
const port = 3000

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

  res.send({
    natalChart,
    destinyBoard,
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
