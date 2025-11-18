//#region VARIABLES

const themes = {
    canvas: {
        button: document.getElementById("canvasButton"),
        content: document.getElementById("canvasToggle"),
        onSelect: appliedCanvasTheme,
        onDeselect: removedCanvasTheme
    },
    audio: {
        button: document.getElementById("audioButton"),
        content: document.getElementById("audioToggle"),
        onSelect: appliedAudioTheme,
        onDeselect: removedAudioTheme
    },
    video: {
        button: document.getElementById("videoButton"),
        content: document.getElementById("videoToggle"),
        onSelect: appliedVideoTheme,
        onDeselect: removedVideoTheme
    }
}

let _activeTheme = null

//#endregion VARIABLES






//#region THEME FUNCTIONS

function appliedCanvasTheme() {
    console.log("Applied: canvas")
    
    startAnimation()

    // add drop-shadows to labels and buttons
    document.getElementById("timeLabel").style.textShadow = "0 0 10px rgba(0, 0, 0, 0.6)"
    document.getElementById("dateLabel").style.textShadow = "0 0 6px rgba(0, 0, 0, 0.8)"
    document.getElementById("dayLabel").style.textShadow = "0 0 6px rgba(0, 0, 0, 0.8)"
    document.getElementById("buttonContainer").style.textShadow = "0 0 10px rgba(0, 0, 0, 0.6)"
    document.querySelectorAll("#buttonContainer button").forEach(button => button.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.4)")
}

function removedCanvasTheme() {
    console.log("Removed: canvas")

    stopAnimation()

    // clear drop-shadows
    document.getElementById("timeLabel").style.textShadow = ""
    document.getElementById("dateLabel").style.textShadow = ""
    document.getElementById("dayLabel").style.textShadow = ""
    document.getElementById("buttonContainer").style.textShadow = ""
    document.querySelectorAll("#buttonContainer button").forEach(button => button.style.boxShadow = "")
}



function appliedAudioTheme() {
    console.log("Applied: audio")
}

function removedAudioTheme() {
    console.log("Removed: audio")
}



function appliedVideoTheme() {
    console.log("Applied: video")
}

function removedVideoTheme() {
    console.log("Removed: video")
}

//#endregion THEME FUNCTIONS






//#region CORE

function _onThemeButtonClicked(theme) {
    const alreadySelected = _activeTheme === theme
    if (alreadySelected) {
        _deselectTheme(theme)
        _activeTheme = null
        return
    }
    const shouldCleanupPrevious = _activeTheme !== null
    if (shouldCleanupPrevious) {
        _deselectTheme(_activeTheme)
    }
    _selectTheme(theme)
}

function _selectTheme(theme) {
    themes[theme].button.classList.add("selected")
    themes[theme].content.classList.remove("hidden")
    themes[theme].onSelect()
    _activeTheme = theme
}

function _deselectTheme(theme) {
    themes[theme].button.classList.remove("selected")
    themes[theme].content.classList.add("hidden")
    themes[theme].onDeselect()
}

//#endregion CORE






themes.canvas.button.addEventListener("click", () => _onThemeButtonClicked("canvas"))
themes.audio.button.addEventListener("click", () => _onThemeButtonClicked("audio"))
themes.video.button.addEventListener("click", () => _onThemeButtonClicked("video"))