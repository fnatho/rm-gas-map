let rmLink = 'node src/mapa/geo.json"'
let gasLink = 'src/mapa/energia-rm.json"'

let rmData
let gasData


let canvas = d3.select('#canvas')

let drawMap = () => {

}
console.log(d3.json(rmLink))

d3.json(rmLink).then(
    (data, error) => {
        if (error) {
            console.log(log)
        } else {
            rmData = data
            console.log(rmData)

            d3.json(gasLink).then(
                (data, error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        gasData = data
                        console.log(gasData)
                    }
                }
            )

        }
    }
)