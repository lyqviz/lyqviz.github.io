queue()
  .defer(d3.csv, "data.csv")
  .await(display);