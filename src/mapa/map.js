//definir función de paleta de colores
function getColor(d) {
    return d > 1000 ? '#0c2c84' :
        d > 990 ? '#225ea8' :
            d > 980 ? '#1d91c0' :
                d > 970 ? '#41b6c4' :
                    d > 960 ? '#7fcdbb' :
                        d > 950 ? '#c7e9b4' :
                            d > 940 ? '#edf8b1' :
                                d > 900 ? '#ffffd9' :
                                    '#bdbdbd';
}

var map = L.map('map').
    setView([-33.568267, -70.685577],
        9);

L.tileLayer('	https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
}).addTo(map);

L.control.scale().addTo(map);

// ingresar geojson
// Tabla contenido
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    console.log(props)
    let description;
    if (props) {

    
    const gas93 = props.bencina93
            const gas95 = props.bencina95
            const gas97 = props.bencina97
            const diesel = props.diesel
            const comuna = props["NOM_COM"]
            const gas93Text = `Bencina 93: $ ${gas93} pesos`
            const gas95Text = `Bencina 95: $ ${gas95} pesos`
            const gas97Text = `Bencina 97: $ ${gas97} pesos`
            const dieselText = `Diesel: $ ${diesel} pesos`
            const comunaText = `Comuna: ${comuna}`
            const text = [comunaText, "Valores promedio:", gas93Text, gas95Text, gas97Text, dieselText]
            description = text.join("<br/>");
        }
    this._div.innerHTML = '<h4>Valores Combustibles</h4>' +  (props ?
        description
        : 'Mueva el cursor');
};

info.addTo(map); 

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update()
}
var geojson;

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties)
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

let myRequest = new Request("/src/mapa/results.json")

fetch(myRequest)
    .then(function (resp) {
        return resp.json();
    })
    .then(function (data) {
        geojson= L.geoJSON(data, {
            style: function (feature) {
                if (!feature.properties.bencina93) {
                    console.log(feature.properties["NOM_COM"])
                }
                return {
                    weight: 1,
                    opacity: 2,
                    color: 'white',
                    dashArray: '700',
                    fillOpacity: 0.77,
                    fillColor: getColor(feature.properties.bencina93)
                }
            },
            onEachFeature: onEachFeature
            
        }).bindPopup(function (layer) {
            const gas93 = layer.feature.properties.bencina93
            const gas95 = layer.feature.properties.bencina95
            const gas97 = layer.feature.properties.bencina97
            const diesel = layer.feature.properties.diesel
            const comuna = layer.feature.properties["NOM_COM"]
            const gas93Text = `Bencina 93: $ ${gas93} pesos`
            const gas95Text = `Bencina 95: $ ${gas95} pesos`
            const gas97Text = `Bencina 97: $ ${gas97} pesos`
            const dieselText = `Diesel: $ ${diesel} pesos`
            const comunaText = `Comuna: $ ${comuna}`
            const text = [comunaText, "Valores promedio:", gas93Text, gas95Text, gas97Text, dieselText]
            return text.join("<br/>");
        })
              
        .addTo(map);     
    })
    ;
//Leyenda
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
            grades = [940, 950, 960, 970, 980, 990, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);




