(function() {

  var margin = {top: 50, left: 50, right: 20, bottom: 20},
  height = 400 - margin.top - margin.bottom,
  width = 240 - margin.left - margin.right;
  
  var container = d3.select("#chart-3")
    .style("margin-left", "-10%")

  var xPositionScale = d3.scalePoint()
    .range([0, width])
  var yPositionScale = d3.scaleLinear()
    .domain([0, 20000])
    .range([height, 0])

  d3.queue()
    .defer(d3.csv, "middle-class-income.csv")
    .defer(d3.csv, "middle-class-income-usa.csv")
    .await(ready)

  function ready(error, others, usa) {

    years = usa.map(function(d){
      return d.year
    })

    var others_nested = d3.nest()
      .key(function(d){
        return d.country
      })
      .entries(others)

    xPositionScale.domain(years)

    var line = d3.line()
      .x(function(d){
        return xPositionScale(d.year)
      })
      .y(function(d){
        return yPositionScale(d.income)
      })

    container.selectAll("svg")
      .data(others_nested)
      .enter().append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .each(function(d){

        var svg = d3.select(this)

        var xAxis = d3.axisBottom(xPositionScale).tickValues(["1980", "1990", "2000", "2010"])
        svg.append("g")
          .attr("class", "axis x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        var yAxis = d3.axisLeft(yPositionScale).tickValues([5000, 10000, 15000, 20000]).tickFormat(function(d) { return "$" + d3.format(",")(d); })
        svg.append("g")
          .attr("class", "axis y-axis")
          .call(yAxis);

        svg.selectAll(".y-axis .tick line")
          .attr("x2", width)
          .attr("stroke-dasharray", 2)
          .attr("stroke", "lightgrey")

        svg.selectAll(".x-axis .tick line")
          .attr("y2", -height)
          .attr("stroke-dasharray", 2)
          .attr("stroke", "lightgrey")

        svg.selectAll(".domain")
          .remove()
          
        svg.append("path")
          .attr("d", line(usa))
          .attr("fill", "none")
          .attr("stroke", "grey")
          .attr("stroke-width", 3)

        svg.append("path")
          .attr("d", function(d){
            return line(d.values)
          })
          .attr("fill", "none")
          .attr("stroke", "#9e4b6c")
          .attr("stroke-width", 3)

        svg.append("text")
          .text(d.key)
          .attr("x", width/2)
          .attr("y", -margin.top/2)
          .attr("text-anchor", "middle")
          .attr("fill", "#9e4b6c")
          .attr("font-weight", "bold")

      })

  }
  
})();