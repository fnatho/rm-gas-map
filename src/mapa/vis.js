let rmLink = './src/mapa/results.json"'

let rmData


let canvas = d3.select('#canvas')

let drawMap = () => {

}
console.log(d3.json(rmLink))


//Fetch Data
d3.json(rmLink).then(
    (data, error) => {
        if (error) {
            console.log(error)
        } else {
            rmData = data
            console.log('RM Data')
            console.log(rmData)


            drawMap()


        }
    }
)

// Understanding the data we need
/*
countyData = data
countyData = topojson.feature(countyData, countyData.objects.counties)
console.log('County Data')
console.log(countyData)

countyData = topojson.feature(countyData, countyData.objects.counties).features

// My choropleth should have counties with a corresponding class="county" that represent the data
canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')

        // Fill Coloro

        .attr('fill', (item) => {
            let fips = item['id']
            let county = educationData.find((county) => {
                return county['fips'] === fips
            })
            let percentage = county['bachelorsOrHigher']
            if (percentage <= 15){
                return 'tomato'
            }else if (percentage <= 30){
                return 'orange'
            } else if (percentage <= 45){
                return 'lightgreen'
            } else {
                return 'limegreen'
            }
          })

          //My counties should each have data-fips and data-education properties containing their corresponding fips and education values

          .attr('data-fips', (item) => {
            return item['id']
        })
        .attr('data-education', (item) => {
            let fips = item['id']
            let county = educationData.find((county) => {
                return county['fips'] === fips
            })
            let percentage = county['bachelorsOrHigher']
            return percentage
        })

*/

