async function draw(el, scaleSelected) {
  // Data
  const dataset = await d3.json('data.json')
  dataset.sort((a ,b) => a - b)

  // Dimensions
  let dimensions = {
    width: 600,
    height: 150,
  };

  const box = 30

  // Draw Image
  const svg = d3.select(el)
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  //Scale
  let colorScale = scaleSelected(dataset)

  // Rectangle
  svg.append('g')
    .attr('transform', `translate(2, 2)`)
    .attr('stroke', 'black')
    .selectAll('rect')
    .data(dataset)
    .join('rect')
    .attr('width', box - 3)
    .attr('height', box - 3)
    .attr('x', (d, i) => box * (i % 20))
    .attr('y', (d, i) => box * ((i / 20) | 0))
    .attr('fill', colorScale)
}

function linear(data){
  return d3.scaleLinear()
          .domain(d3.extent(data))
          .range(d3.schemeSet1)
}

function quantize(data){
  return d3.scaleQuantize()
          .domain(d3.extent(data))
          .range(['white', 'pink', 'red'])
}

function quantile(data){
  return d3.scaleQuantile()
          .domain(data)
          .range(d3.schemeSpectral[4])
}

function threshold(data){
  return d3.scaleThreshold()
          .domain([40000, 80000, 140000])
          .range(['white', 'pink', 'orange', 'red'])
}

draw('#heatmap1', linear)
draw('#heatmap2', quantize)
draw('#heatmap3', quantile)
draw('#heatmap4', threshold)