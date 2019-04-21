// Make chart responsive to autoresize the chart
function makeResponsive() {

    // If SVG Area is not empty upon browser loading, remove then replace with an autofit version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // Clear SVG is not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // Store width and height parameters
    let svgWidth = 960;
    let svgHeight = 500;

    // Set svg margins
    let margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
    };

    // Set width and height based svg margins and parameters to fit the graph within the canvas

    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our data
    let svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Shift by left and top margins
    let chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Import data
    d3.csv("assets/data/data.csv")
        .then(function(healthData) {
   
        // Step 1: Parse Data/Cast as numbers
        healthData.forEach(function (data) {
            data.income = +data.income;
            data.obesity = +data.obesity;
        });

        // Step 2: Create scale functions
        let xLinearScale = d3.scaleLinear()
            .domain([20, d3.max(healthData, d => d.obesity)])
            .range([0, width]);
            
        let yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(healthData, d => d.income)])
            .range([height, 0]);
            
        // Step 3: Create axis functions
        let bottomAxis = d3.axisBottom(xLinearScale);
        let leftAxis = d3.axisLeft(yLinearScale);

        // Step 4: Append axes to the chart
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
            
        chartGroup.append("g")
            .call(leftAxis);
            
        // Step 5: Create Circles
        let circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.obesity))
            .attr("cy", d => yLinearScale(d.income))
            .attr("r", "15")
            .attr("fill", "blue")
            .attr("opacity", ".5");
            
        // Append Text to Circles
        circlesGroup = chartGroup.selectAll()
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d.obesity))
            .attr("y", d => yLinearScale(d.income))
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .text(d => (d.abbr));

        // Step 6: Initialize tool tip
        let toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function (d) {
                return (`${d.state}<br>Income: ${d.income}%<br>Obesity: ${d.obesity}% `);
            });
            
        // Step 7: Create tooltip in the chart
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        circlesGroup.on("mouseover", function (data) {
            toolTip.show(data, this);
        })
            // mouseout event
            .on("mouseout", function (data, index) {
            toolTip.hide(data);
            });
            
        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Household Income (Median)");
            
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Obesity (%)");
    });
}
// makeResponsive() gets called when browser loads
makeResponsive();

// makeResponsive() is called when browser window resizes
d3.select(window).on("resize", makeResponsive);
