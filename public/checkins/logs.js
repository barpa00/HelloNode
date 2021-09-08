const mymap = L.map('issMap').setView([0, 0], 2);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {
  attribution
});
tiles.addTo(mymap);

getdata()
async function getdata() {
  const response = await fetch('/weather_api')
  const data = await response.json()

  let latlngs = []

  for (item of data) {
    let latlng = [ item.lat, item.lon ]
    latlngs.push(latlng)
    
    let text = `
    ${ item.lat } ${ item.lon }
    ${ item.temp }
    `
    if (item.airdata.value < 0) {
      text += ` NO air quality reading. `
    } else {
      text += `
      ${ item.airdata.parameter } ${ item.airdata.value }
      ${ item.airdata.unit } ${ item.airdata.lastUpdated } 
      `
    }
    const marker = L.marker([item.lat, item.lon]).addTo(mymap)
    const polyline = L.polyline(latlngs, {color: 'deeppink'}).addTo(mymap);
    marker.bindPopup(text)
  }
}