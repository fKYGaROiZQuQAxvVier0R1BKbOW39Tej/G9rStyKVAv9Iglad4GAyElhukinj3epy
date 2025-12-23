class SoundManager {
    static _ready() {
        console.log("Sound manager loaded")
    }

    static play(sound) {
        sound.currentTime = 0
        sound.play()
    }
    
    static get_sounds() {
        return {
            template: new Audio('assets/sounds/template.mp3'),
        }
    }

    static {
        this._ready()
    }
}