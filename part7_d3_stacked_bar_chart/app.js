async function draw() {
  // Data
  const dataset = await d3.csv('data.csv', (data, index, columns) => {
    d3.autoType(data)
    data.total = d3.sum(columns, c => data[c])
    return data
  })

  dataset.sort((s1, s2) => s2.total - s1.total)

  // Dimensions
  let dimensions = {
    width: 1000,
    height: 600,
    margins: 20,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const ctr = svg.append("g")
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    )

  // Scales
  const stackGenerator = d3.stack()
    .keys(dataset.columns.slice(1))

  const stackedData = stackGenerator(dataset)
    .map(ageGroup => {
      ageGroup.forEach(state => {
        state.key = ageGroup.key
      })
      return ageGroup
    })


  const yScale = d3.scaleLinear()
    .domain([0, d3.max(stackedData, (ageGroup) => {
      return d3.max(ageGroup, state => state[1])
    })])
    .rangeRound([dimensions.ctrHeight, dimensions.margins])

  const xScale = d3.scaleBand()
    .domain(dataset.map(state => state.name))
    .range([dimensions.margins, dimensions.ctrWidth])
    .paddingInner(0.3)
    .paddingOuter(0.1)

  const colorScale = d3.scaleOrdinal()
    .domain(stackedData.map(sd => sd.key))
    .range(d3.schemeSpectral[stackedData.length])
    .unknown('grey')

  //Draw bars
  const ageGroups = ctr.append('g')
    .classed('age-groups', true)
    .selectAll('g')
    .data(stackedData)
    .join('g')
    .attr('fill', d => colorScale(d.key))

  ageGroups.selectAll('rect')
    .data(d => d)
    .join('rect')
    .attr('x', d => xScale(d.data.name))
    .attr('y', d => yScale(d[1]))
    .attr('height', d => yScale(d[0]) - yScale(d[1]))
    .attr('width', xScale.bandwidth())

  //Axis
  const xAxis = d3.axisBottom(xScale)
  .tickSizeOuter(0)
  ctr.append('g')
    .attr('transform', `translate(0, ${dimensions.ctrHeight})`)
    .call(xAxis)


  const yAxis = d3.axisLeft(yScale)
    .ticks(null, 's')

  const yAxisGroup = ctr.append('g')
  .attr('transform', `translate(${dimensions.margins}, 0)`)
    .call(yAxis)
}

draw()