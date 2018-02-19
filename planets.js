const sunXPosition = 100;
const sunYPosition = 100;
var solarSystm = ["Trappist-1", "Sun", "Alpha Centauri"];

var planets = [{
        "name": "planet_1",
        "radius": 5,
        "mass": 100,
        "orbitRadius": 80,
        "timeToComplete": "20s",
        "color": "red"
    },
    {
        "name": "planet_2",
        "radius": 8,
        "mass": 400,
        "orbitRadius": 100,
        "timeToComplete": "22s",
        "color": "orange"
    },
    {
        "name": "planet_3",
        "radius": 10,
        "mass": 500,
        "orbitRadius": 120,
        "timeToComplete": "28s",
        "color": "green"
    },
    {
        "name": "planet_4",
        "radius": 15,
        "mass": 500,
        "orbitRadius": 150,
        "timeToComplete": "18s",
        "color": "#aa3382"
    },
    {
        "name": "planet_5",
        "radius": 18,
        "mass": 500,
        "orbitRadius": 180,
        "timeToComplete": "32s",
        "color": "#1c266b"
    },
    {
        "name": "planet_6",
        "radius": 32,
        "mass": 500,
        "orbitRadius": 250,
        "timeToComplete": "14s",
        "color": "#af160e"
    },
    {
        "name": "planet_7",
        "radius": 12,
        "mass": 500,
        "orbitRadius": 210,
        "timeToComplete": "18s",
        "color": "#067f82"
    }
];
var bodySelection = d3.select("#home");
var select = d3.select('#home')
      .append('select')
          .attr('class','select')
        .on('change',onchange)
var svgSelection = bodySelection.append("svg")
    .attr("width", 600)
    .attr("height", 750)
    .attr("style","padding: 14em");
var sunSelection = svgSelection.append("circle")
    .attr("cx", sunXPosition)
    .attr("cy", sunYPosition)
    .attr("r", 30)
    .attr("style", "fill:" + "#e6e600");
    
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
        .attr("style", "fill:" + "url(#gradient-" + planet.name + ")");
        //Fill each circle/planet with its corresponding gradient
    var animationSelection = planetSelection.append("animateMotion")
        .attr("dur", planet.timeToComplete)
        .attr("repeatCount", "indefinite");
    var mPathSelection = animationSelection.append("mpath")
        .attr("xlink:href", "#"+planet.name);
}

function getPath(planet) {
    var dFormula = "M " + sunXPosition + " " + sunYPosition +
        " m " + -planet.orbitRadius + ", 0" +
        " a " + planet.orbitRadius + "," + planet.orbitRadius + " 0 1,0 " + planet.orbitRadius * 2 + ",0" +
        " a " + planet.orbitRadius + "," + planet.orbitRadius + " 0 1,0 " + -planet.orbitRadius * 2 + ",0";
    return dFormula;
}

function buildSolarSystem() {
    planets.forEach(function(planet){
        buildPlanet(planet);
    });
}


//Gradient
//Create a radial gradient for each of the planets
var planetGradients = svgSelection.append("defs").selectAll("radialGradient")
	.data(planets)
	.enter().append("radialGradient")
	.attr("id", function(d){ return "gradient-" + d.name; }) //unique id per planet
	.attr("cx", "35%")	//Move the x-center location towards the left
	.attr("cy", "35%")	//Move the y-center location towards the top
	.attr("r", "60%");	//Increase the size of the "spread" of the gradient

//Add colors to the gradient
//First a lighter color in the center
planetGradients.append("stop")
	.attr("offset", "0%")
	.attr("stop-color", function(d) { return d3.rgb(d.color).brighter(1); });
//Then the actual color almost halfway
planetGradients.append("stop")
	.attr("offset", "50%")
	.attr("stop-color", function(d) { return d.color; }); 
//Finally a darker color at the outside
planetGradients.append("stop")
	.attr("offset",  "100%")
	.attr("stop-color", function(d) { return d3.rgb(d.color).darker(1.75); });
buildSolarSystem();

