function draw_lineAdolescent(){

var xAxisLine2 = d3.svg.axis()
	.scale(xScaleLine)
	.orient("bottom")
	.ticks(0)
	.tickFormat(function(d){
		return dateFormat(d);
	})
	.innerTickSize([0]);

var yAxisLine2 = d3.svg.axis()
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

var svgLine = d3.select("#line2")
	.append("svg")
	.attr("width",widthLine)
	.attr("height",heightLine);

d3.csv("data/adolescentFertility.csv",function(data){
	var years = ["1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010","2011","2012","2013","2014"]; 
var dataSet = [];

data.forEach(function(d,i){
	var fertilityRate = [];

	years.forEach(function(y){
		if (d[y]){
			fertilityRate.push({
				year: y,
				amount:d[y],
				country: d.country,
				countryCode:d.countryCode
			});
		}
	});
	dataSet.push({
		country: d.country,
		rates: fertilityRate,
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

var groupsLine = svgLine.selectAll("g.lines")
	.data(dataSet)
	.enter()
	.append("g")
	.attr("class","lines")
	.attr("id",function(d){
		return d.countryCode
	});

groupsLine.selectAll("path")
	.data(function(d){
		return [d.rates];
	})
	.enter()
	.append("path")
	.attr("class","line")
	.attr("d",line);

svgLine.append("g")
	.attr("class","x axis")
	.attr("transform","translate(0," + (heightLine - marginLine.bottom) + ")")
	.call(xAxisLine2);
svgLine.append("g")
	.attr("class","y axis")
	.attr("transform","translate(" + marginLine.left + ",0)")
	.call(yAxisLine2);

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
    .text("1960");

svgLine.append("text")      
    .attr("x", widthLine - marginLine.right - marginLine.left*3 )
    .attr("y", heightLine - 20 )
    .style("text-anchor", "middle")
    .attr("class","lineLabel")
    .text("2014");

d3.selectAll("path.line").classed("unfocused",true);

});// end of csv

}
// end of function draw line

draw_lineAdolescent();