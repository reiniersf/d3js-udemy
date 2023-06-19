async function draw() {
    // Grab the data
    const dataset = await d3.json("data.json")

    const xAccessor =  d => d.currently.humidity
    const yAccessor = d => d.currently.temperature

    //Dimensions
    const dimensions = {
        width: 800,
        height: 800,
        margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }
    }

    dimensions.ctnrWidth = dimensions.width - dimensions.margins.left - dimensions.margins.right
    dimensions.ctnrHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom

    //Draw the image
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)
    const ctnr = svg.append('g')
        .attr(
            'transform',
            `translate(${dimensions.margins.top}, ${dimensions.margins.left})`)
    
    //Scales
    const xScale = d3.scaleLinear()
            .domain(d3.extent(dataset, xAccessor))
            .rangeRound([0, dimensions.ctnrWidth])
            .clamp(true)
    
    const yScale = d3.scaleLinear()
            .domain(d3.extent(dataset, yAccessor))
            .rangeRound([dimensions.ctnrHeight, 0])
            // .range([0, dimensions.ctnrHeight])
            .nice()
            .clamp(true)

    //Draw circles
    ctnr.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', d => xScale(xAccessor(d)))
        .attr('cy', d => yScale(yAccessor(d)))
        .attr('r', 3)
        .attr('fill', 'blue')
        
    
    //Axis
    const xAxis = d3.axisBottom(xScale)
            .ticks(5)
            .tickFormat(lb => lb * 100 + '%')

    const xAxisGroup = ctnr.append('g')
        .call(xAxis)
        .style('transform', `translateY(${dimensions.ctnrHeight}px)`)
        .classed('axis', true)

    xAxisGroup.append('text')
        .attr('x', dimensions.ctnrWidth / 2)
        .attr('y', dimensions.margins.bottom - 5)
        .attr('fill', 'blue')
        .text('HUMIDITY')

    const yAxis = d3.axisLeft(yScale)
            .ticks(4)
            .tickFormat(t => t + '°')            

    const yAxisGroup = ctnr.append('g')
        .call(yAxis)
        .classed('axis', true)

    yAxisGroup.append('text')
        .attr('x', -dimensions.ctnrHeight / 2)
        .attr('y', -dimensions.margins.left + 15)
        .attr('fill', 'red')
        .html('TEMP &deg; F')
        .style('transform', 'rotate(270deg)')
        .style('text-anchor', 'middle')
    
}

draw()