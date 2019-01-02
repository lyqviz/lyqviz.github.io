(function() {

  var margin = { top: 30, left: 30, right: 100, bottom: 30},
      height = 600 - margin.top - margin.bottom,
      width = 800 - margin.left - margin.right;

  console.log("Building chart 2");

  var svg = d3.select("#chart-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create your scales
  var monthNames = ['Jan','Feb','March','April','May','June','July','Aug','Sept','Oct','Nov','Dec'];
  
  var xPositionScale = d3.scalePoint()
    .domain(monthNames)
    .range([0, width])

  var yPositionScale = d3.scaleLinear()
    .domain([1984,2016])
    .range([height, 0])

  var radiusScale = d3.scaleSqrt().domain([0, 1200000]).range([0, 35])

  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(100)
    .startAngle(0)
    .endAngle(Math.PI / 2);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<span style='color:black'>" + "<strong>" + d.na_l3name + "</strong>" + ':'+"<strong>" + d.acres_burned + ' acres'+ "</strong>" + "<br>" 
      + "<span style='color:grey'>"+ 'temperature:' + d.max_air_temp+'ºF' + "<br>" + 'wind speed:' + d.mean_wind_speed
    })

  svg.call(tip)

  d3.queue()
    .defer(d3.csv, "data/wildfire.csv")
    .await(ready)

  // Import your data file using d3.queue()

  function ready(error, datapoints) {

    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("cx", function(d) {
        return xPositionScale(d.month)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.year)
      })
      .attr("r", function(d) {
        return radiusScale(d.acres_burned)
      })
      .attr('fill', '#e34a33')
      .attr('opacity', 0.25)
      .on('mouseover', function(d) {
        d3.select(this)
          .transition()
          .duration(300)
          tip.show(d)     
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .duration(300)
          tip.hide(d)
      })
      // .on("mouseenter", function(d){
      //   var element = d3.select(this)
      //   element
      //     .attr("r", 9)
      //     .on("mouseleave", function(d){
      //       element
      //         .attr("r", 3)
      //     })
      // })
      // .on('mouseover', tip.show)
      // .on('mouseout', tip.hide)

    svg.append("text")
      // .text("acres_burned")
      .attr("x", width / 2)
      .attr("y", 0)
      .attr('fill', 'grey')
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("font-weight", "bold")
  
    var xAxis = d3.axisTop(xPositionScale)
      .tickSize(height)
      .tickValues(monthNames)
    
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.selectAll(".x-axis path").remove()

    var yAxis = d3.axisLeft(yPositionScale)
      .tickSize(-width)
      .tickValues([1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015])

    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    svg.selectAll(".y-axis path").remove()


    svg.selectAll(".tick line")
      .attr("stroke-dasharray", 1.5)
      .attr('stroke', 'lightgrey')

  }
})();



    // var nested = d3.nest()
    //   .key(function(d){
    //     return d.month
    //   })
    //   .entries(datapoints);

    // var multiples = svg.selectAll('g')
    //   .data(nested)
    //   .enter().append('g')
    //   .attr('transform', function(d){
    //     var xPosition = xPositionScale(d.key);
    //     return "translate(" + xPosition + ",150)"
    //   })


    // multiples.each( function (d) {

      // d3.select(this).selectAll("path")
      // .data(pie(d.values))
      // .enter().append("path")
      // .attr("d", arc)