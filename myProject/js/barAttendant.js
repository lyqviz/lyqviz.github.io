var barAttendant = d3.select("#bar2")
			.append("svg")
			.attr("width", fullwidth)
			.attr("height", fullheight);

function draw_bar2(dataFilter2){
	console.log(dataFilter2);

	var xAxisBar = d3.svg.axis()
				.scale(widthScale)
				.ticks(1)
				.orient("bottom");

	var yAxisBar = d3.svg.axis()
				.scale(heightScale)
				.orient("left")
				.innerTickSize([0])
				.outerTickSize([0]);

    var rectsBar2 = barAttendant.selectAll("rect")
					.data(dataFilter2,function(d){return d.country;});

	update_bars2(dataFilter2);

}; // End of draw

function update_bars2(data){

	heightScale.domain(data.map(function(d) { return d.country; } ));

	console.log(data);

	var dataNew = []

	data.forEach(function(d){
		if(d.skilledAttendant != "_"){
			dataNew.push({
				country : d.country,
				skilledAttendant : +d.skilledAttendant
			})
		}
	})

	var rectsBar2 = barAttendant.selectAll("rect")
					.data(dataNew,function(d){return d.country;});

	rectsBar2
		.enter()
		.append("rect")
		.attr("x", marginBar.left)
		.attr("width",0)
		.attr("height", 20)
		.attr("id",function(d){
			return d.country;
		});

	rectsBar2
		.transition()
		.duration(1000)
		.attr("y", function(d,i){
      		return heightScale(d.country);
    	})
		.attr("width", function(d) {
			return widthScale(+d.skilledAttendant);
		});

	rectsBar2
		.exit()
		.transition()
		.duration(1000)
		.attr("width",0)
		.attr("opacity",0)
		.remove();

	var labelBar2 = barAttendant.selectAll("text")
            			.data(dataNew,function(d){return d.country});

    labelBar2
        .enter()
        .append("text")
        .attr("class", "avg");

    labelBar2
    		.transition()
    		.duration(1000)
    		.attr("x", function (d) {
        		console.log("in text: " + d.country);
            		return marginBar.left + 5;
        	})
         	.attr("y", function(d, i) {
          		return heightScale(d.country) + 13;  // location of label
        	})
        	.text(function (d) {
        		if (d.skilledAttendant === 0){
        			return "No data";
        		}else
        		if(d.skilledAttendant!== 0){
                return d.country + ": " + Math.round(d.skilledAttendant*100)/100 + "%";
            }})
         	.attr("font-family", "sans-serif")
         	.attr("font-size", "11px")
       		.attr("fill", "#000000");

    labelBar2
    	.exit()
    	.transition()
    	.duration(1000)
    	.attr("opacity",0)
    	.remove();

    d3.selectAll("rect")
        .attr('fill',function(d){
            if (d.country === "World"){
               	return "#333399";
       		} 
            else {
                return "orange";
            }})
        .attr("opacity",0.5);

}//end of update bars


