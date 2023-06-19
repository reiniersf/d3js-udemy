async function getDataFromJsonFile(){
    const data = await d3.json('data.json')
    console.log(data)
}

getDataFromJsonFile()

async function getDataFromApi(){
    const data = await d3.json('https://api.coindesk.com/v1/bpi/currentprice.json')
    console.log(data)
}

getDataFromApi()

async function getDataFromCSVFile(){
    const data = await d3.csv('data.csv')
    console.log(data)
}

getDataFromCSVFile()