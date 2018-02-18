const sunXPosition = 100;
const sunYPosition = 100;

var planets = [{
        "name": "planet_1",
        "radius": 5,
        "mass": 100,
        "orbitRadius": 80,
        "timeToComplete": "6s",
        "color": "red"
    },
    {
        "name": "planet_2",
        "radius": 8,
        "mass": 400,
        "orbitRadius": 100,
        "timeToComplete": "12s",
        "color": "orange"
    },
    {
        "name": "planet_3",
        "radius": 10,
        "mass": 500,
        "orbitRadius": 120,
        "timeToComplete": "16s",
        "color": "green"
    }
];
var bodySelection = d3.select("body");
var svgSelection = bodySelection.append("svg")
    .attr("width", 400)
    .attr("height", 400)
    .attr("style","padding: 12em");
var sunSelection = svgSelection.append("circle")
    .attr("cx", sunXPosition)
    .attr("cy", sunYPosition)
    .attr("r", 30)
    .attr("style", "fill:" + "black");


//Appending planets to the body
function buildPlanet(planet) {
    var orbitSelection = svgSelection.append("path")
        .attr("d", getPath(planet))
        .attr("stroke", "lightgrey")
        .attr("stroke-width", "2")
        .attr("fill", "none")
        .attr("id", planet.name);
    var planetSelection = svgSelection.append("circle")
        .attr("cx", "")
        .attr("cy", "")
        .attr("r", planet.radius)
        .attr("style", "fill:" + planet.color);
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

buildSolarSystem();