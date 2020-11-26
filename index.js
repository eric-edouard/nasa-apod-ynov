

const axios = require('axios').default;
const express = require('express')
const data = require("./data.json")
const app = express()
const port = process.env.PORT || 3000

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

app.get('/', (req, res) => {
  const date = req.query.date
  if (!date || date === "") {
      res.send(data[formatDate(new Date())])
      return
  }

  if (data[date]) {
    res.send(data[date])
    return
  }

  console.log("will fetch to real api...")
  axios.get(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=DEMO_KEY`)
    .then(_res => {
      const _data = _res.data
      console.log("_data is", JSON.stringify(_data))
      data[date] = _data
      res.send(_data)
      return _data
    })
    .catch(e => {
      console.log("got error ", e)
      res.sendStatus(404)
    })
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})