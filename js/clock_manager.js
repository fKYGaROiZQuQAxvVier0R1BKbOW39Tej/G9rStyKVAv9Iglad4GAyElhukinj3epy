class ClockManager {
    static #days = [
        'Sunday', 'Monday', 'Tuesday', 
        'Wednesday', 'Thursday', 'Friday', 
        'Saturday'
    ]

    static #months = [
        'January', 'February', 'March', 
        'April', 'May', 'June', 
        'July', 'August', 'September', 
        'October', 'November', 'December'
    ]

    static #timeLabel = document.getElementById('timeLabel')
    static #dateLabel = document.getElementById('dateLabel')
    static #dayLabel = document.getElementById('dayLabel')

    static #ready() {
        this.#update_clock()
        setInterval(this.#update_clock, 1000)
        console.log("Clock manager loaded")
    }

    static #update_clock = () => {
        const now = new Date()

        let hour = now.getHours().toString().padStart(2, '0')
        let minute = now.getMinutes().toString().padStart(2, '0')
        let second = now.getSeconds().toString().padStart(2, '0')
        let monthName = this.#months[now.getMonth()]
        let day = now.getDate()
        let year = now.getFullYear()
        let dayName = this.#days[now.getDay()]
        
        this.#timeLabel.textContent = `${hour}:${minute}:${second}`
        this.#dateLabel.textContent = `${monthName} ${day} ${year}`
        this.#dayLabel.textContent = dayName
    }

    static {
        this.#ready()
    }
}