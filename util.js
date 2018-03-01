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
    ids = ['chart1','chart2','chart3','chart4']
    ids.forEach(id => { 
        d3.select('#'+id).remove();

    })
}

function addChartsGroup1(){
    ids = ['chart1','chart2']
    ids.forEach(id => { 
        d3.select('#charts_1_2').append('div').attr('id', id).attr('class',
        id === 'chart1' ? 'chart_first' : 'chart_second');
    });
    buildPlots();
}

function addChartsGroup2(){
    ids = ['chart3','chart4']
    ids.forEach(id => { 
        d3.select('#charts_3_4').append('div').attr('id', id).attr('class', 
        id === 'chart2' ? 'chart_first' : 'chart_second');
    });
    //buildPlots();
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
        handleTabClick();
     }
                             
}

function addHomeDivs(systemDesc_2, starN){
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