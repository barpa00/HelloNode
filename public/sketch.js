    let lat, lon, temp, airdata;
    const button = document.getElementById('submit');
    button.addEventListener('click', async event => {
      const vegetable = document.getElementById('vegetable').value;
      const data = {
        lat,
        lon,
        vegetable
      };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      const res = await fetch('/api', options);
      // const json = await res.json();
      document.getElementById('vegetable').value = " "
    });

    // 抓取使用者的位址
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async position => {
        try {
          lat = position.coords.latitude.toFixed(2)
          lon = position.coords.longitude.toFixed(2)

          document.getElementById('latitude').textContent = lat;
          document.getElementById('longitude').textContent = lon;
          // const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2425706abdb78c02ccd90804c6890f1a`
          // ${lat},${lon} params 丟過去
          const api_url = `/weather/${lat},${lon}`
          const response = await fetch(api_url)
          const json = await response.json()
          temp = json.weather.main.temp
          // 取得溫度值渲染畫面
          document.querySelector("#temp").textContent = temp

          // 判斷是否有有 aq results 值
          // if ( json.aq.results.length !== 0){
          const air = json.aq.results[0].measurements
          // 取得最新的 pm25 
          airdata = air.filter(arry => arry.parameter = "pm25")[0]
          const p = document.createElement("p")
          p.innerHTML = `
            ${airdata.parameter} 
            ${airdata.value} 
            ${airdata.unit} 
            ${airdata.lastUpdated} 
          `
          document.querySelector(".data_content").append(p)
          // }

        } catch {
          // 若沒有 aq 資料存 -1
          airdata = { value: -1}
          const p = document.createElement("p")
          p.innerHTML = `NO READING!!!!`
          document.querySelector(".data_content").appendChild(p)
        }
          // 存 weather 資料
          const data = { lat, lon, temp, airdata };
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          };
          const aq_res = await fetch('/weather_api', options);
          const aq_json = await aq_res.json();
          console.log(aq_json)
      })
    } else {
      console.log("geolocation not available")
    }