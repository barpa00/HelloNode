import express from 'express'
import Datastore from 'nedb'
import fetch from 'node-fetch';
import dotenv from 'dotenv'

if (!globalThis.fetch) {
	globalThis.fetch = fetch;
}
dotenv.config()

const app = express();
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(` start at ${port} `)
});

// 建立名為 database.db 的檔案
const database = new Datastore("database.db")
const weatherdata = new Datastore("weatherdata.db")
// 如果沒有就創建 有就把資料存進去
database.loadDatabase()
weatherdata.loadDatabase()

// 可以獲取在 public 資料夾裡的檔案
app.use(express.static('public'));
app.use(express.json({limit: "1mb"}))


// route
// 存 database 路徑 
app.post("/api", (req, res) => {
  const data = req.body
  const timestamp = Date.now()
  data.timestamp = timestamp
  database.insert(data);
})

// 存 weather 路徑
app.post("/weather_api", (req, res) => {
  const data = req.body
  weatherdata.insert(data)
  res.json(data)
})

// 取得 weatherdata 全部資料的路徑
app.get("/weather_api", (req, res) => {
  weatherdata.find({}, (err,data) => {
    if(err){
      res.end()
      return
    }
    res.json(data)
  })
})

// 取得 database 全部資料的路徑
app.get("/api", (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end()
      return
    }
    res.json(data)
  })
})

// 取得天氣資料的路徑 代理服務器??
// :latlon 丟過來的 params 
app.get("/weather/:latlon", async (req, res) => {
  const latlon = req.params.latlon.split(",")
  const lat = latlon[0]
  const lon = latlon[1]
  //取得天氣溫度
  const api_key = process.env.API_KEY
  const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
  const weather_response = await fetch(weather_url)
  const weather_data = await weather_response.json()
  //取得空氣指數
  const aq_url=`https://docs.openaq.org/v2/latest?limit=100&page=1&offset=0&sort=desc&coordinates=${lat}%2C${lon}&radius=1000&order_by=lastUpdated&dumpRaw=false`
  const aq_response = await fetch(aq_url)
  const aq_data = await aq_response.json()
  
  // 兩個數據源 => 物件傳送
  const data = {
    weather: weather_data,
    aq: aq_data
  }
  res.json(data)

})