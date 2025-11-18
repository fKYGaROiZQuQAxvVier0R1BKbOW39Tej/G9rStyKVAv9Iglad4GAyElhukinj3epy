//#region VARIABLES

const _blendMode = "screen"
const _particleMaterial = {
    colorPool: [
        { color: "rgb(255,0,0)", weight: 1.00 },
        { color: "rgb(0,255,0)", weight: 0.50 },
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
    preSimulation:      3       /*seconds*/         * 1000, /*only applied on first play*/
    maxSpawnDelay:      2       /*seconds*/         * 1000,
    spawnCenterBias:    0       /*strength*/        ,       /*-x: negative bias, 0: no bias, 1: full center bias*/
}

let _canvas = document.querySelector("canvas")
let _c = _canvas.getContext("2d")
let _animationFrameId = null
let _activeParticles = []
let _time = performance.now()

//#endregion VARIABLES






//#region UTILITY FUNCTIONS

function startAnimation() {
    if (_activeParticles.length === 0)
        for (let i = 0; i < _particleMaterial.count; i++)
            _activeParticles.push(new _Particle(true))
    
    _time = performance.now()
    _animate()
}

function stopAnimation() {
    if (_animationFrameId) {
        cancelAnimationFrame(_animationFrameId)
        _animationFrameId = null
    }
}

//#endregion UTILITY FUNCTIONS






//#region CORE

class _Particle {
    constructor(applyPreSimulation = false) {
        this._init(applyPreSimulation)
    }

    _init(applyPreSimulation) {
        // center bias
        const offsetX = (Math.random() - 0.5) * 2 * _canvas.width / 2 * (1 - _particleMaterial.spawnCenterBias)
        const offsetY = (Math.random() - 0.5) * 2 * _canvas.height / 2 * (1 - _particleMaterial.spawnCenterBias)
        this.x = _canvas.width / 2 + offsetX
        this.y = _canvas.height / 2 + offsetY

        // roll stats
        this.size = _randf_range(_particleMaterial.minSize, _particleMaterial.maxSize)
        this.vx = _randf_range(-_particleMaterial.maxSpeed, _particleMaterial.maxSpeed)
        this.vy = _randf_range(-_particleMaterial.maxSpeed, _particleMaterial.maxSpeed)
        this.color = _weighed_rand_color(_particleMaterial.colorPool)
        this.lifetime = _randf_range(_particleMaterial.minLifetime, _particleMaterial.maxLifetime)
        this.age = applyPreSimulation && _particleMaterial.preSimulation > 0 
            ? Math.random() * Math.min(this.lifetime, _particleMaterial.preSimulation) 
            : -Math.random() * _particleMaterial.maxSpawnDelay
    }

    _process(deltaTime) {
        this.age += deltaTime
        
        if (this.age >= this.lifetime) {
            this._init()
        }

        this.x += this.vx
        this.y += this.vy
    }

    _draw() {
        let opacity = null
        let isFadingIn = this.age < _particleMaterial.fadeInDuration
        let isFadingOut = this.age > this.lifetime - _particleMaterial.fadeOutDuration

        if (isFadingIn) 
            opacity = this.age / _particleMaterial.fadeInDuration
        else if (isFadingOut) 
            opacity = (this.lifetime - this.age) / _particleMaterial.fadeOutDuration
        else
            opacity = 1
        
        const gradient = _c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
        gradient.addColorStop(0, this.color.replace("rgb", "rgba").replace(")", `,${opacity})`))
        gradient.addColorStop(1, this.color.replace("rgb", "rgba").replace(")", ",0)"))
        
        _c.globalCompositeOperation = _blendMode
        _c.fillStyle = gradient
        _c.beginPath()
        _c.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        _c.fill()
    }
}

function _animate() {
    const newTime = performance.now()
    const delta = newTime - _time
    _time = newTime

    _c.clearRect(0, 0, _canvas.width, _canvas.height)

    for (let particle of _activeParticles) {
        particle._process(delta)
        particle._draw()
    }

    _animationFrameId = requestAnimationFrame(_animate)
}

function _randf_range(min, max) {
    return min + Math.random() * (max - min)
}

function _weighed_rand_color(colorPool) {
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

//#endregion CORE






_canvas.height = window.innerHeight
_canvas.width = window.innerWidth

window.addEventListener('resize', () => {
    _canvas.height = window.innerHeight
    _canvas.width = window.innerWidth
})
