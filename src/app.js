const topNav = document.querySelector('.top-nav')
const programNav = document.querySelector('.programme')
const main = document.querySelector('#content-container')
const header = document.querySelector('#header')
const reload = document.querySelector('.reload')


const BASE_URL = "https://schedule-site.managedwalrus.now.sh/"

let programme
let query

main.appendChild(programmeSelect())

main.onclick = (e) => {
    if(e.target.tagName === 'BUTTON' && e.target.className !== 'reload'){
        programme = e.target.id
        formSubmitted(e)
    } else{
        main.innerHTML = ''
        main.appendChild(programmeSelect())
    }
}

header.onclick = (e) => {
    if(e.target.tagName === 'BUTTON'){
        query = e.target.id
        formSubmitted(e)
    }
}

function formSubmitted(event){
    event.preventDefault()

    console.log(BASE_URL+programme+'/'+query)
    if(typeof(query) === 'undefined' && typeof(programme) !== 'undefined'){
        getSchedule(`${programme}`).then(res => {
            displayData(res)
        })
    } else if(typeof(programme) !== 'undefined' && typeof(query) !== 'undefined'){
        if(query.length === 0){
            getSchedule(`${programme}`).then(res => {
                displayData(res)
            })
        } else {
            getSchedule(`${programme}/${query}`).then(res => {
                displayData(res)
            })
        }
    }
}


function getSchedule(query){    
    return fetch(`${BASE_URL}${query}`)
    .then(res => res.json())
}


function displayData(results){
    main.innerHTML = ''

    const mainHead = document.createElement('div')
    mainHead.className = 'main-header'

    const reloadBtn = document.createElement('button')
    reloadBtn.className = 'reload'
    reloadBtn.innerHTML = 'Go back'

    const programmeChoice = document.createElement('h1')
    programmeChoice.className = 'programme'
    programmeChoice.innerHTML = programme
    
    mainHead.appendChild(programmeChoice)
    mainHead.appendChild(reloadBtn)

    main.appendChild(mainHead)


    topNav.innerHTML = ''
    topNav.appendChild(navList())
    if(results.length >= 1){

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

                const lectureNum = document.createElement('h3')
                lectureNum.className = 'lecture-num'
                lectureNum.innerHTML = j
                const dayLecture = document.createElement('div')
                dayLecture.className = 'lecture'

                let lecture = keys[j]
                let lectureTime = day[lecture].time
                let lectureCourse = day[lecture].course
                let lectureRoom = day[lecture].room
                let lectureActivity = day[lecture].activity
                let lectureGroup = day[lecture].group

                if(/^\d+$/.test(lectureGroup.slice(-1))){
                    lectureGroup = lectureGroup.slice(-1);
                }

                const time = document.createElement('p')
                time.className = 'time'
                time.innerHTML = `<span class="title">Tid: </span>${lectureTime}`
                const course = document.createElement('p')
                course.className = 'course'
                course.innerHTML = `<span class="title">Kurs: </span>${lectureCourse}`
                const room = document.createElement('p')
                room.className = 'room'
                room.innerHTML = `<span class="title">Rum: </span>${lectureRoom}`
                const activity = document.createElement('p')
                activity.className = 'activity'
                activity.innerHTML = `<span class="title">Aktivitet: </span>${lectureActivity}`
                const group = document.createElement('p')
                group.className = 'group'
                group.innerHTML = `<span class="title">Grupp: </span>${lectureGroup}`

                dayLecture.appendChild(lectureNum)
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

function navList(){
    const nav = document.createElement('form')
    nav.className = 'nav'
    const button1 = document.createElement('button')
    button1.className = 'button 1'
    button1.type = 'submit'
    button1.id = 'today'
    button1.onclick = 'query = this.id'
    button1.innerHTML = 'Idag'
    const button2 = document.createElement('button')
    button2.className = 'button 2'
    button2.type = 'submit'
    button2.id = 'tomorrow'
    button2.onclick = 'query = this.id'
    button2.innerHTML = 'Imorgon'
    const button3 = document.createElement('button')
    button3.className = 'button 3'
    button3.type = 'submit'
    button3.id = 'this-week'
    button3.onclick = 'query = this.id'
    button3.innerHTML = 'Denna vecka'
    const button4 = document.createElement('button')
    button4.className = 'button 4'
    button4.type = 'submit'
    button4.id = 'next-week'
    button4.onclick = 'query = this.id'
    button4.innerHTML = 'Nästa vecka'
    const button5 = document.createElement('button')
    button5.className = 'button 5'
    button5.type = 'submit'
    button5.id = ''
    button5.onclick = 'query = this.id'
    button5.innerHTML = 'Hela schemat'
    nav.appendChild(button1)
    nav.appendChild(button2)
    nav.appendChild(button3)
    nav.appendChild(button4)
    nav.appendChild(button5)
    return nav
}

function programmeSelect(){
    main.innerHTML = ''
    topNav.innerHTML = ''
    const programmeForm = document.createElement('form')
    programmeForm.className = 'programmes'

    const button1 = document.createElement('button')
    button1.id = 'UDM'
    button1.type = 'submit'
    button1.onclick = 'programme = this.id'
    button1.innerHTML = 'UDM'

    const button2 = document.createElement('button')
    button2.id = 'WP'
    button2.type = 'submit'
    button2.onclick = 'programme = this.id'
    button2.innerHTML = 'WP'

    const button3 = document.createElement('button')
    button3.id = 'ID'
    button3.type = 'submit'
    button3.onclick = 'programme = this.id'
    button3.innerHTML = 'ID'

    const button4 = document.createElement('button')
    button4.id = 'MT'
    button4.type = 'submit'
    button4.onclick = 'programme = this.id'
    button4.innerHTML = 'MT'
    
    programmeForm.appendChild(button1)
    programmeForm.appendChild(button2)
    programmeForm.appendChild(button3)
    programmeForm.appendChild(button4)
    
    return programmeForm
}