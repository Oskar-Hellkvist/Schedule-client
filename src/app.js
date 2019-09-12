const form = document.querySelector('.nav')
const main = document.querySelector('#content-container')

const BASE_URL = "https://schedule-site.managedwalrus.now.sh/"

let query

form.addEventListener('submit', formSubmitted)

function formSubmitted(event){
    event.preventDefault()

    // console.log(`${BASE_URL}${query}`)
    getSchedule(query).then(res => {
        displayData(res)
    })
}


function getSchedule(query){
    return fetch(`${BASE_URL}${query}`)
    .then(res => res.json())
}


function displayData(results){
    if(results.length > 1){
        let lectures = []
        for(let i = 0; i < results.length; i++){
            let day = results[i]
            let dayDate = day.date
            console.log(dayDate)
            let keys = Object.keys(day)
            for(let j = 1; j < keys.length; j++){
                let lecture = keys[j]
                let lectureTime = day[lecture].time
                let lectureCourse = day[lecture].course
                let lectureRoom = day[lecture].room
                let lectureActivity = day[lecture].activity
                let lectureGroup = day[lecture].group
                console.log(`${lecture}-${lectureTime}-${lectureCourse}-${lectureRoom}-${lectureActivity}-${lectureGroup}`)
            }
        }
    } else {
        console.log(results)
    }
}



