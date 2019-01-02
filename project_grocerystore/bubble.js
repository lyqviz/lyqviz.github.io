(function() {
  var margin = { top: 0, left: 50, right: 50, bottom: 100},
      height = 550 - margin.top - margin.bottom,
      width = 800 - margin.left - margin.right;
  
  var svg = d3.select("#chart2")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var categoryScale = d3.scalePoint()
    .range([-100, width])

   var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>" + d.Trade_Name + "</strong>" 
        + "<br>" +  "<span style='color:black'>" + d.City + "<br>"
        + "<br>" + "<span style='color:black'>" + "zip code: " + d.Zip_Code 
      })

  svg.call(tip)


  var simulation = d3.forceSimulation()
      .force("x", d3.forceX(function(d){
        if (d.Inspection_Grade === 'B') {
          return 200
        }
        else {
          return 400
        }
      }))
      .force("y", d3.forceY(function(d){
        if (d.Inspection_Grade === 'B'){
          return 300
        }
        else {
          return 300
        }

      }))
      .force("manybody", d3.forceManyBody().strength(-1.8))
      .force("collide", d3.forceCollide(2)) //A froce from the middle to avoid overlap
  
  d3.queue()
    .defer(d3.csv, "failstores.csv")
    .await(ready)

  function ready (error, datapoints) {

    var categories = datapoints.map(function(d) { 
        return d.Inspection_Grade
    })


    categoryScale.domain(categories)   


    var circles = svg.selectAll("circles")
      .data(datapoints)
      .enter().append("circle")
      .attr('r', 3)
      .attr('fill-opacity', 0.7)
      .attr('fill', '#6baed6')
      .attr('stroke', 'lightgray')
      .attr('stroke-width', 0.5)
      .attr('cx', width/2)
      .attr('cy', height/2)
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

      datapoints.forEach(function(d) {
        d.x = width/2
        d.y = height/2
      })

    datapoints.forEach(function(d) {
      d.x = d.x + (Math.random() * 30) 
      d.y = d.y + (Math.random() * 30) 
    })

    simulation.nodes(datapoints)
      .on('tick', ticked)

      function ticked() {
        circles
          .attr("cx", function(d){
            return d.x
          })
          .attr("cy", function(d){
            return d.y
          })
      }

    svg.append("text")
        .text('Over a thousand grocery stores almost fail to serve, find those in your neighborhood')
        .attr("x", 50)
        .attr("y", 30)
        .attr("text-anchor", "left")
        .attr("font-size", "16px")
        .attr('fill', 'black')
        .style("font-weight", "bold")

    svg.append("text")
        .text("Each point represents a store. Hover to see where and who they are.")
        .attr("x",50)
        .attr("y",50)
        .attr("text-anchor", "left")
        .attr("font-size", "12px")
        .attr('fill', 'grey')

    svg.append("text")
        .text('Grade: B')
        .attr("x", 120)
        .attr("y", 170)
        .attr("text-anchor", "left")
        .attr("font-size", "12px")
        .attr('fill', 'black')
        .style("font-weight", 'bold')

    svg.append("text")
        .text('Grade: C')
        .attr("x", 360)
        .attr("y", 150)
        .attr("text-anchor", "left")
        .attr("font-size", "12px")
        .attr('fill', 'black')
        .style("font-weight", 'bold')


  }

})();