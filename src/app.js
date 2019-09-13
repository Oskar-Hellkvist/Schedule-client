const form = document.querySelector('.nav')
const main = document.querySelector('#content-container')

const BASE_URL = "https://schedule-site.managedwalrus.now.sh/"

let query

form.addEventListener('submit', formSubmitted)

window.onload = formSubmitted

function formSubmitted(event){
    event.preventDefault()
    if(typeof(query) === 'undefined'){
        getSchedule('today').then(res => {
            displayData(res)
        })
    } else {
        getSchedule(query).then(res => {
            displayData(res)
        })
    }
}


function getSchedule(query){    
    return fetch(`${BASE_URL}${query}`)
    .then(res => res.json())
}


function displayData(results){
    main.innerHTML = ""
    if(results.length > 1){
        let lectures = []

        for(let i = 0; i < results.length; i++){

            const borderWrapper = document.createElement('div')
            const dayDiv = document.createElement('div')
            const dayDateHeader = document.createElement('h3')

            borderWrapper.className = 'border-gradient-wrapper'
            dayDiv.className = 'date-schedule'
            dayDateHeader.className = 'date'

            let day = results[i]
            let dayDate = day.date
            dayDateHeader.innerHTML = dayDate
            dayDiv.appendChild(dayDateHeader)
            let keys = Object.keys(day)
            
            for(let j = 1; j < keys.length; j++){

                const dayLecture = document.createElement('div')
                dayLecture.className = 'lecture'

                let lecture = keys[j]
                let lectureTime = day[lecture].time
                let lectureCourse = day[lecture].course
                let lectureRoom = day[lecture].room
                let lectureActivity = day[lecture].activity
                let lectureGroup = day[lecture].group

                const time = document.createElement('p')
                time.className = 'time'
                time.innerHTML = `<b>Time: </b>${lectureTime}`
                const course = document.createElement('p')
                course.className = 'course'
                course.innerHTML = `<b>Course: </b>${lectureCourse}`
                const room = document.createElement('p')
                room.className = 'room'
                room.innerHTML = `<b>Room: </b>${lectureRoom}`
                const activity = document.createElement('p')
                activity.className = 'activity'
                activity.innerHTML = `<b>Activity: </b>${lectureActivity}`
                const group = document.createElement('p')
                group.className = 'group'
                group.innerHTML = `<b>Group: </b>${lectureGroup}`

                dayLecture.appendChild(time)
                dayLecture.appendChild(activity)
                dayLecture.appendChild(room)
                dayLecture.appendChild(group)
                dayLecture.appendChild(course)


            dayDiv.appendChild(dayLecture)
            }
            borderWrapper.appendChild(dayDiv)
            main.appendChild(borderWrapper)
        }
    } else {
        const borderWrapper = document.createElement('div')
        const empty = document.createElement('h2')
        borderWrapper.className = 'empty-border-gradient-wrapper'
        empty.className = 'empty-day'
        empty.innerHTML = results.message
        borderWrapper.appendChild(empty)
        main.appendChild(borderWrapper)
    }
}