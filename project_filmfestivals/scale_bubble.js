(function() {
  var margin = { top: 30, left: 30, right: 30, bottom: 30},
      height = 2500 - margin.top - margin.bottom,
      width = 1000 - margin.left - margin.right;
  
  var svg = d3.select("#chart2")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


  const xPositionScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width])


  const yPositionScale = d3.scalePoint()
    .domain([ 
      'Cairo International Film Festival',
      'Tallinn Black Nights Film Festival',
      'Locarno International Film Festival',
      'Shanghai International Film Festival',
      'International Film Festival of India (Goa)',
      'Warsaw International Film Festival',
      'Karlovy Vary International Film Festival',
      'San Sebastián International Film Festival',
      'Mar del Plata Film Festival',
      'Montreal World Film Festival', 
      'Moscow International Film Festival',
      'Berlin International Film Festival',
      'Tokyo International Film Festival', 
      'Venice Film Festival',
      'Cannes Film Festival'
      ])
    .range([height,0])
    .padding(1)


  const scaleColor = d3.scaleOrdinal()
    .range(['#cb181d', //Asia
        '#ff9999', //europe
        //'#8c96c6', //middleeast
        '#8BCBC8', //north america
        '#969696', //oceania
        '#33cc33', //africa
        '#8c96c6']) //south america

  var radiusScale = d3
    .scaleSqrt()
    .domain([0, 140000000])
    .range([3, 500])

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

  var forceXCombine = d3.forceX(function(d){return d.x0}).strength(0.08)
  var forceYCombine = d3.forceY(function(d){return d.y0}).strength(0.08)
  var forceCollide = d3.forceCollide(d => radiusScale(d.rating_users) + 1).strength(1)
  var forceCharge = d3.forceManyBody().strength(-2)
 

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

    const yAxis = d3.axisLeft(yPositionScale)
      
    svg.append("g")
        .attr("class", "axis y-axis")
        //.attr("transform", 'translate(' + margin.left + ',' + margin.top +')')
        .call(yAxis)
        .select(".domain").remove()

    const xAxis = d3.axisBottom(xPositionScale)
        .tickSize(-height)
        .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9])
      
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", 'translate(' + margin.left + ',' + margin.top +')')
        .call(xAxis)
        .select(".domain")
        .remove()

    svg.selectAll(".tick line")
          .attr("stroke-dasharray", 0.5)
          .attr('stroke', 'lightgrey') 


    var circles = svg.selectAll("circles")
      .data(datapoints)
      .enter().append("circle")
      .attr('r', function(d){
        return radiusScale(d.rating_users)
      })
      .attr('fill-opacity', 0.7)
      .attr('fill', function(d){ return scaleColor(d.movie_region) })
      .attr('stroke', '#525252')
      .style('stroke-width',d => {
        if(d.movie === 'Pulp Fiction' || d.movie === 'Intouchables' || d.movie === 'Amélie' 
          || d.movie === 'The Pianist' || d.movie === 'Taxi Driver' || d.movie === '12 Angry Men' 
          || d.movie === 'Spirited Away' || d.movie === 'Apocalypse Now' || d.movie === 'Rain Man'
          || d.movie === 'Brokeback Mountain'){
          return '3px'
        } else {
          return '0px'
        }
      })
      .attr('cx', function(d) {
            return xPositionScale(d.imdb_score)
          })
      .attr('cy', function(d) {
            return yPositionScale(d.festival)
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

    datapoints.forEach(function(d) {
        d.x0 = xPositionScale(d.imdb_score)
        d.y0 = yPositionScale(d.festival)
        d.x = xPositionScale(d.imdb_score)
        d.y = yPositionScale(d.festival)
        d.r = radiusScale(d.rating_users)
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

  }

})();