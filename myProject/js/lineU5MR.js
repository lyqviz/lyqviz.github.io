
var widthLine = 280;
var heightLine = 280;

var marginLine = {top:20, right:20, bottom:40, left:10};

var dateFormat = d3.time.format("%Y");

var xScaleLine = d3.time.scale()
	.range([marginLine.left,widthLine-marginLine.left*2 - marginLine.right]);
var yScaleLine = d3.scale.linear()
	.range([marginLine.top, heightLine- marginLine.bottom]);

function draw_lineU5MR(){

var xAxisLine = d3.svg.axis()
	.scale(xScaleLine)
	.orient("bottom")
	.ticks(0)
	.tickFormat(function(d){
		return dateFormat(d);
	})
	.innerTickSize([0]);

var yAxisLine = d3.svg.axis()
	.scale(yScaleLine)
	.orient("right")
	.tickSize(widthLine - marginLine.right - marginLine.left*3 )
	.ticks(3)
	.outerTickSize([0]);

var line = d3.svg.line()
	.x(function(d){
		return xScaleLine(dateFormat.parse(d.year));
	})
	.y(function(d){
		return yScaleLine(+d.amount);
	});

var svgLine = d3.select("#line")
	.append("svg")
	.attr("width",widthLine)
	.attr("height",heightLine);

d3.csv("data/U5MR.csv",function(data){
	var years = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010","2011","2012","2013","2014","2015"]; 

var dataSet = [];

data.forEach(function(d,i){
	var mortality = [];

	years.forEach(function(y){
		if (d[y]){
			mortality.push({
				year: y,
				amount:d[y],
				countryCode: d.countryCode
			});
		}
	});
	dataSet.push({
		country: d.country,
		rates: mortality,
		countryCode: d.countryCode
	});

});

xScaleLine.domain(
	d3.extent(years,function(d){
		return dateFormat.parse(d);
}));
yScaleLine.domain([
	d3.max(dataSet,function(d){
		return d3.max(d.rates,function(d){
			return +d.amount;
		});
	}),
	0
]);

var groups = svgLine.selectAll("g.lines")
	.data(dataSet)
	.enter()
	.append("g")
	.attr("class","lines");

groups.selectAll("path")
	.data(function(d){
		return [d.rates];
	})
	.enter()
	.append("path")
	.attr("class","line")
	.attr("d",line)
	.attr("id",function(d){
		return d.countryCode;
	});

d3.selectAll("path.line").classed("unfocused",true);

svgLine.append("g")
	.attr("class","x axis")
	.attr("transform","translate(0," + (heightLine - marginLine.bottom) + ")")
	.call(xAxisLine);
svgLine.append("g")
	.attr("class","y axis")
	.attr("transform","translate(" + marginLine.left + ",0)")
	.call(yAxisLine);

svgLine.append("text")      
    .attr("x", widthLine/2 - 15 )
    .attr("y", heightLine - 20 )
    .style("text-anchor", "middle")
    .attr("class","lineLabel")
    .text("Year");

svgLine.append("text")      
    .attr("x", marginLine.left + 10 )
    .attr("y", heightLine - 20 )
    .style("text-anchor", "middle")
    .attr("class","lineLabel")
    .text("1990");

svgLine.append("text")      
    .attr("x", widthLine - marginLine.right - marginLine.left*3 )
    .attr("y", heightLine - 20 )
    .style("text-anchor", "middle")
    .attr("class","lineLabel")
    .text("2015");


});
}//end of draw line function

draw_lineU5MR();