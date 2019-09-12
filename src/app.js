const form = document.querySelector('.nav')
const main = document.querySelector('#content-container')

const BASE_URL = "https://schedule-site.managedwalrus.now.sh/"

let query

form.addEventListener('submit', formSubmitted)

function formSubmitted(event){
    event.preventDefault()

    // console.log(`${BASE_URL}${query}`)
    getSchedule(query).then(displayData)
}


function getSchedule(query){
    return fetch(`${BASE_URL}${query}`)
    .then(res => res.json())
}


function displayData(results){
    results.forEach(element => {

        const dayDiv = document.createElement('div')
        const dateEl = document.createElement('h3')
        const lecturesDiv = document.createElement('div')

        dayDiv.className('day')
        date.className('date')
        lectures.className('lectures')

        let date = Object.keys(element)
        console.log(date)
    })
}



