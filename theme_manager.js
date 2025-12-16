//#region VARIABLES

// const template = {
//     blendMode: "normal",
//     colorPool: [
//         { color: "rgb(255,0,0)", weight: 1.00 },
//         { color: "rgb(0,255,0)", weight: 1.00 },
//         { color: "rgb(0,0,255)", weight: 1.00 }
//     ],
    
//     count:              8      /*instances*/       ,
//     minSize:            50     /*px radius*/       ,
//     maxSize:            50     /*px radius*/       ,
//     minSpeed:           0      /*px per sec*/      / 100,
//     maxSpeed:           0      /*px per sec*/      / 100,
//     minLifetime:        1       /*seconds*/         * 1000,
//     maxLifetime:        1      /*seconds*/         * 1000,
//     fadeInDuration:     0       /*seconds*/         * 1000,
//     fadeOutDuration:    0       /*seconds*/         * 1000,
//     preSimulation:      0       /*seconds*/         * 1000,
//     maxSpawnDelay:      0       /*seconds*/         * 1000,
//     spawnCenterBias:    0       /*strength*/        ,
// }

const particleConfigTheme1 = {
    blendMode: "screen",
    colorPool: [
        { color: "rgb(255,0,0)", weight: 1.00 },
        { color: "rgb(0,255,0)", weight: 1.00 },
        { color: "rgb(0,0,255)", weight: 1.00 }
    ],
    
    count:              16      /*instances*/       ,
    minSize:            600     /*px radius*/       ,
    maxSize:            800     /*px radius*/       ,
    minSpeed:           25      /*px per sec*/      / 100,
    maxSpeed:           75      /*px per sec*/      / 100,
    minLifetime:        5       /*seconds*/         * 1000,
    maxLifetime:        10      /*seconds*/         * 1000,
    fadeInDuration:     1       /*seconds*/         * 1000,
    fadeOutDuration:    2       /*seconds*/         * 1000,
    preSimulation:      3       /*seconds*/         * 1000,
    maxSpawnDelay:      2       /*seconds*/         * 1000,
    spawnCenterBias:    0       /*strength*/        ,
}

const particleConfigTheme2 = {
    blendMode: "screen",
    colorPool: [
        { color: "rgb(255, 251, 0)", weight: 1.00 },
        { color: "rgb(255, 0, 0)", weight: 1.00 },
        { color: "rgb(0, 255, 85)", weight: 1.00 }
    ],
    
    count:              16      /*instances*/       ,
    minSize:            600     /*px radius*/       ,
    maxSize:            800     /*px radius*/       ,
    minSpeed:           25      /*px per sec*/      / 100,
    maxSpeed:           75      /*px per sec*/      / 100,
    minLifetime:        5       /*seconds*/         * 1000,
    maxLifetime:        10      /*seconds*/         * 1000,
    fadeInDuration:     1       /*seconds*/         * 1000,
    fadeOutDuration:    2       /*seconds*/         * 1000,
    preSimulation:      3       /*seconds*/         * 1000,
    maxSpawnDelay:      2       /*seconds*/         * 1000,
    spawnCenterBias:    0       /*strength*/        ,
}

const particleConfigTheme3 = {
    blendMode: "screen",
    colorPool: [
        { color: "rgb(0, 162, 255)", weight: 1.00 },
        { color: "rgb(255, 0, 212)", weight: 1.00 },
        { color: "rgb(255, 166, 0)", weight: 1.00 }
    ],
    
    count:              16      /*instances*/       ,
    minSize:            600     /*px radius*/       ,
    maxSize:            800     /*px radius*/       ,
    minSpeed:           25      /*px per sec*/      / 100,
    maxSpeed:           75      /*px per sec*/      / 100,
    minLifetime:        5       /*seconds*/         * 1000,
    maxLifetime:        10      /*seconds*/         * 1000,
    fadeInDuration:     1       /*seconds*/         * 1000,
    fadeOutDuration:    2       /*seconds*/         * 1000,
    preSimulation:      3       /*seconds*/         * 1000,
    maxSpawnDelay:      2       /*seconds*/         * 1000,
    spawnCenterBias:    0       /*strength*/        ,
}

const themes = {
    theme1: {
        button: document.getElementById("theme1Button"),
        content: document.getElementById("theme1Toggle"),
        particleManager: new ParticleManager("canvas1", particleConfigTheme1),
        onSelect: appliedTheme1,
        onDeselect: removedTheme1
    },
    theme2: {
        button: document.getElementById("theme2Button"),
        content: document.getElementById("theme2Toggle"),
        particleManager: new ParticleManager("canvas2", particleConfigTheme2),
        onSelect: appliedTheme2,
        onDeselect: removedTheme2
    },
    theme3: {
        button: document.getElementById("theme3Button"),
        content: document.getElementById("theme3Toggle"),
        particleManager: new ParticleManager("canvas3", particleConfigTheme3),
        onSelect: appliedTheme3,
        onDeselect: removedTheme3
    }
}

let _activeTheme = null

//#endregion VARIABLES






//#region THEME FUNCTIONS

function appliedTheme1() {
    console.log("Applied: theme1")
}

function removedTheme1() {
    console.log("Removed: theme1")
}



function appliedTheme2() {
    console.log("Applied: theme2")
}

function removedTheme2() {
    console.log("Removed: theme2")
}



function appliedTheme3() {
    console.log("Applied: theme3")
}

function removedTheme3() {
    console.log("Removed: theme3")
}

//#endregion THEME FUNCTIONS






//#region CORE

function _onThemeButtonClicked(theme) {
    const alreadySelected = _activeTheme === theme
    if (alreadySelected) {
        _deselectTheme(theme)
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
    themes[theme].button.classList.remove("deselected")
    themes[theme].content.classList.remove("hidden")
    themes[theme].particleManager.start()
    themes[theme].onSelect()
    _activeTheme = theme
}

function _deselectTheme(theme) {
    themes[theme].button.classList.remove("selected")
    themes[theme].button.classList.add("deselected")
    themes[theme].content.classList.add("hidden")
    themes[theme].particleManager.stop()
    themes[theme].onDeselect()
    _activeTheme = null
}

//#endregion CORE