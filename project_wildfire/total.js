 
(function() {
  var margin = { top: 30, left: 30, right: 30, bottom: 30},
  height = 600 - margin.top - margin.bottom,
  width = 800 - margin.left - margin.right;

  console.log("Building chart 4");

  // var svg = d3.select("#chart-4")
  //       .append("svg")
  //       .attr("height", height + margin.top + margin.bottom)
  //       .attr("width", width + margin.left + margin.right)
  //       .append("g")
  //       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var svg = d3.select('#chart-4')
        .append('svg')
        .attr('width', 500)
        .attr('heigth', 500)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
  d3.json('acres.json', function(data){
      var treemap = d3.layout.treemap()
          .size([500,500])
          .nodes(data)

      var cells = svg.selectAll('.cell')
          .data(treemap)
          .enter()
          .append('g')
          .attr('class','cell')

      cells.append('rect')
          .attr('x', function(d){return d.year;})
          .attr('y', function(d){return d.total;})
          .attr('width', function(d){return d.dx;})
          .attr('heigth', function(d){return d.dy;})
          .attr('stroke', '#fff')

      cells.append('text')
          .attr('x', function(d){return d.year + d.dx / 2})
          .attr('y', function(d){return d.total + d.dy / 2})
          .attr('text-anchor', 'middle')
          .text(function(d){return d.children ? null : d.name;})
  })

})();