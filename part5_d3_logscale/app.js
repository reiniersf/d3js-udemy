async function draw() {
  // Data
  const dataset = await d3.json('data.json')

  const sizeAccessor = (d) => d.size
  const nameAccessor = (d) => d.name

  // Dimensions
  let dimensions = {
    width: 200,
    height: 500,
    margin: 50
  };

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  // Scale
  const universeScale = d3.scaleLog()
  .domain(d3.extent(dataset, sizeAccessor))
  .range([
    dimensions.height - dimensions.margin,
    dimensions.margin
  ])

  // Draw points
  const circleGroup = svg.append('g')
                          .style('font-size', '16px')
                          .style('dominant-baseline', 'middle')

  circleGroup.selectAll('circle')
              .data(dataset)
              .join('circle')
              .attr('r', 4)
              .attr('cy', d => universeScale(sizeAccessor(d)))
              .attr('cx', dimensions.margin)
  
  circleGroup.selectAll('text')
              .data(dataset)
              .join('text')
              .attr('x', dimensions.margin + 10)
              .attr('y', d => universeScale(sizeAccessor(d)))
              .text(nameAccessor)
  
  // Axis
  const universeAxis = d3.axisLeft(universeScale)

  svg.append('g')
    .attr('transform', `translate(${dimensions.margin}, 0)`)
    .call(universeAxis)
  
}

draw()