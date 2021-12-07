
//init canvas
var m = {t:30,r:20,b:50,l:50}
    // w = document.getElementById('canvas').clientWidth - m.l - m.r,
    // h = document.getElementById('canvas').clientHeight - m.t - m.b;

var svg = d3.select('#canvas')
    .append('svg')
    // .attr('width', w + m.l + m.r)
    // .attr('height', h + m.t + m.b)
    plot=svg.append('g').attr('class','plot')
    .attr('transform','translate('+ m.l+','+ m.t+')');

//set scales
var scaleColor = d3.scaleOrdinal()
	.domain(['China','Taiwan','Japan', 'SouthKorea', 'SoutheastAsia'])
	// .range(['#A3FB66','#D65671','#2BA3E6']),
    .range(['#45B5AA','#DECDBE','#FF6F61','#ffce00','#92A8D1' ]),
	scaleX = d3.scaleBand()
	// .range([w/22,w])
    .paddingOuter(.3)
    .paddingInner(.6),
	scaleY = d3.scaleLinear()
	.domain([500,1])
	
var lineGenerator = d3.line()
    .x(function(d){return scaleX(d.year)})
    .y(function(d){return scaleY(d.rank)})
    .curve(d3.curveCardinal.tension(0.5));
var axisX = d3.axisBottom().tickPadding(10),
    axisY = d3.axisLeft().tickPadding(10);
var rankbg,X,Y,years,isFirst,rankYear;
var Byname = JSON.parse(localStorage.getItem('Byname')) || [];
var fortune = JSON.parse(localStorage.getItem('fortune')) || [];
var keys = [];
    keys.push({location:'China'});
    keys.push({location:'Japan'});
    keys.push({location:'SouthKorea'});
    //keys.push({location:'Taiwan'});
    keys.push({location:'SoutheastAsia'});
    rankbg = plot.append('g').attr('class','diagram');
    X = rankbg.append('g').attr('class','axis axis-x')
    Y = rankbg.append('g').attr('class','axis axis-y');
//add animation to lines
function setanimationline(){
    var paths = document.querySelectorAll('.location');
    paths.forEach(path=>{
        animationline(path)
        // setInterval(function(){},6000)
        path.addEventListener("transitionend", function(d){animationline(path)});
    })
}
function animationline(path){
    // console.log(path.getTotalLength())
    var length = path.getTotalLength();
    path.style.transition = path.style.WebkitTransition = 'none';
    path.style.strokeDasharray = length+' ' + length;
    path.style.strokeDashoffset = length;
    path.getBoundingClientRect();
    path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 5s ease-in-out';
    path.style.strokeDashoffset = '0';
}


d3.csv('data/fortunatedata.csv',parse,dataloaded);
function dataloaded(err, fortune){
console.table(fortune);
Byname = d3.nest()
    .key(function(d){return d.name}).sortKeys(d3.ascending)
    .rollup(function(leaves){
        var changes; 
        if(leaves[0].location == 'China' && leaves[0].rank - leaves[leaves.length - 1].rank <= -1){return {values:leaves,
        change:'down'}}
        if(leaves[0].location == 'China' && leaves[0].rank-leaves[leaves.length - 1].rank >= 100){return {values:leaves,
        change:'rapid'}}
        if(leaves[0].location == 'Japan' && leaves[0].rank - leaves[leaves.length - 1].rank <= -1){return {values:leaves,
        change:'down'}}
        if(leaves[0].location == 'Japan' && leaves[0].rank-leaves[leaves.length - 1].rank >= 100){return {values:leaves,
        change:'rapid'}}
        if(leaves[0].location == 'SouthKorea' && leaves[0].rank - leaves[leaves.length - 1].rank <= -1){return {values:leaves,
        change:'down'}}
        if(leaves[0].location == 'SouthKorea' && leaves[0].rank-leaves[leaves.length - 1].rank >= 100){return {values:leaves,
        change:'rapid'}}
        if(leaves[0].location == 'SoutheastAsia' && leaves[0].rank - leaves[leaves.length - 1].rank <= -1){return {values:leaves,
        change:'down'}}
        if(leaves[0].location == 'SoutheastAsia' && leaves[0].rank-leaves[leaves.length - 1].rank >= 100){return {values:leaves,
        change:'rapid'}}
        if(leaves[0].location == 'Taiwan' && leaves[0].rank - leaves[leaves.length - 1].rank <= -1){return {values:leaves,
        change:'down'}}
        if(leaves[0].location == 'Taiwan' && leaves[0].rank-leaves[leaves.length - 1].rank >= 100){return {values:leaves,
        change:'rapid'}}
        else{return {values:leaves,change:''}
        }
    })
    .entries(fortune)

console.log(Byname)

localStorage.setItem('Byname', JSON.stringify(Byname))
localStorage.setItem('fortune', JSON.stringify(fortune));
years = d3.map(fortune,function(d){return d.year})

scaleX.domain(years.keys())
axisX.scale(scaleX).tickValues(years.keys()).tickSize(0);
axisY.scale(scaleY).tickValues([1,100,200,300,400,500])
// .tickSize(-w);

isFirst=false;
setsight()
creatediagram()

dots(fortune);setTimeout(function(){lines(Byname)}, 1500);



window.addEventListener('scroll', debounce(checkSlide));


}
function checkSlide(e) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        // console.log(slide.offsetTop,slide.clientHeight)

        // half way through the slide
        const slideInAt = (window.scrollY + window.innerHeight) - slide.clientHeight/2;
        // bottom of the slide
        const slideBottom = slide.offsetTop + slide.clientHeight*.5;
        const isHalfShown = slideInAt > slide.offsetTop;
        const isNotScrolledPast = window.scrollY < slideBottom;
        if (isHalfShown && isNotScrolledPast) {
         // console.log(slide.id+' :i am in');
         switch(slide.id){
            case 'slide0':
                d3.selectAll('.location').style('opacity',.9);
                break;
            case 'slide1': 
                isFirst=true;
                setsight();
                d3.selectAll('.location').style('opacity',0);
                break;
            case 'slide2':
                resetline('.China');
                break;
            case 'slide3':
                resetline('.China','rapid');
                break;
            case 'slide4':
                resetline('.China','down');
                break;    
            case 'slide5':
                resetline('.Japan');
                break;
            case 'slide6':
                resetline('.Japan','rapid');
                break;
            case 'slide7':
                resetline('.SouthKorea');
                break;
            case 'slide8':
                resetline('.SouthKorea','rapid');
                break;
            case 'slide9':
                resetline('.SouthKorea','down');
                break;
            case 'slide10':
                resetline('.SoutheastAsia');
                break;
            case 'slide11':
                resetline('.SoutheastAsia','rapid');
                break;
            case 'slide12':
                resetline('.SoutheastAsia','down');
                break;
            case 'slide13':
                resetline('.location');
                break;
         }
        } else {
          // console.log(slide.id+' :i am out');
          switch(slide.id){
            case 'slide0':

            case 'slide1':           
               if(isNotScrolledPast){isFirst=false;setsight();d3.selectAll('.location').style('opacity',.9);}
                break;
            case 'slide2':            
                if(isNotScrolledPast){plot.selectAll('.location').style('opacity',0);d3.selectAll('.dots').style('opacity',.7)}
                break;
            case 'slide3':
                if(!isNotScrolledPast){resetline('.China');}
                break;
            case 'slide4':
                if(!isNotScrolledPast){resetline('.China','rapid');}
                break;
            case 'slide5':
                if(!isNotScrolledPast){resetline('.China','down');}
                break;
            case 'slide6':
                if(!isNotScrolledPast){resetline('.Japan');}
                break;
            case 'slide7':
                if(!isNotScrolledPast){resetline('.Japan','rapid');}
                break;
            case 'slide8':
                if(!isNotScrolledPast){resetline('.SouthKorea')}
                break;
            case 'slide9':
                if(!isNotScrolledPast){resetline('.SouthKorea','rapid')}
                break;
            case 'slide10':
                if(!isNotScrolledPast){resetline('.SouthKorea','down')}
                break;
            case 'slide11':
                if(!isNotScrolledPast){resetline('.SoutheastAsia')}
                break;
            case 'slide12':
                if(!isNotScrolledPast){resetline('.SoutheastAsia','rapid')}
                break;
            case 'slide13':
                if(!isNotScrolledPast){resetline('.SoutheastAsia','down')}
                break;
        };}
      })
}
function setsight(){

    if(isFirst){
        document.querySelector('#canvas').classList.remove('blur'); 
        document.querySelector('#diagram').classList.remove('col-lg-12', 'col-md-12', 'col-sm-12')
        document.querySelector('#diagram').classList.add('col-lg-8', 'col-md-8', 'col-sm-8')
        lines(Byname);
        isFirst=false;
    }
    else{
        document.querySelector('#canvas').classList.add('blur'); 
        document.querySelector('#diagram').classList.remove('col-lg-8', 'col-md-8', 'col-sm-8')
        document.querySelector('#diagram').classList.add('col-lg-12', 'col-md-12', 'col-sm-12')  
        lines(Byname);resetline('.location')
        isFirst=true;
    }
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;
    svg.attr('width', w + m.l + m.r).attr('height', h + m.t + m.b)
    scaleX.range([w/22,w])
    axisY.tickSize(-w);
    scaleY.range([h,h/500+h*.15]);
    setTimeout(function(){dots(fortune);}, 500);
    X.transition().call(axisX);    
}
function creatediagram(){
    X.attr('transform','translate(0,'+ h +')'),
    X.call(axisX);
    Y.call(axisY);
    rankbg.append('g').attr('class','circle');
    rankbg.append('g').attr('class','line');
    d3.selectAll('.tagprofit').remove();
    rankbg.append("text").attr('class','tagrank')
        .style("text-anchor", "middle")
        .text("Year")
        .attr("transform", "translate(" + (w/4) + "," + (h + m.b/1.3) + ")")
    rankbg.append("text").attr('class','tagrank')
        .attr("transform", "translate(" + (-m.l/4) + "," + (m.t*2) + ")")
        .style("text-anchor", "middle")
        .text("Rank");
    var key=rankbg.selectAll('.key')
        .data(keys).enter()
        .append("g").attr('class','key')
        .attr("transform", function(d,i){return 'translate(' + (i + 1) * (w/8) + ',' + (m.t) + ')'})

    key.append('circle')
        .attr('r',6)
        .style('stroke',function(d){return scaleColor(d.location)})
        .style('stroke-width','2px')
        .style('fill','none')
    key.append('text')
        .style("text-anchor", "left")
        .text(function(d){return d.location})
        .attr('transform',function(d){return 'translate('+15+','+5+')'});

}
//to select specific country/industry's lines
function resetline(name,filter){
    // console.log(name.substr(1))
     var getchange=d3.map(Byname,function(d){return d.key})
    if(name != '.location'){
        plot.selectAll('.dots').style('opacity',.2);

       
        plot.selectAll('.dots').filter(d=>{
            // console.log(d)

            var itschange=getchange.get(d.name)
            // console.log(itschange.value.values[itschange.value.values.length-1])
            // console.log(d.year)
            if(filter == undefined){
                return d.location == name.substr(1) && (d.year == itschange.value.values[itschange.value.values.length-1].year || d.year == itschange.value.values[0].year);
            }
            else{
                // console.log(d.change+":"+itschange.value.change)
                return (d.change == "" ? d.location == name.substr(1) && itschange.value.change == filter : d.location == name.substr(1) && d.change == filter) && (d.year == itschange.value.values[itschange.value.values.length-1].year || d.year == itschange.value.values[0].year)
            }
        })
        .style('opacity',.9)  
    }
    else{
        plot.selectAll('.dots').filter(d=>{
            var itschange=getchange.get(d.name)
            return d.year == itschange.value.values[itschange.value.values.length-1].year || d.year == itschange.value.values[0].year;
        })
        .style('opacity',.9)
    }

    plot.selectAll('.location').transition().style('opacity',0);
    plot.selectAll(name).filter(d=>{
        switch(filter){
            case 'rapid':
                switch(name){
                    case '.China':return d[0].rank - d[d.length - 1].rank >= 100;
                    break;
                    case '.Japan':return d[0].rank - d[d.length - 1].rank >= 100;
                    break;
                    case '.SouthKorea':return d[0].rank - d[d.length - 1].rank >= 100;
                    break;
                    case '.SoutheastAsia':return d[0].rank - d[d.length - 1].rank >= 100;
                    break;
                }
            break;
            case 'down':
                switch(name){
                    case '.China':return d[0].rank - d[d.length - 1].rank <= -1;
                    break;
                    case '.Japan':return d[0].rank - d[d.length - 1].rank <= -1;
                    break;
                    case '.SouthKorea':return d[0].rank - d[d.length - 1].rank <= -1;
                    break;
                    case '.SoutheastAsia':return d[0].rank - d[d.length - 1].rank <= -1;
                    break;
                }
            break;
            /*case 'top':
                switch(name){
                    case '.China':return d[0].change == filter;
                    break;
                    case '.Japan':return d[0].change == filter;
                    break;
                    case '.South Korea':return d[0].change == filter;
                    break;
                }
            break;*/
            case undefined:
                return d;
            break;
        }
    })
    .transition().style('opacity',.8)   
}

//to draw line
function lines(data){
    var updateline = d3.select('.line').selectAll('.location')
        .data(data,function(d){return d.key});

    var enterline = updateline.enter()
            .append('path').attr('class',function(d){return 'location '+d.value.values[0].location + ' ' + d.value.change + ' ' + d.value.values[0].industry})
            .datum(function(d){return d.value.values})
            .attr('d',function(d){return lineGenerator(d);})
            .on('mouseenter',function(d){
            var tooltip = d3.select('.custom-tooltip');
            tooltip.select('.title')
                .html(d[0].name)
            tooltip.select('.value')
                .html(d[0].location);

            tooltip.transition().style('opacity',1);

            d3.select(this).style('stroke-width','2px');           
        })
        .on('mousemove',function(d){
            var tooltip = d3.select('.custom-tooltip');
            var xy = d3.mouse( d3.select('.container-fluid').node() );
            tooltip
                .style('left',xy[0]+10+'px')
                .style('top',xy[1]+10+'px');
        })
        .on('mouseleave',function(d){
            var tooltip = d3.select('.custom-tooltip');
            tooltip.transition().style('opacity',0);

            d3.select(this).style('stroke-width','1.5px');
        })
            
    updateline.merge(enterline)
            .style('stroke',function(d){return scaleColor(d[0].location)})
            .style('fill','none')
            .style('opacity',.9)
            .style('stroke-width',2)
            
    updateline.exit().remove(); 
    setanimationline();
}
//to draw dots
function dots(data){

var updatedots = d3.select('.circle').selectAll('.dots')
        .data(data);
var enterdots = updatedots.enter()
        .append('circle').attr('class',function(d){return 'dots y' + d.year})
        .attr('cx',0)
        .attr('cy',0)      
        .style('stroke',function(d){return scaleColor(d.location)})
        .style('stroke-width','1.5px')
        .style('fill','none')
        .style('opacity',.7)
        .attr('r',0)
        .on('click',function(d){console.log(d.rank)})
        .attr('r','3.5px')
    
updatedots.merge(enterdots)
    .attr('cy',function(d){return scaleY(d.rank)})
    .transition().duration(500)
    .attr('cx',function(d){return scaleX(d.year)})

}

function parse(d){
    String.prototype.replaceAll = function(target, replacement) {
      return this.split(target).join(replacement);
    };
    if(d['Location'] == "" || d['Location'] == undefined)return;
    if(d['Year'] == "2008")return;

    return {
    	year:d['Year'],
        rank:+d['Rank'],
        // prerank:+d['PreviousRank']?+d['PreviousRank']:undefined,
        name:d['Name'],
        location:d['Location'],
        // profit:d['Profits'].indexOf('(')?+(d['Profits'].replace('$','').replaceAll(',','')):-(+(d['Profits'].replace('(','').replace(')','').replace('$','').replaceAll(',',''))),
        // assets:+(d['Assets'].replace('$','').replaceAll(',','')),
        // employee:+(d['Employees'].replaceAll(',','')),
       // industry:d['industry']!==""?d['industry']:'',
        change:d['Change']!==""?d['Change']:'',
    }
}
