var fullwidth = 280,
	fullheight = 100;

var marginBar = {top:30, right:20, bottom:40, left:10};

var widthBar = fullwidth - marginBar.left - marginBar.right,
   	heightBar = fullheight - marginBar.top - marginBar.bottom;

var widthScale = d3.scale.linear()
					.range([0, widthBar-marginBar.left*2 -marginBar.right]).domain([0,100]);

var heightScale = d3.scale.ordinal()
					.rangeRoundBands([marginBar.top, fullheight]);

var barEducation = d3.select("#bar1")
			.append("svg")
			.attr("width", fullwidth)
			.attr("height", fullheight);

function draw_bar(dataFilter1){

console.log(dataFilter1);

	var xAxisBar = d3.svg.axis()
				.scale(widthScale)
				.ticks(1)
				.orient("bottom");

	var yAxisBar = d3.svg.axis()
				.scale(heightScale)
				.orient("left")
				.innerTickSize([0])
				.outerTickSize([0]);

    var rectsBar = barEducation.selectAll("rect")
					.data(dataFilter1, function(d) {return d.country;});

     update_bars(dataFilter1);

} // end of draw_bar


function update_bars(data) {

	heightScale.domain(data.map(function(d) { return d.country; } ));

	var rectsBar = barEducation.selectAll("rect")
					.data(data, function(d) {return d.country;});

	rectsBar
		.enter()
		.append("rect")
		.attr("x", marginBar.left)
		.attr("width",0)
		.attr("height", 20)
		.attr("id",function(d){
			return d.country;
		});

    rectsBar
    .exit()
    .transition()
    .duration(1000)
    .attr("width",0)
    .attr("opacity",0)
    .remove();

	rectsBar
		.transition()
		.duration(1000)
    .attr("y", function(d,i){
      //return i*30 + 25
      return heightScale(d.country);
    })
		.attr("width", function(d) {
			return widthScale(+d.youthLiteracyRate);
		});

	d3.selectAll("rect")
        .attr('fill',function(d){
            if (d.country === "World"){
               	return "blue";
       		} 
            else {
                return "orange";
            }})
        .attr("opacity",0.5);

    var labelBar = barEducation.selectAll("text")
            			.data(data, function(d) {return d.country;});

    labelBar
        .enter()
        .append("text")
        .attr("class", "avg");

    labelBar
      .exit()
      .transition()
      .duration(1000)
      .attr("opacity",0)
      .remove();

    labelBar
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
        		if (d.youthLiteracyRate === 0){
        			return "No data";
        		}else
        		if(d.youthLiteracyRate !== 0){
                return d.country + ": " +Math.round(d.youthLiteracyRate*100)/100 + "%";
            }})
         	.attr("font-family", "sans-serif")
         	.attr("font-size", "11px")
       		.attr("fill", "#000000");


	} // end update

