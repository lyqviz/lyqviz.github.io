(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
      height = 700 - margin.top - margin.bottom,
      width = 1000 - margin.left - margin.right;
  
  var svg = d3.select("#chart1")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var categoryScale = d3.scalePoint()
    .range([-100, width])

  var radiusScale = d3
    .scaleSqrt()
    .domain([0, 140000000])
    .range([3, 500])

  var legend = d3.select('#intro-legend')
    .append('svg')
    .attr('width','300px')
    .attr('height','150px')
       .append('g')
       .attr('tranform','translate(0,0)')


  const scaleColor = d3.scaleOrdinal()
    .range(['#cb181d', //Asia
        '#ff9999', //europe
        //'#8c96c6', //middleeast
        '#8BCBC8', //north america
        '#d9d9d9', //oceania
        '#33cc33', //africa
        '#8c96c6']) //south america

   var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>" + "<span style='color:black'>" + "Film Festival: " + d.festival + "</strong>" + "<br>"
        +"<strong>" + "<span style='color:black'>" + "Movie: "+ d.movie + "</strong>" 
        + "<br>" +  "<span style='color:black'>" + "Director: "+ d.director + "<br>"
        + "<span style='color:black'>" + "Country: " + d.country + "<br>"
        + "<span style='color:black'>" + "IMDb Score: " + d.imdb_score + "<br>"
        + "<span style='color:black'>" + "User Ratings: " + d.rating_users
      })

  svg.call(tip)


  var forceXCombine = d3.forceX(width / 2).strength(0.08)
  var forceYCombine = d3.forceY(height / 2).strength(0.08)

  var forceCollide = d3.forceCollide(d => radiusScale(d.rating_users) + 1).strength(1)
  var forceCharge = d3.forceManyBody().strength(-5)

  var simulation = d3
    .forceSimulation()
    .force('x', forceXCombine)
    .force('y', forceYCombine)
    .force('collide', forceCollide)
    .force('charge', forceCharge)
  
  d3.queue()
    .defer(d3.csv, "fulllist.csv")
    .await(ready)

  function ready (error, datapoints) {

    var categories = datapoints.map(function(d) { 
        return d.festival
    })


    categoryScale.domain(categories)   


    var circles = svg.selectAll("circles")
      .data(datapoints)
      .enter().append("circle")
      .attr('r', function(d){
        return radiusScale(d.rating_users)
      })
      .attr('fill-opacity', 0.7)
      .attr('fill', function(d){ return scaleColor(d.movie_region) })
      .attr('stroke', 'lightgray')
      .attr('stroke-width', 0.5)
      .attr('class', d => {
      // console.log(d.country.toLowerCase().replace(/[^a-z]*/g, ''))
      return d.country.toLowerCase().replace(/[^a-z]*/g, '')
      })
      .classed('countries', true)
      .attr('id', function(d, i) {
      return 'country' + i})
      .classed('Pulp Fiction', d => {
      // console.log(d)
      if (d.movie === 'Pulp Fiction') {
        return true
      }
    })
      .classed('Intouchables', d => {
      // console.log(d)
      if (d.movie === 'Intouchables') {
        return true
      }
      })
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

      // add text-label on each circle
  var nodeText = svg
    .selectAll('.countries-label')
    .data(datapoints)
    .enter()
    .append('text')
    .attr('class', 'countries-label')
    .text(function(d) {
      return d.country + '\n' + d.rating_users.toLocaleString()
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 11)
    .attr('fill', 'black')
    .classed('Fiction-label', d => {
      //console.log(d)
      if (d.movie === 'Pulp Fiction') {
        return true
      }
    })
    .classed('Intouchables-label', d => {
      //console.log(d)
      if (d.movie === 'Intouchables') {
        return true
      }
    })
    .style('visibility', 'hidden')


  }

})();