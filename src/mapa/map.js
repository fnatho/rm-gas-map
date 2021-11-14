//definir función de paleta de colores
function getColor(d) {
    return d > 1000 ? '#014636' :
        d > 990 ? '#016c59' :
            d > 980 ? '#02818a' :
                d > 970 ? '#3690c0' :
                    d > 960 ? '#67a9cf' :
                        d > 950 ? '#a6bddb' :
                            d > 940 ? '#d0d1e6' :
                                d > 900 ? '#ece2f0' :
                                    '#bdbdbd';
}

console.log(123)
var map = L.map('map').
    setView([-33.732247, -70.715594],
        9);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
}).addTo(map);

L.control.scale().addTo(map);

// ingresar geojson

let myRequest = new Request("/src/mapa/results.json")

fetch(myRequest)
    .then(function (resp) {
        return resp.json();
    })
    .then(function (data) {
        L.geoJSON(data, {
            style: function (feature) {
                if (!feature.properties.bencina93) {
                    console.log(feature.properties["NOM_COM"])
                }
                return {
                    weight: 1,
                    opacity: 2,
                    color: 'black',
                    dashArray: '30',
                    fillOpacity: 0.77,
                    fillColor: getColor(feature.properties.bencina93)
                };
            }
        }).bindPopup(function (layer) {
            const gas93 = layer.feature.properties.bencina93
            const gas95 = layer.feature.properties.bencina95
            const gas97 = layer.feature.properties.bencina97
            const diesel = layer.feature.properties.diesel
            const comuna = layer.feature.properties["NOM_COM"]
            const gas93Text = `Bencina 93: ${gas93}`
            const gas95Text = `Bencina 95: ${gas95}`
            const gas97Text = `Bencina 97: ${gas97}`
            const dieselText = `Diesel: ${diesel}`
            const comunaText = `Comuna: ${comuna}`
            const text = [comunaText, gas93Text, gas95Text, gas97Text, dieselText]
            return text.join("<br/>");
        })
        
        
        .addTo(map);

    })
    ;