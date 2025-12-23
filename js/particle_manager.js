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

        this.size = Utils.Math.randf_range(this.config.minSize, this.config.maxSize)
        this.vx = Utils.Math.randf_range(-this.config.maxSpeed, this.config.maxSpeed)
        this.vy = Utils.Math.randf_range(-this.config.maxSpeed, this.config.maxSpeed)
        this.color = Utils.Math.get_weighted_variant(this.config.colorPool.map(item => item.color), this.config.colorPool.map(item => item.weight))
        this.lifetime = Utils.Math.randf_range(this.config.minLifetime, this.config.maxLifetime)
        this.age = applyPreSimulation && this.config.preSimulation > 0 
            ? Math.random() * Math.min(this.lifetime, this.config.preSimulation) 
            : -Math.random() * this.config.maxSpawnDelay
    }
}