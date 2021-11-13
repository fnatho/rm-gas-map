// Cargar las librerías
const { log } = require("console"); // Para mensajes por consola (terminal)
const fs = require("fs"); // Para lecturas/escrituras de archivos
const path = require("path"); // Para acceso a directorios
const XLSX = require("xlsx"); // Para manejo de archivos Excel (XLS, XLSX)
const createCsvWriter = require('csv-writer').createObjectCsvWriter; // Para generar archivo CSV

// Definir archivo de origen
let rawdata = fs.readFileSync('output/energia.json');
let hoja_json = JSON.parse(rawdata)["data"];


// Definir filtros
const REGION = "Metropolitana de Santiago";
const COMMUNES = ["Santiago Centro", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", 
                "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", 
                "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango",
                "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor", ];

// Definir la GEO-Posición por comuna
 /*const GEO = {
    "VALPARAISO": [-33.0438639, -71.6023175],
    "PETORCA": [-32.25123, -70.9408742],
    "LA LIGUA": [-32.4501874, -71.2418708],
    "QUILLOTA": [-33.0156341, -71.5468906],
    "LOS ANDES": [-32.83204, -70.6145295],
    "MARGA MARGA": [-33.0816332, -71.3825493],
};
*/

// Preparar variable donde se mantendrá la transformación, en formato JSON
var output_data = {} // Objeto Arreglo "vacío", es decir sin datos

// Ciclo para recorrer todas las filas de la hoja

for (let idx = 0; idx < hoja_json.length; idx++) {
    /*
    obs: al recorrer cada fila, está se referencia por la variable "idx"
  
    Extraer datos de acuerdo a filtros:
      - REGION
      - COMUNAS
    */
    let region_hoja = hoja_json[idx][8]; // Obtiene el valor de la columna REGION
    let comuna_hoja = hoja_json[idx][6]; // Obtiene el valor de la columna COMUNA
  

    // Validar condición que la fila leida coincida con los filtros requeridos.
    // Ya que la variable COMMUNES es un arreglo, se una un método para validar.
    if (region_hoja == REGION && COMMUNES.indexOf(comuna_hoja) > -1) {

        // log("Datos en Hoja para [" + REGION + " - " + COMMUNES + "]", hoja_json[idx]);

        // Obtener el registro desde la variable donde se mantendrá la transformación
        let data_comuna =  output_data[comuna_hoja];
        
        let gas_93 = parseInt(hoja_json[idx][14]);
        let gas_95 = parseInt(hoja_json[idx][17]);
        let gas_97 = parseInt(hoja_json[idx][15]);
        let diesel = parseInt(hoja_json[idx][16]);

        if (!gas_93) gas_93 = 0;
        if (!gas_95) gas_95 = 0;
        if (!gas_97) gas_97 = 0;
        if (!diesel) diesel = 0;

        if (data_comuna) {
            // Si existe el registro, se aumentan los contadores
            data_comuna['DATA']['Gasolina 93 $/L'] += gas_93;
            data_comuna['DATA']['Gasolina 95 $/L'] += gas_95;
            data_comuna['DATA']['Gasolina 97 $/L'] += gas_97;
            data_comuna['DATA']['Petróleo Diesel $/L'] += diesel;
            data_comuna['DATA']['Entries93'] += (gas_93 > 0) ? 1 : 0;
            data_comuna['DATA']['Entries95'] += (gas_95 > 0) ? 1 : 0;
            data_comuna['DATA']['Entries97'] += (gas_97 > 0) ? 1 : 0;
            data_comuna['DATA']['EntriesDiesel'] += (diesel > 0) ? 1 : 0;
        } else {
            // Al no existir registro, se establece los contadores
            data_comuna = {};
            data_comuna['COMUNA'] = hoja_json[idx][6];
            data_comuna['DATA'] = {};
            data_comuna['DATA']['COMUNA'] = hoja_json[idx][6];
            data_comuna['DATA']['Gasolina 93 $/L'] = gas_93;
            data_comuna['DATA']['Gasolina 95 $/L'] = gas_95;
            data_comuna['DATA']['Gasolina 97 $/L'] = gas_97;
            data_comuna['DATA']['Petróleo Diesel $/L'] = diesel;
            data_comuna['DATA']['Entries93'] = (gas_93 > 0) ? 1 : 0;
            data_comuna['DATA']['Entries95'] = (gas_95 > 0) ? 1 : 0;
            data_comuna['DATA']['Entries97'] = (gas_97 > 0) ? 1 : 0;
            data_comuna['DATA']['EntriesDiesel'] = (diesel > 0) ? 1 : 0;
        }


        // Se almacena en la variable la información procesada
        output_data[comuna_hoja] = data_comuna;
    }
}

// Muestra por consola el contenido de información procesada
log("Data de Salida", output_data);

/*
Generar archivo JSON
*/
// Definir archivo de salida (JSON)
//const json_file = path.resolve("output/energia-rm.json");
// Guardar en JSON los datos transformados 
//fs.writeFileSync(json_file, JSON.stringify(output_data));

//CALCULO DEL PROMEDIO DE VALOR DE BENCINA
// Primero convierto el objeto de energia-rm a un arreglo de objetos. De esta forma 
/*
[
    {
    "COMUNA": "Santiago Centro",
    "DATA": {
        "COMUNA": "Santiago Centro",
        "Gasolina 93 $/L": 31013,
        "Gasolina 95 $/L": 31864,
        "Gasolina 97 $/L": 32681,
        "Petróleo Diesel $/L": 24224,
        "Entries": 33
    },
    {"COMUNA": ...
    ....
},
...
] */

const communesValues = Object.values(output_data)
// se aplica método map para este arreglo de objetos. Lo que va dentro del map es una función
// que aplica para cada objeto del arreglo
const communesMeans = communesValues.map((element)=> {
    const means = {
        "bencina93": 0,
        "bencina95": 0,
        "bencina97": 0,
        "diesel": 0,
    }
    const comuna = element.COMUNA
    const entries93 = element.DATA.Entries93
    const entries95 = element.DATA.Entries95
    const entries97 = element.DATA.Entries97
    const entriesdiesel = element.DATA.EntriesDiesel

    const mean93 = Math.trunc(element.DATA["Gasolina 93 $/L"]/element.DATA["Entries93"])
    const mean95 = Math.trunc(element.DATA["Gasolina 95 $/L"]/element.DATA["Entries95"])
    const mean97 = Math.trunc(element.DATA["Gasolina 97 $/L"]/element.DATA["Entries97"])
    const meanDiesel = Math.trunc(element.DATA["Petróleo Diesel $/L"]/element.DATA["EntriesDiesel"])
    means.NOM_COM = comuna
    means.Entries93 = entries93
    means.Entries95 = entries95
    means.Entries97 = entries97
    means.EntriesDiesel = entriesdiesel

    means["bencina93"] = mean93
    means["bencina95"] = mean95
    means["bencina97"] = mean97
    means["diesel"] = meanDiesel
    return means
})
console.log(communesMeans)

// Definir archivo de salida (JSON)
const json_file = path.resolve("src/mapa/energia-rm.json");
// Guardar en JSON los datos transformados 
fs.writeFileSync(json_file, JSON.stringify(communesMeans));