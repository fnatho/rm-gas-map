var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var svg = d3.select("body")
    .append("svg")
    .style("cursor", "move");

svg.attr("viewBox", "50 10 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMin");

var zoom = d3.zoom()
    .on("zoom", function () {
        var transform = d3.zoomTransform(this);
        map.attr("transform", transform);
    });

svg.call(zoom);

var map = svg.append("g")
    .attr("class", "map");

d3.queue()
    .defer(d3.json, "src/mapa/geo.json")
    .defer(d3.json, "src/mapa/energia-rm.json")
    .await(function (error, rm, data) {
        if (error) {
            console.error('Oh dear, something went wrong: ' + error);
        }
        else {
            drawMap(rm, data);
        }
    });

function drawMap(rm, data) {
    // geoMercator projection
    var projection = d3.geoMercator() //d3.geoOrthographic()
        .scale(130)
        .translate([width / 2, height / 1.5]);

    // geoPath projection
    var path = d3.geoPath().projection(projection);

    //colors for population metrics
    var color = d3.scaleThreshold()
        .domain([750, 800, 850, 900, 950, 1000, 1050, 1100, 1150])
        .range(["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"]);

    var features = topojson.feature(rm, rm.features).features;
    var GasValue = {};

    data.forEach(function (d) {
        GasValue[d.NOM_COM] = {
            bencina93 =+d.bencina93,
            bencina95 =+d.bencina95,
            bencina97 =+d.bencina97,
            diesel  =+d.diesel,
            }
    });
    features.forEach(function (d) {
        d.details = GasValue[d.NOM_COM] ? GasValue[d.NOM_COM] : {};
    });

    map.append("g")
        .selectAll("path")
        .data(features)
        .enter().append("path")
        .attr("NOM_COM", function (d) {
            return d.NOM_COM;
        })
        .attr("COD_COMUNA", function (d) {
            return d.COD_COMUNA;
        })
        .attr("d", path)
        .style("fill", function (d) {
            return d.details && d.details.bencina93 ? color(d.details.bencina93) : undefined;
        })
        .on('mouseover', function (d) {
            d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", 1)
                .style("cursor", "pointer");

            d3.select(".NOM_COM")
                .text(d.properties.NOM_COM);

            d3.select(".bencina93")
                .text(d.details && d.details.bencina93 && "Female " + d.details.bencina93 || "¯\\_(ツ)_/¯");

            d3.select(".bencina95")
                .text(d.details && d.details.bencina95 && "Male " + d.details.bencina95 || "¯\\_(ツ)_/¯");

            d3.select('.details')
                .style('visibility', "visible")
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style("stroke", null)
                .style("stroke-width", 0.25);

            d3.select('.details')
                .style('visibility', "hidden");
        });
}