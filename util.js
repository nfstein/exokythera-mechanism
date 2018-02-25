function getPath(planet) {
    var scaledOrditRadius = ((Number.parseFloat(planet[12] ? planet[12] : 0.0)*5 + Number.parseInt(50)));
    var dFormula = "M " + sunXPosition + " " + sunYPosition +
        " m " + -scaledOrditRadius + ", 0" +
        " a " + scaledOrditRadius + "," + scaledOrditRadius + " 0 1,0 " + scaledOrditRadius * 2 + ",0" +
        " a " + scaledOrditRadius + "," + scaledOrditRadius + " 0 1,0 " + -scaledOrditRadius * 2 + ",0";
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

function menuBarHandler(event){ 
     var previousMenu = d3.selectAll("a")
                        .attr("class","");
     var currentSelection = d3.select(event)
                            .attr("class","active");                   
}