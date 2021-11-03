// Cargar las librerías
const { log } = require("console"); // Para mensajes por consola (terminal)
const fs = require("fs"); // Para lecturas/escrituras de archivos
const path = require("path"); // Para acceso a directorios
const axios = require("axios").default; // Para acceso a API

// Crea función que consultará a la API
async function callAPI(URL) {
    return await axios.get(URL)
}

// Definir los datos de la API origen
const API_KEY = '?auth_key=Nx0G4vwDelj6TAPOkrhNOqUHQJnSVFjh8Btfkh54'
const API_URL = `https://api.desarrolladores.energiaabierta.cl/bencina-en-linea/v1/combustibles/vehicular/estaciones.json/${API_KEY}`;



// Definir parámetros de consulta
const REGISTRIES = 5000 // Registros a obtener por petición
var PAGE = 1 // Registros a obtener por petición
var API_URL_FILTERS = `${API_URL}&limit=${REGISTRIES}`

console.log(API_URL_FILTERS)


log("Dirección API:", API_URL_FILTERS);
log(API_KEY);

// Definir objeto JSON vacío para salida
let output_headers = {};
let output_data = {};


const mainfunction = async () => {
const response = await callAPI(API_URL_FILTERS)
const cleanResponse = response.data.replace(/\t/g,"")
fs.writeFile("./output/energia-rm.json", cleanResponse, () => {});
const fileData = require('./output/energia-rm.json')
const parsedData= JSON.parse(fileData)



//fs.writeFile("./output/energia-rm.json", JSON.stringify(output_data),() => {});
fs.writeFile("./output/energia-rm.json", response.data, () => {});
console.log(typeof response.data)
console.log(JSON.parse(response.data).headers) 
} 
mainfunction()
