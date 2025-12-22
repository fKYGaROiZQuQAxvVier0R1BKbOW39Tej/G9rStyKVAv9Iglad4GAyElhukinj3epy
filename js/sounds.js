// #region VARIABLES

const sounds = {
    template: new Audio('assets/sounds/button_click.mp3'),
}

// #endregion VARIABLES



// #region CORE FUNCTIONS

function _play(sound) {
    sound.currentTime = 0
    sound.play()
}

// #endregion CORE FUNCTIONS