var height = 40
var width = 40
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

// The scale you use for bubble size
var size = d3.scaleSqrt()
  .domain([0, 14000000])  // What's in the data, let's say it is percentage
  .range([3, 500])  // Size in pixel

// Add legend: circles
var valuesToShow = [10000, 100000, 1000000]
var xCircle = 5
var xLabel = 30
var yCircle = 5
svg
  .selectAll("legend")
  .data(valuesToShow)
  .enter()
  .append("circle")
    .attr("cx", xCircle)
    .attr("cy", function(d){ return yCircle - size(d) } )
    .attr("r", function(d){ return size(d) })
    .style("fill", "none")
    .attr("stroke", "black")

// Add legend: segments
svg
  .selectAll("legend")
  .data(valuesToShow)
  .enter()
  .append("line")
    .attr('x1', function(d){ return xCircle + size(d) } )
    .attr('x2', xLabel)
    .attr('y1', function(d){ return yCircle - size(d) } )
    .attr('y2', function(d){ return yCircle - size(d) } )
    .attr('stroke', 'black')
    .style('stroke-dasharray', ('2,2'))

// Add legend: labels
svg
  .selectAll("legend")
  .data(valuesToShow)
  .enter()
  .append("text")
    .attr('x', xLabel)
    .attr('y', function(d){ return yCircle - size(d) } )
    .text( function(d){ return d } )
    .style("font-size", 10)
    .attr('alignment-baseline', 'middle')