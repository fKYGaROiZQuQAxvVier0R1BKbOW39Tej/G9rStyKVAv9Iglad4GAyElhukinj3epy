//#region CLASSES

class ParticleManager {
    constructor(canvasId, config) {
        this.canvas = document.getElementById(canvasId)
        this.context = this.canvas.getContext("2d")
        this.config = config
        this.particles = []
        this.animationFrameId = null
        this.lastTime = performance.now()
        
        this._init()
    }

    start() {
        if (this.particles.length === 0) {
            for (let i = 0; i < this.config.count; i++) {
                this.particles.push(new Particle(this, true))
            }
        }
        
        this.lastTime = performance.now()
        this._animate()
    }

    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId)
            this.animationFrameId = null
        }
    }

    _init() {
        this.canvas.height = window.innerHeight
        this.canvas.width = window.innerWidth
        
        window.addEventListener('resize', () => {
            this.canvas.height = window.innerHeight
            this.canvas.width = window.innerWidth
        })
    }

    _animate() {
        const currentTime = performance.now()
        const deltaTime = currentTime - this.lastTime
        this.lastTime = currentTime

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        for (let particle of this.particles) {
            particle._update(deltaTime)
            
        }

        this.animationFrameId = requestAnimationFrame(() => this._animate())
    }
}

class Particle {
    constructor(parentParticleManager, applyPreSimulation = false) {
        this.parentParticleManager = parentParticleManager
        this.config = parentParticleManager.config
        this.canvas = parentParticleManager.canvas
        this.context = parentParticleManager.context
        this._reset(applyPreSimulation)
    }

    _update(deltaTime) {
        this.age += deltaTime
        
        if (this.age >= this.lifetime) {
            this._reset()
        }

        this.x += this.vx
        this.y += this.vy

        this._draw()
    }

    _draw() {
        let opacity = 1
        
        if (this.age < this.config.fadeInDuration) {
            opacity = this.age / this.config.fadeInDuration
        } else if (this.age > this.lifetime - this.config.fadeOutDuration) {
            opacity = (this.lifetime - this.age) / this.config.fadeOutDuration
        }

        const gradient = this.context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
        gradient.addColorStop(0, this.color.replace("rgb", "rgba").replace(")", `,${opacity})`))
        gradient.addColorStop(1, this.color.replace("rgb", "rgba").replace(")", ",0)"))
        
        this.context.globalCompositeOperation = this.config.blendMode
        this.context.fillStyle = gradient
        this.context.beginPath()
        this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        this.context.fill()
    }

    _reset(applyPreSimulation = false) {
        const offsetX = (Math.random() - 0.5) * 2 * this.canvas.width / 2 * (1 - this.config.spawnCenterBias)
        const offsetY = (Math.random() - 0.5) * 2 * this.canvas.height / 2 * (1 - this.config.spawnCenterBias)
        this.x = this.canvas.width / 2 + offsetX
        this.y = this.canvas.height / 2 + offsetY

        this.size = _randomRange(this.config.minSize, this.config.maxSize)
        this.vx = _randomRange(-this.config.maxSpeed, this.config.maxSpeed)
        this.vy = _randomRange(-this.config.maxSpeed, this.config.maxSpeed)
        this.color = _getWeightedColor(this.config.colorPool)
        this.lifetime = _randomRange(this.config.minLifetime, this.config.maxLifetime)
        this.age = applyPreSimulation && this.config.preSimulation > 0 
            ? Math.random() * Math.min(this.lifetime, this.config.preSimulation) 
            : -Math.random() * this.config.maxSpawnDelay
    }
}

//#endregion CLASSES



//#endregion HELPER FUNCTIONS

function _randomRange(min, max) {
    return min + Math.random() * (max - min)
}

function _getWeightedColor(colorPool) {
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

//#endregion HELPER FUNCTIONS