const estacionesLink = "https://api.desarrolladores.energiaabierta.cl/bencina-en-linea/v1/combustibles/vehicular/estaciones.json/?auth_key=Nx0G4vwDelj6TAPOkrhNOqUHQJnSVFjh8Btfkh54"
const columnNames = [
    "ID",
    "Última Actualización",
    "Razón Social",
    "Calle",
    "Número",
    "ID Comuna",
    "Comuna",
    "ID Región",
    "Región",
    "Horario de Atención",
    "Distribuidor",
    "Distribuidor Logo",
    "Distribuidor Logo SVG",
    "Distribuidor Logo SVG Horizontal",
    "Gasolina 93 $/L",
    "Gasolina 97 $/L",
    "Petróleo Diesel $/L",
    "Gasolina 95 $/L",
    "GLP Vehicular $/m3",
    "GNC $/m3",
    "Latitud",
    "Longitud",
    "Tienda",
    "Farmacia",
    "Mantención",
    "Autoservicio",
    "Pago Efectivo",
    "Cheque",
    "Tarjetas Bancarias",
    "Tarjeta Grandes Tiendas"
]

console.log(columnNames)


const communeSummary = {
    Iquique: {
        totalValue: "10800",
        count: 11
    },
    Antofa: {
        totalValue: "11800",
        count: 12
    }
}
const main = async () => {
    const response = await axios(estacionesLink)
    console.log(Object.keys(response.data))

    console.log("largo arreglo", response.data.data.lenght)

    response.data.data.forEach((element) => {
        const currentCommune = element[6]
        const currentValue = element[14]
        console.log(currentCommune, currentValue)
    })
}

main