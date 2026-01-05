class VideoManager {
    static #video = null
    static #duration = -1


    // PUBLIC
    static play(video, duration = -1) {
        this.#duration = duration
        this.#video.src = video
        this.#video.loop = true
        this.#video.muted = true
        this.#video.style.background = 'rgba(0, 0, 0, 1)'
        this.#video.classList.remove('hidden')
        this.#video.play().catch(() => {})
    }

    static stop() {
        const hide = () => {
            this.#video.pause()
            this.#video.removeAttribute('src')
            this.#video.load()
            this.#video.style.background = 'rgba(0, 0, 0, 0)'
            this.#video.classList.add('hidden')
        }

        if (this.#duration >= 0) {
            setTimeout(hide, this.#duration * 1000)
        } else {
            hide()
        }
    }


    // PRIVATE
    static #ready() {
        console.log("Video manager loaded")
        this.#video = document.getElementById('videoPlayer')
    }


    // INIT
    static {
        this.#ready()
    }
}
