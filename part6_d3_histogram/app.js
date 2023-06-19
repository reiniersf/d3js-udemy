async function draw() {
  // Data
  const dataset = await d3.json('data.json')



  // Dimensions
  let dimensions = {
    width: 800,
    height: 400,
    margins: 50
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

  const padding = 2
  const labelGroup = ctr.append('g')
    .classed('bar-labels', true)
  const xAxisGroup = ctr.append('g')
    .style('transform', `translateY(${dimensions.ctrHeight}px)`)
  const meanLine = ctr.append('line')
    .classed('mean-line', true)

  function updateHistogram(metric) {
    const xAccessor = d => d.currently[metric]
    const yAccessor = d => d.length

    //Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.ctrWidth])


    //Bins
    const bin = d3.bin()
      .domain(xScale.domain())
      .value(xAccessor)
      .thresholds(10)

    const newDataset = bin(dataset)
    console.log(newDataset)

    const yScale = d3.scaleLinear()
      .domain(d3.extent(newDataset, yAccessor))
      .range([dimensions.ctrHeight, 0])

    const exitTransition = d3.transition().duration(1000)
    const updateTransition = exitTransition.transition().duration(1000)

    ctr.selectAll('rect')
      .data(newDataset)
      .join(
        enter => enter.append('rect')
          .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - padding]))
          .attr('height', 0)
          .attr('x', d => xScale(d.x0))
          .attr('y', dimensions.ctrHeight)
          .attr('fill', 'lightgreen'),
        update => update,
        exit => exit
          .attr('fill', 'orange')
          .transition(exitTransition)
          .attr('y', dimensions.ctrHeight)
          .attr('height', 0)
          .remove()
      )
      .transition(updateTransition)
      .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - padding]))
      .attr('height', d => dimensions.ctrHeight - yScale(yAccessor(d)))
      .attr('x', d => xScale(d.x0))
      .attr('y', d => yScale(yAccessor(d)))
      .attr('fill', 'darkblue')


    labelGroup.selectAll('text')
      .data(newDataset)
      .join(
        enter => enter.append('text')
          .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
          .attr('y', d => dimensions.ctrHeight)
          .text(yAccessor),
        update => update,
        exit => exit.transition(exitTransition)
        .attr('y', dimensions.ctrHeight)
        .remove()
      )
      .transition(updateTransition)
      .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr('y', d => yScale(yAccessor(d)) - 7)
      .text(yAccessor)

    //Calculate mean
    const mean = d3.mean(dataset, xAccessor)

    meanLine.raise()
    .transition(updateTransition)
    .attr('x1', xScale(mean))
    .attr('y1', 0)
    .attr('x2', xScale(mean))
    .attr('y2', dimensions.ctrHeight)

    //Draw axis
    const xAxis = d3.axisBottom(xScale)
    xAxisGroup.transition().call(xAxis)
  }

  d3.select('#metric')
    .on('change', function (ev) {
      ev.preventDefault()
      updateHistogram(ev.target.value)
    })

  updateHistogram('humidity')

}

draw()