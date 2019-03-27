// @TODO: YOUR CODE HERE!
function makeResponsive() {

    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    var svgWidth = window.innerWidth*0.5;
    var svgHeight = window.innerHeight*0.8;

    var margin = {
        top: 50,
        right: 50,
        bottom: 100,
        left: 100
    };

    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`); 

    d3.csv("/assets/data/data.csv")
        .then(function (healthData) {
        
        healthData.forEach(function(data) {
            data.id = +data.id;
            data.state = data.state;
            data.abbr = data.abbr;
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;
            data.obesity = +data.obesity;
            data.healthcare = +data.healthcare;
            data.smokes = +data.smokes;
          });

        var xLinearScale = d3.scaleLinear()
            .domain(d3.extent(healthData, d => d.poverty))
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain(d3.extent(healthData, d => d.healthcare))
            .range([height, 0]);

        var xAxis = d3.axisBottom(xLinearScale).ticks(8);
        var yAxis = d3.axisLeft(yLinearScale).ticks(12);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        chartGroup.append("g")
            .call(yAxis);

        // var theCircles = svg.selectAll("g theCircles").data(healthData).enter();
        var theCircles = chartGroup.selectAll("g circle").data(healthData).enter();


        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
        // theCircles
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "13")
            .attr("fill", "lightblue")
            .attr("stroke-width", "1")
            .attr("stroke", "lightblue")

        // var text = chartGroup.selectAll("text")
        //     .data(healthData)
        //     .enter()
        theCircles
            .append("text")
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .text(d => d.abbr)
            .style("text-anchor", "middle")
            .style("alignment-baseline", "central")
            .attr("font-size", "12px")
            .attr("fill", "white");
        
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function (d) {
                return (`<strong>${d.state}:</strong><br>Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`);
            });

        chartGroup.call(toolTip);
        // theCircles.call(toolTip);

        circlesGroup.on("mouseover", function (data) {
        // theCircles.on("mouseover", function (data) {
            toolTip.show(data, this);
        })
            .on("mouseout", function (data) {
                toolTip.hide(data);
            });

        chartGroup.append("text")
        // theCircles.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 1.5))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)");

        chartGroup.append("text")
        // theCircles.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");
        
        
    });
}
makeResponsive();
d3.select(window).on("resize", makeResponsive);
