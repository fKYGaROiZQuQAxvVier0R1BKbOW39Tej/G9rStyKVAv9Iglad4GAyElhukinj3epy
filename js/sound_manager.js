class SoundManager {
    // PUBLIC
    static play(sound) {
        sound.currentTime = 0
        sound.play()
    }
    

    // PRIVATE
    static #ready() {
        console.log("Sound manager loaded")
    }

    
    // INIT
    static {
        this.#ready()
    }
}