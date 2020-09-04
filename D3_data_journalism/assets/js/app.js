// Step 1: Set up our chart
// ===========================
var svgWidth = 700;
var svgHeight = 550;

//set the margins
var margin = {
  top: 40,
  right: 30,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Step 2: Create an SVG wrapper, 
// append an SVG group that will hold our chart, 
// and shift the latter by left and top margins.
// ===============================================
var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);   


// Step 3: Import data from the data.csv file
// =========================================== 
d3.csv("assets/data/data.csv").then(function(datacsv) {

    // Step 4: Format the data
    // ================================

    datacsv.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // Step 5: Create Scales
    // ================================
    var xLinearScale = d3.scaleLinear()
                         .domain([7, d3.max(datacsv, d => d.poverty)])
                         .range([0, width]);

    var yLinearScale = d3.scaleLinear()
                         .domain([0, d3.max(datacsv, d => d.healthcare)])
                         .range([height, 0]);

    // Step 6: Create Axes
    // ================================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 7: Append the axes to the chartGroup
    // ===========================================
    chartGroup.append("g")
              .attr("transform", `translate(0, ${height})`)
              .call(bottomAxis);

    chartGroup.append("g")
              .call(leftAxis);

    // Step 8: Create Circles
    // ============================================================
    var circlesGroup = chartGroup.selectAll("circle")
                                 .data(datacsv)
                                 .enter()
                                 .append("circle")
                                 .attr("cx", d => xLinearScale(d.poverty))
                                 .attr("cy", d => yLinearScale(d.healthcare))
                                 .attr("r", "11")
                                 .classed("stateCircle", true)

    circlesGroup.append("p")
                .text(d => d.abbr)
                .classed("stateText", true)
                .style("fill", "blue")

    var stateText = chartGroup.selectAll(".text")
                              .data(datacsv)
                              .enter()
                              .append("text")
                              .text(d => d.abbr)
                              .attr("x", d => xLinearScale(d.poverty))
                              .attr("y", d => yLinearScale(d.healthcare))
                              .classed("stateText", true)
                              .attr("transform", `translate(-0.5,5)`)

    // Step 9: Initialize Tooltip
    // ============================
    var toolTip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([80, -60])
                    .html(function(d) {
                        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
                    });

    // Step 10: Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Step 11: Create event listeners to display and hide the tooltip
    // ================================================================
    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    })

        // onmouseout event
        .on("mouseout", function(d, index) {
          toolTip.hide(d);
        });
  
        // Create axes labels
        chartGroup.append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 0 - margin.left + 40)
                  .attr("x", 0 - (height / 2))
                  .attr("dy", "1em")
                  .text("Lacks Healthcare (%)");
  
        chartGroup.append("text")
                  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
                  .text("In Poverty (%)");
  

}).catch(function(error) {
      console.log(error);
    });
