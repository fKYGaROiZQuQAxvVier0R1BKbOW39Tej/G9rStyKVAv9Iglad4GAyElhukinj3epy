// #region VARIABLES

const sounds = {
    click: new Audio('assets/sounds/template.mp3'),
}

// #endregion VARIABLES



// #region CORE FUNCTIONS

function _play(sound) {
    sound.currentTime = 0
    sound.play()
}

// #endregion CORE FUNCTIONS