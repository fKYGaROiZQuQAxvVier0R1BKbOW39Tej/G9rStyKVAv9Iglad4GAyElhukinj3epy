class ClockManager {
    // VARIABLES
    static #paused = false
    static #manualTime = null
    static #timeLabel = document.getElementById('timeLabel')
    static #dateLabel = document.getElementById('dateLabel')
    static #dayLabel = document.getElementById('dayLabel')


    // PUBLIC
    static update_time = () => {
        const now = new Date()

        let hour = now.getHours().toString().padStart(2, '0')
        let minute = now.getMinutes().toString().padStart(2, '0')
        let second = now.getSeconds().toString().padStart(2, '0')
        this.#timeLabel.textContent = `${hour}:${minute}:${second}`

        let monthName = Resources.Months[now.getMonth()]
        let day = now.getDate()
        let year = now.getFullYear()
        this.#dateLabel.textContent = `${monthName} ${day} ${year}`
        
        let dayName = Resources.Days[now.getDay()]
        this.#dayLabel.textContent = dayName
    }

    static set_color(r, g, b, td = 0) {
        this.#set_label_color(this.#timeLabel, r, g, b, td)
        this.#set_label_color(this.#dateLabel, r, g, b, td)
        this.#set_label_color(this.#dayLabel, r, g, b, td)
    }

    static is_paused() {
        return this.#paused
    }

    static get_manual_time() {
        return this.#manualTime
    }

    static set_time(timeString) {
        const [hour, minute, second] = timeString.split(':').map(Number)
        this.#manualTime = new Date()
        this.#manualTime.setHours(hour, minute, second)
        this.pause()
        this.update_time()
    }

    static pause() {
        this.#paused = true
        if (this.#manualTime === null) {
            this.#manualTime = new Date()
        }
    }

    static unpause() {
        this.#paused = false
        this.#manualTime = null
    }


    // PRIVATE
    static #ready() {
        const oneMinute = 1000
        const fifteenMinutes = 15 * 60 * 1000

        ClockManager.set_color(255,255,255)
        ClockManager.update_time()

        setInterval(() => {
            ClockManager.update_time()
            WeatherManager.update_weather(ClockManager.is_paused() ? 0 : 1)
        }, oneMinute)

        setInterval(() => {
            WeatherData.update_data()
        }, fifteenMinutes)

        console.log("Clock manager loaded")
    }
    
    static #set_label_color(label, r, g, b, td = 0, other = null) {
        const transition = td > 0 ? `color ${td}s linear` : ''
        const color = `rgb(${r | 0}, ${g | 0}, ${b | 0})`

        label.style.transition = transition
        label.style.color = color

        if (other !== null) {
            other.style.transition = transition
            other.style.color = color
        }
    }


    // INIT
    static {
        this.#ready()
    }
}
