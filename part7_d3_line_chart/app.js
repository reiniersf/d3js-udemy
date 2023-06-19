async function draw() {
  // Data
  const dataset = await d3.csv('data.csv')

  const dateParse = d3.timeParse("%Y-%m-%d")
  const xAccessor = d => dateParse(d.date)
  const yAccessor = d => parseInt(d.close)

  // Dimensions
  let dimensions = {
    width: 1000,
    height: 500,
    margins: 50,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const ctr = svg.append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    )

  const tooltip = d3.select("#tooltip")
  const tooltipPoint = ctr.append('circle')
    .attr('r', 4)
    .attr('fill', 'red')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .style('opacity', 0)
    .style('pointer-event', 'none')

  // Scales
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.ctrHeight, 0])
    .nice()

  const xScale = d3.scaleUtc()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.ctrWidth])

  // console.log(xScale(xAccessor(dataset[1])), dataset[1])

  //Generators
  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

  // console.log(lineGenerator(dataset))

  //Adding 'path' element to draw the "line" based on the dataset
  ctr.append('path')
    .datum(dataset)
    .attr('d', lineGenerator)
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-width', 2)


  //Axis
  const xAxis = d3.axisBottom(xScale)
  const xAxisGroup = ctr.append('g')
    .call(xAxis)
    .style('transform', `translateY(${dimensions.ctrHeight}px)`)
    .classed('axis', true)

  const yAxis = d3.axisLeft(yScale)
    .ticks(5)
    .tickFormat(p => '$' + p)

  const yAxisGroup = ctr.append('g')
    .call(yAxis)
    .classed('axis', true)

  // Tooltip
  ctr.append('rect')
    .attr('width', dimensions.ctrWidth)
    .attr('height', dimensions.ctrHeight)
    .style('opacity', 0)
    .on('touchmouse mousemove', function (evt) {
      const mPosition = d3.pointer(evt)
      const date = xScale.invert(mPosition[0])

      const byDateBisector = d3.bisector(xAccessor).left
      const index = byDateBisector(dataset, date)
      // console.log(date, index, dataset[index])
      const entry = dataset[index]
      const entryX = xScale(xAccessor(entry))
      const entryY = yScale(yAccessor(entry))

      tooltipPoint.style('opacity', 1)
        .attr('cx', entryX)
        .attr('cy', entryY)
        .raise()

      tooltip.style('display', 'block')
        .style('top', entryY - 20 + 'px')
        .style('left', entryX + 'px')

      tooltip.select('.price')
        .text(`$${yAccessor(entry)}`)

      const dateFormatter = d3.timeFormat('%B %-d, %Y')
      tooltip.select('.date')
        .text(`${dateFormatter(xAccessor(entry))}`)

    })
    .on('mouseleave', function (evt) {
        tooltipPoint.style('opacity', 0)

        tooltip.style('display', 'none')
    })
}

draw()