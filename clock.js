//#region VARIABLES

const _days = [
    'Sunday', 'Monday', 'Tuesday', 
    'Wednesday', 'Thursday', 'Friday', 
    'Saturday'
]

const _months = [
    'January', 'February', 'March', 
    'April', 'May', 'June', 
    'July', 'August', 'September', 
    'October', 'November', 'December'
]

const _timeLabel = document.getElementById('timeLabel')
const _dateLabel = document.getElementById('dateLabel')
const _dayLabel = document.getElementById('dayLabel')

//#endregion VARIABLES






//#region CORE

function _syncClock() {
    const now = new Date()

    let hour = now.getHours().toString().padStart(2, '0')
    let minute = now.getMinutes().toString().padStart(2, '0')
    let second = now.getSeconds().toString().padStart(2, '0')
    let monthName = _months[now.getMonth()]
    let day = now.getDate()
    let year = now.getFullYear()
    let dayName = _days[now.getDay()]
    
    _timeLabel.textContent = `${hour}:${minute}:${second}`
    _dateLabel.textContent = `${monthName} ${day} ${year}`
    _dayLabel.textContent = dayName
}

//#endregion CORE






_syncClock()
setInterval(_syncClock, 1000)