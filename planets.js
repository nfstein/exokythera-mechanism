//reading data csv
const sunXPosition = 100;
const sunYPosition = 100;
const svgWidth = 600;
const svgHeight = 600;
var systems = system_data;
var bodySelection = d3.select("#home");
var select = d3.select('#home')
    .append('select')
    .attr('class', 'select')
    .attr('id', "stars")
    .on('change', onchange)
var svgSelection = bodySelection.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("style", "padding: 14em");

var options = select
    .selectAll('option')
    .data(stars).enter()
    .append('option')
    .text(function (d) {
        return d;
    });


//Appending planets to the body
function buildPlanet(planet, orbitalScale) {
    //var scaleFactor = (d3.max([svgHeight,svgWidth])/2)/maxRadius
    //var width = (d3.max([svgHeight,svgWidth])/2)
    //console.log('scaleFactor', scaleFactor)
    //console.log('radius', planet[12])
    //console.log('maxRadius', maxRadius)
    //console.log('d3.max([svgHeight,svgWidth])/2', d3.max([svgHeight,svgWidth])/2)
    //console.log('scaledRadius', orbitalScale(planet[12]))
    //console.log('maxorbitalScale', orbitalScale(maxRadius))
    var orbitSelection = svgSelection.append("path")
        .attr("d", getPath(orbitalScale(planet[12])))
        .attr("stroke", "lightgrey")
        .attr("stroke-width", "1")
        .attr("fill", "none")
        .attr("id", planet[0])
        .on("mouseover", function () {
            mouseOver(this);
        })
        .on("mouseout", function () {
            mouseOut(this);
        });
    var planetSelection = svgSelection.append("circle")
        .attr("r", Math.sqrt(Number.parseFloat(planet[11] ? planet[11] : 0.0)*300))
        .attr("style", "fill:" + "url(#gradient-" + planet[0] + ")")
    //Fill each circle/planet with its corresponding gradient
    var animationSelection = planetSelection.append("animateMotion")
        .attr("dur", Number.parseFloat(planet[9] ? planet[9]  : 0.0)/2)
        .attr("repeatCount", "indefinite");
    var mPathSelection = animationSelection.append("mpath")
        .attr("xlink:href", "#" + planet[0]);
    //Adding callbacks
}



function buildSolarSystem() {
    const planetClrAttributes = getGradient();
    const starName = document.getElementById("stars").value;
    //filter all the planets for this sun
    const indexOfStarName = system_headers.indexOf("HostStar")
    const planets = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starName.toLowerCase());
    var maxRadius = d3.max(planets,function(d){ console.log(d[12]); return d[12] });
    console.log('max: ', maxRadius)
    if (maxRadius < 1) {maxRadius = 1};

    var orbitalScale = d3.scaleSqrt().domain([.00001,maxRadius]).range([0,.9*d3.min([svgHeight,svgWidth])/2]);
    //d3.domain([0,maxRadius])//needs to be zero not minRadius or will place first planet under sun
    //d3.range([0,d3.min([svgHeight,svgWidth])/2])
    //const logOfMaxRadius =  Math.log(Number.parseFloat(maxRadius)*10)*100;
    //var scaleFactor = 0.0;
    /*if(logOfMaxRadius>=d3.max([svgHeight,svgWidth])/2){
        scaleFactor = (d3.max([svgHeight,svgWidth])-100)/2;
    }*/
    extraOrbits(planets[0], orbitalScale)
    planets.map((x, i) => {
        buildPlanet(x, orbitalScale);
    });
    addSun(starName);
}

function extraOrbits(planet,orbitalScale) {
    var earthOrbit = svgSelection.append("path")
        .attr("d", getPath(orbitalScale(1)))
        .attr("stroke", "blue")
        .attr("stroke-width", "2")
        .attr("fill", "none")
        .attr("id", '1AU');

    var inner = orbitalScale(Number.parseFloat(planet[system_headers.indexOf("HostStarInnerHabitabilityAU")]))
    var outer = orbitalScale(Number.parseFloat(planet[system_headers.indexOf("HostStarOuterHabitabilityAU")]))

    var width = outer-inner
    var radius = (width)/2 + inner
    
    /*var conservativeHabitable = svgSelection.append("path")
        .attr("d", getPath(radius))
        .attr("stroke", "green")
        .attr("stroke-width", width)
        .attr("fill", "none")
        .attr("opacity", .2)
        .attr("id", 'habitable zone');*/

    var liberalHabitable = svgSelection.append("path")
        .attr("d", getPath(radius))
        .attr("stroke", "green")
        .attr("stroke-width", width*1.6)
        .attr("fill", "none")
        .attr("opacity", .4)
        .attr("id", 'liberal habitable zone');
    
    /*var extraliberalHabitable = svgSelection.append("path")
        .attr("d", getPath(radius))
        .attr("stroke", "green")
        .attr("stroke-width", width*2)
        .attr("fill", "none")
        .attr("opacity", .1)
        .attr("id", 'liberal habitable zone');*/

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
        //filter all the planets for this sun
    const indexOfStarName = system_headers.indexOf("HostStar")
    const planets = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starN.toLowerCase());
    handleTabClick(systemDesc_2, planets, starN);
}

function handleTabClick(systemDesc_2, planets, starN){
    switch(menuSelected){
        case "desc":
        removeHomeTab(); 
        removeChartsTab();
        getHomeDivs(systemDesc_2,starN);
        var sunSelection = svgSelection.append("circle")
        .attr("cx", sunXPosition)
        .attr("cy", sunYPosition)
        .attr("r", Number.parseFloat(planets[0][6] ? planets[0][6] : 0.0) + Number.parseInt(10))
        .attr("style", "fill:" + "url(#radial-gradient)");
        break;
        case "graphs":
        removeHomeTab(); 
        removeChartsTab();
        getChartsDivs();                                       
        break;
        default:
          break;
    }
}
function getHomeDivs(systemDesc_2, starN){
    var h1 = d3.select("div.w3-padding-large").append("h1")
    .attr("class", "w3-center")
    .text(starN);
    var h5 = d3.select("div.w3-padding-large").append("h5")
    .attr("class", "w3-center")
    .text("Heading");
    var p1 = d3.select("div.w3-padding-large").append("p")
    .attr("class", "w3-large")
    .text(systemDesc_1[0][starN]);
    var p2 = d3.select("div.w3-padding-large").append("p")
    .attr("class", "w3-large w3-hide-medium")
    .text(systemDesc_2[0][starN]);
    ;
}

function getChartsDivs(){
    var chartsParentDiv = d3.select("div#about").append("div")
    .attr("id","charts");
var chart1Div =   d3.select("div#charts").append("div")
     .attr("id","chart1")
     .text("Chart1")   ;         
var chart2Div =   d3.select("div#charts").append("div")
     .attr("id","chart2")
     .text("Chart2") ;
var chart3Div =   d3.select("div#charts").append("div")
     .attr("id","chart3")
     .text("Chart3") 
var chart4Div =   d3.select("div#charts").append("div")
     .attr("id","chart4")   
     .text("Chart4")    ; 
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

    //Append a radialGradient element to the defs and give it a unique id
    var radialGradient = d3.select("defs").append("radialGradient")
        .attr("id", "radial-gradient")
        .attr("cx", "50%") //The x-center of the gradient, same as a typical SVG circle
        .attr("cy", "50%") //The y-center of the gradient
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
    return habitabilityScore;
}

function buildPlot() {
    console.log(document.getElementById("plotTest"));
    Plotly.newPlot('chart2', [trace01, trace02], barLayout)
    Plotly.newPlot('chart4', [barTrace01, barTrace02], barLayout)

}

buildSolarSystem();