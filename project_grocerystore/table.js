(function() {

    d3.queue()
    .defer(d3.csv, 'data/compiled_data.csv')
    .await(ready)

    function ready(error, datapoints) {

      // create table
      var table = d3.select('#table').append('table')

      // create the titles of the table
      var titles = ["County", 'Store Num', "Density", "Ratio"]

      var sortAscending = true
      
      var headers = table.append('thead')
                         .selectAll('th')
                         .data(titles).enter()
                         .append('th')
                         .append('tr')
                         .text(function (d) {
                            return d
                          })
                         .on('click', function (d) {

                            console.log(d)
                             // set up sortable table
                             // when true, descend it and change sortAscending to "false"
                             if (d != "County") {
                               if (sortAscending) {
                                  rows.sort(function(x, y){
                                    return d3.descending(x[d], y[d])
                                  })
                                  sortAscending = false
                               } 
                               else {
                                 rows.sort(function(x, y){
                                    return d3.ascending(x[d], y[d])
                                  })
                                 sortAscending = true
                               }

                             d3.selectAll('td')
                               .style("background", "white")
                               .style("color", "black")
                               .style("border-bottom", "1px solid #ccc")
                               .style("text-shadow", "none")

                             d3.selectAll('th')
                               .style("border-top", "3px solid white")


                            }


                         })

      
      var rows = table.append('tbody').selectAll('tr')
                      .data(datapoints).enter()
                      .append('tr')

      rows.selectAll('td')
          .data(function (d) {
            console.log()
              return titles.map(function (k) {
                return { 'value': d[k], 'name': k}
              });
          }).enter()
          .append('td')
          .attr('data-th', function (d) {
          return d.name;
          })
          .text(function (d) {
             // assign different formats for texts and numbers
             if (d.name === "County") {
                return d.value
             } 
             else {
                return +d.value
             }
        })


        
      }

})();