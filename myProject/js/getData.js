var selectedCountry = null;
var nameCountry = null;
var dataFilter1 = [];
var dataFilter2 = [];
var dataLegend = ["Country Selected","World"];

function onClick(d){
	selectedCountry = d.id;
	nameCountry = d.properties.name;
	console.log(selectedCountry);
	d3.selectAll("g.lines")
		.each(function(d){
		if (d.country === "World"){
			d3.select(this).select("path.line").classed("focused1", true);
			d3.select(this).select("text").attr("opacity",1);
		}
		else if (d.countryCode === selectedCountry){
			d3.select(this).select("path.line").classed("focused2", true);
			d3.select(this).select("text").attr("opacity",1);
		}
		else{
			d3.select(this).select("path.line").classed("focused2",false).classed("unfocused", true);
			d3.select(this).select("text").attr("opacity",0);
		}
	});

	dataFilter1 = dataBar1.filter(function(d){
		return d.ISO3 === selectedCountry || d.country === "World"
	});
	dataFilter2 = dataBar2.filter(function(d){
		return d.ISO3 === selectedCountry || d.country === "World"
	});
	
	d3.select("h3#change").html(nameCountry);
	update_bars(dataFilter1);
	update_bars2(dataFilter2);
};

	
var dataBar1 = [];
var dataBar2 = [];

function display (error,barData,barData2){
	if (error){
		console.log(error);
	} else{
		dataBar1 = barData;
		dataBar2 = barData2;

		dataFilter1 = dataBar1.filter(function(d){
		return d.country === "China" || d.country === "World"
	});
		dataFilter2 = dataBar2.filter(function(d){
		return d.country === "China" || d.country === "World"
	});
		draw_bar(dataFilter1);
		draw_bar2(dataFilter2);
		drawLegend(dataLegend);
	}
}

var queue = d3.queue();

queue()
  .defer(d3.csv, "data/data2.csv")
  .defer(d3.csv,"data/skilledAttendant.csv")
  .await(display);