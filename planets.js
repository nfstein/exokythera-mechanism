//reading data csv

const svgWidth = 680;
const svgHeight = 600;
const sunXPosition = 100;//svgWidth/2;
const sunYPosition = 100//svgHeight/2;
var systems = system_data;
var bodySelection = d3.select("#home");
var select = d3.select('#home')
    .append('select')
    .attr('class', 'select')
    .attr('id', "stars")
    .on('change', onchange)
//var divForSvg =   bodySelection.append("div").attr('id', 'charts_0').attr('class', 'chart_parent_0');
var svgSelection = bodySelection.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("style", "padding-left: 18em; padding-top: 9em").attr('class','chart_first');

var options = select
    .selectAll('option')
    .data(stars).enter()
    .append('option')
    .text(function (d) {
        return d;
    });

const density = 2 //mass density of planets

//Appending planets to the body
function buildPlanet(planet, orbitalScale) { //orbitalScale is the d3 scaling function
    var orbitSelection = svgSelection.append("path")
        .attr("d", getPath(orbitalScale(planet[12])))
        .attr("stroke", "lightgrey")
        .attr("stroke-width", "1")
        .attr("fill", "none")
        .attr("id", planet[0])
    
        /*.on("click", function () {
            orbitClick(this);
        })
        /*.on("mouseout", function () {
            mouseOut(this);
        });*/
    //not all planets have radius data
    if (planet[11]) {
        var planetSelection = svgSelection.append("circle")
            .attr("r", planet[11]**.5*20)
            .attr("style", "fill:" + "url(#gradient-" + planet[0] + ")")
    }
    else { //those with no radius get populated by mass
        var planetSelection = svgSelection.append("circle")
            .attr("r", (((planet[system_headers.indexOf('PlanetaryMassJpt')]/4)**.33)*density)**.5*20) //mass = volume*constant = c * 4/3 * pi * r^3
            .attr("style", "fill:" + "url(#gradient-" + planet[0] + ")")
    }
    planetSelection.on("click", function () {
        orbitClick(planet);
    })
    //Fill each circle/planet with its corresponding gradient
    var animationSelection = planetSelection.append("animateMotion")
        .attr("dur", Number.parseFloat(planet[9] ? planet[9]  : 0.0)/2)
        .attr("repeatCount", "indefinite");
    var mPathSelection = animationSelection.append("mpath")
        .attr("xlink:href", "#" + planet[0]);
    //Adding callbacks
    var selectionOrbit = svgSelection.append("circle")
        .attr("r", orbitalScale(planet[12]))
        .attr('cx', sunXPosition)
        .attr('cy', sunYPosition)
        .attr("stroke", "lightgrey")
        .attr("stroke-width", "20")
        .attr('opacity', 0)
        .attr("fill", "none")
        .attr("id", planet[0]+' selection')
        .on("click", function () {
            orbitClick(planet);
        })
}



function buildSolarSystem() {
    const planetClrAttributes = getGradient(); //creates fill gradients for each planet in system
    const starName = document.getElementById("stars").value; 
    //filter all the planets for this sun
    const indexOfStarName = system_headers.indexOf("HostStar")
    //planets is array of each planet data array for the system
    const planets = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starName.toLowerCase());
    //maxRadius currently bugged for our solar system at least
    var maxRadius = d3.max(planets,function(d){ console.log(d[12]); return d[12] });
    console.log('max: ', maxRadius)
    //make sure earth orbit included for reference
    if (maxRadius < 1) {maxRadius = 1};

    //sqrt scale makes tiny orbits larger and giant orbits smaller
    var orbitalScale = d3.scaleSqrt()
        .domain([.00001,maxRadius]) //not quite zero to avoid undefineds
        .range([0,.7*d3.min([svgHeight,svgWidth])/2]); //range leaves a 10% border around edge

    extraOrbits(planets[0], orbitalScale) //populates earth orbit, habitable zone
    planets.map((x, i) => {
        buildPlanet(x, orbitalScale);
    });
    addSun(starName);

}

function extraOrbits(planet,orbitalScale) {
    //earth orbit of 1AU
    var earthOrbit = svgSelection.append("path")
        .attr("d", getPath(orbitalScale(1)))
        .attr("stroke", "#1F75FE")
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

    var textPath = svgSelection
        .append('text')
        .attr('font-size', '18px')
        .attr('fill', "#1F75FE")
        .append("textPath")
        .attr('startOffset', '22%')
        .attr('xlink:href', "#1AU")
        .text('1 AU');
    
    
}


function orbitClick(planetData) {
    const starName = document.getElementById("stars").value;
    const indexOfStarName = system_headers.indexOf("HostStar")
    
    console.log(planetData[0])

    
    d3.select("chart4").html('hellochart4')
}

/*function mouseOut(p) {
    d3.selectAll("rect").data([]).exit().remove();
    d3.selectAll("text").data([]).exit().remove();
}*/


function addSun(starN) {
        //filter all the planets for this sun
    const indexOfStarName = system_headers.indexOf("HostStar")
    const planets = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starN.toLowerCase());
    
    handleTabClick(systemDesc_2, planets, starN);
}

function handleTabClick(systemDesc_2, planets, starN){ 
    /*if (planets[0][system_headers.indexOf('HostStarColor')]){
        var sunSelection = svgSelection.append("circle")
            .attr("cx", sunXPosition)
            .attr("cy", sunYPosition)
            .attr("r", Number.parseFloat(planets[0][6] ? planets[0][6] : 1)**.5 *10)
            .attr("style", "fill:" + planets[0][system_headers.indexOf('HostStarColor')]);//"url(#radial-gradient)");
    }
    else {
        var animationHTML = `<animateTransform attributeName="transform"
            type="rotate"
            from="360 ${sunXPosition} ${sunYPosition}" to="0 ${sunXPosition} ${sunYPosition}"
            begin="0s" dur="1s"
            repeatCount="indefinite"
        />`
        var sun1Selection = svgSelection.append("circle")
            .attr("cx", sunXPosition+3)
            .attr("cy", sunYPosition)
            .attr("r", (Number.parseFloat(planets[0][6] ? planets[0][6] : 0.0) + Number.parseInt(10)))
            .attr("style", "fill:" + '#ffd2a1')
            .html(animationHTML);
        var sun2Selection = svgSelection.append("circle")
            .attr("cx", sunXPosition-15)
            .attr("cy", sunYPosition)
            .attr("r", (Number.parseFloat(planets[0][6] ? planets[0][6] : 0.0) + Number.parseInt(10))/3)
            .attr("style", "fill:" + '#A52A2A')//"url(#radial-gradient)");
            .html(animationHTML);

    }*/
    drawSun(planets[0]);
    switch(menuSelected){
        case "desc":
            removeHomeTab(); 
            removeChartsTab();
            addHomeDivs(systemDesc_2,starN);
            break;
        case "graphs":
        removeHomeTab(); 
        removeChartsTab();
        addChartsAll();                       
        break;
        default:
          break;
    } 
}

function drawSun(planet){
    console.log(planet)
    if (planet[system_headers.indexOf('HostStarColor')]){
        var sunSelection = svgSelection.append("circle")
            .attr("cx", sunXPosition)
            .attr("cy", sunYPosition)
            .attr("r", Number.parseFloat(planet[6] ? planet[6] : 1)**.5 *10)
            .attr("style", "fill:" + planet[system_headers.indexOf('HostStarColor')]);//"url(#radial-gradient)");
    }
    else {
        var animationHTML = `<animateTransform attributeName="transform"
            type="rotate"
            from="360 ${sunXPosition} ${sunYPosition}" to="0 ${sunXPosition} ${sunYPosition}"
            begin="0s" dur="1s"
            repeatCount="indefinite"
        />`
        var sun1Selection = svgSelection.append("circle")
            .attr("cx", sunXPosition+3)
            .attr("cy", sunYPosition)
            .attr("r", (Number.parseFloat(planet[6] ? planet[6] : 0.0) + Number.parseInt(10)))
            .attr("style", "fill:" + '#ffd2a1')
            .html(animationHTML);
        var sun2Selection = svgSelection.append("circle")
            .attr("cx", sunXPosition-15)
            .attr("cy", sunYPosition)
            .attr("r", (Number.parseFloat(planet[6] ? planet[6] : 0.0) + Number.parseInt(10))/3)
            .attr("style", "fill:" + '#A52A2A')//"url(#radial-gradient)");
            .html(animationHTML);
    }
}

function onchange() {
    cleanSvg();
    buildSolarSystem();
    starTable();
    planetTable();
    buildPlot_0();
    buildPlot();
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
        colors.push(d3.interpolateRdYlGn((i + Number.parseInt(1)) / habitabilityScore.length));
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

function buildPlotsAll(){
    buildPlots();
}
function buildPlots() {
    const starName = document.getElementById("stars").value; 

    const indexOfStarName = system_headers.indexOf("HostStar")
    //planets is array of each planet data array for the system
    const planets = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starName.toLowerCase());
    var names = []
    var radii = []
    var mass = []
    var sizes = []
    planets.forEach(planet => {
        console.log('radius', planet[11], 'mass', planet[10] )
        names.push(planet[0])
        if (planet[11]) {
            var rad = Number.parseFloat(planet[11])
            radii.push(rad)
            sizes.push(rad**.5*20)
        } else {
            var rad = (((Number.parseFloat(planet[10])/4)**.33)*density)
            radii.push(rad)
            sizes.push(rad**.5*20)
        }
        if (planet[10]) {
            mass.push(planet[10])
        }
        else {mass.push((((rad/density)**3)*4))}
    })


    var bubbleTrace02 = {
        'name': starName + ' System',
        'marker': {'color': 'red', 'opacity': 0.9, 'size': sizes},
        'mode': 'lines+markers',
        'text': names,
        'x': mass,
        'y': radii
    }
    var bubbleTraceLayout = {
        title: 'Planetary Mass vs Radius',
        xaxis: {
            title: 'Jupiter Masses of Planet',
            },
        yaxis: {
          title: 'Jupiter Radii of Planet',
          titlefont: {
            size: 16,
            color: 'rgb(107, 107, 107)'
          },
          tickfont: {
            size: 14,
            color: 'rgb(107, 107, 107)'
          }
        },
        legend: {
            x: .8,
            y: 1.0,
            bgcolor: 'rgba(255, 255, 255, 0)',
            bordercolor: 'rgba(255, 255, 255, 0)'
          },

    }

    Plotly.newPlot('chart0', [bubbleTrace01, bubbleTrace02], bubbleTraceLayout)
    Plotly.newPlot('chart1', [barTrace01, barTrace02], barLayout)
    buildSpacial();
    //Plotly.newPlot('chart3', [barTrace01, barTrace02], barLayout)
    //Plotly.newPlot('chart4', [bubbleTrace01, bubbleTrace02], )
}

function buildSpacial () {
    const starName = document.getElementById("stars").value;

    starCoords = {
        'Kepler-9': [-1539.9039134475752, 500.2603491155542, 1368.5415246630942],
        'Sun': null,
        'HD 10180': [-68.25830277523994, 52.92520452735363, 92.80157703921971],
        'Kepler-90': [-173.61122965974192, 1448.00591950006, -2084.5084196005596],
        'Gliese 667 C': [10.896255655714036, -17.532596898521373, 9.522265664891716],
        'HD 219134': [-16.034878818331286, 6.7051134387771025, 12.399801099313779],
        'tau ceti': [-7.348373975649817, -8.966760485982912, 2.7085466148903614],
        'HD 40307': [-34.08155637669682, -21.03977322734041, 13.862934868740846],
        'Gliese 581': [-2.306532255654748, -1.3269252260781572, -20.078753716681728],
        'TRAPPIST-1': [6.611653176571944, 11.558431830781737, 38.740674990977574]
    }
    var spacialTrace02 = {
        'x':[ 0], 'y': [0], 'z': [0],
        'mode': 'markers',
        'name': 'Sun',
        'text': 'Sun',
        'marker': {
            'size': 8,
            'color': 'yellow',
            'line': {
            'width': 0.5,
            'opacity': .5
            },
            'opacity': 1,
        },
        'type': 'scatter3d'
    }
    if (!(starCoords[starName])){
        return Plotly.newPlot('chart2', [spacialTrace01, spacialTrace02], spacialLayout)
    }
    
    coord = starCoords[starName]
    var spacialTrace03 = {
        'x':[coord[0]], 'y': [coord[1]], 'z': [coord[2]],
        'mode': 'markers',
        'name': 'System ' + starName,
        'text': starName,
        'marker': {
            'size': 10,
            'color': 'orange',
            'line': {
            'width': 0.5,
            'opacity': .5
            },
            'opacity': 1,
        },
        'type': 'scatter3d'
    }
    console.log(spacialTrace02)
    Plotly.newPlot('chart2', [spacialTrace01, spacialTrace02, spacialTrace03], spacialLayout)

}

function starTable () {
    const starName = document.getElementById("stars").value;
    //filter all the planets for this sun
    const indexOfStarName = system_headers.indexOf("HostStar")
    const planet = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starName.toLowerCase())[0];

    rows = [
        "HostStarMassSlrMass", //4
        "HostStarRadiusSlrRad", //6
        "HostStarInnerHabitabilityAU", //17
        "HostStarOuterHabitabilityAU", //18
        "HostStarTempK", //7
        "HostStarClass", //19
        "HostStarMetallicity", //5
        "HostStarLuminosity", //16
        "HostStarDistanceFromSunLY", //21
    ]

    tableHTML = '<table style="width:100%; text-align:center"><tr><th>HostStar</th><th>'+starName+ '</th></tr>'
    rows.forEach(row => {
        if (isNaN(planet[system_headers.indexOf(row)])){
            var value = planet[system_headers.indexOf(row)]
        } else {value = +Number.parseFloat(planet[system_headers.indexOf(row)]).toFixed(4)}
        tableHTML += `<tr><th style="background-color:black">${row.slice(8)}</th><td>${value}</td></tr>`
    })
    tableHTML += '</table>'
    d3.select('#star-table').html(tableHTML)

}

function planetTable () {
    const starName = document.getElementById("stars").value;
    //filter all the planets for this sun
    const indexOfStarName = system_headers.indexOf("HostStar")
    const planets = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starName.toLowerCase());

    rows = [
        "PlanetaryMassJpt", //10
        "RadiusJpt", //11
        "SemiMajorAxisAU", //12
        "PeriodDays", //9
        "SurfaceTempK", //13
        "DiscoveryMethod", //1
        "DiscoveryYear", //2
        "Eccentricity", //3
        "ListsPlanetIsOn", //8
    ]

    tableHTML = '<table style="width:100%; text-align:center;"><tr><th>Planet</th>'
    planets.forEach(planet => {
        tableHTML += '<th>' +planet[0]+ '</th>'
    })

    tableHTML += '</tr>'
    rows.forEach(row => {
        rowHTML = '<tr><th>'+ row + '</th>'
        index = system_headers.indexOf(row)
        planets.forEach(planet => {
            if (isNaN(value = planet[index])){
                var value = planet[index]
            } else {value = +Number.parseFloat(planet[index]).toFixed(4)}

            rowHTML += '<td>'+ value +'</td>'
        })
        rowHTML += '</tr>'
        tableHTML += rowHTML
    })
    tableHTML += '</table>'
    console.log(tableHTML)
    d3.select('#planet-table').html(tableHTML)
}
/*function buildPlot_0() {
    const starName = document.getElementById("stars").value; 

    const indexOfStarName = system_headers.indexOf("HostStar")
    //planets is array of each planet data array for the system
    const planets = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starName.toLowerCase());
    var names = []
    var radii = []
    var mass = []
    var sizes = []
    planets.forEach(planet => {
        console.log('radius', planet[11], 'mass', planet[10] )
        names.push(planet[0])
        if (planet[11]) {
            var rad = Number.parseFloat(planet[11])
            radii.push(rad)
            sizes.push(rad*20)
        } else {
            var rad = (((Number.parseFloat(planet[10])/4)**.33)*density)
            radii.push(rad)
            sizes.push(rad*20)
        }
        if (planet[10]) {
            mass.push(planet[10])
        }
        else {mass.push((((rad/density)**3)*4))}
    })


    var bubbleTrace02 = {
        'name': starName + ' System',
        'marker': {'color': 'red', 'opacity': 0.9, 'size': sizes},
        'mode': 'lines+markers',
        'text': names,
        'x': mass,
        'y': radii
    }

    Plotly.newPlot('chart0', [bubbleTrace01, bubbleTrace02], );
}*/

buildSolarSystem();
starTable();
planetTable();