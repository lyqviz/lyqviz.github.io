  var margin = { top: 12, left: 60, right: 80, bottom: 50},
      height = 1200 - margin.top - margin.bottom,
      width = 960 - margin.left - margin.right;
  
  var svg = d3.select("#chart2")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
  /*var parseTime = d3.timeParse('%m/%d/%Y');
  
  console.log(parseTime)*/

  const xPositionScale = d3.scaleLinear()
    .domain([0, 35])
    .range([0, width])
  //console.log(xPositionScale)

  const yPositionScale = d3.scalePoint()
    .domain([ 
      'CBP',//non-cab
      'USCIS',//non-cab
      'SBA',//cab-le
      'FDA',//non-cab
      'The Interior',//cab
      'DHS', //cab
      'EPA',//cab-le
      'Attorney General',//cab
      'OMB',
      'White House',
      'Defense',
      'FAA',
      'FEMA',
      'Veterans Affairs',//cab
      'CIA',//cab-le
      'Department of State',//cab
      'Homeland Security',//cab
      'HHS', //cab
      'OSHA',//non-cab
      'Trade Representative',//cab-le
      'Agriculture',//cab
      'National Intelligence',//cab-le
      'Energy',//cab
      'HUD',//cab
      'Commerce',//cab
      'Treasury',//cab
      'CPSC',//non-cab
      'Transportation',
      'Education', //cab
      'ICE', //non-cab
      'EEOC' //non-cab
      ])
    .range([height,0])
    .padding(1)

   var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>" + "<span style='color:black'>" + d.Name + "</strong>" 
      })

  svg.call(tip)

  const scaleColor = d3.scaleOrdinal()
    .range(['#ff9999','#8BCBC8'])

  
  //const data = d3.csv('../actingpositiondata.csv', parse);
  d3.queue()
    .defer(d3.csv, "actingpositiondata.csv")
    .await(ready)

  function ready (error, data) {

    console.log(data)

    const rolesbylevel = d3.nest()
    .key(function(d){return d.Level})
    .entries(data)
    console.log(rolesbylevel)

    const yAxis = d3.axisLeft(yPositionScale)
      
    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", 'translate(' + margin.left + ',' + margin.top +')')
        .call(yAxis)
        .select(".domain").remove()

    svg.selectAll(".tick line")
          .attr("stroke-dasharray", 1.5)
          .attr('stroke', 'lightgrey') 

    const xAxis = d3.axisTop(xPositionScale)
        .tickSize(-height)
        .tickValues([0, 4, 6, 8, 12, 18, 24, 30])
      
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", 'translate(' + margin.left + ',' + margin.top +')')
        .call(xAxis)
        .select(".domain")
        .remove()

    svg.selectAll(".tick line")
          .attr("stroke-dasharray", 1.5)
          .attr('stroke', 'lightgrey') 


    var circles = svg.selectAll("circles")
      .data(data)
      .enter().append('circle')
      .attr("transform", 'translate(' + margin.left + ',' + margin.top +')')
      .attr('r', 5)
      .attr('fill-opacity', 0.7)
      .attr('fill', function(d){ return scaleColor(d.status) })
      .attr('stroke', '#525252')
      //.attr('stroke-width', '0.5px')
      .attr('cx', function(d) {
            return xPositionScale(d.Months)})
      .attr('cy', function(d) {
            return yPositionScale(d.Department)
      })
 
    svg.append('text')
       .attr('x', d => xPositionScale(d.Start_Date))
       .attr('y', d => yPositionScale(d.Department))
       .style('fill', 'grey')
       .style('font-size', '12px')
      //.attr('class', 'countries-label')
       .text(function(d) {
        return d.Name
      })
       .attr("transform", `translate(0," + height + ")`)
       .attr('text-anchor', 'middle')

    var link = svg.selectAll('line')
       .data(data)
       .enter()
       .append('line')
       .style('stroke', 'black')

       
      //.attr('class', 'countries-label')
       .text(function(d) {
        return d.Name
      })
       .attr("transform", `translate(0," + height + ")`)
       .attr('text-anchor', 'middle')
       //.attr('font-size', 12)
       .attr('fill', 'grey')


  }