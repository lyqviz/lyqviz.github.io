window_h = $(window).height();
window_w = $(window).width();
row1_top = $('#row1').offset().top;
row2_top = $('#row2').offset().top;
svg_h = $('.scatter-svg').height();
svg_w = $('.scatter-svg').width();
plotStartX = 45;
rangeY = [400,10];
translateYaxis = 450;
opacity = 0.7;
borderColor = '#D96459';


//Set the default view of menu
d3.select('#MHincome')
  .classed('selected','true');

const plot1 = d3.select('#svg1')
      .append('g')
      .attr('transform','translate(30,0)')

const plot2 = d3.select('#svg2')
      .append('g')
      .attr('transform','translate(30,0)')

const plot3 = d3.select('#svg3')
      .append('g')
      .attr('transform','translate(30,0)')

const plot4 = d3.select('#svg4')
      .append('g')
      .attr('transform','translate(30,0)')


// X axis for food insecurity
let scaleX = d3.scaleLinear()
    .domain([0,0.3])
    .range([10,400])

let scaleY1 = d3.scaleLinear()
    .range(rangeY)

let scaleY2 = d3.scaleLinear()
    .range(rangeY)

let scaleY3 = d3.scaleLinear()
    .range(rangeY)

let scaleY4 = d3.scaleLinear()
    .range(rangeY)

let scaleColorIncome = d3.scaleLinear()
    .range(['#F2E394','#588C72'])

let scaleColorPct = d3.scaleLinear()
    .range(['#F1AF72','#8C4646'])
    .domain([0,1])

d3.csv('food.csv', parse)
  .then(draw)


function draw(data){

    const nestByMuni =  d3.nest().key(d => d.municipal)
        .rollup(values => {
        	return {
        		FIpct: d3.mean(values, d => d.fip/100),
        		MHincome: d3.mean(values, d => d.mhi),
        	    senior: d3.mean(values, d => d.senior),
                kid: d3.mean(values, d => d.kid),
                pop: d3.mean(values, d => d.pop),
                lowincome: d3.mean(values, d => d.lowincome)
        	}
        })
        .entries(data);

    //There are 194 municipalities 
    const municipalData = nestByMuni.map(d => {
    	return {
    		municipal: d.key,
    		FIpct: +d.value.FIpct,
            MHincome: +d.value.MHincome,
		    senior: +d.value.senior,
            kid: +d.value.kid,
            pop: +d.value.pop,
            lowincome: +d.value.lowincome
    	}
    })

    console.log(municipalData)

    let extentIncome = d3.extent(municipalData, d => d.MHincome)
    let extentPop = d3.extent(municipalData, d => d.pop)
    let extentSenior = d3.extent(municipalData, d => d.senior)
    let extentKid = d3.extent(municipalData, d => d.kid)
    
    scaleY1.domain(extentIncome)
    scaleY2.domain([0,1.02])
    scaleY3.domain([0,0.32])
    scaleY4.domain([0,0.32])

    scaleColorIncome.domain(extentIncome)

    		    //axis
    axisX = d3.axisBottom()
		      .scale(scaleX)
		      .tickSize(400)
		      .tickValues([0,0.05,0.1,0.15,0.2,0.25,0.3])
		      .tickFormat(d => d*100);;

    axisY1 = d3.axisLeft()
		      .scale(scaleY1)
		      .tickSize(-420)
		      .tickValues([50000,50000*2,50000*3,50000*4]);

    
    axisY2 = d3.axisLeft()
		      .scale(scaleY2)
		      .tickSize(-420)
		      .tickValues([0,0.2,0.4,0.6,0.8,1.0])
		      .tickFormat(d => d*100);
    
    axisY3 = d3.axisLeft()
		      .scale(scaleY3)
		      .tickSize(-420)
		      .tickValues([0,0.05,0.1,0.15,0.2,0.25,0.3])
		      .tickFormat(d => d*100);

    axisY4 = d3.axisLeft()
		      .scale(scaleY4)
		      .tickSize(-420)
		      .tickValues([0,0.05,0.1,0.15,0.2,0.25,0.3])
		      .tickFormat(d => d*100);


/////////////// HOUSEHOLD INCOME /////////////////


		    plot1.append('g')
		        .attr('class','axis axisX')
		        .attr('transform','translate(0,20)')
		        .call(axisX);

		    plot1.append('g')
		        .attr('class','axis axisY')
		        .attr('transform','translate(10,0)')
		        .call(axisY1);  

	    circles1 = plot1.selectAll('.circle1')
	        .data(municipalData)
	        .enter()
	        .append('circle')
	        .attr('class',d  => d.municipal)
	        .classed('circle1', true)
	        .attr('cx', d => scaleX(d.FIpct))
	        .attr('cy', d => scaleY1(d.MHincome))
	        .attr('r', 5)
	        .style('fill', d => scaleColorIncome(d.MHincome))
	        .style('opacity',opacity)
	        .on('mouseover', d => {
	            //Tooltip //
	            let tooltip = d3.select('#scatter-tooltip')
	                .style('visibility','visible');

	            let x = d3.event.pageX, y = d3.event.pageY

	            if(x > window_w/2){
	            	tooltip
	            	.style('left',(d3.event.pageX-190) + 'px')
	            } else {
	            	tooltip
	            	.style('left',(d3.event.pageX+20) + 'px')
	            }

	            if(y > (row1_top + (svg_h/1.75))){
	            	tooltip
	                .style('top',(d3.event.pageY-100) + 'px')
	            } else {
	            	tooltip
	                .style('top',(d3.event.pageY+40) + 'px')            	
	            }

		        d3.select('#tooltip-muni')
		          .html(d.municipal);
		        d3.select('#tooltip-FIpct')
		          .html('Food Insecurity Rate: ' + d3.format('.2n')(d.FIpct*100));
		        d3.select('#tooltip-var')
		          .html('Median Household Income' +d3.format('$,')(Math.round(d.MHincome))); 
                
			    d3.selectAll('.row')
			      .selectAll('.'+d.municipal)
			      .attr('r', 10)
			      .style('stroke-width','3px')
			      .style('stroke','#4D4D4D')


	        })
	        .on('mouseleave', d => {
	    	    d3.select('#scatter-tooltip')
	    	      .style('visibility', 'hidden');

			    d3.selectAll('.row')
			      .selectAll('.'+d.municipal)
			      .attr('r', 5)
			      .style('stroke-width',d => {
			      	if(d.municipal == 'Boston' || d.municipal == 'Cambridge'){
			      		return '3px'
			      	} else {
			      		return '0px'
			      	}
			      })

	        })
            
            plot1.append('text')
                 .text('Boston')
                 .attr('x',260)
                 .attr('y',347)

            plot1.append('text')
                 .text('Cambridge')
                 .attr('x',200)
                 .attr('y',295)


/////////////    POPULATION   ///////////////


		    plot2.append('g')
		        .attr('class','axis axisX')
		        .attr('transform','translate(0,20)')
		        .call(axisX);

		    plot2.append('g')
		        .attr('class','axis axisY')
		        .attr('transform','translate(10,0)')
		        .call(axisY2);   

	    circles2 = plot2.selectAll('.circle2')
	        .data(municipalData)
	        .enter()
	        .append('circle')
	        .attr('class',d  => d.municipal)
	        .classed('circle2', true)
	        .attr('cx', d => scaleX(d.FIpct))
	        .attr('cy', d => scaleY2(d.pop))
	        .attr('r', 5)
	        .style('fill', d => scaleColorPct(d.pop))
	        .style('opacity',opacity)
	        .on('mouseover', d => {
	            //Tooltip //
	            let tooltip = d3.select('#scatter-tooltip')
	                .style('visibility','visible');

	            let x = d3.event.pageX, y = d3.event.pageY

	            if(x > window_w/2){
	            	tooltip
	            	.style('left',(d3.event.pageX-190) + 'px')
	            } else {
	            	tooltip
	            	.style('left',(d3.event.pageX+20) + 'px')
	            }

	            if(y > (row1_top + (svg_h/1.75))){
	            	tooltip
	                .style('top',(d3.event.pageY-100) + 'px')
	            } else {
	            	tooltip
	                .style('top',(d3.event.pageY+40) + 'px')            	
	            }

		        d3.select('#tooltip-muni')
		          .html(d.municipal);
		        d3.select('#tooltip-FIpct')
		          .html('Food Insecurity Rate: ' + d3.format('.2n')(d.FIpct*100));
		        d3.select('#tooltip-var')
		          .html('% of population: ' + d3.format('.2n')(d.pop*100)); 

			    d3.selectAll('.row')
			      .selectAll('.'+d.municipal)
			      .attr('r', 10)
			      .style('stroke-width','3px')
			      .style('stroke','#4D4D4D')

	        })
	        .on('mouseleave', d => {
	    	    d3.select('#scatter-tooltip')
	    	      .style('visibility', 'hidden');
	            
	            d3.selectAll('.row')
			      .selectAll('.'+d.municipal)
			      .attr('r', 5)
			      .style('stroke-width',d => {
			      	if(d.municipal == 'Boston' || d.municipal == 'Cambridge'){
			      		return '3px'
			      	} else {
			      		return '0px'
			      	}
			      })

	        })
            
            plot2.append('text')
                 .text('Boston')
                 .attr('x',260)
                 .attr('y',402)

            plot2.append('text')
                 .text('Cambridge')
                 .attr('x',190)
                 .attr('y',385)

/////////////    SENIOR   ///////////////
		   
		    plot3.append('g')
		        .attr('class','axis axisX')
		        .attr('transform','translate(0,20)')
		        .call(axisX);

		    plot3.append('g')
		        .attr('class','axis axisY')
		        .attr('transform','translate(10,0)')
		        .call(axisY3);   

	    circles3 = plot3.selectAll('.circle3')
	        .data(municipalData)
	        .enter()
	        .append('circle')
	        .attr('class',d  => d.municipal)
	        .classed('circle3', true)
	        .attr('cx', d => scaleX(d.FIpct))
	        .attr('cy', d => scaleY3(d.senior))
	        .attr('r', 5)
	        .style('fill', d => scaleColorPct(d.senior))
	        .style('opacity',opacity)
	        .on('mouseover', d => {
	            //Tooltip //
	            let tooltip = d3.select('#scatter-tooltip')
	                .style('visibility','visible');

	            let x = d3.event.pageX, y = d3.event.pageY

	            if(x > window_w/2){
	            	tooltip
	            	.style('left',(d3.event.pageX-190) + 'px')
	            } else {
	            	tooltip
	            	.style('left',(d3.event.pageX+20) + 'px')
	            }

	            if(y > (row1_top + (svg_h/1.75))){
	            	tooltip
	                .style('top',(d3.event.pageY-100) + 'px')
	            } else {
	            	tooltip
	                .style('top',(d3.event.pageY+40) + 'px')            	
	            }

		        d3.select('#tooltip-muni')
		          .html(d.municipal);
		        d3.select('#tooltip-FIpct')
		          .html('Food Insecurity Rate: ' + d3.format('.2n')(d.FIpct*100));
		        d3.select('#tooltip-var')
		          .html('% of senior: ' + d3.format('.2n')(d.senior*100)); 
			   
			    d3.selectAll('.row')
			      .selectAll('.'+d.municipal)
			      .attr('r', 10)
			      .style('stroke-width','3px')
			      .style('stroke','#4D4D4D')

	        })
	        .on('mouseleave', d => {
	    	    d3.select('#scatter-tooltip')
	    	      .style('visibility', 'hidden');
			    d3.selectAll('.row')
			      .selectAll('.'+d.municipal)
			      .attr('r', 5)
			      .style('stroke-width',d => {
			      	if(d.municipal == 'Boston' || d.municipal == 'Cambridge'){
			      		return '3px'
			      	} else {
			      		return '0px'
			      	}
			      })
	        })

            
            plot3.append('text')
                 .text('Boston')
                 .attr('x',260)
                 .attr('y',404)

            plot3.append('text')
                 .text('Cambridge')
                 .attr('x',180)
                 .attr('y',385)


/////////////    KIDS   ///////////////

		    plot4.append('g')
		        .attr('class','axis axisX')
		        .attr('transform','translate(0,20)')
		        .call(axisX);

		    plot4.append('g')
		        .attr('class','axis axisY')
		        .attr('transform','translate(10,0)')
		        .call(axisY4);   


	    circles4 = plot4.selectAll('.circle4')
	        .data(municipalData)
	        .enter()
	        .append('circle')
	        .attr('class',d  => d.municipal)
	        .classed('circle4', true)
	        .attr('cx', d => scaleX(d.FIpct))
	        .attr('cy', d => scaleY3(d.kid))
	        .attr('r', 5)
	        .style('fill', d => scaleColorPct(d.kid))
	        .style('opacity',0.7)
	        .on('mouseover', d => {
	            //Tooltip //
	            let tooltip = d3.select('#scatter-tooltip')
	                .style('visibility','visible');

	            let x = d3.event.pageX, y = d3.event.pageY

	            if(x > window_w/2){
	            	tooltip
	            	.style('left',(d3.event.pageX-190) + 'px')
	            } else {
	            	tooltip
	            	.style('left',(d3.event.pageX+20) + 'px')
	            }

	            if(y > (row1_top + (svg_h/1.75))){
	            	tooltip
	                .style('top',(d3.event.pageY-100) + 'px')
	            } else {
	            	tooltip
	                .style('top',(d3.event.pageY+40) + 'px')            	
	            }

		        d3.select('#tooltip-muni')
		          .html(d.municipal);
		        d3.select('#tooltip-FIpct')
		          .html('Food Insecurity Rate: ' + d3.format('.2n')(d.FIpct*100));
		        d3.select('#tooltip-var')
		          .html('% of kids: ' + d3.format('.2n')(d.kid*100)); 

			    d3.selectAll('.row')
			      .selectAll('.'+d.municipal)
			      .attr('r', 10)
			      .style('stroke-width','3px')
			      .style('stroke','#4D4D4D')

	        })
	        .on('mouseleave', d => {
	    	    d3.select('#scatter-tooltip')
	    	      .style('visibility', 'hidden');
			    d3.selectAll('.row')
			      .selectAll('.'+d.municipal)
			      .attr('r', 5)
			      .style('stroke-width',d => {
			      	if(d.municipal == 'Boston' || d.municipal == 'Cambridge'){
			      		return '3px'
			      	} else {
			      		return '0px'
			      	}
			      })
	        })
          
            plot4.append('text')
                 .text('Boston')
                 .attr('x',260)
                 .attr('y',404)

            plot4.append('text')
                 .text('Cambridge')
                 .attr('x',180)
                 .attr('y',385)

//////// highlight

			d3.selectAll('.row')
			  .selectAll('.Boston')
			  .style('stroke-width','3px')
			  .style('stroke','#4D4D4D')

			d3.selectAll('.row')
			  .selectAll('.Cambridge')
			  .style('stroke-width','3px')
			  .style('stroke','#4D4D4D')

}//draw


function parse(d) {
	// console.log(d);
	return {
		tract: d.ct10_id,
		municipal: d.municipal,
		county: d.county,
		fip: +d.fi_p,
		mhi: +d.mhi,
		senior: +d.laseniors1share,
        kid: +d.lakids1share,
        pop: +d.lapop1share,
        lowincome: +d.lalowi1share
	}
}