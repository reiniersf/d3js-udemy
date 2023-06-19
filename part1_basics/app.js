//Lecture: D3 selector
// const d_browser = document.querySelector("div")
// const d_d3 = d3.select("div")
// const ds_d3 = d3.selectAll("div")

// console.log(d_d3)
// console.log(ds_d3)
// console.log(d_browser)

//Lecture: Appending element
const el_d3 = d3.select("body")
    .append('div', "World!")
    // .attr("class", "foo")
    // .attr("class", "bar") -> override the existing class(es) in the element
    .classed('foo', true) // -> if true the class will be added to the existing otherwise it will be removed
    .classed('bar', true)
    .text("Added text")
    .style('color', 'blue')

console.log(el_d3)