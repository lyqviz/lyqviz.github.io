var start_val = 72.5432,
    start_val2 = 1990,
    end_val = [31.8350]
    end_val2 = [2015];

var qSVG = d3.select("#number").append("svg").attr("width","100%").attr("height",200);

qSVG.selectAll("#txt2")
    .data(end_val2)
    .enter()
    .append("text")
    .text(start_val2)
    .attr("class", "count")
    .attr("id","txt2")
    .attr("x", "45%")
    .attr("y", "100%")
    .attr("fill","grey")
    .attr("opacity",0.9)
    .transition()
    .duration(5000)
        .tween("text", function(d) {
            var i = d3.interpolate(this.textContent, d),
                prec = (d + "").split("."),
                round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

            return function(t) {
                this.textContent = Math.round(i(t) * round) / round;
            };
        });

var qSVG = d3.select("#number").append("svg").attr("width","100%").attr("height",100);

qSVG.selectAll("#txt")
    .data(end_val)
    .enter()
    .append("text")
    .text(start_val)
    .attr("class", "count")
    .attr("id","txt")
    .attr("x", "43.5%")
    .attr("y", "90%")
    .attr("fill","grey")
    .attr("opacity",0.9)
    .transition()
    .duration(5000)
        .tween("text", function(d) {
            var i = d3.interpolate(this.textContent, d),
                prec = (d + "").split("."),
                round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

            return function(t) {
                this.textContent = Math.round(i(t) * round) / round;
            };
        });

function draw_round(){
    var roundScale = d3.scale.linear()
    .range([ 100,350])
    .domain([end_val,start_val]);

    var qSVG2 = d3.select("#clearStyle").append("svg").attr("width","100%").attr("height",700)
                ;

    var round = qSVG2.append("circle")
                        .attr("id","round")
                        .attr("cx", "50%")
                        .attr("cy", "50%")
                        .attr("r", roundScale(start_val))
                        .attr("fill","rgba(51, 51, 153,0.6)");

        round.transition()
            .duration(5000)
            .attr("r",roundScale(end_val))
            .attr("cy","65%");

}

draw_round();







