(function() {

    var app = new Vue({
      el: '#app',
      // the default for data
      data: {
        search: "",
        snitching: false,
        divisions: [],
        currentcounty: "Suffolk",
        currentstorenum: "1877",
        currentdensity: "629.31",
        currentratio: "0.34"
      },
      computed: {
        filteredDivisions:function(divisions){
          var that=this;
          // if(this.search === "") {
          //   return []
          // }
            return this.divisions.filter(function(division){
              // console.log(division.Division.toLowerCase().indexOf(self.search.toLowerCase()) >= 0)
              return division.County.toLowerCase().indexOf(that.search.toLowerCase()) !== -1 
            }).slice(0, 100000)
        }
      },
      methods: {
        showDivision: function (division) {
          console.log(division)
          app.currentcounty = division["County"] 
          app.currentstorenum = parseFloat(Math.round(division["store_num"]))//.toFixed(0)
          app.currentdensity = parseFloat(Math.round(division["density"]))//.toFixed(0)
          app.currentratio = parseFloat(Math.round(division["ratio"]))//.toFixed(0)
          //app.currentYear4 = parseFloat(Math.round(division["8-14 Years"] * 100)).toFixed(0) + "%"
        }
      },
      created: function () {
        // papa.parse is a library to parse csv
          Papa.parse("data/compiled_data.csv", {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: function (parsed) {
          app.divisions = parsed.data
          }
        });
      }
    })


})()