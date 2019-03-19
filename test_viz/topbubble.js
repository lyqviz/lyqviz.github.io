(function() {
  var margin = { top: 100, left: 30, right: 30, bottom: 30},
      height = 1000 - margin.top - margin.bottom,
      width = 1000 - margin.left - margin.right;
  
  var svg = d3.select("#chart3")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


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


  var forceXSeparate = d3
  .forceX(function(d) {
    if (d.movie_region === 'Asia') {
      // console.log(d.continent)
      return 280
    } else if (d.movie_region === 'Europe') {
      // console.log(d.continent)
      return 480
    } else if (d.movie_region === 'Africa') {
      // console.log(d.continent)
      return 700
    } else if (d.movie_region === 'South America') {
      // console.log(d.continent)
      return 280
    } else if (d.movie_region === 'North America') {
      // console.log(d.continent)
      return 480
    } else if (d.movie_region === 'Oceania') {
      // console.log(d.continent)
      return 700
    }
  })
  .strength(0.1)

  var forceYSeparate = d3
  .forceY(function(d) {
    if (d.movie_region === 'Asia') {
      return 200
    } else if (d.movie_region === 'Europe') {
      return 200
    } else if (d.movie_region === 'Africa') {
      return 200
    } else if (d.movie_region === 'South America') {
      return 500
    } else if (d.movie_region === 'North America') {
      return 500
    } else if (d.movie_region === 'Oceania') {
      return 500
    }
  })
  .strength(0.1)

  /*var forceXCombine = d3.forceX(function(d){return d.x0}).strength(0.08)
  var forceYCombine = d3.forceY(function(d){return d.y0}).strength(0.08)
  var forceCollide = d3.forceCollide(d => radiusScale(d.rating_users) + 1).strength(1)
  var forceCharge = d3.forceManyBody().strength(-2)*/
 
  var forceXCombine = d3.forceX(width / 2).strength(0.08)
  var forceYCombine = d3.forceY(height / 2).strength(0.08)

  var forceCollide = d3.forceCollide(d => radiusScale(d.rating_users) + 5).strength(1)
  var forceCharge = d3.forceManyBody().strength(-15)

  var simulation = d3
    .forceSimulation()
    .force('x', forceXCombine)
    .force('y', forceYCombine)
    .force('collide', forceCollide)
    .force('charge', forceCharge)


  /*var simulation = d3.forceSimulation()
      .force("x", d3.forceX(function(d){
        return 600
      }))
      .force("y", d3.forceY(function(d){
        return 300
      }))
      .force("manybody", d3.forceManyBody().strength(-6))
      .force("collide", d3.forceCollide(3)) */
  
  d3.queue()
    .defer(d3.csv, "fulllist.csv")
    .await(ready)

  function ready (error, datapoints) {


    var topData = [
    'Afghanistan',
    'Iraq',
    'Syrian Arab Rep.',
    'Burundi']


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

    svg
    .selectAll('.continent-label')
    .data(datapoints)
    .enter()
    .append('text')
    .text(d => d.movie_region)
    .attr('font-size', 18)
    //.attr('font-weight', 300)
    //.attr('font-family': "Times New Roman")
    .attr('class', 'continent-label')
    .attr('x', function(d) {
      if (d.movie_region === 'Asia') {
        // console.log(d.key)
        return 100
      } else if (d.movie_region === 'Europe') {
        // console.log(d.key)
        return 500
      } else if (d.movie_region === 'Africa') {
        // console.log(d.key)
        return 900
      } else if (d.movie_region === 'South America') {
        // console.log(d.key)
        return 150
      } else if (d.movie_region === 'North America') {
        // console.log(d.key)
        return 500
      } else if (d.movie_region === 'Oceania') {
        // console.log(d.key)
        return 850
      }
    })
    .attr('y', function(d) {
      if (d.movie_region === 'Asia') {
        return 0
      } else if (d.movie_region === 'Europe') {
        return 0
      } else if (d.movie_region === 'Africa') {
        return 0
      } else if (d.movie_region === 'South America') {
        return 450
      } else if (d.movie_region === 'North America') {
        return 450
      } else if (d.movie_region === 'Oceania') {
        return 450
      }
    })
    .attr('fill', '#525252')
    .attr('text-anchor', 'middle')
    //.attr('opacity', 0.8)
    //.attr('visibility', 'hidden')


      // add text-label on each circle
  var nodeText = svg
    .selectAll('.countries-label')
    .data(datapoints)
    .enter()
    .append('text')
    .attr('class', 'countries-label')
    .text(function(d) {
      return d.country + '\n' + d.movie_region.toLocaleString()
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 11)
    .attr('fill', 'white')
    .classed('top-ten-label', d => {
      if (topData.indexOf(d.country) !== -1) {
        return true
      }
    })
    .style('visibility', 'hidden')

    simulation.nodes(datapoints).on('tick', ticked)


    function ticked() {
      circles
      .attr('cx', function(d) {
        // console.log(d)
        return d.x
      })
      .attr('cy', function(d) {
        return d.y
      })
      nodeText
      .attr('x', function(d) {
        // console.log(d)
        return d.x
      })
      .attr('y', function(d) {
        return d.y
      })
    }

    svg
      .selectAll('circles')
      .transition()
      .attr('fill', d => colorScale(d.movie_region))
    svg.selectAll('.countries-label').style('visibility', 'hidden')

    svg
      .selectAll('.continent-label')
      .transition()
      .style('visibility', 'visible')

    simulation
      .force('x', forceXSeparate)
      .force('y', forceYSeparate)
      // .force('charge', forceCharge)
      .alphaTarget(0.25)
      .restart()

  }

})();