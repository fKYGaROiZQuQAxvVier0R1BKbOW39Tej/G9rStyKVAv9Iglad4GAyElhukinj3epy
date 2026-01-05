class ParticleManager {
    // VARIABLES
    static #layers = []


    // PUBLIC
    static create_layer(config) {
        const canvas = document.createElement('canvas')
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        
        const inner = document.createElement('div')
        inner.className = 'layer-inner'
        inner.appendChild(canvas)
        
        const wrapper = document.createElement('div')
        wrapper.className = 'layer'
        wrapper.appendChild(inner)

        const layer = new ParticleLayer(config, wrapper)
        this.#layers.push(layer)

        return layer
    }

    static get_layer(variableName) {
        return window[variableName]
    }
}

class ParticleLayer extends AbstractLayer {
    // VARIABLES
    #canProcess = false

    #config = null
    #runtimeConfig = null

    #stage = document.getElementById('stage')
    #wrapper = null

    #canvas = null
    #context = null
    #tintCanvas = null
    #tintContext = null

    #images = null
    #imageWeights = null
    #particles = []


    // PUBLIC
    constructor(config, wrapper) {
        super()

        this.#config = config
        this.#runtimeConfig = {
            count: config.count,
            minLifetime: config.minLifetime,
            maxLifetime: config.maxLifetime,
            fadeOutDuration: config.fadeOutDuration,
            minRotation: config.minRotation,
            maxRotation: config.maxRotation,
            minSpeed: config.minSpeed,
            maxSpeed: config.maxSpeed
        }

        this.#wrapper = wrapper
        document.getElementById('layers').appendChild(wrapper)

        this.#canvas = wrapper.querySelector('canvas')
        this.#context = this.#canvas.getContext('2d')
        this.#tintCanvas = document.createElement('canvas')
        this.#tintContext = this.#tintCanvas.getContext('2d')

        this.#images = config.imagePool.map(item => {const image = new Image(); image.src = item.path; return image})
        this.#imageWeights = config.imagePool.map(e => e.weight)

        this.#ready()
    }

    start() {
        this.#canProcess = true

        const desiredCount = Math.ceil(this.#runtimeConfig.count)

        this.#reset_particle_pool()
        this.#grow_particle_pool(desiredCount)

        return this
    }

    stop() {
        this.#canProcess = false
        this.#resize()
        
        return this
    }
    
    set_particle_count(value, transitionDuration = 0) {
        ParallaxManager.get_tweener()
            .tween(this.#runtimeConfig, 'count', value, transitionDuration)
            
        return this
    }

    set_particle_rotation(min, max, transitionDuration = 0) {
        ParallaxManager.get_tweener()
            .tween(this.#runtimeConfig, 'minRotation', min, transitionDuration)
            .tween(this.#runtimeConfig, 'maxRotation', max, transitionDuration)

        return this
    }

    set_particle_speed(min, max, transitionDuration = 0) {
        ParallaxManager.get_tweener()
            .tween(this.#runtimeConfig, 'minSpeed', min / 1000, transitionDuration)
            .tween(this.#runtimeConfig, 'maxSpeed', max / 1000, transitionDuration)

        return this
    }

    set_particle_lifetime(min, max, transitionDuration = 0) {
        ParallaxManager.get_tweener()
            .tween(this.#runtimeConfig, 'minLifetime', min * 1000, transitionDuration)
            .tween(this.#runtimeConfig, 'maxLifetime', max * 1000, transitionDuration)

        return this
    }

    set_particle_fade_out_duration(value, transitionDuration = 0) {
        ParallaxManager.get_tweener()
            .tween(this.#runtimeConfig, 'fadeOutDuration', value * 1000, transitionDuration)

        return this
    }

    get_config() {
        return this.#config
    }


    // PRIVATE
    #ready() {
        ProcessManager.register_process_node(this)
        this.#resize()
    }

    _process(delta) {
        if (this.#canProcess) {
            this.#resize()
            this.#process_particles(delta)
            this.#apply_opacity()
            this.#apply_color()
        }
    }

    #resize() {
        const width = Math.floor(this.#stage.getBoundingClientRect().width)
        const height = Math.floor(this.#stage.getBoundingClientRect().height)

        this.#wrapper.style.width = width + 'px'

        this.#canvas.width = width
        this.#canvas.height = height
        this.#tintCanvas.width = width
        this.#tintCanvas.height = height

        this.#context.imageSmoothingEnabled = this.antialiasing
        this.#tintContext.imageSmoothingEnabled = this.antialiasing
    }

    #process_particles(delta) {
        const desiredCount = Math.ceil(this.#runtimeConfig.count)
        const notEnoughParticles = this.#particles.length < desiredCount
        if (notEnoughParticles) {
            this.#grow_particle_pool(desiredCount, 2)
        }

        Utils.Array.backwards_each(this.#particles, (particle, particleIndex) => {
            particle.process_age(delta, desiredCount, particleIndex, this.#particles)
            particle.process_position(delta, this.#runtimeConfig)
            particle.process_opacity(this.#config)
            particle.draw(this.#tintContext, this.offsetX, this.offsetY)
        })
    }

    #grow_particle_pool(desiredCount, maxNew = Infinity) {
        let added = 0
        while (this.#particles.length < desiredCount && added < maxNew) {
            const particle = new Particle(this.#canvas, this.#config, this.#runtimeConfig, this.#images, this.#imageWeights)
            particle.presimulate()
            this.#particles.push(particle)
            added++
        }
    }

    #reset_particle_pool() {
        this.#particles.length = 0
    }

    #apply_opacity() {
        this.#wrapper.style.opacity = this.opacity
    }

    #apply_color() {
        this.#context.drawImage(this.#tintCanvas, 0, 0)

        this.#context.globalCompositeOperation = 'multiply'
        this.#context.fillStyle = `rgb(${this.colorR | 0}, ${this.colorG | 0}, ${this.colorB | 0})`
        this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height)

        this.#context.globalCompositeOperation = 'destination-in'
        this.#context.drawImage(this.#tintCanvas, 0, 0)
    }
}

class Particle {
    // VARIABLES
    #image = null
    #size = 0

    #lifetime = 0
    #age = 0
    #opacity = 1
    #deltaOvershoot = 0

    #fadeOutDuration = 0

    #rotationStrength = 0
    #speedStrength = 0
    #rotation = 0
    #speed = 0

    #velocityX = 0
    #velocityY = 0
    #xPosition = 0
    #yPosition = 0

    #canvas = null
    #config = null
    #runtimeConfig = null
    #images = null
    #imageWeights = null


    // PUBLIC
    constructor(canvas, config, runtimeConfig, images, imageWeights) {
        this.#canvas = canvas
        this.#config = config
        this.#runtimeConfig = runtimeConfig
        this.#images = images
        this.#imageWeights = imageWeights

        this.respawn()
    }

    presimulate() {
        this.#age = Utils.Math.randf() * this.#lifetime

        this.process_position(0, this.#runtimeConfig)

        this.#xPosition += this.#velocityX * this.#age
        this.#yPosition += this.#velocityY * this.#age
    }

    respawn() {
        this.#size = Utils.Math.randf_range(this.#config.minSize, this.#config.maxSize)
        this.#image = Utils.Math.get_weighted_variant(this.#images, this.#imageWeights)

        this.#rotationStrength = Utils.Math.randf()
        this.#speedStrength = Utils.Math.randf()

        const spawnPosition = this.#get_spawn_position()
        this.#xPosition = spawnPosition.x
        this.#yPosition = spawnPosition.y

        this.#lifetime = Utils.Math.randf_range(this.#runtimeConfig.minLifetime, this.#runtimeConfig.maxLifetime)
        this.#fadeOutDuration = this.#runtimeConfig.fadeOutDuration
        this.#age = this.#deltaOvershoot
    }

    process_age(delta, desiredCount, particleIndex, particlesArray) {
        this.#age += delta

        const notEndOfLife = this.#age < this.#lifetime
        if (notEndOfLife) {
            return
        }

        const isOverflowParticle = particleIndex >= desiredCount
        if (isOverflowParticle) {
            particlesArray.splice(particleIndex, 1)
        } else {
            this.#update_delta_overshoot()
            this.respawn()
        }
    }

    process_position(delta, runtimeConfig) {
        delta += this.#deltaOvershoot
        this.#deltaOvershoot = 0

        this.#rotation = Utils.Math.lerp(runtimeConfig.minRotation, runtimeConfig.maxRotation, this.#rotationStrength)
        this.#speed = Utils.Math.lerp(runtimeConfig.minSpeed, runtimeConfig.maxSpeed, this.#speedStrength)

        const direction = Utils.Math.direction_from_rotation(this.#rotation)
        this.#velocityX = direction.x * this.#speed
        this.#velocityY = direction.y * this.#speed

        this.#xPosition += this.#velocityX * delta
        this.#yPosition += this.#velocityY * delta
    }

    process_opacity(config) {
        let opacity = 1

        const fadingIn = config.fadeInDuration > 0 && this.#age < config.fadeInDuration
        if (fadingIn) {
            opacity = Utils.Math.normalize(this.#age, 0, config.fadeInDuration)
        }

        const fadingOut = this.#fadeOutDuration > 0 && this.#age > this.#lifetime - this.#fadeOutDuration
        if (fadingOut) {
            opacity = 1 - Utils.Math.normalize(this.#age, this.#lifetime - this.#fadeOutDuration, this.#lifetime)
        }

        this.#opacity = opacity
    }

    draw(context, offsetX, offsetY) {
        context.save()
        context.globalAlpha = this.#opacity
        context.translate(this.#xPosition + offsetX, this.#yPosition + offsetY)
        context.rotate(this.#rotation * Math.PI / 180)
        context.drawImage(this.#image, -this.#size / 2, -this.#size / 2, this.#size, this.#size)
        context.restore()
    }


    // PRIVATE
    #get_spawn_position() {
        const spawnFrom = this.#config.spawnFrom
        const spread = this.#config.spread

        let x = 0
        let y = 0

        switch (spawnFrom) {
            case Resources.ScreenPosition.CENTER:
                x = this.#canvas.width / 2 + (Utils.Math.randf() - 0.5) * 2 * spread
                y = this.#canvas.height / 2 + (Utils.Math.randf() - 0.5) * 2 * spread
                break
            case Resources.ScreenPosition.TOP:
                x = spread === 0 ? Utils.Math.randf() * this.#canvas.width : this.#canvas.width / 2 + (Utils.Math.randf() - 0.5) * 2 * spread
                y = 0
                break
            case Resources.ScreenPosition.BOTTOM:
                x = spread === 0 ? Utils.Math.randf() * this.#canvas.width : this.#canvas.width / 2 + (Utils.Math.randf() - 0.5) * 2 * spread
                y = this.#canvas.height
                break
            case Resources.ScreenPosition.LEFT:
                x = 0
                y = spread === 0 ? Utils.Math.randf() * this.#canvas.height : this.#canvas.height / 2 + (Utils.Math.randf() - 0.5) * 2 * spread
                break
            case Resources.ScreenPosition.RIGHT:
                x = this.#canvas.width
                y = spread === 0 ? Utils.Math.randf() * this.#canvas.height : this.#canvas.height / 2 + (Utils.Math.randf() - 0.5) * 2 * spread
                break
        }

        return {x, y}
    }

    #update_delta_overshoot() {
        this.#deltaOvershoot = this.#age - this.#lifetime
    }
}