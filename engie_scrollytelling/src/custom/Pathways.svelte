<script>
	import * as d3 from 'd3';

	import { onMount } from 'svelte';

	import { beforeUpdate, afterUpdate } from 'svelte';

	export let data;
	export let settings;
	let node;
	let legendNode;
	
	let width = 960;
	let height = 600 - 150;


	afterUpdate(() => {
		draw(node);
	});

	onMount(() => {
		draw(node);
	});

	function draw(node) {
	
		if(data){
			var lever = settings.lever;
			drawChart(lever);
			
			if(settings.legend == "slider"){
			  drawSliders(lever);
			} else if (settings.legend == "dot"){
			  drawLegend(lever);
			}
		}
	}

	function drawChart(lever) {
		const graphic = d3.select(node);
		graphic.selectAll("*").remove();
		
		var els = document.getElementsByClassName( 'custom__chart' );
    var divWidth = getComputedStyle( els[0], null ).getPropertyValue( 'width' );
		var divHeight = getComputedStyle( els[0], null ).getPropertyValue( 'height' );
		
		// data handling
		var emissionsData = data.emissions;
		var targetData = Object.assign(data.BAU,{y: "target"}).map(x => ({ "date": x.Date, "value": x.Value, "type": x.Type}))
		var target = d3.group(targetData, d => d.type);
		var emissionsDataHeaders = lever;
		
		var multipliers = [];
		for(var a = 0; a< emissionsDataHeaders.length; a++){
			var thisLever = data.leverCosts.find( x => x.lever == lever[a])
			if(document.getElementById('investment'+ a)){
				var val = document.getElementById('investment'+ a).value;
				multipliers[a] = val/(thisLever.maxcost);
			} else {
				multipliers[a] = 1;
			}
		}
		
		var chartData = [];
		for(var b = 0; b< emissionsData.length; b++){

			chartData[b] = {};
			chartData[b].date = +emissionsData[b].date;
			var AllItems = 0;
			for(var c = 0; c< emissionsDataHeaders.length; c++){
				var emissions = 0;
				emissions = emissionsData[b][emissionsDataHeaders[c]]
				chartData[b][emissionsDataHeaders[c]] = +emissions*multipliers[c]; 
				AllItems += +emissions*multipliers[c]
			}
			const thisYearBAU = target.get("BAU").filter(function(d) { return d.date == chartData[b].date })[0].value;
			chartData[b]["Offsets"] = (thisYearBAU-AllItems)*multipliers[multipliers.length - 1]; 
			chartData[b]["Carbon comp"] = (thisYearBAU - AllItems - chartData[b]["Offsets"]); 
	}
	
		var emissions2 = d3
      .stack()
      .keys(emissionsDataHeaders)
      .order(d3.stackOrderNone)
      (chartData)
      
    let mappedEmissionsToBAU2 = emissions2;
    mappedEmissionsToBAU2.map(e => {
        e.forEach((arr, i) => {
          arr[0] = target.get("BAU")[i].value - arr[0];
          arr[1] = target.get("BAU")[i].value - arr[1];
          e.data = e.data;
        })
        return e;
      })
		
		//chart functions
		var width = divWidth.substring(0, divWidth.length - 2);
		var height = divHeight.substring(0, divHeight.length - 2)-70;
		var margin = ({top: 20, right: 170, bottom: 155, left: 50});
		
		var y = d3.scaleLinear()
			.domain([0, 2000000])
			.range([height - margin.bottom, margin.top]);
		
		var yAxis = g => g
			.attr("transform", `translate(0, 0)`)
			.attr("class", "axis yaxis")
			.call(d3.axisRight(y).tickSize(0).ticks(5,"2s"));
	
		var x = d3.scaleLinear()
			.domain([d3.extent(targetData, d => d.date)[0],d3.extent(targetData, d => d.date)[1]])
			.range([margin.left, width - margin.right])
	
		var xAxis = g => g
    	.attr("transform", `translate(0,${height - margin.bottom})`)
    	.attr("class", "axis xaxis")
    	.call(d3.axisBottom(x).ticks(7).tickSize(0).tickPadding(15).tickFormat(d3.format("d")))
		
		var area = d3.area()
	    .x(d => x(+d.data.date))
	    .y0(d => y(d[0])+1)
	    .y1(d => y(d[1]))
			
		var line = d3
        .line()
        .defined(d => !isNaN(d.value))
        .x(d => x(d.date))
        .y(d => y(d.value))
			
		var colorLine = d3.scaleOrdinal()
    	.domain([
				'Energy Efficiency',
				'Renewables',
				'Electrification',
				'Scope 3',
				'Offsets',
			])
    	.range(["#915EBD", "#3CCE9E", "#DBBA19", "#009BEC", "transparent", "transparent"]);
			
		var colorArea = d3.scaleOrdinal()
			.domain([
				'Energy Efficiency',
				'Renewables',
				'Electrification',
				'Scope 3',
				'Offsets',
			])
			.range(["#EBE6F0", "#E8F6F1", "#FBF7E1", "#E5F7FF", "#F2F2F2", "#F2F2F2"]);
			
		//generation functions
		function generateAxis(svg)  {
	  	const gx = svg.append("g").call(xAxis);
	  	const gy = svg.append("g").call(yAxis);
		}
			
		function generateChartBackground(svg) {
  		let maxYear = d3.extent(targetData, d => d.date)[1];
  		const lines = svg.append("g").attr("class", "backgroundLines");
  		var ticks = d3.selectAll(".yaxis g.tick > text")
      	.nodes()
      	.map(function(t){
					var tick = t.innerHTML.substring(0, t.innerHTML.length - 1);
					tick = tick*1000000;
        	return tick;
      });
			
			let unique = ticks.filter((item, i, ar) => ar.indexOf(item) === i);
  
  		for(var a =0; a<unique.length; a++){
    		var num = unique[a]
 
		    lines.append("line")
		    .attr("class", "gridline")
		    .attr("x1", x(d3.extent(targetData, d => d.date)[0]))
		    .attr("y1", y(num))
		    .attr("y2", y(num))
		    .attr("x2", x(maxYear))
		    .attr("stroke", "#979797")
		    .attr("stroke-width", 1)
		    .attr("fill", "none")
		    .attr("opacity", 0.2)
		  .style("pointer-events", "none");
  		}
		}
		
		function generatePathwayLine(svg){
		  let pathwayLine = svg.append('g').selectAll("path");
			
			pathwayLine
       .data(mappedEmissionsToBAU2)
        .join("path")
        .attr("fill", "transparent")
          .style('stroke', ({key}) => colorLine(key)) 
          .style('stroke-width', '1px')
          .attr("x", 5)
          .attr("class", function(d,i){return "areaLine"+i;})
          .attr("d", area)
		}
		
		function generatePathway(svg) {
			let pathway = svg.append('g').selectAll("path");
			
			pathway
        .data(mappedEmissionsToBAU2)
        .join("path")
          .attr("fill", ({key}) => colorArea(key))
        //  .attr("opacity", 0.55)
          .attr("x", 5)
          .attr("class", function(d,i){return "area"+i;})
          .attr("d", area)
		}
		
		function generateLine(type, color, label, svg) {
		  
			let maxYear = d3.extent(targetData, d => d.date)[1];
		  const typeTarget = target.get(type).filter(function(d) { return d.date <= maxYear });
		  
		  const l = svg.append("g");
		        
		  l.append("path")
		    .datum(typeTarget)
		    .attr("fill", "none")
		    .attr("stroke", color)
		    .attr("dx", "-1px")
		    .attr("stroke-width", 1)
		    .attr("stroke-linejoin", "round")
		    .attr("stroke-linecap", "round")
		    .attr("d", line)
		}
		
		function generateChartStats(svg){
		  
		  const BAUTarget = target.get("BAU");
		  const lastBAUTargetElem = BAUTarget[BAUTarget.length -1];
		  
		  /*const SBTTarget = target.get("SBT").filter(function(d) { return d.date <= maxYear });
		  const lastSBTTargetElem = SBTTarget[SBTTarget.length -1];*/
		  
		  var reduction = 0;
		  for(var a = 0; a< emissionsDataHeaders.length; a++){
					if(emissionsDataHeaders[a] != "Offsets"){
		      	reduction += chartData[chartData.length -1][emissionsDataHeaders[a]]
					}
		  }
			
		  var reductionOffsets = reduction;
			for(var a = 0; a< emissionsDataHeaders.length; a++){
					if(emissionsDataHeaders[a] == "Offsets"){
		      	reductionOffsets += chartData[chartData.length -1][emissionsDataHeaders[a]]
					}
		  }

		  const reductionDot = lastBAUTargetElem.value - reduction;
		  const reductionOffsetsDot = lastBAUTargetElem.value - reductionOffsets;
		  
		   var p = d3.precisionPrefix(1e5, 1.3e6),
		    format = d3.formatPrefix("." + p, 1.3e6);
		  
		  const l = svg.append("g").attr("class", "chartStats");
		  
		    var values = [
		    { name: "Business As Usual",
		     type: "num",
		      value: lastBAUTargetElem.value
		    }
		  ];
			
			if(reductionDot != lastBAUTargetElem.value){
		    values.push(
				{ name: "Projected Emissions",
					type: "num",
					value: reductionDot
				})
		  }
		  
		  if(reductionOffsetsDot != reductionDot && emissionsDataHeaders.length>1 && reductionOffsetsDot > 0){
		    values.push(
		      { name: "Offsets Total",
		     type: "num",
		      value: reductionOffsetsDot
		    })
		  }
		  
		  if( reductionOffsetsDot >= 0 || emissionsDataHeaders.length == 1){
		    values.push(
		      { name: "Net Zero",
		       type: "num",
		      value: 0
		    })
		  };
		  
		  values.sort(function(a, b) {
		  return b.value - a.value;
		  });
		  
		  
		  for( var c = 0; c < values.length; c++)
		  {
		    
		    l.append("rect")
		    .attr("x", x(lastBAUTargetElem.date) + 5)
		    .attr("y", y(values[c].value))
		    .attr("height", 1)
		    .attr("width", 15)
				.attr("fill", "#424242");
		  
		  l.append("text")
		    .text(values[c].name)
		    .attr("x", x(lastBAUTargetElem.date) + 25)
		    .attr("y", y(values[c].value) +5)
		    .attr("class", "statText")
		    .attr("fill", "#424242"); 
		  }
		  
		}
		
		//build chart 
		generateAxis(graphic);
		generateChartBackground(graphic);
		generatePathway(graphic);
		generatePathwayLine(graphic);
		generateLine("BAU", "#424242", "Business As Usual", graphic);
		generateChartStats(graphic);
		
	}
	
	function drawLegend(lever){

		const graphic = legendNode;
		graphic.innerHTML = "";
		
		var colorLine = d3.scaleOrdinal()
			.domain([
				'Energy Efficiency',
				'Renewables',
				'Electrification',
				'Scope 3',
				'Offsets',
			])
			.range(["#915EBD", "#3CCE9E", "#DBBA19", "#009BEC", "#979797", "transparent"]);
		
		for (var a = 0; a< lever.length; a++){
			var node = document.createElement("div"); 
			node.style.color = colorLine(lever[a]); 
			node.className = "legendText";  
			var circlenode = document.createElement("div");    
			circlenode.className = "circle";    
			circlenode.style.background = colorLine(lever[a]);  
			var textnode = document.createTextNode(lever[a]);  
			node.appendChild(circlenode);           
			node.appendChild(textnode);                             
			graphic.appendChild(node);  

		}
	}
	
	function drawSliders(lever){

		const graphic = legendNode;
		graphic.innerHTML = "";
		
		var colorLine = d3.scaleOrdinal()
			.domain([
				'Energy Efficiency',
				'Renewables',
				'Electrification',
				'Scope 3',
				'Offsets',
			])
			.range(["#915EBD", "#3CCE9E", "#DBBA19", "#009BEC", "#979797", "transparent"]);
			
		var p = d3.precisionPrefix(1e5, 1.3e6),
      format = d3.formatPrefix("." + p, 1.3e6),
      p2 = d3.precisionPrefix(1e5, 1.3e5),
      format2 = d3.formatPrefix("." + p2, 1.3e5);
		
		for (var a = 0; a< lever.length; a++){
		
			var thisLever = data.leverCosts.find( x => x.lever == lever[a])

			var node = document.createElement("div"); 
			node.style.color = colorLine(lever[a]); 
			node.className = "legendBox";  
			
			var textnode = document.createTextNode(lever[a]); 
			var textnode2 = document.createElement("div"); 
			textnode2.innerHTML = "INVESTMENT"; 
			textnode2.className = "legendInvest"; 
			var textnode3 = document.createElement("div"); 
			textnode3.id = "investNum"+a;
			textnode3.className = "legendInvestNum";
			textnode3.innerHTML = format(thisLever.maxcost); 
			
			var slider = document.createElement("input"); 
			slider.type = "range";
			slider.min = thisLever.mincost;
			slider.max = thisLever.maxcost;
			slider.value = thisLever.maxcost;
			slider.name = a;
			slider.className = "legendRange"; 
			slider.id = "investment" + a;
			
			var slideval1 = document.createElement("div"); 
			slideval1.className = "sliderNum sliderNumMin";
			slideval1.innerHTML = format(thisLever.mincost); 
			
			var slideval2 = document.createElement("div"); 
			slideval2.className = "sliderNum sliderNumMax";
			slideval2.innerHTML = format(thisLever.maxcost); 

			node.appendChild(textnode); 
			node.appendChild(textnode2); 
			node.appendChild(textnode3); 
			node.appendChild(slider); 
			node.appendChild(slideval1); 
			node.appendChild(slideval2);                            
			graphic.appendChild(node);  
			
			document.getElementById("investment" + a).style.backgroundColor = colorLine(lever[a]);
			
			document.getElementById('investment'+ a).addEventListener("change", function(){
				var val = this.value;
				document.getElementById('investNum'+ this.name).innerHTML = format(val);
				drawChart(lever);
			})

		}
	}
	
	
</script>

<div class="custom__chart pathways" >
{#if data}
	 <div class="title">Total Projected Emissions by <b>Lever</b> (MT CO2)</div>
	 <svg bind:this={node} class="chart" viewBox="0 0 {width} {height}" /> 
	 <div bind:this={legendNode} class="legend"></div>
{/if}
</div>

