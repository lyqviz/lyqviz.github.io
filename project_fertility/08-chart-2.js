(function() {

  var margin = { top: 30, left: 30, right: 150, bottom: 30},
    height = 200 - margin.top - margin.bottom,
    width = 300 - margin.left - margin.right;

  var container = d3.select("#chart-2")
    .style("margin-left", "-10%")
    .style("margin-right", "-10%")

  var xPositionScale = d3.scaleLinear()
    .domain([10,55])
    .range([0, width])
  var yPositionScale = d3.scaleLinear()
    .domain([0, 0.3])
    .range([height, 0])

  d3.queue()
    .defer(d3.csv, "fertility.csv")
    .await(ready)

  function ready(error, datapoints) {

    var nested = d3.nest()
      .key( function(d) {
        return d.Year;
      })
      .entries(datapoints);

    container.selectAll("svg")
      .data(nested)
      .enter().append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", (width + margin.left + margin.right)/2)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .each(function(d){
        
        var svg = d3.select(this)
        svg.append("text")
          .text(d.key)
          .attr("x", width/2)
          .attr("y", -margin.top/2)
          .attr("text-anchor", "middle")

        var area_jp = d3.area()
          .x0(function(d){
            return xPositionScale(d.Age)
          })
          .y0(function(d){
            return yPositionScale(0)
          })
          .x1(function(d){
            return xPositionScale(d.Age)
          })
          .y1(function(d){
            return yPositionScale(d.ASFR_jp)
          })

        var area_us = d3.area()
          .x0(function(d){
            return xPositionScale(d.Age)
          })
          .y0(function(d){
            return yPositionScale(0)
          })
          .x1(function(d){
            return xPositionScale(d.Age)
          })
          .y1(function(d){
            return yPositionScale(d.ASFR_us)
          })

        svg.selectAll(".usa")
          .data(nested)
          .enter().append("path")
          .attr("class", "usa")
          .attr("d", area_us(d.values))
          .attr("fill", "lightblue")
          .attr("fill-opacity", 0.1)

        svg.selectAll(".japan")
          .data(nested)
          .enter().append("path")
          .attr("class", "japan")
          .attr("d", area_jp(d.values))
          .attr("fill", "red")
          .attr("fill-opacity", 0.01)

        var sum_jp = d3.sum(d.values, function(d){
          return d.ASFR_jp
        })

        var sum_us = d3.sum(d.values, function(d){
          return d.ASFR_us
        })

        formatDecimal = d3.format(".2f")

        svg.append("text")
          .text(formatDecimal(sum_us))
          .attr("x", xPositionScale(40))
          .attr("y", yPositionScale(0.2))
          .attr("fill", "lightblue")

        svg.append("text")
          .text(formatDecimal(sum_jp))
          .attr("x", xPositionScale(40))
          .attr("y", yPositionScale(0.15))
          .attr("fill", "red")

        var xAxis = d3.axisBottom(xPositionScale)
          .tickValues([15,30,45])

        svg.append("g")
          .attr("class", "axis x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        var yAxis = d3.axisLeft(yPositionScale)
          .ticks(3)
    
        svg.append("g")
          .attr("class", "axis y-axis")
          .call(yAxis);

      })
  }
  
})();