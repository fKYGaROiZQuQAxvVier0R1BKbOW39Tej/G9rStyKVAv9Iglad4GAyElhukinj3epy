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
        on_select: applied_theme_1,
        on_deselect: removed_theme_1
    },
    theme2: {
        button: document.getElementById("theme2Button"),
        content: document.getElementById("theme2Toggle"),
        particleManager: new ParticleManager("canvas2", particleConfigTheme2),
        on_select: applied_theme_2,
        on_deselect: removed_theme_2
    },
    theme3: {
        button: document.getElementById("theme3Button"),
        content: document.getElementById("theme3Toggle"),
        particleManager: new ParticleManager("canvas3", particleConfigTheme3),
        on_select: applied_theme_3,
        on_deselect: removed_theme_3
    }
}

let _activeTheme = null

function applied_theme_1() {
    console.log("Applied: theme1")
}

function removed_theme_1() {
    console.log("Removed: theme1")
}

function applied_theme_2() {
    console.log("Applied: theme2")
}

function removed_theme_2() {
    console.log("Removed: theme2")
}

function applied_theme_3() {
    console.log("Applied: theme3")
}

function removed_theme_3() {
    console.log("Removed: theme3")
}

function _on_theme_button_clicked(theme) {
    const alreadySelected = _activeTheme === theme
    if (alreadySelected) {
        _deselect_theme(theme)
        return
    }
    const shouldCleanupPrevious = _activeTheme !== null
    if (shouldCleanupPrevious) {
        _deselect_theme(_activeTheme)
    }
    _select_theme(theme)
}

function _select_theme(theme) {
    themes[theme].button.classList.add("selected")
    themes[theme].button.classList.remove("deselected")
    themes[theme].content.classList.remove("hidden")
    themes[theme].particleManager.start()
    themes[theme].on_select()
    _activeTheme = theme
}

function _deselect_theme(theme) {
    themes[theme].button.classList.remove("selected")
    themes[theme].button.classList.add("deselected")
    themes[theme].content.classList.add("hidden")
    themes[theme].particleManager.stop()
    themes[theme].on_deselect()
    _activeTheme = null
}
