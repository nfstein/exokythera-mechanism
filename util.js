var menuSelected="desc";
function getPath(radius) {
    var dFormula = "M " + sunXPosition + " " + sunYPosition +
        " m " + -radius + ", 0" +
        " a " + radius + "," + radius + " 0 1,0 " + radius * 2 + ",0" +
        " a " + radius + "," + radius + " 0 1,0 " + -radius * 2 + ",0";
    return dFormula;
};
function compare(a, b) {
    if (a["habitability"] > b["habitability"])
        return -1;
    if (a["habitability"] < b["habitability"])
        return 1;
    return 0;
};

function cleanSvg() {
    d3.selectAll("defs").data([]).exit().remove();
    d3.selectAll("path").data([]).exit().remove();
    d3.selectAll("circle").data([]).exit().remove();
    d3.selectAll("rect").data([]).exit().remove();
    d3.selectAll("text").data([]).exit().remove();
    d3.selectAll("h1").data([]).exit().remove();
    d3.selectAll("h5").data([]).exit().remove();
    d3.selectAll("p").data([]).exit().remove();

    
}

function removeHomeTab(){
    d3.selectAll("h1").data([]).exit().remove();
    d3.selectAll("h5").data([]).exit().remove();
    d3.selectAll("p").data([]).exit().remove();
    d3.select('div.w3-padding-smaller').attr("class","w3-col m6 w3-padding-smaller");
    d3.select('div#all').attr("class","");
}

function removeChartsTab(){
    ids = ['chart0','chart1','chart2','chart3','chart4']
    ids.forEach(id => { 
        d3.select('#'+id).remove();
    })
}


function addChartsAll(){
    ids = ['chart0','chart1','chart2','chart3','chart4'];
    var divAll =   d3.select('div#all').attr("class","scroll-area");
    ids.forEach(id => { 
        d3.select("div#all").append("div").attr('id',id);
    })
    buildPlotsAll();
}



function menuBarHandler(event){ 
     var previousMenu = d3.selectAll("a")
                        .attr("class","");
     var currentSelection = d3.select(event)
                            .attr("class","active");    
     menuSelected = (event.id).split("#")[0];  
     if(menuSelected === "desc"){
        buildSolarSystem();
     }
     else{
        const starName = document.getElementById("stars").value;
        //filter all the planets for this sun
        const indexOfStarName = system_headers.indexOf("HostStar")
        const planets = system_data.filter(x => x[indexOfStarName] && x[indexOfStarName].toLowerCase() === starName.toLowerCase());
    
        handleTabClick(0,planets,);
     }
                             
}

function addHomeDivs(systemDesc_2, starN){
    d3.select('div.w3-padding-smaller').attr("class","w3-col m6 w3-padding-smaller scroll-area_0");
    var h1 = d3.select("div.w3-padding-smaller").append("h1")
    .attr("class", "w3-center")
    .append("a")
    .attr("href", systemLinks[0][starN]).attr("target","_blank").text(starN);
    var p1 = d3.select("div.w3-padding-smaller").append("p")
    .attr("class", "w3-large")
    .text(systemDesc_1[0][starN]);
    var p2 = d3.select("div.w3-padding-smaller").append("p")
    .attr("class", "w3-large w3-hide-medium")
    .text(systemDesc_2[0][starN]+" To know more about your favorite system click ").append("a")
    .attr("href", systemLinks[0][starN]).attr("target","_blank").text("here.");
    ;
}