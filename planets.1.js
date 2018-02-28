var debug = true //debug console.logs

//reading data csv
const sunXPosition = 100;
const sunYPosition = 100;
const windowWidth = 600;
const windowHeight = 600;

var systems = system_data;
var  $bodySelection = d3.select("#home");
var $select = d3.select('#home')
    .append('select')
    .attr('class', 'select')
    .attr('id', "stars")
    .on('change', onchange)
var svgSelection =  $bodySelection.append("svg")
    .attr("width", windowWidth)
    .attr("height", windowHeight)
    .attr("style", "padding: 14em");

var options = $select
    .selectAll('option')
    .data(stars).enter()
    .append('option')
    .text(function (d) {
        return d;
    });

function buildPlanet(planet, planetName, scaleFactor, timeFactor) {
    console.log(planet)
    var randAngle = Math.random()*2*3.14
    var cx = planet['SemiMajorAxisAU'] * scaleFactor*Math.sin(randAngle) + sunXPosition
    var cy = planet['SemiMajorAxisAU'] * scaleFactor*Math.cos(randAngle) + sunYPosition
    var animationHTML = `<animateTransform attributeName="transform"
            type="rotate"
            from="360 ${sunXPosition} ${sunYPosition}" to="0 ${sunXPosition} ${sunYPosition}"
            begin="0s" dur="${planet['PeriodDays']*timeFactor}s"
            repeatCount="indefinite"
        />`

    if (debug) {console.log('PeriodDays - ', planet['PeriodDays'], '; timeFactor - ', timeFactor)}
    var $orbitSelection = svgSelection.append("path")
        .attr("d", getPath(planet['SemiMajorAxisAU'] * scaleFactor))
        .attr("stroke", "lightgrey")
        .attr("stroke-width", "2")
        .attr("fill", "none")
        .attr("id", planetName);
    if (planet['RadiusJpt']) {
        var radius = planet['RadiusJpt'];
    } 
    else {var radius = planet['PlanetaryMassJpt']*20}

    console.log(planetName, ' radius - ', radius)
    var $planetSelection = svgSelection.append("circle")
        .attr("r", (planetScale(radius))) 
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("style", "fill:" + 'blue')//somethings up with the radius, will address later: "url(#gradient-" + planetName + ")")
        .html(animationHTML)
}



function buildSolarSystem() {
    const planetClrAttributes = getGradient();
    const starName = document.getElementById("stars").value;
    console.log(starName)
    console.log(test[starName]) //useful to have logged outside of debug
    //filter all the planets for this sun
    const indexOfStarName = system_headers.indexOf("HostStar")
    //const planets = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starName.toLowerCase());
    const planets = test[starName] //same as above but using object

    var scaleFactor = getScaleFactor(planets, windowWidth) //scaleFactor maxOrbit/windowWidth
    var timeFactor = getTimeFactor(planets, 1) //timefactor sets minperiod to 5 seconds, others proportionally

    if (debug) {console.log('scaleFactor = ', scaleFactor, '; timeFactor = ', timeFactor)}

    addExtraOrbits(planets, scaleFactor)
    planets.list.forEach(planet => {
        //console.log(planet, ', ', planets[planet])
        buildPlanet(planets[planet], planet, scaleFactor, timeFactor);
    });

    addSun(starName);
}

function addExtraOrbits(system, scaleFactor) {
    var earthOrbit = svgSelection.append("path")
        .attr("d", getPath(1 * scaleFactor))
        .attr("stroke", "blue")
        .attr("stroke-width", "2")
        .attr("fill", "none")
        .attr("id", '1AU');
    var planetStat = system[system.list[0]]
    var inner = planetStat['HostStarInnerHabitabilityAU'] * scaleFactor
    var outer = planetStat['HostStarOuterHabitabilityAU'] * scaleFactor
    var width = outer-inner
    var radius = (width)/2 + inner

    var earthOrbit = svgSelection.append("path")
        .attr("d", getPath(radius))
        .attr("stroke", "green")
        .attr("stroke-width", width)
        .attr("fill", "none")
        .attr("opacity", .1)
        .attr("id", 'habitable zone');
}

function getTimeFactor(system, modifier) {
    //slowest orbit completes in 3 seconds
    var minTime;
    system.list.forEach(planet => {
        var time = system[planet]['PeriodDays']
        if (!minTime) {
            minTime = time
        }
        if (time < minTime) {
            minTime = time
        }
    })
    //slowest orbit completes in 3 seconds
    console.log('minTime = ', minTime)
    return (3/minTime)*modifier;
}
function planetScale(radius) {
    return (radius**.4)*10
}
//loop through planets to find max orbit or 1AU -> windowSize
function getScaleFactor(system, width) {
    //Number.parseFloat(planet[11])
    console.log(system);
    maxOrbit = 1 //accounts for AU for scale
    system.list.forEach(planet => {
        var orbit = system[planet]['SemiMajorAxisAU']
        if (orbit > maxOrbit){
            maxOrbit = orbit
        }
    })

    console.log('maxOrbit = ', maxOrbit)

    return (width/2)/maxOrbit;

}



function mouseOver(p) {
    const starName = document.getElementById("stars").value;
    //filter all the planets for this sun
    const indexOfStarName = system_headers.indexOf("HostStar")
    const planets = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starName.toLowerCase());
    var planetName = p.id;
    var planet = planets.filter(x => x[0] && x[0].toLowerCase() === planetName.toLowerCase())
    var rect = svgSelection.append('rect').transition().duration(100).attr('width', 150)
        .attr('height', 25)
        .attr('x', 40)
        .attr('y', 100)
        .style('fill', 'white')
        .attr('stroke', planet[0].color)
    var text = svgSelection.append('text').
    text(planet[0].desc)
        .attr('x', "40")
        .attr('y', "120")
        .attr('fill', 'black')
        .attr('alignment-baseline', "right")
        .attr("text-anchor", "right")
        .attr("font-family", "sans-serif")
        .attr("font", "10")
        .attr("class", "wrap")
}

function mouseOut(p) {
    d3.selectAll("rect").data([]).exit().remove();
    d3.selectAll("text").data([]).exit().remove();
}


function addSun(starN) {
    var $h1 = d3.select("div.w3-padding-large").append("h1")
    .attr("class", "w3-center")
    .text(starN);
    var  $h5 = d3.select("div.w3-padding-large").append("h5")
    .attr("class", "w3-center")
    .text("Heading");
    var $p1 = d3.select("div.w3-padding-large").append("p")
    .attr("class", "w3-large")
    .text(systemDesc_1[0][starN]);
    var $p2 = d3.select("div.w3-padding-large").append("p")
    .attr("class", "w3-large w3-hide-medium")
    .text(systemDesc_2[0][starN]);
    //filter all the planets for this sun
    const indexOfStarName = system_headers.indexOf("HostStar")
    const planets = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starN.toLowerCase());
    const planetStats = test[starN][test[starN].list[0]]
    if (planetStats["HostStarColor"]) {
        // draw single star
        var $sunSelection = svgSelection.append("circle")
            .attr("cx", sunXPosition)
            .attr("cy", sunYPosition)
            .attr("r", planetScale(planetStats['HostStarRadiusSlrRad'])/2)
            .attr("fill", planetStats['HostStarColor'])
            .attr("style", "fill:" + planetStats['HostStarColor'] )//"url(#radial-gradient)")
            .on("click", function () {
                var $h1 = d3.select("div.w3-col m6 w3-padding-large").append("h1")
                    .attr("class", "w3-center")
                    .text(star);
                var $h5 = d3.select("div.w3-col m6 w3-padding-large").append("h5")
                    .attr("class", "w3-center")
                    .text("Heading");
                var $p1 = d3.select("div.w3-col m6 w3-padding-large").append("p")
                    .attr("class", "w3-large")
                    .text(systemDesc_1[0][starN]);
                var $p2 = d3.select("w3-large w3-hide-medium").append("p")
                    .attr("class", "w3-large w3-hide-medium")
                    .attr(systemDesc_2[0][starN]);
            });
        }
    else {
        // draw binary star
        var animationHTML = `<animateTransform attributeName="transform"
            type="rotate"
            from="360 ${sunXPosition} ${sunYPosition}" to="0 ${sunXPosition} ${sunYPosition}"
            begin="0s" dur="2s"
            repeatCount="indefinite"
        />`
        var $sun1Selection = svgSelection.append("circle")
            .attr("cx", sunXPosition+1)
            .attr("cy", sunYPosition)
            .attr("r", planetScale(planetStats['HostStarRadiusSlrRad'])/2)
            .attr("style", "fill:" + "url(#radial-gradient)")
            .on("click", function () {
                var $h1 = d3.select("div.w3-col m6 w3-padding-large").append("h1")
                    .attr("class", "w3-center")
                    .text(star);
                var $h5 = d3.select("div.w3-col m6 w3-padding-large").append("h5")
                    .attr("class", "w3-center")
                    .text("Heading");
                var $p1 = d3.select("div.w3-col m6 w3-padding-large").append("p")
                    .attr("class", "w3-large")
                    .text(systemDesc_1[0][starN]);
                var $p2 = d3.select("w3-large w3-hide-medium").append("p")
                    .attr("class", "w3-large w3-hide-medium")
                    .attr(systemDesc_2[0][starN]);
            })
            .html(animationHTML);

        var $sun2Selection = svgSelection.append("circle")
            .attr("cx", sunXPosition-8)
            .attr("cy", sunYPosition)
            .attr("r", planetScale(planetStats['HostStarRadiusSlrRad'])/4)
            .attr("fill", 'orange')
            .on("click", function () {
                var $h1 = d3.select("div.w3-col m6 w3-padding-large").append("h1")
                    .attr("class", "w3-center")
                    .text(star);
                var $h5 = d3.select("div.w3-col m6 w3-padding-large").append("h5")
                    .attr("class", "w3-center")
                    .text("Heading");
                var $p1 = d3.select("div.w3-col m6 w3-padding-large").append("p")
                    .attr("class", "w3-large")
                    .text(systemDesc_1[0][starN]);
                var $p2 = d3.select("w3-large w3-hide-medium").append("p")
                    .attr("class", "w3-large w3-hide-medium")
                    .attr(systemDesc_2[0][starN]);
            })
            .html(animationHTML);
        }
        
}

function onchange() {
    cleanSvg();
    buildSolarSystem();
}

function getGradient() {
    const starName = document.getElementById("stars").value;
    //filter all the planets for this sun
    const indexOfStarName = system_headers.indexOf("HostStar")
    const planets = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starName.toLowerCase());
    var habitabilityScore = [];
    planets.map(x => {
        habitabilityScore.push({
            "name": x[0],
            "habitability": (((Number.parseFloat(x[17]) + Number.parseFloat(x[18])) / 2) - Number.parseFloat(x[12])) > 0 ?
                (((Number.parseFloat(x[17]) + Number.parseFloat(x[18] ? x[18]  : 0.0)) / 2) - Number.parseFloat(x[12] ? x[12] : 0.0)) : -1 * (((Number.parseFloat(x[17] ? x[17] : 0.0) + Number.parseFloat(x[18] ? x[18] : 0.0)) / 2) - Number.parseFloat(x[12] ? x[12] : 0.0))
        });
    });
    habitabilityScore.sort(compare);
    var colors = []
    habitabilityScore.map((x, i) => {
        colors.push(d3.interpolateSpectral((i + Number.parseInt(1)) / habitabilityScore.length));
    })
    habitabilityScore.map((x, i) => {
        x["color"] = colors[i];
    });

    //Create a radial gradient for each of the planets
    var planetGradients = svgSelection.append("defs").selectAll("radialGradient")
        .data(habitabilityScore)
        .enter().append("radialGradient")
        .attr("id", function (d) {
            return "gradient-" + d.name;
        }) //unique id per planet
        .attr("cx", "35%") //Move the x-center location towards the left
        .attr("cy", "35%") //Move the y-center location towards the top
        .attr("r", "60%"); //Increase the size of the "spread" of the gradient

    //Add colors to the gradient
    //First a lighter color in the center
    planetGradients.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", function (d) {
            return d3.rgb(d.color).brighter(1);
        });
    //Then the actual color almost halfway
    planetGradients.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", function (d) {
            return d.color;
        });
    //Finally a darker color at the outside
    planetGradients.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", function (d) {
            return d3.rgb(d.color).darker(1.75);
        });

    //Append a $radialGradient element to the defs and give it a unique id
    var $radialGradient = d3.select("defs").append("radialGradient")
        .attr("id", "radial-gradient")
        .attr("cx", "50%") //The x-center of the gradient, same as a typical SVG circle
        .attr("cy", "50%") //The y-center of the gradient
        .attr("r", "50%");
    //Add colors to make the gradient appear like a Sun
    $radialGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#FFF76B");
    $radialGradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#FFF845");
    $radialGradient.append("stop")
        .attr("offset", "90%")
        .attr("stop-color", "#FFDA4E");
    $radialGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#FB8933");
    return habitabilityScore;
}



buildSolarSystem();