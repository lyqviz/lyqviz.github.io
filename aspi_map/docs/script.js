let small_screen = document.documentElement.clientWidth < 600 ? true : false
let pymChild = null // for embedding

const margin = {
    top: 20,
    left: 0,
    right: 0,
    bottom: 20
  },
  height = 600 - margin.top - margin.bottom,
  width = 1200 - margin.left - margin.right;

var svg = d3.select('#map')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


d3.queue()
  .defer(d3.json, 'world.topojson')
  .defer(d3.csv, 'full.csv', typeAndSet)
  .await(ready)

var countryById = d3.map()

function typeAndSet(d) {
  countryById.set(d.name, d)
  return d
}

var projection = d3.geoMercator()
//geoGilbert()
//
  //.fitSize([width,height],world.topojson)
  .translate([-120, height/1.2])
  .scale(350)

var path = d3.geoPath()
  .projection(projection)

const tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style("left", '82px')
  .style("top", "100px")
  .style('visibility', 'hidden');
// .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const country_name = d3
  .select('body')
  .append('div')
  .attr('id', 'nametag')
  .style('visibility', 'visible');

const tooltip_test = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip_test')
  .style("left", '82px')
  .style("top", "100px")
  .style('visibility', 'hidden')

function ready(error, data, full) {
  console.log(data)
  console.log(full)

  var countries = topojson.feature(data, data.objects.countries).features

  console.log(countries)

  svg.selectAll('.country')
    .data(countries)
    .enter().append('path')
    .attr('class', 'country')
    .attr('d', path)
    //.attr('stroke-width', 1)
    //.attr('stroke', 'white')
    .style('fill', d => {
      if (d.properties.name === 'China' || d.properties.name === 'South Korea'|| d.properties.name === 'Indonesia' ) {
        return '#4191D1'
      }
      if (d.properties.name === 'Vietnam' || d.properties.name === 'Chinese Taipei'
        || d.properties.name === 'Thailand' || d.properties.name === 'Philippines') {
        return '#C3CB40'
      }
    })
    .attr('id', function (d) {
      // console.log(d)
      return d.properties.name
    })
    .on('mouseover', d => mouseOver(d))
    .on('mouseout', d => mouseOut(d))
    .on('click', function (d) {
      console.log('I am clicked', d.properties.name)
      return clickOn(d)
    })

 var labels = svg.selectAll('.label')
    .data(countries)
    .enter()
    .filter(function (d) {
      return d.properties.name === 'China' || d.properties.name === 'South Korea' ||
        d.properties.name === 'Vietnam' || d.properties.name === 'Chinese Taipei' || d.properties.name === 'Thailand' ||
        d.properties.name === 'Indonesia' || d.properties.name === 'Philippines' || d.properties.name === 'Japan'
    })

 /* var label_box = labels
    .append('rect')
    .attr('x', function(d) {
      const centroid = path.centroid(d)
      if (d.properties.name === 'Japan'){
        return centroid[0] - 16
      }
      if (d.properties.name === 'Thailand'){
        return centroid[0] - 25
      }
      if (d.properties.name === 'Vietnam'){
        return centroid[0] - 26
      }
      if (d.properties.name === 'China'){
        return centroid[0] - 26
      }
      if (d.properties.name === 'South Korea'){
        return centroid[0] - 33
      }
      if (d.properties.name === 'Indonesia'){
        return centroid[0] - 30
      }
      if (d.properties.name === 'Philippines'){
        return centroid[0] - 30
      }
      if (d.properties.name === 'Chinese Taipei'){
        return centroid[0] - 31
      }
      //return centroid[1] - 17 ///1.03
    })    
    .attr('y', function(d) {
      const centroid = path.centroid(d)
      if (d.properties.name === 'South Korea'){
        return centroid[1] - 34
      }
      if (d.properties.name === 'Japan'){
        return centroid[1] + 29
      }
      if (d.properties.name === 'Chinese Taipei'){
        return centroid[1] - 34        
      }
      if (d.properties.name === 'Thailand'){
        return centroid[1]        
      }
      if (d.properties.name === 'China'|| d.properties.name === 'Vietnam' || d.properties.name === 'Indonesia' 
        || d.properties.name === 'Philippines'){
        return centroid[1] - 15
      }
      //return centroid[1] - 17 ///1.03
    })
    //.attr('width', 75)
    .attr('width', d => {
      if (d.properties.name === 'Japan') {
        return 70
      }
      if (d.properties.name === 'Vietnam' || d.properties.name === 'Thailand'|| d.properties.name === 'China') {
        return 55
      }
      if (d.properties.name === 'Indonesia' || d.properties.name === 'Philippines') {
        return 65
      }
      if (d.properties.name === 'South Korea') {
        return 70
      }
      if (d.properties.name === 'Chinese Taipei') {
        return 66
      }

    })
    //.attr('height', 25)
    .attr('height', d => {
      if (d.properties.name === 'Chinese Taipei'|| d.properties.name === 'Japan'){
        return 20
      }
      if (d.properties.name === 'China'|| d.properties.name === 'South Korea'|| d.properties.name === 'Vietnam'
        || d.properties.name === 'Indonesia' || d.properties.name === 'Philippines'|| d.properties.name === 'Thailand'){
        return 25
      }
    })
    .attr('fill', d => {
      if (d.properties.name === 'China' || d.properties.name === 'South Korea'
        || d.properties.name === 'Indonesia' || d.properties.name === 'Japan') {
        return '#ffffff'
      }
      if (d.properties.name === 'Vietnam' || d.properties.name === 'Chinese Taipei' || 
        d.properties.name === 'Thailand' || d.properties.name === 'Philippines') {
        return '#000000'
      }
    })
    .style('stroke', d => {
      if (d.properties.name === 'Vietnam' || d.properties.name === 'Chinese Taipei' || 
        d.properties.name === 'Thailand' || d.properties.name === 'Philippines') {
        return '#BABABA'
      }
    })
    .style('stroke-width', '0.75px')
    .on('mouseover', d => mouseOverLabel(d))
    .on('mouseout', d => mouseOutLabel(d))
    .on('click', function (d) {
      console.log('I am clicked', d.properties.name)
      return clickOnLabel(d)
    })
    */

    //.attr('opacity', .6)

//label text
  var label_text = labels
    .append('text')
    .attr('class', 'label')
    /*.attr('fill', d => {
      if (d.properties.name === 'China' || d.properties.name === 'South Korea'
        || d.properties.name === 'Indonesia' || d.properties.name === 'Japan') {
        return '#000000'
      }
      if (d.properties.name === 'Vietnam' || d.properties.name === 'Chinese Taipei'
        || d.properties.name === 'Thailand' || d.properties.name === 'Philippines') {
        return '#BABABA'
      }
    })*/
    .text(function(d) {
      if (d.properties.name === 'Japan'){
        return "Tokyo & Saitama"
      }
      if (d.properties.name === 'China'|| d.properties.name === 'South Korea'|| d.properties.name === 'Vietnam'
        || d.properties.name === 'Indonesia' || d.properties.name === 'Philippines' || d.properties.name === 'Chinese Taipei'
        || d.properties.name === 'Thailand'){
        return d.properties.name
      }
    })
    .style('font-weight', 600)
    .style('font-weight', d=>{
      if (d.properties.name === 'China' || d.properties.name === 'South Korea'||
        d.properties.name === 'Indonesia' || d.properties.name === 'Japan'){
        return 700
      }
      if (d.properties.name === 'Vietnam' || d.properties.name === 'Chinese Taipei' || d.properties.name === 'Thailand' ||
        d.properties.name === 'Philippines') {
        return 400
      }
    })
    //.style('font-size', '10px')
    .style('font-size', d =>{
      if (d.properties.name === 'Chinese Taipei'|| d.properties.name === 'Japan'){
        return '8px'
      }
      if (d.properties.name === 'China'|| d.properties.name === 'South Korea'|| d.properties.name === 'Vietnam'
        || d.properties.name === 'Indonesia' || d.properties.name === 'Philippines'|| d.properties.name === 'Thailand'){
        return '10px'
      }
    })
    .style('text-anchor', 'middle')
    .attr('x', d => {
      const centroid = path.centroid(d)
      //return centroid[0] + 2
     if (d.properties.name === 'China'|| d.properties.name === 'South Korea'|| d.properties.name === 'Vietnam'
        || d.properties.name === 'Indonesia' || d.properties.name === 'Philippines' || d.properties.name === 'Chinese Taipei'
        || d.properties.name === 'Thailand'){
        return centroid[0] + 2
      }
      if (d.properties.name === 'Japan'){
        return centroid[0] + 19
      }
    })
    .attr('y', function(d) {
      const centroid = path.centroid(d)
      if (d.properties.name === 'South Korea'){
        return centroid[1] - 18
      }
      if (d.properties.name === 'Japan'){
        return centroid[1] + 42
      }
      if (d.properties.name === 'Chinese Taipei'){
        return centroid[1] - 21        
      }
      if (d.properties.name === 'Thailand'){
        return centroid[1] + 15       
      }
      if (d.properties.name === 'China'|| d.properties.name === 'Vietnam' || d.properties.name === 'Indonesia' 
        || d.properties.name === 'Philippines'){
        return centroid[1]
      }
    })
    .on('mouseover', d => mouseOverLabel(d))
    .on('mouseout', d => mouseOutLabel(d))
    .on('click', function (d) {
      console.log('I am clicked', d.properties.name)
      return clickOnLabel(d)
    })

    

function mouseOverLabel(d, i) {
    //  console.log(d.properties.name)
    var dataRow = countryById.get(d.properties.name)
    // console.log(dataRow)

    //d3.selectAll('.label')

    d3.selectAll('.label')
      .filter(function (d) {
        return d.properties.name === 'China' || d.properties.name === 'South Korea' ||
          d.properties.name === 'Vietnam' || d.properties.name === 'Chinese Taipei' || d.properties.name === 'Thailand' ||
          d.properties.name === 'Indonesia' || d.properties.name === 'Philippines' || d.properties.name === 'Japan'
      })
      .attr('opacity', v => (v.id === d.id ? 1 : 0.3))
     // .style('stroke', '#ffffff')
      //.style('stroke-width', '0.5px')
  /*  d3.selectAll('.label')
      .attr('opacity', v => (v.id === d.id ? 1 : 0.15))*/

  /* label_box
      .attr('opacity', v => (v.id === d.id ? 1 : 0.3))*/
    label_text
      .attr('opacity', v => (v.id === d.id ? 1 : 0.3))

    tooltip
      .attr('data-html', 'true')
      .style('visibility', 'visible')
      .html(function () {
        if (dataRow.name === 'China') {
          return "<span style='color:white'>" + dataRow.name.bold() + "'s National ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;' + dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>" +
            '<a href= "https://asiasociety.org/policy-institute/ets-status-china" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:grey'>"+ "<span style='color:black'>" +"Learn More".bold() + "<br>"+ "<br>"
        } else if (dataRow.name === 'South Korea') {
          return "<span style='color:white'>" + dataRow.name.bold() + "'s ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;'+ dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>"+
            "<span style='color:white'>" + '<a href= "https://asiasociety.org/policy-institute/ets-status-south-korea" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:grey'>"+ "<span style='color:black'>" + "Learn More".bold() + "<br>"+ "<br>"
        } else if (dataRow.name === 'Indonesia') {
          return "<span style='color:white'>" + dataRow.name.bold() + "'s Trial ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;'+ dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>"+
            "<span style='color:white'>" + '<a href= "https://asiasociety.org/policy-institute/ets-status-indonesia" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:grey'>"+ "<span style='color:black'>"+ "Learn More".bold() + "<br>"+ "<br>"
        } else if (dataRow.name === 'Vietnam' || dataRow.name === 'Chinese Taipei' || dataRow.name === 'Thailand') {
          return "<span style='color:white'>" + dataRow.name.bold() + "'s ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note1 + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note2 + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note3 + "<br>" + "<br>"
        } else if (dataRow.name === 'Philippines') {
          return "<span style='color:white'>" + dataRow.name.bold() + "'s ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note1 + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note2 + "<br>" + "<br>"
        } else if (dataRow.name === 'Japan') {
          return "<span style='color:white'>" + "Tokyo & Saitama's ETS (Japan)".bold() + "<br>" +"<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;'+ dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>"+
            "<span style='color:white'>" + '<a href= "https://asiasociety.org/policy-institute/ets-status-japan" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:grey'>"+ "<span style='color:black'>"+ "Learn More".bold() + "<br>"+ "<br>"
        }
      })

  }

 function mouseOutLabel(d) {
    //d3.selectAll('.country')
     d3.selectAll('.label')
      .filter(function (d) {
        return d.properties.name === 'China' || d.properties.name === 'South Korea' ||
          d.properties.name === 'Vietnam' || d.properties.name === 'Chinese Taipei' || d.properties.name === 'Thailand' ||
          d.properties.name === 'Indonesia' || d.properties.name === 'Philippines' || d.properties.name === 'Japan'
      })
      .attr('opacity', 1)
      .style('stroke', 'none')
      .style('stroke-width', 'none')

    label_box
      .attr('opacity', 1)
    label_text
      .attr('opacity', 1)

    tooltip.style('visibility', 'hidden')
      .style("left", '82px')
      .style("top", "100px");
  }



  //hover
  function mouseOver(d, i) {
    //  console.log(d.properties.name)
    var dataRow = countryById.get(d.properties.name)
    // console.log(dataRow)

    //d3.selectAll('.label')

    d3.selectAll('.country')
      .filter(function (d) {
        return d.properties.name === 'China' || d.properties.name === 'South Korea' ||
          d.properties.name === 'Vietnam' || d.properties.name === 'Chinese Taipei' || d.properties.name === 'Thailand' ||
          d.properties.name === 'Indonesia' || d.properties.name === 'Philippines' || d.properties.name === 'Japan'
      })
      .attr('opacity', v => (v.id === d.id ? 1 : 0.3))
     // .style('stroke', '#ffffff')
      //.style('stroke-width', '0.5px')
  /*  d3.selectAll('.label')
      .attr('opacity', v => (v.id === d.id ? 1 : 0.15))*/

   /* label_box
      .attr('opacity', v => (v.id === d.id ? 1 : 0.3))*/
    label_text
      .attr('opacity', v => (v.id === d.id ? 1 : 0.3))

    tooltip
      .attr('data-html', 'true')
      .style('visibility', 'visible')
      .html(function () {
        if (dataRow.name === 'China') {
          return "<span style='color:white'>" + dataRow.name.bold() + "'s National ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;' + dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>" +
            '<a href= "https://asiasociety.org/policy-institute/ets-status-china" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:grey'>"+ "<span style='color:black'>" +"Learn More".bold() + "<br>"+ "<br>"
        } else if (dataRow.name === 'South Korea') {
          return "<span style='color:white'>" + dataRow.name.bold() + "'s ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;'+ dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>"+
            "<span style='color:white'>" + '<a href= "https://asiasociety.org/policy-institute/ets-status-south-korea" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:grey'>"+ "<span style='color:black'>" + "Learn More".bold() + "<br>"+ "<br>"
        } else if (dataRow.name === 'Indonesia') {
          return "<span style='color:white'>" + dataRow.name.bold() + "'s Trial ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;'+ dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>"+
            "<span style='color:white'>" + '<a href= "https://asiasociety.org/policy-institute/ets-status-indonesia" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:grey'>"+ "<span style='color:black'>"+ "Learn More".bold() + "<br>"+ "<br>"
        } else if (dataRow.name === 'Vietnam' || dataRow.name === 'Chinese Taipei' || dataRow.name === 'Thailand') {
          return "<span style='color:white'>" + dataRow.name.bold() + "'s ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note1 + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note2 + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note3 + "<br>" + "<br>"
        } else if (dataRow.name === 'Philippines') {
          return "<span style='color:white'>" + dataRow.name.bold() + "'s ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note1 + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note2 + "<br>" + "<br>"
        } else if (dataRow.name === 'Japan') {
          return "<span style='color:white'>" + "Tokyo & Saitama's ETS (Japan)".bold() + "<br>" +"<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;'+ dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>"+
            "<span style='color:white'>" + '<a href= "https://asiasociety.org/policy-institute/ets-status-japan" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:grey'>"+ "<span style='color:black'>"+ "Learn More".bold() + "<br>"+ "<br>"
        }
      })

  }


  function mouseOut(d) {
    d3.selectAll('.country')
      // d3.selectAll('.label')
      .filter(function (d) {
        return d.properties.name === 'China' || d.properties.name === 'South Korea' ||
          d.properties.name === 'Vietnam' || d.properties.name === 'Chinese Taipei' || d.properties.name === 'Thailand' ||
          d.properties.name === 'Indonesia' || d.properties.name === 'Philippines' || d.properties.name === 'Japan'
      })
      .attr('opacity', 1)
      .style('stroke', 'none')
      .style('stroke-width', 'none')

   /* label_box
      .attr('opacity', 1)*/
    label_text
      .attr('opacity', 1)

    tooltip.style('visibility', 'hidden')
      .style("left", '82px')
      .style("top", "100px");
  }

//Click
  window.myFunction = () => {
    tooltip_test
      .style('visibility', 'hidden')
      .style("left", '82px')
      .style("top", "100px");
  }
  
  function clickOn(d, i) {
    //  console.log(d.properties.name)
    var dataRow = countryById.get(d.properties.name)
    console.log(dataRow)

    d3.selectAll('.country')
      .filter(function (d) {
        return d.properties.name === 'China' || d.properties.name === 'South Korea' ||
          d.properties.name === 'Vietnam' || d.properties.name === 'Chinese Taipei' || d.properties.name === 'Thailand' ||
          d.properties.name === 'Indonesia' || d.properties.name === 'Philippines' || d.properties.name === 'Japan'
      })
      .attr('opacity', v => (v.id === d.id ? 1 : 0.15))
      .style('stroke', '#ffffff')
      .style('stroke-width', '0.6px')

    tooltip_test
      .attr('data-html', 'true')
      .style('visibility', 'visible')
      .html(function () {
        if (dataRow.name === 'China') {
          return "<img class='close' src='close.svg' onclick='myFunction()'>" +
            "<span style='color:white'>" + dataRow.name.bold() + "'s National ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;' + dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>" +
            '<a href= "https://asiasociety.org/policy-institute/ets-status-china" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:white'>"+ "<span style='color:black'>" + "Learn More".bold() + "<br>"+ "<br>"
        } else if (dataRow.name === 'South Korea') {
          return "<img class='close' src='close.svg' onclick='myFunction()'>" +
            "<span style='color:white'>" + dataRow.name.bold() + "'s ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;'+ dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>"+
            '<a href= "https://asiasociety.org/policy-institute/ets-status-south-korea" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:white'>"+ "<span style='color:black'>" + "Learn More".bold() + "<br>"+ "<br>"
        } else if (dataRow.name === 'Indonesia') {
          return "<img class='close' src='close.svg' onclick='myFunction()'>" +
            "<span style='color:white'>" + dataRow.name.bold() + "'s Trial ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;'+ dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>"+
            '<a href= "https://asiasociety.org/policy-institute/ets-status-indonesia" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:white'>"+ "<span style='color:black'>" + "Learn More".bold() + "<br>"+ "<br>"
        } else if (dataRow.name === 'Vietnam' || dataRow.name === 'Chinese Taipei' || dataRow.name === 'Thailand') {
          return "<img class='close' src='close.svg' onclick='myFunction()'>" +
            "<span style='color:white'>" + dataRow.name.bold() + "'s ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note1 + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note2 + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note3 + "<br>" + "<br>"
        } else if (dataRow.name === 'Philippines') {
          return "<img class='close' src='close.svg' onclick='myFunction()'>" +
            "<span style='color:white'>" + dataRow.name.bold() + "'s ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note1 + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note2 + "<br>" + "<br>"
        } else if (dataRow.name === 'Japan') {
          return "<img class='close' src='close.svg' onclick='myFunction()'>" +
            "<span style='color:white'>" + "Tokyo & Saitama's ETS (Japan)".bold() + "<br>" +"<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;'+ dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>"+
            '<a href= "https://asiasociety.org/policy-institute/ets-status-japan" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:white'>"+ "<span style='color:black'>" + "Learn More".bold() + "<br>"+ "<br>"
        }
      })
 
    d3.selectAll('.country').each(function(d){
      if (d.id) {
        tooltip_test.style('visibility', 'visible')
      } else {
        tooltip_test.style('visibility', 'hidden')
      }
    })
  }

  function clickOnLabel(d, i) {
    //  console.log(d.properties.name)
    var dataRow = countryById.get(d.properties.name)
    console.log(dataRow)

    d3.selectAll('.label')
      .filter(function (d) {
        return d.properties.name === 'China' || d.properties.name === 'South Korea' ||
          d.properties.name === 'Vietnam' || d.properties.name === 'Chinese Taipei' || d.properties.name === 'Thailand' ||
          d.properties.name === 'Indonesia' || d.properties.name === 'Philippines' || d.properties.name === 'Japan'
      })
      .attr('opacity', v => (v.id === d.id ? 1 : 0.15))
      .style('stroke', '#ffffff')
      .style('stroke-width', '0.6px')

    tooltip_test
      .attr('data-html', 'true')
      .style('visibility', 'visible')
      .html(function () {
        if (dataRow.name === 'China') {
          return "<img class='close' src='close.svg' onclick='myFunction()'>" +
            "<span style='color:white'>" + dataRow.name.bold() + "'s National ETS".bold() + "<br>" + "<br>" +
           "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;' + dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>" +
            '<a href= "https://asiasociety.org/policy-institute/ets-status-china" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:white'>"+ "<span style='color:black'>" + "Learn More".bold() + "<br>"+ "<br>"
        } else if (dataRow.name === 'South Korea') {
          return "<img class='close' src='close.svg' onclick='myFunction()'>" +
            "<span style='color:white'>" + dataRow.name.bold() + "'s ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;'+ dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>"+
            '<a href= "https://asiasociety.org/policy-institute/ets-status-south-korea" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:white'>"+ "<span style='color:black'>" + "Learn More".bold() + "<br>"+ "<br>"
        } else if (dataRow.name === 'Indonesia') {
          return "<img class='close' src='close.svg' onclick='myFunction()'>" +
            "<span style='color:white'>" + dataRow.name.bold() + "'s Trial ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;'+ dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>"+
            '<a href= "https://asiasociety.org/policy-institute/ets-status-indonesia" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:white'>"+ "<span style='color:black'>" + "Learn More".bold() + "<br>"+ "<br>"
        } else if (dataRow.name === 'Vietnam' || dataRow.name === 'Chinese Taipei' || dataRow.name === 'Thailand') {
          return "<img class='close' src='close.svg' onclick='myFunction()'>" +
            "<span style='color:white'>" + dataRow.name.bold() + "'s ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note1 + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note2 + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note3 + "<br>" + "<br>"
        } else if (dataRow.name === 'Philippines') {
          return "<img class='close' src='close.svg' onclick='myFunction()'>" +
            "<span style='color:white'>" + dataRow.name.bold() + "'s ETS".bold() + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note1 + "<br>" + "<br>" +
            "<span style='color:white'>" + "• " + dataRow.note2 + "<br>" + "<br>"
        } else if (dataRow.name === 'Japan') {
          return "<img class='close' src='close.svg' onclick='myFunction()'>" +
            "<span style='color:white'>" + "Tokyo & Saitama's ETS (Japan)".bold() + "<br>" +"<br>" +
            "<span style='color:white'>" + "Year started" + '&nbsp;&nbsp;&nbsp;'+ dataRow.year_started.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "Sectors" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.sectors.bold() + "<br>" + '<hr>' +
            "<span style='color:white'>" + "GHGs" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.ghgs.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Thresholds" + '&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.inclusion_thresholds.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Entities"  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.entities.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Cap" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dataRow.emissions_cap.bold() + "<br>" + "<hr>" +
            "<span style='color:white'>" + "Coverage" + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + dataRow.coverage.bold() + "<br>" + "<br>"+
            '<a href= "https://asiasociety.org/policy-institute/ets-status-japan" target="_blank">'
            + "<span style= 'padding: 90px'>" + "<span style='background-color:white'>"+ "<span style='color:black'>" + "Learn More".bold() + "<br>"+ "<br>"
        }
      })
 
    d3.selectAll('.country').each(function(d){
      if (d.id) {
        tooltip_test.style('visibility', 'visible')
      } else {
        tooltip_test.style('visibility', 'hidden')
      }
    })
  }

  function wrap(text, width) {
  text.each(function() {
    const text = d3.select(this)
    const words = text
      .text()
      .split(/\s+/)
      .reverse()
    let word
    let line = []
    let lineNumber = 0
    const lineHeight = 1.1 // ems
    const y = text.attr('y')
    const dy = parseFloat(text.attr('dy'))
    let tspan = text
      .text(null)
      .append('tspan')
      .attr('x', 0)
      .attr('y', y)
      .attr('dy', dy + 'em')
    while ((word = words.pop())) {
      line.push(word)
      tspan.text(line.join(' '))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        tspan = text
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word)
      }
    }
  })
}

 /* svg.append('rect')
    .attr('x', 0)
    .attr('y', 520)
    .attr('width', 1200)
    .attr('height', 60)
    //.attr('stroke', 'black')
    .attr('fill', '#black');*/

  svg.append('text')
    .attr('x', (width / 15))
    .attr('y', 15)
    .attr('text-anchor', 'left')
    .style('font-size', '20px')
    .style('fill', '#black')
    .text("Implementation of ETS in East and South East Asia")

  svg.append('text')
    .attr('x', (width / 15))
    .attr('y', 40)
    .attr('text-anchor', 'left')
    .style('font-size', '12px')
    .style('fill', '#black')
    .text("Implementation stages of ETS among countries in the region")

 /* svg.append('rect')
    .attr('x', 78)
    .attr('y', 495)
    .attr('width', 145)
    .attr('height', 25)
    //.attr('stroke', 'black')
    .attr('fill', '#ffffff');

  svg.append('text')
    .attr('x', 87)
    .attr('y', 511)
    //.attr('text-anchor', 'left')
    .style('font-size', '12px')
    .style('fill', 'black')
    .text("Have Implemented ETS")

  svg.append('rect')
    .attr('x', 78)
    .attr('y', 530)
    .attr('width', 160)
    .attr('height', 25)
    .attr('stroke', '#ffffff')
    .attr('fill', 'black');

  svg.append('text')
    .attr('x', 85)
    .attr('y', 546)
    //.attr('text-anchor', 'left')
    .style('font-size', '12px')
    .style('fill', '#ffffff')
    .text("Planning to Implement ETS")*/

  svg.append('circle')
    .attr('cx', 736)
    .attr('cy', 237)
    .attr('r', 5)
    .attr('fill', '#4191D1')

 // resize function + on start
  function render() {
    // sets up the responsiveness
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    const svgHeight = svgContainer.offsetHeight
    const actualSvg = d3.select(svg.node().closest('svg'))
    margin = { top: 20, left: 0, right: 0, bottom: 20 }
    if (svgWidth < 500) margin = { top: 30, left: 0, right: 0, bottom: 10 }
    width = svgWidth - margin.right - margin.left
    height = svgHeight - margin.top - margin.bottom
    d3.select('svg g').attr(
      'transform',
      'translate(' + margin.left + ',' + margin.top + ')'
    )
    actualSvg.attr('width', svgWidth)

    // update the ranges
    xPositionScale.range([0, width])
    yPositionScale.range([height, 0])

    const barHeight =
      yPositionScale(parseY('1-2-2020')) - yPositionScale(parseY('1-1-2020'))

    // update what is drawn
    rects
      .attr('x', d => xPositionScale(d.type))
      .attr('y', d => yPositionScale(parseTime(d.date)))
      .attr('width', xPositionScale.bandwidth())
      .attr('height', barHeight)
      .on('mouseover', d => mouseOver(d))
      .on('mousemove', d => mouseMove(d, width))
      .on('mouseout', d => mouseOut(d))

    yAxis
      .call(yOptions.tickSizeInner(-width).tickPadding(15))
      .call(g => g.select('.domain').remove())

    xAxis
      .call(
        xOptions
          .tickSizeInner(-height)
          .ticks(width / 100)
          .tickPadding(15)
      )
      .selectAll('.tick text')
      .call(wrap, 50)
    xAxis.call(g => g.select('.domain').remove())

    // send the height to embed
    if (pymChild) pymChild.sendHeight()

    function getMobileOffset(mobile, desktop) {
      if (width < 500) {
        return mobile
      } else {
        return desktop
      }
    }
  } // end render

  // kick off the graphic and then listen for resize events
  // render()
  window.addEventListener('resize', render)

  // for the embed, don't change!
  if (pymChild) pymChild.sendHeight()
  pymChild = new pym.Child({ polling: 200, renderCallback: render })

}