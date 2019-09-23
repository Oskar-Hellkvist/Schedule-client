// here i find all the elements that will have elements added to them and store them
// they have to be constants
const topNav = document.querySelector('.top-nav')
// const programNav = document.querySelector('.programme')
const main = document.querySelector('#content-container')
const header = document.querySelector('#header')

// the url of the api that we're hooking into
const BASE_URL = 'https://schedule-site.managedwalrus.now.sh/'

// declared variables that will store user choices when buttons on the site are pressed
// this is assigned a value when the user selects a programme from the list of programmes displayed on the page
let programme
// this is assigned a value when the user clicks one of the parameter buttons in the top navigation list after selecting a programme
// (the today, tomorrow, this week, next week, full schedule buttons)
let query

// when the page loads the user is greeted by a list of selectable programmes
main.appendChild(programmeSelect())

// here we handle click events in the main tag.
main.onclick = (e) => {
  // if the user didnt press a button but it didnt have the class reload then the user must have selected a programme
  // those are the only other buttons pressed on the page
  if (e.target.tagName === 'BUTTON' && e.target.className !== 'reload') {
    // assign the buttons id to the programme variable declared earlier
    programme = e.target.id
    // run formSubmitted with the button as a parameter
    formSubmitted(e)
  }
  // else if the button pressed in main has the class reload (which can only be done after selecting a programme and entering the schedule)...
  else if (e.target.className === 'reload' && e.target.tagName === 'BUTTON') {
    // ...clear main of all its content and display the programme select screen again
    main.innerHTML = ''
    main.appendChild(programmeSelect())
  }
}

// here we handle onclick events for the header
header.onclick = (e) => {
  // here we check if the user clicks a button with any class other than menu-btn
  if (e.target.tagName === 'BUTTON' && e.target.className !== 'menu-btn') {
    // if so we assign the buttons id to the query variable declared earlier and run formSubmitted
    query = e.target.id
    formSubmitted(e)
  }
  // if the user clicks on a button with the class menu-btn (which only appears on the mobile versions) 
  else if (e.target.tagName === 'BUTTON' && e.target.className === 'menu-btn') {
    // here we check if the navigation menu spawned by the menu-btn button is present
    // (if the menu is present the return value will be 1 and if not, 0)
    const navLength = document.getElementsByClassName('mobile-nav').length
    if (navLength === 0) {
      // if present then clear topNav's innerHTML and append the button and the navigation menu to it after
      topNav.innerHTML = ''
      topNav.appendChild(menuBtn())
      topNav.appendChild(mobileNavList())
    } else {
      // else clear topNav also but only append the menu-btn
      topNav.innerHTML = ''
      topNav.appendChild(menuBtn())
    }

  }
}

// here we handle sending the requests to the api
function formSubmitted (event) {
  // here we prevent the form from actually submitting to just grab the data and send it to the api
  event.preventDefault()

  // console.log(BASE_URL+programme+'/'+query)

  // here we check if the query and the programme variables are defined or not
  // depending on those conditions requests will be sent with the correct queries
  // here if the query var is undefined then we send the programme only to the api function
  if (typeof (query) === 'undefined' && typeof (programme) !== 'undefined') {
    getSchedule(`${programme}`).then(res => {
      displayData(res)
    })
  }
  // here we send both programme and query since they're both defined
  else if (typeof (programme) !== 'undefined' && typeof (query) !== 'undefined') {
    // this if else statement is used when the button 'full schedule' is used since the button sets query = ''
    if (query.length === 0) {
      getSchedule(`${programme}`).then(res => {
        displayData(res)
      })
    }
    // else if the query string has contents then send a request as per usual with forward-slash between values
    else {
      getSchedule(`${programme}/${query}`).then(res => {
        displayData(res)
      })
    }
  }
}

// this function send the correct data to the api and the api sends an array of JSON-objects back
// when handling this function it's important to remember that it returns a promise that you need to handle 
// (example of handling inside formSubmitted)
function getSchedule (query) {
  return fetch(`${BASE_URL}${query}`)
    .then(res => res.json())
}

// displayData takes care of displaying the returned information from the api and appends it to the frontend client
function displayData (results) {
  // clear html inside main in order to not append new values to an old result
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
  // here we create different navigation structures depending on the screen width (for mobile viewing the menu will be different)
  if (window.screen.width > 415) {
    topNav.appendChild(navList())
  } else {
    topNav.appendChild(menuBtn())
  }
  // checks if the result from the api has a length that is more than 0 and if so it creates the schedule elements and appends it to main
  if (results.length >= 1) {
    // iterates through each element of the array returned from the api
    for (let i = 0; i < results.length; i++) {

      // here we create the element holding each day and its lectures
      // border-gradient-wrapper is used to achieve gradient border around each day element
      const borderWrapper = document.createElement('div')
      const dayDiv = document.createElement('div')
      const dayDateHeader = document.createElement('h3')

      borderWrapper.className = 'border-gradient-wrapper'
      dayDiv.className = 'date-schedule'
      dayDateHeader.className = 'date'

      // extract the date value from the object at the current index
      const day = results[i]
      const dayDate = day.date
      dayDateHeader.innerHTML = dayDate
      dayDiv.appendChild(dayDateHeader)

      // get object keys from the current object, this is used to get the amount of lectures that day holds
      const keys = Object.keys(day)

      // loop through each lecture using the keys variable's length we declared above as reference
      for (let j = 1; j < keys.length; j++) {

        // here we create all the element that will hold each lecture's values such as 'room', 'time', 'course' and so on
        const lectureNum = document.createElement('h3')
        lectureNum.className = 'lecture-num'
        lectureNum.innerHTML = j
        const dayLecture = document.createElement('div')
        dayLecture.className = 'lecture'

        const lecture = keys[j]
        const lectureTime = day[lecture].time
        const lectureCourse = day[lecture].course
        const lectureRoom = day[lecture].room
        const lectureActivity = day[lecture].activity
        let lectureGroup = day[lecture].group

        // here we test if the group value has a number at the end and if it does it means that that lecture is for a specific group
        // ie group 1 or group 2.
        // if it is true i grab the group number only
        if (lectureGroup.length > 0) {
          lectureGroup = lectureGroup.slice(-1);
        }

        // here we create all the elements the different values will be stored in
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

        // lastly we append the elements created to their parent elements to form the site structure
        dayLecture.appendChild(lectureNum)
        dayLecture.appendChild(time)
        dayLecture.appendChild(activity)
        dayLecture.appendChild(room)
        dayLecture.appendChild(group)
        dayLecture.appendChild(course)

        dayDiv.appendChild(dayLecture)
      }
      // append everything to the border-wrapper element and then append that to main
      borderWrapper.appendChild(dayDiv)
      main.appendChild(borderWrapper)
    }
  }
  // if the returned contents from the api has a length of 0 then there is no schedule for the selected query
  // then a simple message is read from the response and appended instead
  else {
    const borderWrapper = document.createElement('div')
    const empty = document.createElement('h2')
    borderWrapper.className = 'empty-border-gradient-wrapper'
    empty.className = 'empty-day'
    empty.innerHTML = results.message
    borderWrapper.appendChild(empty)
    main.appendChild(borderWrapper)
  }
}
// creates the navigation menu for desktop clients
function navList () {
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
// creates menu button for mobile clients
function menuBtn () {
  const menuBtn = document.createElement('button')
  menuBtn.className = 'menu-btn'
  menuBtn.innerHTML = 'Menu'
  return menuBtn
}
// creates the navigation menu for mobile clients
function mobileNavList () {
  const nav = document.createElement('div')
  nav.className = 'mobile-nav'

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

  const menuUl = document.createElement('ul')
  menuUl.className = 'mobile-nav-list'

  const menuLi1 = document.createElement('li')
  menuLi1.className = 'mobile-nav-element'
  const menuLi2 = document.createElement('li')
  menuLi2.className = 'mobile-nav-element'
  const menuLi3 = document.createElement('li')
  menuLi3.className = 'mobile-nav-element'
  const menuLi4 = document.createElement('li')
  menuLi4.className = 'mobile-nav-element'
  const menuLi5 = document.createElement('li')
  menuLi5.className = 'mobile-nav-element'

  menuLi1.appendChild(button1)
  menuLi2.appendChild(button2)
  menuLi3.appendChild(button3)
  menuLi4.appendChild(button4)
  menuLi5.appendChild(button5)

  menuUl.appendChild(menuLi1)
  menuUl.appendChild(menuLi2)
  menuUl.appendChild(menuLi3)
  menuUl.appendChild(menuLi4)
  menuUl.appendChild(menuLi5)
  nav.appendChild(menuUl)
  return nav

}
// creates the programme select menu that appears in the beginning when you enter the webpage
function programmeSelect () {
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
