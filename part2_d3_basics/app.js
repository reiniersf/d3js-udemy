const data = [10, 20, 30, 40, 50]

const els = d3.select('ul') //-> Establish the parent element for the subsequent selection
        .selectAll('li')
        .data(data) // bind data to the selection
        //[Enter selection] -> elements missing to match the amount of data
        //[Exit selection] -> elements exceeding the amount of data
        // .join('li') 
        // if the amount of data exceed the number of elements [join] will generate the needed number of elements 
        // [join] also removes when elements exceeds the amount of existing data
        .join(
            enter => enter.append('li').style('color', 'green'),
            update => update.style('color', 'blue'),
            exit => exit.remove()
        )
        //[join] behavior can be customized by supplying three functions [enter, update, exit] in the exact defined order
        //[enter] is provided to handle elements in the [enter selection]; the default behavior is to append the elements
        //[update] is provided to handle elements in the [current selection]; the default behavior is to return them as they are
        //[exit] is provided to handle elements in the [exit selection]; the default behavior is to remove the elements
        .text(d => d) 
        // if a batch of elements are selected it apply the change to them all
        //[d] stands for the data element


console.log(els)