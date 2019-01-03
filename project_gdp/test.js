const margin = { top: 60, left: 200, right: 30, bottom: 50}
      height = 500 - margin.top - margin.bottom
      width = 1000 - margin.left - margin.right

const plot = d3.select("#chart1")
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

const colorScale = d3.scaleLog()
    .range(['white', '#08519c'])

  //Append a defs (for definition) element to your SVG
const defs = plot.append("defs");

  //Append a linearGradient element to the defs and give it a unique id
const linearGradient = defs.append("linearGradient")
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
     .attr('x', width/2 - 190)
     .attr('y', -60)
     .attr("width", 170)
     .attr("height", 15)
     .style("fill", "url(#linear-gradient)")

plot.append("text")
    .attr("x", width/2 -260)
    .attr("y", -50)
    .text("low income")
    .attr("font-size", "8px")

plot.append("text")
    .attr("x", width/2 +10)
    .attr("y", -50)
    .text("high income")
    .attr("font-size", "8px")

var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        var formatPercent = d3.format(",.2r")
        change = +d.growth
        return "<strong>" + d.country + "</strong>"
        + "<br>" +  "<span style='color:black'>" + "$" + formatPercent(change)
      })

plot.call(tip)


const dataPromise = d3.csv('../data/data.csv', parseData)
.then(function(rows){ 
    return rows.reduce(function(acc,val){return acc.concat(val)}, []); 
});
const metadataPromise = d3.csv('../data/countries-metadata.csv', parseMetadata);
const geojsonPromise = d3.json('../data/countries.geojson');

Promise.all([dataPromise, metadataPromise, geojsonPromise])
    .then(function([data, metadata, geojson]){

        console.log(data)
        console.log(metadata)

        //let's say we want to group population by income group
        //"map" is a data structure for lookup, e.g. dictionary
        const metadataMap = d3.map(metadata, function(d){ return d.Code });

        data.forEach(function(d){
            if(metadataMap.get(d.countryCode)){
                const incomeGroup = metadataMap.get(d.countryCode)['Income Group'];
                d.incomeGroup = incomeGroup;
            }else{
                return;
            }
        }); 

        data.forEach(function(d){
            if(metadataMap.get(d.countryCode)){
                const Region = metadataMap.get(d.countryCode)['Region'];
                d.Region = Region;
            }else{
                return;
            }
        });

        const dataByGroup = d3.nest()
            .key(function(d){return d.Region})
            .key(function(d){return d.incomeGroup})
            .entries(data);

        console.log(dataByGroup)


        const changeMax = d3.max(datapoints, function(d) {return +d.growth})

        console.log(changeMax)

        const changeMin = d3.min(datapoints, function(d) { return +d.growth})

        console.log(changeMin)

        xPositionScale.domain([changeMin, changeMax])

        const gdpMax = d3.max(datapoints, function(d) { return +d['1990 [YR1990]']})

        console.log(gdpMax)

        const gdpMin = d3.min(datapoints, function(d) { return +d['2017 [YR2017]']})

        console.log(gdpMin)

        colorScale.domain([gdpMin, gdpMax])

        const yAxis = d3.axisLeft(yPositionScale)
      
        plot.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
        .select(".domain").remove()

        const xAxis = d3.axisBottom(xPositionScale).tickSize(-height)
        .tickValues([-50, 0, 50, 100, 150, 200, 300, 500, 900])
        .tickFormat(function(d) { return d + "%"; })

        plot.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .select(".domain").remove()

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
            return yPositionScale(d.Region) - 13
         })
        .attr("height", 28)
        .attr('width', 3)
        .attr('stroke', '#9E4B6C')
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


    });

function ready(error, datapoints){
    const changeMax = d3.max(datapoints, function(d) { 
        return +d.growth
    })

    console.log(changeMax)

    const changeMin = d3.min(datapoints, function(d) { 
        return +d.growth
    })

    console.log(changeMin)

    xPositionScale.domain([changeMin, changeMax])

    const gdpMax = d3.max(datapoints, function(d) { 
        return +d['1990 [YR1990]']
    })

    console.log(gdpMax)

    const gdpMin = d3.min(datapoints, function(d) { 
        return +d['2017 [YR2017]']
    })

    console.log(gdpMin)

    colorScale.domain([gdpMin, gdpMax])


    const yAxis = d3.axisLeft(yPositionScale)
      plot.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
        .select(".domain").remove()

    const xAxis = d3.axisBottom(xPositionScale).tickSize(-height)
        .tickValues([-50, 0, 50, 100, 150, 200, 300, 500, 900])
        .tickFormat(function(d) { return d + "%"; })

    plot.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .select(".domain").remove()

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
            return yPositionScale(d.Region) - 13
         })
        .attr("height", 28)
        .attr('width', 3)
        .attr('stroke', '#9E4B6C')
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

}



function parseData(d){

    const country = d['Country Name'];
    const countryCode = d['Country Code'];
    const growth = d['Growth'];
    const yearone = d['1990 [YR1990]'];
    const yeartwo = d['2017 [YR2017]'];

    delete d['Country Name'];
    delete d['Country Code'];
    delete d['Growth'];
    delete d['1990 [YR1990]'];
    delete d['2017 [YR2017]'];

    const records = [];

    for(key in d){
        records.push({
            country:country,
            countryCode:countryCode,
            growth:growth
            //year:+key.split(' ')[0],
            //value:d[key]==='..'?null:+d[key]
        })
    }

    return records;

}

function parseMetadata(d){

    //Minimal parsing required; return data as is
    return d;

}

