
var width = 700;
var height = 600;
var margin = {top:20,right:10,bottom:50,left:50};

var colors = d3.scale.category10();
				
var colorsNone = function(d) {
	if (d === "None") {
		return "rgba(51,51,153,0.6)";
	}
	else { 
		return "grey"; 
	}
};

var colorFunction = colorsNone; 

var dotRadius = 6; 

var xScale = d3.scale.linear()
	.range([ margin.left, width - margin.right - margin.left ]);

var yScale = d3.scale.linear()
	.range([ height - margin.bottom, margin.top ]);

var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.ticks(5);  

var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left")
	.ticks(5);

var svg = d3.select("#vis")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

var drawylabel = svg
    .append('text')
    .attr("transform", "rotate(-90)")
    .attr("x", -margin.top)
    .attr("y", -margin.left +103 )
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .attr("class", "label");

var tooltip = d3.select("body")
				.append("div")
				.attr("class","tooltip")

drawylabel.transition().duration(1000)

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(xAxis)
    .append("text")
    .attr("x", width - margin.left - margin.right/2)
    .attr("y", -15)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .attr("class", "label")
    .text("Female Youth Literacy Rate");

svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis)
    /*.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -margin.top)
    .attr("y", -2*margin.left / 3)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .attr("class", "label")
    .text(label);*/

function draw_circles(data){
	//console.log(data);
	//console.log(showScatter);
	//svg.style("display",showScatter);

	xScale.domain([
		d3.min(data,function(d){
			return d.x;
		}) - 4,
		d3.max(data,function(d){
			return d.x;
		}) 
	]);

	yScale.domain([
		d3.min(data,function(d){
			return + d.y;
		}) - 7,
		d3.max(data,function(d){
			return + d.y;
		}) +2
	]);

	var circles = svg.selectAll("circle")
		.data(data,function(d){return d.country;});

	circles
		.enter()
		.append("circle")
		.attr("r", 0)
		.attr("opacity",0)
		.attr("id",function(d){
				return d.country;
			})
		.attr("class","dots");
				
			
	circles.transition().duration(1000).attr("cx", function(d) {
				return xScale(+d.x);
			})
			.attr("cy", function(d) {
				return yScale(+d.y);
			})
			.attr("r",dotRadius)
			.attr("fill",function(d){
				return colorFunction(d.Region);
			})
			.attr("stroke",function(d){
				if (d.country ==="World"){
					return colorFunction(d.Region);
				} else{
					return "none"
				}
			})
			.attr("opacity",0.7);

	circles.exit().transition().duration(1000).attr("r",0).attr("opacity",0).remove();

	svg.select('.x.axis').transition().duration(1000).call(xAxis);
	svg.select('.y.axis').transition().duration(1000).call(yAxis);

	circles
		.on("mouseover", mouseoverFunc) 
      	.on("mousemove", mousemoveFunc) 
      	.on("mouseout", mouseoutFunc);

};

function getData(data){
  data.forEach(function(d){
    d.x = +d.youthLiteracyRate;
    d.y = +d.under5Mortality;
    d.yLabel = "Under 5 Mortality Rate"
  })
  return data;
}

function getData2(data){
  data.forEach(function(d){
    d.x = +d.youthLiteracyRate;
    d.y = +d.adolescentFertilityRate;
    d.yLabel = "Adolescent Fertility Rate"
  })
  return data;
}



function mouseoverFunc(d){
	d3.selectAll(".dots").attr("r",dotRadius);
	d3.select(this).attr("r",9);
	console.log(d);
	return tooltip
		.style("display",null)
		.html("<p>Country: " + d.country +
			"<br>Region: " + d.Region +
			"<br>Female youth literacy rate: " + d.x
			+ "%<br>" + d.yLabel + ": " + d.y + " per thousand</p>");
}

function mousemoveFunc(d){
				return tooltip
					.style("top",(d3.event.pageY - 10) + "px")
					.style("left",(d3.event.pageX + 10) + "px");
			}

function mouseoutFunc(d){
	d3.selectAll(".dots").attr("r",dotRadius);
				return tooltip
					.style("display","none");

			}



















