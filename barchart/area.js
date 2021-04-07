//let small_screen = document.documentElement.clientWidth < 600 ? true : false
const margin = { top: 20, left: 55, right: 30, bottom: 30},
      height = 550 - margin.top - margin.bottom,
      width = 950 - margin.left - margin.right;

  const plot = d3.select("#chart")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  d3.queue()
    .defer(d3.csv, "area.csv")
    .await(ready)


  function ready (error, data) {

    console.log(data)

    var keys = data.columns.slice(1)

  
    const x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width ])

    plot.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5))
    .select(".domain").remove()

    const y = d3.scaleLinear()
    .domain([0, 110000])
    .range([height,0]);

    plot.append("g")
    .call(d3.axisLeft(y).tickSize(-width*1.2).ticks(6))
    .select(".domain").remove()

    plot.selectAll(".tick line").attr("stroke", "#EBEBEB")

   /* tooltip = d3.select('chart').append('div')
       .attr('id', 'tooltip')
       .style('position','absolute')
       .style('background-color', '#D3D3D3')
       .style('padding', 6)
       .style('display', 'none')

    mouseG = plot.append('g')
       .attr('class', 'mouse-over-effects');

    mouseG.append('path')
       .style('stroke','#A9A9A9')
       .style("stroke-width", lineStroke)
       .style("opacity", "0");

    const lines = document.getElementsByClassName('line');

    const mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(data)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line")

    mousePerLine.append("circle")
      .attr("r", 4)
      .style("stroke", function (d) {
        return color(d.key)
      })
      .style("fill", "none")
      .style("stroke-width", lineStroke)
      .style("opacity", "0");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) 
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function () { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
        d3.selectAll("#tooltip")
          .style('display', 'none')
            })
      .on('mouseover', function () { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll("#tooltip")
          .style('display', 'block')
        })
      .on('mousemove', function () { // update tooltip content, line, circles and text when mouse moves
        var mouse = d3.mouse(this)
        d3.selectAll(".mouse-per-line")
          /*.attr("transform", function (d, i) {
            var xDate = xScale.invert(mouse[0]) // use 'invert' to get date corresponding to distance from mouse position relative to svg
            var bisect = d3.bisector(function (d) { return d.date; }).left // retrieve row index of date on parsed csv
            var idx = bisect(d.values, xDate);

            d3.select(".mouse-line")
              .attr("d", function () {
                var data = "M" + xScale(d.values[idx].date) + "," + (height);
                data += " " + xScale(d.values[idx].date) + "," + 0;
                return data;
              });
            return "translate(" + xScale(d.values[idx].date) + "," + yScale(d.values[idx].premium) + ")";
           });

       updateTooltipContent(mouse, data)

      })*/


    const color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#552382', '#009DE9', '#007873', '#6ED2B1', '#FBDB3C'])

    const stackedData = d3.stack()
    .keys(keys)
    (data)

    plot.selectAll('layers')
        .data(stackedData)
        .enter()
        .append('path')
          .attr("stroke", function(d) { return color(d.key); })
          .attr("stroke-width", 1.5)
           .style('fill', function(d) { return color(d.key); })
           .attr('fill-opacity', 0.4)
           .attr("d", d3.area()
           .x(function(d, i) { return x(d.data.year); })
           .y0(function(d) { return y(d[0]); })
           .y1(function(d) { return y(d[1]); })
          )

  }
