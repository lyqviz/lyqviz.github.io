let small_screen = document.documentElement.clientWidth < 600 ? true : false
var margin = { top: 30, left: 30, right: 160, bottom: 50},
      height = 1300 - margin.top - margin.bottom,
      width = 900 - margin.left - margin.right;
console.log(margin)
if(small_screen) {
    //run visual function
  var margin = { top: 30, left: 30, right: 60, bottom: 50},
      height = 800 - margin.top - margin.bottom,
      width = 400 - margin.left - margin.right;

  console.log('small_screen_detected')
  
  }
  
  
  var parseTime = d3.timeParse('%m/%d/%Y');

  var plot = d3.select("#chart1")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  const xPositionScale = d3.scaleTime()
    //.domain([new Date(0,1,2017), new Date(8,1,2019)])
    .domain([parseTime('1/1/2017'), parseTime('8/1/2019')])
    .range([0, width])
  console.log(xPositionScale.domain())

  const yPositionScale = d3.scalePoint()
    .domain([ 
      'USCIS',//non-cab
      'FDA',//non-cab
      'FEMA',//non-cab
      'FAA',//non-cab
      'OSHA',//non-cab
      'CPSC',//non-cab
      'EEOC', //non-cab
      'CBP',//non-cab
      'ICE', //non-cab
      
      'Trade Rep',//cab-le
      'National Intelligence',//cab-le
      'CIA',//cab-le
      'SBA',//cab-le
      'OMB',//cab-le
      'White House',//cab-le
      'UN Amb',//cab-le
      'EPA',//cab-le

      'Agriculture',//cab
      'Energy',//cab 
      'HUD',//cab
      'Commerce',//cab
      'Treasury',//cab
      'Education',//cab
      'Transportation',//cab
      'State',//cab
      'Interior',//cab
      'Attorney General',//cab
      'Labor',//cab
      'HHS', //cab
      'Veterans Affairs',//cab
      'Defense',//cab
      'Homeland Sec'//cab
      ])
    .range([height,0])
    .padding(1)

  const scaleColor = d3.scaleOrdinal()
    .range(['#7fcdbb', '#ffce00'])

  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:black'>" + d.Name + "<br>" 
        + "<span style='color:black'>" + "Start Date: "+ d.Start_Date + "<br>" + "<br>"
        //+ "<span style='color:black'>" + d.fullname+ "<br>"
        + "<span style='color:black'>"+ "Status: " + d.status + "<br>"

        + "<span style='color:black'>" + d.fullPosition
      })

  plot.call(tip)


  d3.queue()
    .defer(d3.csv, "finallist.csv")
    .await(ready)

  function ready (error, data) {

    console.log(data)

    const rolesbylevel = d3.nest()
    .key(function(d){return d.Level})
    .entries(data)
    console.log(rolesbylevel)

    const yAxis = d3.axisLeft(yPositionScale)
      
    plot.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", 'translate(' + margin.left + ',' + margin.top +')')
        .call(yAxis)
        .select(".domain").remove()

    plot.selectAll(".tick line")
          .attr("stroke-dasharray", 1.5)
          .attr('stroke', 'black') 

    const xAxis = d3.axisTop(xPositionScale)
        .tickFormat(d3.timeFormat("%Y-%m"))
        //.tickValues([])
      
    plot.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", 'translate(' + margin.left + ',' + margin.top +')')
        .call(xAxis)
        .select(".domain")
        .remove()

    plot.selectAll(".tick line")
          .attr("stroke-dasharray", 8)
          .attr('stroke', 'black') 

   plot.selectAll("lines")
      .data(data)
      .enter()
      .append("line")
      .attr("transform", 'translate(' + margin.left + ',' + margin.top +')')
      .attr("x1", function(d) { return xPositionScale(new Date(d.Start_Date))})
      .attr("x2", function(d) { return xPositionScale(new Date(d.End_Date))})
      .attr("y1", function(d) { return yPositionScale(d.Department); })
      .attr("y2", function(d) { return yPositionScale(d.Department); })
      .attr("stroke", function(d){ return scaleColor(d.status) })
      .attr("stroke-width", "1px")
      .attr("marker-end","url(#arrow)"); 

    /*plot.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(d => d.Level)
      .attr('font-size', 20)
      .attr('font-style', 'Arimo')
      //.attr('class', 'level-label')
      .attr('x', -110)
      .attr('y', function(d){
        if (d.Level === 'Cabinet'){
          return 37
        } else if (d.Level === 'Cabinet-Level'){
          return 624
        } else if (d.Level === 'Non-Cabinet'){
          return 920
        }
      })
      .attr('fill', '#525252')
      //.attr('text-anchor', 'middle')*/

    plot.selectAll("circles")
      .data(data)
      .enter().append('circle')
      .attr("transform", 'translate(' + margin.left + ',' + margin.top +')')
      .attr('r', 5)
      .attr('fill-opacity', 1)
      .attr('fill', function(d){ return scaleColor(d.status) })
      //.attr('stroke', '#525252')
      .attr('cx', function(d) {
            return xPositionScale(new Date(d.Start_Date))})
      .attr('cy', function(d) {
            return yPositionScale(d.Department)
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
 

    plot.selectAll("endcircle")
      .data(data)
      .enter()
      .append("circle")
      .attr("transform", 'translate(' + margin.left + ',' + margin.top +')')
      .attr("cx", function(d) {
            return xPositionScale(new Date(d.End_Date))})
      .attr("cy", function(d) { return yPositionScale(d.Department); })
      .attr("r", 1)
      .attr('fill', function(d){ return scaleColor(d.status) })
      .attr('fill-opacity', 0.1)


    let circlehover = function(d, circlehov){
      let natleft = circlehov.node().offsetLeft + 15
      let nattop = circlehov.node().offsetTop + 15
      height = d3.select('#chart1').node().offsetHeight
    

    tip.style('display', 'block');

    let right = tooltip.node().offsetWidth + natleft
        let bottom = tooltip.node().offsetHeight + nattop
        let left = right >= width ? width - tooltip.node().offsetWidth : natleft;
        let top = bottom >= height ? height - tooltip.node().offsetHeight - 25 : nattop;

    tip.transition()
          .style('left', left + 'px')
          .style('top', top + 'px')

    }

    let circleMouseOut = function(d, circlehov) {

        tip
          .transition()
          .delay(700)
          .style('display', 'none');
      }



  }
