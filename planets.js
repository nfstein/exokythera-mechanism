const sunXPosition = 100;
const sunYPosition = 100;
var solarSystm = ["Trappist-1", "Sun", "Alpha Centauri"];

var planets = [{
    "name": "planet_1",
    "radius": 5,
    "mass": 100,
    "orbitRadius": 80,
    "timeToComplete": "20s",
    "color": "red",
    "desc":"TRAPPIST-1b"
},
{
    "name": "planet_2",
    "radius": 8,
    "mass": 400,
    "orbitRadius": 100,
    "timeToComplete": "22s",
    "color": "orange",
    "desc":"TRAPPIST-1c"
},
{
    "name": "planet_3",
    "radius": 10,
    "mass": 500,
    "orbitRadius": 120,
    "timeToComplete": "28s",
    "color": "green",
    "desc":"TRAPPIST-1d"
},
{
    "name": "planet_4",
    "radius": 15,
    "mass": 500,
    "orbitRadius": 150,
    "timeToComplete": "23s",
    "color": "#aa3382",
    "desc":"TRAPPIST-1e"
},
{
    "name": "planet_5",
    "radius": 18,
    "mass": 500,
    "orbitRadius": 180,
    "timeToComplete": "32s",
    "color": "#1c266b",
    "desc":"TRAPPIST-1f"
},
{
    "name": "planet_6",
    "radius": 32,
    "mass": 500,
    "orbitRadius": 250,
    "timeToComplete": "24s",
    "color": "#af160e",
    "desc":"TRAPPIST-1g"
},
{
    "name": "planet_7",
    "radius": 12,
    "mass": 500,
    "orbitRadius": 210,
    "timeToComplete": "28s",
    "color": "#067f82",
    "desc":"TRAPPIST-1h"
}
];
var bodySelection = d3.select("#home");
var select = d3.select('#home')
    .append('select')
    .attr('class', 'select')
    .on('change', onchange)
var svgSelection = bodySelection.append("svg")
    .attr("width", 600)
    .attr("height", 750)
    .attr("style", "padding: 14em");

var options = select
    .selectAll('option')
    .data(solarSystm).enter()
    .append('option')
    .text(function (d) { return d; });


//Appending planets to the body
function buildPlanet(planet) {
    var orbitSelection = svgSelection.append("path")
        .attr("d", getPath(planet))
        .attr("stroke", "lightgrey")
        .attr("stroke-width", "2")
        .attr("fill", "none")
        .attr("id", planet.name);
    var planetSelection = svgSelection.append("circle")
        .attr("r", planet.radius)
        .attr("style", "fill:" + "url(#gradient-" + planet.name + ")")
        .attr("onmouseover", "mouseOver(this)")
        .attr("onmouseout","mouseOut(this)")
    //Fill each circle/planet with its corresponding gradient
    var animationSelection = planetSelection.append("animateMotion")
        .attr("dur", planet.timeToComplete)
        .attr("repeatCount", "indefinite");
    var mPathSelection = animationSelection.append("mpath")
        .attr("xlink:href", "#" + planet.name);
    //Adding callbacks


}

function getPath(planet) {
    var dFormula = "M " + sunXPosition + " " + sunYPosition +
        " m " + -planet.orbitRadius + ", 0" +
        " a " + planet.orbitRadius + "," + planet.orbitRadius + " 0 1,0 " + planet.orbitRadius * 2 + ",0" +
        " a " + planet.orbitRadius + "," + planet.orbitRadius + " 0 1,0 " + -planet.orbitRadius * 2 + ",0";
    return dFormula;
}

function buildSolarSystem() {
    planets.forEach(function (planet) {
        buildPlanet(planet);
    });
}


//Gradient
//Create a radial gradient for each of the planets
var planetGradients = svgSelection.append("defs").selectAll("radialGradient")
    .data(planets)
    .enter().append("radialGradient")
    .attr("id", function (d) { return "gradient-" + d.name; }) //unique id per planet
    .attr("cx", "35%")	//Move the x-center location towards the left
    .attr("cy", "35%")	//Move the y-center location towards the top
    .attr("r", "60%");	//Increase the size of the "spread" of the gradient

//Add colors to the gradient
//First a lighter color in the center
planetGradients.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", function (d) { return d3.rgb(d.color).brighter(1); });
//Then the actual color almost halfway
planetGradients.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", function (d) { return d.color; });
//Finally a darker color at the outside
planetGradients.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", function (d) { return d3.rgb(d.color).darker(1.75); });


//Append a radialGradient element to the defs and give it a unique id
var radialGradient = d3.select("defs").append("radialGradient")
    .attr("id", "radial-gradient")
    .attr("cx", "50%")    //The x-center of the gradient, same as a typical SVG circle
    .attr("cy", "50%")    //The y-center of the gradient
    .attr("r", "50%");
//Add colors to make the gradient appear like a Sun
radialGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#FFF76B");
radialGradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "#FFF845");
radialGradient.append("stop")
    .attr("offset", "90%")
    .attr("stop-color", "#FFDA4E");
radialGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#FB8933");
var sunSelection = svgSelection.append("circle")
    .attr("cx", sunXPosition)
    .attr("cy", sunYPosition)
    .attr("r", 30)
    .attr("style", "fill:" + "url(#radial-gradient)");
function mouseOver(p){
    var planetName = p.style.fill.split("\"")[1].split("-")[1];
    var planet =  planets.filter(x=>x.name === planetName)
    var rect = svgSelection.append('rect').transition().duration(100).attr('width', 150)
                .attr('height', 100)
                .attr('x', 40)
                .attr('y', 100)
                .style('fill', 'white')
                .attr('stroke', planet[0].color)
var text = svgSelection.append('text').
                text(planet[0].desc)
                .attr('x', "40")
                .attr('y', "122")
                .attr('fill', 'black')
                .attr('alignment-baseline',"right")
                .attr("text-anchor","right")
                .attr("font-family","sans-serif")
                .attr("font","10")
                .attr("class","wrap")
}

function mouseOut(p){
    d3.selectAll("rect").data([]).exit().remove();
    d3.selectAll("text").data([]).exit().remove();
}

buildSolarSystem();


