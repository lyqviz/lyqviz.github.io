
// For use with scroller_template.html and mfreeman_scroller.js.
// function to move a selection to the front/top, from
// https://gist.github.com/trtg/3922684
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

var data = []; 

var vis = d3.select("#vis");

function focus_country(country) {
  console.log("in focus", country);
    d3.selectAll(".dots").classed("focused", false);
    d3.selectAll(".dots").classed("unfocused", false);
    if (country) {
        var country = country.replace(/\s/g, '_');
        d3.selectAll(".dots").classed("unfocused",true);
        var dots = d3.select("#" + country );
        dots.classed("unfocused",false).classed("focused", true);
        var dotsgroup = d3.select("#" + country);
        dots.moveToFront();
    }
}

function draw_label(yValue){  
  drawylabel.text(yValue);
}

var update = function(value) {
  
  var country = null;
  var localdata = getData(data);
  colorFunction = colorsNone;
  var opacity = 0;
  var show_vis = true;
  switch(value) {
    case 0:
      show_vis = false;
      console.log("in case",value,country);
      localdata = getData(data);
      country = null;
      yValue = "Under Five Mortality Rate";
      colorFunction = colorsNone;
    case 1:
      console.log("in case",value,country);
      localdata = getData(data);
      country = null;
      yValue = "Under Five Mortality Rate";
      colorFunction = colorsNone;
    case 2:
      console.log("in case",value,country);
      localdata = getData(data);
      country = "Afghanistan";
      yValue = "Under Five Mortality Rate";
      colorFunction = colorsNone;
      break;
    case 3:
      console.log("in case",country);
      localdata = getData(data);
      country = "Angola";
      yValue = "Under Five Mortality Rate";
      colorFunction = colorsNone;
      break;
    case 4:
      console.log("in case",value,country);
      country = null;
      localdata = getData(data);
      console.log(localdata);
      yValue = "Under Five Mortality Rate";
      colorFunction = colors;
      break;
    case 5:
      console.log("in case",value,country,"10 lowest");
      country = null;
      localdata = getData(data).sort(function(a,b){
        return a.youthLiteracyRate - b.youthLiteracyRate;
      }).slice(0,10);
      console.log(localdata);
      yValue = "Under Five Mortality Rate";
      colorFunction = colors;
      break;
    case 6:
      console.log("in case",value,country,"10 hightest");
      country = null;
      localdata = getData(data).sort(function(a,b){
        return b.youthLiteracyRate - a.youthLiteracyRate;
      }).slice(0,10);
      console.log(localdata);
      yValue = "Under Five Mortality Rate";
      colorFunction = colors;
      break;
    case 7:
      console.log("in case", value);
      localdata = getData(data);
      console.log(localdata);
      country = null;
      yValue = "Under Five Mortality Rate";
      colorFunction = colors;
      break;
    case 8:
      country = null;
      console.log("in case ", value);
      localdata = getData2(data);
      console.log(localdata);
      yValue = "Adolescent Fertility Rate";
      colorFunction = colors;
      break;
    case 9:
      country = null;
      console.log("in case ", value);
      localdata = getData2(data);
      console.log(localdata);
      yValue = "Adolescent Fertility Rate";
      colorFunction = colors;
      show_vis = false;
      break;
    default:
      colorFunction = colorsNone;
      country = null;
      show_vis = true;
      yValue = "Under Five Mortality Rate";
      colorFunction = colorsNone;
      break;
  }
  console.log("show viz and country", show_vis, country, value);
  if (show_vis) {
    vis.style("display", "inline-block");
  } else {
    vis.style("display", "none");
  }
  draw_circles(localdata); 
  if (value > 1) {
   focus_country(country); 
 } else {
  focus_country(null);
 }
  draw_label(yValue);
}

function display(error, mydata) {
  if (error) {
    console.log(error);
  } else {

    data = mydata; 

    console.log(data);

    var scroll = scroller()
      .container(d3.select('#graphic'));

    scroll(d3.selectAll('.step'));

    scroll.update(update);

    var oldScroll = 4500;
    $(window).scroll(function (event) {
      var scroll = $(window).scrollTop();
      if (scroll >= 8100 && scroll > oldScroll) {
          vis.style("display", "none");
       } else if (scroll >= 8100 && scroll < 8400 && scroll < oldScroll-1 ) {
        vis.style("display", "inline-block"); 
       }
      oldScroll = scroll;
    });
  }
}

queue()
  .defer(d3.csv, "data/data.csv")
  .await(display);

