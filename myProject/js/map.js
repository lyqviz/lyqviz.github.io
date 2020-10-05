function draw_map(){
	var width1 = 1100,
	height1 = 800;

	var svgMap = d3.select('#map').append('svg')
			.attr('width',width1)
			.attr('height',height1)
			.attr("id","svgMap");

	var projection = d3.geo.mercator()
		.scale(125)
		.translate([width1/2-160,height1/2+20]);

	var path = d3.geo.path()
		.projection(projection);

	var colors = d3.scale.linear().range(["#e5e5ff","#333399"])
				.interpolate(d3.interpolateLab);

	var countryById = d3.map();

	d3.queue()
		.defer(d3.json,"js/countries.json")
		.defer(d3.csv,'data/dataMap.csv',typeAndSet)
		.await(loaded);

	var myTooltipMap = d3.select("body")
    				.append("div")
    				.attr("class", "myTooltipMap");

	function typeAndSet(d){
		d.rate = +d["2015"]
		d.country = d["Country Name"];
		d.code = d["Country Code"];
		countryById.set(d.code,d);
		return d;
	}

	function getColor(d){
		var dataRow = countryById.get(d.id);
		if (dataRow){
			return colors(dataRow.rate);
		} else {
			return "#ccc";
		}
	}

	function getText(d){
		var dataRow = countryById.get(d.id);
		if (dataRow){
			return "<strong>" + dataRow.country + "</strong></br> Under 5 Mortality Rate: " + dataRow.rate + "‰";
		} else {
			console.log("no dataRow",d);
			return d.properties.name + ": no data"; 
		}
	}

	function loaded(error,world,region){
		console.log(world);
		console.log(region);

		colors.domain(d3.extent(region, function(d){return d.rate;}))

		var countries = topojson.feature(world,world.objects.units).features;

		svgMap.selectAll("path.countries")
			.data(countries)
			.enter()
			.append("path")
			.attr("class","countries")
			.attr("id", function (d,i){return d.id;})
			.attr('d',path)
			.attr('fill',function(d,i){
				return getColor(d);
			})
			.on("click",onClick);

	var linear = colors;

	svgMap.append("g")
		.attr("class","legendLinear")
		.attr("transform","translate(0,500)");

	var legendLinear = d3.legend.color()
		.shapeWidth(30)
		.orient('horizontal')
		.scale(linear);

	svgMap.select(".legendLinear")
		.call(legendLinear);

	svgMap.selectAll("path.countries")
    	.on("mouseover", mouseoverFunc)
        .on("mousemove", mousemoveFunc)
        .on("mouseout", mouseoutFunc);


	function mouseoverFunc(d){
		myTooltipMap
			.style("display",null)
			.html("<p>" + getText(d) + "</p>");
	}

	function mousemoveFunc(d) {
        myTooltipMap
            .style("top", (d3.event.pageY - 5) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
    }

    function mouseoutFunc(d) {
        return myTooltipMap.style("display", "none"); 
    }

	}; 

} //end of draw map function

draw_map();
      