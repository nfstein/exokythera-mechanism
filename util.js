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
}

function removeChartsTab(){
    ids = ['chart0','chart1','chart2','chart3','chart4']
    ids.forEach(id => { 
        d3.select('#'+id).remove();

    })
}

function addChartsGroup0(){
    ids = ['chart0']
    ids.forEach(id => { 
        divForSvg.append('div').attr('id', id).attr('class',
        id === 'chart0' ? 'chart_first' : 'chart_second').attr('style',"padding-left:100px");
    });
    buildPlot_0();
}

function addChartsGroup1(){
    ids = ['chart1','chart2']
    ids.forEach(id => { 
        d3.select('#charts_1_2').append('div').attr('id', id).attr('class',
        id === 'chart1' ? 'chart_first' : 'chart_second');
    });
    buildPlot_0();
}

function addChartsGroup2(){
    ids = ['chart3','chart4']
    ids.forEach(id => { 
        d3.select('#charts_3_4').append('div').attr('id', id).attr('class', 
        id === 'chart2' ? 'chart_first' : 'chart_second');
    });
    //buildPlot_0();
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
    var h1 = d3.select("div.w3-padding-large").append("h1")
    .attr("class", "w3-center")
    .append("a")
    .attr("href", systemLinks[0][starN]).attr("target","_blank").text(starN);
    var p1 = d3.select("div.w3-padding-large").append("p")
    .attr("class", "w3-large")
    .text(systemDesc_1[0][starN]);
    var p2 = d3.select("div.w3-padding-large").append("p")
    .attr("class", "w3-large w3-hide-medium")
    .text(systemDesc_2[0][starN]+" To know more about your favorite system click ").append("a")
    .attr("href", systemLinks[0][starN]).attr("target","_blank").text("here.");
    ;
}