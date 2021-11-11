var map = L.map('map').
setView([-33.4534628, -70.7493761], 
11);
 
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
}).addTo(map);

L.control.scale().addTo(map);
const marker = L.marker([41.66, -4.71], {draggable: true})
marker.bindPopup('sada')
marker.addTo(map);

var latlngs = [[41.6, -4.7],[41.6, -4.7],[41.5, -4.5],[41.7, -4.81]];
const poly = L.polygon(latlngs, {color: 'red'})
poly.bindPopup('ladjksaklda')
poly.addTo(map);