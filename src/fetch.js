const fs = require("fs"); // Para lecturas/escrituras de archivos

const geojson = require("./mapa/geo.json")
console.log(geojson)

const energiarm = require("./mapa/energia-rm.json")
console.log(energiarm)

const { features } = geojson
console.log(features[0].properties)
const parsedfeatures = features.map((feature) => {
    const comuneToFind = feature.properties.NOM_COM
    const matchComune = energiarm.find((comuneinfo) => {
        return comuneinfo.NOM_COM === comuneToFind
    }
    )
feature.properties = {
    ...feature.properties,...matchComune
}
return feature
}
)
geojson.features = parsedfeatures 
fs.writeFileSync("./results.json", JSON.stringify(geojson));
