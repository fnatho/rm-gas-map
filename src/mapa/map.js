var map = L.map('map').
    setView([-33.4534628, -70.7493761],
        11);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
}).addTo(map);

L.control.scale().addTo(map);
const marker = L.marker([-33.4534628, -70.7493761], { draggable: true })
marker.bindPopup('sada')
marker.addTo(map);


var aa = [[
    -70.541796,
    -33.387349
],
[
    -70.53734,
    -33.385364
],
[
    -70.534942,
    -33.384142
],
[
    -70.533885,
    -33.383816
],
[
    -70.532351,
    -33.382168
]];

const parsedcoordinates = aa.map(([a, b]) => [b, a])

//Mensaje tipo al presionar el polígono a ó parsedcoodinates
const poly = L.polygon(parsedcoordinates, { color: 'red' })
poly.bindPopup('Freddy')
poly.addTo(map);


// ingresar geojson
let myRequest = new Request(".src/mapa/results.json")

console.log(myRequest)
fecth(myRequest)
    .then(function (resp) {
        return resp.json();
    })
    .then(function (data) {
        console.log(data)
    })
    ;
L.geoJSON(data, {
    style: function (feature) {
        return { color: feature.properties.color };
    }
}).bindPopup(function (layer) {
    return layer.feature.properties.description;
}).addTo(map);

