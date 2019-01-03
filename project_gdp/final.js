(function () {

  var margin = { top: 60, left: 200, right: 30, bottom: 50}
      height = 500 - margin.top - margin.bottom
      width = 1000 - margin.left - margin.right
  
  const plot = d3.select("#chart")
      .append("svg")
      .attr("height", height + margin.bottom + margin.top)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  const xPositionScale = d3.scaleLinear()
    .range([0, width])


  const yPositionScale = d3.scalePoint()
    .domain([ 
      'South Asia',
      'Europe & Central Asia',
      'Middle East & North Africa',
      'East Asia & Pacific', 
      'Sub-Saharan Africa',
      'Latin America & Caribbean',
      'North America', 
      ])
    .range([height,0])
    .padding(0.5)

  var colorScale = d3.scaleLog()
    .range(['white', '#08519c'])

  //Append a defs (for definition) element to your SVG
  var defs = plot.append("defs");

  //Append a linearGradient element to the defs and give it a unique id
  var linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient")

  linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")

  //Set the color for the start (0%)
  linearGradient.append("stop") 
      .attr("offset", "0%")   
      .attr("stop-color", "white")

  //Set the color for the end (100%)
  linearGradient.append("stop") 
      .attr("offset", "100%")   
      .attr("stop-color", "#08519c")

  plot.append("rect")
     .attr('class', 'radient_bar')
     .attr('x', width/2 - 175)
     .attr('y', -60)
     .attr("width", 170)
     .attr("height", 15)
     .style("fill", "url(#linear-gradient)")

   plot.append("text")
            .attr("x", width/2 -260)
            .attr("y", -50)
            .text("low income")
            .attr("font-size", "10px")

  plot.append("text")
            .attr("x", width/2 +10)
            .attr("y", -50)
            .text("high income")
            .attr("font-size", "10px")


  const tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        number = +d.yeartwo
        return "<strong>" + d.Country + "</strong>"
        + "<br>" +  "<span style='color:black'>" + "$" + number 
      })

  plot.call(tip)

  d3.queue()
    .defer(d3.csv, '../data/compileddata.csv')
    .await(ready)

  function ready(error, datapoints) { 


      const changeMax = d3.max(datapoints, function(d) { 
          return +d.growth
        })

      const changeMin = d3.min(datapoints, function(d) { 
          return +d.growth
        })

      console.log(changeMax)
      console.log(changeMin)

      xPositionScale.domain([changeMin, changeMax])

      const Max = d3.max(datapoints, function(d) { 
          return +d.yeartwo
        })

      const Min = d3.min(datapoints, function(d) { 
          return +d.yeartwo
        })

      console.log(Min)

      colorScale.domain([Min, Max])

      const yAxis = d3.axisLeft(yPositionScale)
      
      plot.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
        .select(".domain").remove()

      const xAxis = d3.axisBottom(xPositionScale)
        .tickSize(-height)
        .tickValues([ -50, 0, 50, 100, 150, 200, 300, 500, 1000])
        .tickFormat(function(d) { return d + "%"; })
      
      plot.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .select(".domain")
        .remove()

      plot.selectAll(".tick line")
          .attr("stroke-dasharray", 1.5)
          .attr('stroke', 'lightgrey')

      plot.selectAll("rect")
         .data(datapoints)
         .enter().append("rect")
         .attr("x", function(d) {
            return xPositionScale(d.growth)
         })
         .attr("y", function(d) {
            return yPositionScale(d.continent) - 15
         })
        .attr("height", 28)
        .attr('width', 3)
        .attr('stroke', '#08519c')
        .attr('stroke-width', 0.2)
        .attr('fill', function(d) {
            return colorScale(d.yeartwo)
        })
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

        const smallcolorScale = d3.scaleLinear()
           .range(['white', '#08519c']) 

        plot.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "end")
            .attr("x", width/2 + 50)
            .attr("y", height+30)
            .text("Change of GDP per capita from 1990 to 2017")
            .attr("font-size", "10px")

        d3.select("#low")
          .on('click', function() {
              plot.selectAll("rect")
                  .transition()
                  .duration(500)
                  .attr("fill", function(d) {
                    if(d.incomegroup == 'Low income') {
                      smallcolorScale.domain([Min,Max])
                        return smallcolorScale(d.yeartwo)
                      } else {
                        return '#F6F6F6'
                      }
                  })
                  .attr("stroke", function(d) {
                    if(d.incomegroup == 'Low income') {
                    return '#08519c'
                  } else {
                    return '#F6F6F6'
                  }
                })
                plot.selectAll("rect")
                  .filter(function(d) {
                    return d.incomegroup == 'Low income'
                  })
                  .raise()
           })

          d3.select("#lower")
            .on('click', function() {
            plot.selectAll("rect")
                .filter(function(d) {
                  return d.incomegroup == 'Lower middle income'
                })
                .raise()
            plot.selectAll("rect")
              .raise()
              .transition()
              .duration(500)
              .attr("fill", function(d) {
                if(d.incomegroup == 'Lower middle income') {
                  smallcolorScale.domain([Min,Max])
                  return smallcolorScale(d.yeartwo)
                } else {
                  return '#F6F6F6'
                }
              })
              .attr("stroke", function(d) {
                if(d.incomegroup == 'Lower middle income') {
                  return '#08519c'
                } else {
                  return '#F6F6F6'
                }
              })
            })

          d3.select("#upper")
            .on('click', function() {
            plot.selectAll("rect")
                .filter(function(d) {
                  return d.incomegroup == 'Upper middle income'
                })
                .raise()
            plot.selectAll("rect")
              .transition()
              .duration(500)
              .attr("fill", function(d) {
                if(d.incomegroup == 'Upper middle income') {
                  smallcolorScale.domain([Min,Max])
                  return smallcolorScale(d.yeartwo)
                } else {
                  return '#F6F6F6'
                }
              })
              .attr("stroke", function(d) {
                if(d.incomegroup == 'Upper middle income') {
                  return '#08519c'
                } else {
                  return '#F6F6F6'
                }
              })
            })

          d3.select("#high")
            .on('click', function() {
            plot.selectAll("rect")
                .filter(function(d) {
                  return d.incomegroup == 'High income'
                })
                .raise()
            plot.selectAll("rect")
                .raise()
                .transition()
                .duration(500)
                .attr("fill", function(d) {
                  if(d.incomegroup == 'High income') {
                    smallcolorScale.domain([Min,Max])
                    return smallcolorScale(d.yeartwo)
                  } else {
                    return '#F6F6F6'
                  }
                })
                .attr("stroke", function(d) {
                  if(d.incomegroup == 'High income') {
                    return '#08519c'
                  } else {
                    return '#F6F6F6'
                  }
                })
              })

            d3.select("#all")
            .on('click', function() {
            plot.selectAll("rect")
              .transition()
              .duration(500)
              .attr('fill', function(d) {
                  smallcolorScale.domain([Min, Max])
                  return colorScale(d.yeartwo)
              })
            })

  }

})()