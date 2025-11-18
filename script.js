let canvas = document.querySelector("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth
let c = canvas.getContext("2d")

let activeTheme = null
let animationFrameId = null

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
})

const particleConfig = {
    colorPool: [
        { color: "rgb(255,0,0)", weight: 1 },
        { color: "rgb(0,255,0)", weight: 1 },
        { color: "rgb(0,0,255)", weight: 1 }
    ],
    
    count:              16      /*instances*/       ,
    minSize:            400     /*px radius*/       ,
    maxSize:            700     /*px radius*/       ,
    minSpeed:           25      /*px per sec*/      / 100,
    maxSpeed:           75      /*px per sec*/      / 100,
    minLifetime:        5       /*seconds*/         * 1000,
    maxLifetime:        10       /*seconds*/        * 1000,
    fadeInDuration:     2       /*seconds*/         * 1000,
    fadeOutDuration:    2       /*seconds*/         * 1000,
    prewarmTime:        3       /*seconds*/         * 1000,
    maxSpawnDelay:      2       /*seconds*/         * 1000,
    spawnCenterBias:    0       /*strength*/        , /*-x: negative bias, 0: no bias, 1: full center bias*/
}

let particles = []

class Particle {
    constructor(config, applyPrewarm = false) {
        this.config = config
        this.reset(applyPrewarm)
    }

    reset(applyPrewarm = false) {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const maxOffsetX = canvas.width / 2
        const maxOffsetY = canvas.height / 2
        
        const offsetX = (Math.random() - 0.5) * 2 * maxOffsetX * (1 - this.config.spawnCenterBias)
        const offsetY = (Math.random() - 0.5) * 2 * maxOffsetY * (1 - this.config.spawnCenterBias)
        
        this.x = centerX + offsetX
        this.y = centerY + offsetY
        this.size = randomBetween(this.config.minSize, this.config.maxSize)
        this.vx = randomBetween(-this.config.maxSpeed, this.config.maxSpeed)
        this.vy = randomBetween(-this.config.maxSpeed, this.config.maxSpeed)
        this.color = getWeightedRandomColor(this.config.colorPool)
        this.lifetime = randomBetween(this.config.minLifetime, this.config.maxLifetime)
        this.age = applyPrewarm && this.config.prewarmTime > 0 
            ? Math.random() * Math.min(this.lifetime, this.config.prewarmTime) 
            : -Math.random() * this.config.maxSpawnDelay
    }

    update(deltaTime) {
        this.age += deltaTime
        
        if (this.age >= this.lifetime) {
            this.reset()
        }

        this.x += this.vx
        this.y += this.vy
    }

    draw() {
        let opacity = 1

        if (this.age < this.config.fadeInDuration) {
            opacity = this.age / this.config.fadeInDuration
        } else if (this.age > this.lifetime - this.config.fadeOutDuration) {
            opacity = (this.lifetime - this.age) / this.config.fadeOutDuration
        }

        c.globalCompositeOperation = 'lighter'

        const gradient = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
        gradient.addColorStop(0, this.color.replace("rgb", "rgba").replace(")", `,${opacity})`))
        gradient.addColorStop(1, this.color.replace("rgb", "rgba").replace(")", ",0)"))

        c.fillStyle = gradient
        c.beginPath()
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        c.fill()
    }
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min)
}

function getWeightedRandomColor(colorPool) {
    const totalWeight = colorPool.reduce((sum, item) => sum + item.weight, 0)
    let random = Math.random() * totalWeight
    
    for (let item of colorPool) {
        random -= item.weight
        if (random <= 0) {
            return item.color
        }
    }
    
    return colorPool[colorPool.length - 1].color
}

function initializeParticles() {
    particles = []
    for (let i = 0; i < particleConfig.count; i++) {
        particles.push(new Particle(particleConfig, true))
    }
}

let lastTime = performance.now()

function animateParticles() {
    const currentTime = performance.now()
    const deltaTime = currentTime - lastTime
    lastTime = currentTime

    c.clearRect(0, 0, canvas.width, canvas.height)

    for (let particle of particles) {
        particle.update(deltaTime)
        particle.draw()
    }

    animationFrameId = requestAnimationFrame(animateParticles)
}

function startParticleAnimation() {
    if (particles.length === 0) {
        initializeParticles()
    }
    lastTime = performance.now()
    animateParticles()
}

function stopParticleAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }
}

const themes = {
    canvas: {
        button: document.getElementById("canvasButton"),
        content: document.getElementById("canvasToggle"),
        onDeselect: removedCanvasTheme,
        onSelect: appliedCanvasTheme
    },
    audio: {
        button: document.getElementById("audioButton"),
        content: document.getElementById("audioToggle"),
        onDeselect: removedAudioTheme,
        onSelect: appliedAudioTheme
    },
    video: {
        button: document.getElementById("videoButton"),
        content: document.getElementById("videoToggle"),
        onDeselect: removedVideoTheme,
        onSelect: appliedVideoTheme
    }
}

function removedCanvasTheme() {
    stopParticleAnimation()
}

function appliedCanvasTheme() {
    startParticleAnimation()
}

function removedAudioTheme() {
    console.log("Removed: audio")
}

function appliedAudioTheme() {
    console.log("Applied: audio")
}

function removedVideoTheme() {
    console.log("Removed: video")
}

function appliedVideoTheme() {
    console.log("Applied: video")
}

function onThemeButtonClicked(theme) {
    const alreadySelected = activeTheme === theme
    if (alreadySelected) {
        deselectTheme(theme)
        activeTheme = null
        return
    }
    const shouldCleanupPrevious = activeTheme !== null
    if (shouldCleanupPrevious) {
        deselectTheme(activeTheme)
    }
    selectTheme(theme)
}

function deselectTheme(theme) {
    themes[theme].button.classList.remove("selected")
    themes[theme].content.classList.add("hidden")
    themes[theme].onDeselect()
}

function selectTheme(theme) {
    themes[theme].button.classList.add("selected")
    themes[theme].content.classList.remove("hidden")
    themes[theme].onSelect()
    activeTheme = theme
}

themes.canvas.button.addEventListener("click", () => onThemeButtonClicked("canvas"))
themes.audio.button.addEventListener("click", () => onThemeButtonClicked("audio"))
themes.video.button.addEventListener("click", () => onThemeButtonClicked("video"))