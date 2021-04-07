//let small_screen = document.documentElement.clientWidth < 600 ? true : false
const margin = { top: 20, left: 55, right: 30, bottom: 30},
      height = 500 - margin.top - margin.bottom,
      width = 600 - margin.left - margin.right;

  const plot = d3.select("#chart1")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  d3.queue()
    .defer(d3.csv, "emission1.csv")
    .await(ready)


  function ready (error, data) {

    console.log(data)

    var subgroups = data.columns.slice(1)

     console.log(subgroups)
    //var groups = d3.map(data, function(d){return(d.year)}).keys()
    //console.log(groups)

    //const time = d3.timeParse('%Y');

    var groups = d3.map(data, function(d){return(d.year)}).keys()
console.log(groups)

    const x = d3.scaleBand()
    .domain(groups)
    .range([ 0, width ])
    //.tickFormat(d3.timeFormat("%Y"));
    //.padding([0.2])

    plot.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))
    //.select(".domain").remove()

    const y = d3.scaleLinear()
    .domain([0, 65000])
    .range([height,0]);

    plot.append("g")
    .call(d3.axisLeft(y).tickSize(-width*1.2).ticks(6))
    .select(".domain").remove()

    plot.selectAll(".tick line").attr("stroke", "#EBEBEB")


    const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#552382', '#009DE9', '#007873', '#6ED2B1', '#FBDB3C'])

    const stackedData = d3.stack().keys(subgroups)(data)

   const tooltip = d3.select("#chart1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    tooltip
        .html("Lever: " + subgroupName + "<br>" + "Value: " + subgroupValue)
        .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
   // d3.selectAll('rect').attr('opacity', 0.9)
    //tooltip.style("visibility", 'hidden')
  }

    plot.append('g')
       .selectAll('g')
       .data(stackedData)
       .enter().append('g')
          .attr('fill', function(d){return color(d.key)})
          .style("opacity", 0.7)
          .selectAll('rect')

          .data(function(d){return d;})
          .enter().append('rect')
             .attr('x', function(d){return x(d.data.year)})
             .attr('y', function(d){return y(d[1])})
             .attr('height', function(d){return y(d[0]) - y(d[1]) })
             .attr('width', x.bandwidth())
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)


  }
